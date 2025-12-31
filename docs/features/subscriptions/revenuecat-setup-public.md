# RevenueCat iOS (Swift/SwiftUI) Implementation Guide

Complete guide to integrating RevenueCat SDK into your iOS app using Swift Package Manager and SwiftUI.

> ⚠️ **Note:** This is the public version of the setup guide. API keys and sensitive configuration should be stored in environment variables or a separate configuration file that is gitignored.

## Overview

This guide covers:
1. Installing RevenueCat SDK via Swift Package Manager
2. Configuring with your API key (from environment)
3. Creating a subscription manager in Swift
4. Implementing entitlement checking
5. Displaying RevenueCat Paywalls
6. Adding Customer Center
7. Best practices and error handling

**Configuration Required:**
- RevenueCat API Key (get from [RevenueCat Dashboard](https://app.revenuecat.com/))
- Entitlement ID (e.g., "pro_access")
- Product IDs (monthly, yearly, lifetime)

---

## Part 1: Install RevenueCat SDK

### Step 1: Add Swift Package Dependencies

1. Open your project in Xcode
2. Go to **File → Add Package Dependencies...**
3. Enter the repository URL:
   ```
   https://github.com/RevenueCat/purchases-ios-spm.git
   ```
4. Set **Dependency Rule** to **"Up to Next Major Version"**
5. Version: `5.0.0 < 6.0.0`
6. When "Choose Package Products" appears, select:
   - ✅ **RevenueCat**
   - ✅ **RevenueCatUI** (for Paywalls and Customer Center)
7. Click **"Add Package"**

---

## Part 2: Create Configuration File

Create a new Swift file: `RevenueCatConfig.swift`

```swift
//
//  RevenueCatConfig.swift
//  Manifest the Unseen
//
//  RevenueCat API configuration
//

import Foundation

enum RevenueCatConfig {
    /// RevenueCat API Key
    /// In production, load from environment or secure storage
    static var apiKey: String {
        // Option 1: Load from Info.plist
        if let key = Bundle.main.object(forInfoDictionaryKey: "REVENUECAT_API_KEY") as? String {
            return key
        }
        
        // Option 2: Load from environment variable (for development)
        if let key = ProcessInfo.processInfo.environment["REVENUECAT_API_KEY"] {
            return key
        }
        
        // Fallback (for development only - replace with your actual key)
        #if DEBUG
        return "your_test_api_key_here"
        #else
        fatalError("RevenueCat API key not configured")
        #endif
    }
    
    /// Pro entitlement identifier
    static let proEntitlementID = "pro_access"
    
    /// Product identifiers
    enum ProductID {
        static let monthly = "monthly"
        static let yearly = "yearly"
        static let lifetime = "lifetime"
    }
}
```

### Adding API Key to Info.plist (Recommended for Production)

1. Open your `Info.plist` file
2. Add a new row:
   - **Key:** `REVENUECAT_API_KEY`
   - **Type:** String
   - **Value:** Your API key

---

## Part 3: Create Subscription Manager

Create a new Swift file: `SubscriptionManager.swift`

```swift
//
//  SubscriptionManager.swift
//  Manifest the Unseen
//
//  Manages all RevenueCat subscription logic
//

import Foundation
import RevenueCat
import Combine

@MainActor
class SubscriptionManager: ObservableObject {
    
    // MARK: - Published Properties
    
    /// Current subscription tier
    @Published var currentTier: SubscriptionTier = .free
    
    /// Whether user has Pro access
    @Published var hasProAccess: Bool = false
    
    /// Current customer info
    @Published var customerInfo: CustomerInfo?
    
    /// Available offerings
    @Published var currentOffering: Offering?
    
    /// Loading state
    @Published var isLoading: Bool = false
    
    /// Error message
    @Published var errorMessage: String?
    
    // MARK: - Singleton
    
    static let shared = SubscriptionManager()
    
    private init() {
        configure()
    }
    
    // MARK: - Configuration
    
    /// Configure RevenueCat SDK
    func configure() {
        let apiKey = RevenueCatConfig.apiKey
        
        // Enable debug logs in development
        #if DEBUG
        Purchases.logLevel = .debug
        #else
        Purchases.logLevel = .error
        #endif
        
        // Configure SDK with API key
        Purchases.configure(withAPIKey: apiKey)
        
        // Set delegate for subscription updates
        Purchases.shared.delegate = self
        
        // Load initial customer info
        Task {
            await refreshCustomerInfo()
        }
    }
    
    /// Configure with user ID (call after authentication)
    func configure(with userID: String) async {
        do {
            let (customerInfo, _) = try await Purchases.shared.logIn(userID)
            await updateSubscriptionStatus(customerInfo)
            print("✅ RevenueCat configured for user: \(userID)")
        } catch {
            print("❌ Failed to configure with user ID: \(error.localizedDescription)")
            errorMessage = "Failed to sync subscription: \(error.localizedDescription)"
        }
    }
    
    /// Logout current user
    func logout() async {
        do {
            _ = try await Purchases.shared.logOut()
            currentTier = .free
            hasProAccess = false
            customerInfo = nil
            print("✅ User logged out from RevenueCat")
        } catch {
            print("❌ Failed to logout: \(error.localizedDescription)")
        }
    }
    
    // MARK: - Customer Info
    
    /// Refresh customer info from RevenueCat
    func refreshCustomerInfo() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let info = try await Purchases.shared.customerInfo()
            await updateSubscriptionStatus(info)
            print("✅ Customer info refreshed")
        } catch {
            print("❌ Failed to refresh customer info: \(error.localizedDescription)")
            errorMessage = "Failed to load subscription status"
        }
        
        isLoading = false
    }
    
    /// Update subscription status from customer info
    private func updateSubscriptionStatus(_ info: CustomerInfo) {
        customerInfo = info
        
        // Check Pro entitlement
        hasProAccess = info.entitlements[RevenueCatConfig.proEntitlementID]?.isActive == true
        
        // Determine tier based on active products
        if let activeSubscriptions = info.activeSubscriptions.first {
            switch activeSubscriptions {
            case let id where id.contains(RevenueCatConfig.ProductID.lifetime):
                currentTier = .lifetime
            case let id where id.contains(RevenueCatConfig.ProductID.yearly):
                currentTier = .yearly
            case let id where id.contains(RevenueCatConfig.ProductID.monthly):
                currentTier = .monthly
            default:
                currentTier = hasProAccess ? .monthly : .free
            }
        } else {
            currentTier = .free
        }
        
        print("📊 Subscription Status:")
        print("  - Tier: \(currentTier)")
        print("  - Pro Access: \(hasProAccess)")
        print("  - Active Subscriptions: \(info.activeSubscriptions)")
    }
    
    // MARK: - Offerings
    
    /// Fetch current offerings
    func fetchOfferings() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let offerings = try await Purchases.shared.offerings()
            currentOffering = offerings.current
            print("✅ Offerings loaded: \(offerings.current?.availablePackages.count ?? 0) packages")
        } catch {
            print("❌ Failed to fetch offerings: \(error.localizedDescription)")
            errorMessage = "Failed to load subscription options"
        }
        
        isLoading = false
    }
    
    // MARK: - Purchases
    
    /// Purchase a package
    func purchase(_ package: Package) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let (_, customerInfo, _) = try await Purchases.shared.purchase(package: package)
            await updateSubscriptionStatus(customerInfo)
            print("✅ Purchase successful: \(package.identifier)")
            return true
        } catch let error as ErrorCode {
            switch error {
            case .purchaseCancelledError:
                print("ℹ️ User cancelled purchase")
                // Don't show error for user cancellation
                return false
            case .productAlreadyPurchasedError:
                errorMessage = "You already own this subscription"
            default:
                errorMessage = "Purchase failed: \(error.localizedDescription)"
            }
            print("❌ Purchase failed: \(error.localizedDescription)")
            isLoading = false
            return false
        } catch {
            errorMessage = "Purchase failed: \(error.localizedDescription)"
            print("❌ Purchase failed: \(error.localizedDescription)")
            isLoading = false
            return false
        }
        
        isLoading = false
    }
    
    /// Restore purchases
    func restorePurchases() async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let customerInfo = try await Purchases.shared.restorePurchases()
            await updateSubscriptionStatus(customerInfo)
            
            if hasProAccess {
                print("✅ Purchases restored successfully")
                return true
            } else {
                errorMessage = "No active subscriptions found"
                return false
            }
        } catch {
            errorMessage = "Restore failed: \(error.localizedDescription)"
            print("❌ Restore failed: \(error.localizedDescription)")
            isLoading = false
            return false
        }
        
        isLoading = false
    }
    
    // MARK: - Subscription Info
    
    /// Check if user has specific entitlement
    func hasEntitlement(_ entitlementID: String) -> Bool {
        return customerInfo?.entitlements[entitlementID]?.isActive == true
    }
    
    /// Get subscription expiration date
    var expirationDate: Date? {
        return customerInfo?.entitlements[RevenueCatConfig.proEntitlementID]?.expirationDate
    }
    
    /// Check if subscription will renew
    var willRenew: Bool {
        return customerInfo?.entitlements[RevenueCatConfig.proEntitlementID]?.willRenew ?? false
    }
    
    /// Check if in trial period
    var isInTrialPeriod: Bool {
        return customerInfo?.entitlements[RevenueCatConfig.proEntitlementID]?.periodType == .trial
    }
    
    /// Get trial end date
    var trialEndDate: Date? {
        guard isInTrialPeriod else { return nil }
        return expirationDate
    }
}

// MARK: - PurchasesDelegate

extension SubscriptionManager: PurchasesDelegate {
    
    /// Called when customer info is updated
    nonisolated func purchases(_ purchases: Purchases, receivedUpdated customerInfo: CustomerInfo) {
        Task { @MainActor in
            await updateSubscriptionStatus(customerInfo)
            print("📱 Customer info updated via delegate")
        }
    }
}

// MARK: - Subscription Tier

enum SubscriptionTier: String, CaseIterable {
    case free = "Free"
    case monthly = "Monthly"
    case yearly = "Yearly"
    case lifetime = "Lifetime"
    
    var displayName: String {
        return rawValue
    }
    
    var icon: String {
        switch self {
        case .free:
            return "lock.fill"
        case .monthly:
            return "calendar"
        case .yearly:
            return "calendar.badge.clock"
        case .lifetime:
            return "infinity.circle.fill"
        }
    }
}
```

---

## Part 4: SwiftUI App Integration

Update your main app file to initialize RevenueCat:

```swift
//
//  ManifestTheUnseenApp.swift
//

import SwiftUI
import RevenueCat

@main
struct ManifestTheUnseenApp: App {
    
    // Subscription manager
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(subscriptionManager)
                .task {
                    // Fetch offerings on app launch
                    await subscriptionManager.fetchOfferings()
                }
        }
    }
}
```

---

## Security Best Practices

### 1. Never Hardcode API Keys in Source Code

**❌ Bad:**
```swift
let apiKey = "test_BNBlDdtGQwZdpmfspkxtempIcYP"
```

**✅ Good:**
```swift
// Load from Info.plist or environment
let apiKey = RevenueCatConfig.apiKey
```

### 2. Add API Keys to .gitignore

Add these to your `.gitignore`:
```
# API keys and secrets
Config.swift
**/Config.swift
*Config*.plist
.env
.env.*

# RevenueCat setup files with API keys
docs/*SETUP*.md
```

### 3. Use Different Keys for Development and Production

- Test/Sandbox key for development: `test_*`
- Production key for release builds: `appl_*` or `goog_*`

### 4. Use Xcode Configuration Files

Create separate configuration files:
- `Debug.xcconfig`
- `Release.xcconfig`

```
// Debug.xcconfig
REVENUECAT_API_KEY = test_YOUR_TEST_KEY_HERE

// Release.xcconfig
REVENUECAT_API_KEY = appl_YOUR_PRODUCTION_KEY_HERE
```

---

## Complete Setup Instructions

For the complete implementation with all SwiftUI views (Paywall, Customer Center, Settings, etc.), refer to the private setup guide that includes:

- Part 5: Display RevenueCat Paywall
- Part 6: Add Customer Center
- Part 7: Content Gating
- Part 8: Configure Products in RevenueCat Dashboard
- Part 9: Testing
- Part 10: Best Practices
- Troubleshooting
- Resources

---

## Quick Start Checklist

- [ ] Install RevenueCat SDK via Swift Package Manager
- [ ] Create `RevenueCatConfig.swift` with your configuration
- [ ] Add API key to Info.plist (or environment)
- [ ] Create `SubscriptionManager.swift`
- [ ] Initialize in your main app file
- [ ] Create products in App Store Connect
- [ ] Configure entitlements in RevenueCat Dashboard
- [ ] Create "current" offering
- [ ] Design paywall in RevenueCat Dashboard
- [ ] Test with sandbox account

---

## Resources

- [RevenueCat iOS Documentation](https://www.revenuecat.com/docs/getting-started/installation/ios)
- [Paywall Documentation](https://www.revenuecat.com/docs/tools/paywalls)
- [Customer Center Docs](https://www.revenuecat.com/docs/tools/customer-center)
- [Swift SDK Reference](https://sdk.revenuecat.com/ios/index.html)
- [App Store Connect](https://appstoreconnect.apple.com/)

---

**Last Updated:** December 8, 2025
