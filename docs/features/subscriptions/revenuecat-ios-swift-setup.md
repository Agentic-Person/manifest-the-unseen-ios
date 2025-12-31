# RevenueCat iOS (Swift/SwiftUI) Implementation Guide

Complete guide to integrating RevenueCat SDK into your iOS app using Swift Package Manager and SwiftUI.

## Overview

This guide covers:
1. Installing RevenueCat SDK via Swift Package Manager
2. Configuring with your API key
3. Creating a subscription manager in Swift
4. Implementing entitlement checking
5. Displaying RevenueCat Paywalls
6. Adding Customer Center
7. Best practices and error handling

**Your Configuration:**
- API Key: `test_BNBlDdtGQwZdpmfspkxtempIcYP`
- Entitlement: `Manifest the Unseen Pro`
- Products: Monthly, Yearly, Lifetime

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

## Part 2: Create Subscription Manager

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
    
    // MARK: - Constants
    
    private let apiKey = "test_BNBlDdtGQwZdpmfspkxtempIcYP"
    private let proEntitlementID = "Manifest the Unseen Pro"
    
    // MARK: - Singleton
    
    static let shared = SubscriptionManager()
    
    private init() {
        configure()
    }
    
    // MARK: - Configuration
    
    /// Configure RevenueCat SDK
    func configure() {
        // Enable debug logs in development
        Purchases.logLevel = .debug
        
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
        hasProAccess = info.entitlements[proEntitlementID]?.isActive == true
        
        // Determine tier based on active products
        if let activeSubscriptions = info.activeSubscriptions.first {
            switch activeSubscriptions {
            case let id where id.contains("lifetime"):
                currentTier = .lifetime
            case let id where id.contains("yearly"):
                currentTier = .yearly
            case let id where id.contains("monthly"):
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
        return customerInfo?.entitlements[proEntitlementID]?.expirationDate
    }
    
    /// Check if subscription will renew
    var willRenew: Bool {
        return customerInfo?.entitlements[proEntitlementID]?.willRenew ?? false
    }
    
    /// Check if in trial period
    var isInTrialPeriod: Bool {
        return customerInfo?.entitlements[proEntitlementID]?.periodType == .trial
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

## Part 3: SwiftUI App Integration

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

## Part 4: Create Subscription Status View

Create a view to display subscription status:

```swift
//
//  SubscriptionStatusView.swift
//

import SwiftUI

struct SubscriptionStatusView: View {
    
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Current Tier
            HStack {
                Image(systemName: subscriptionManager.currentTier.icon)
                    .foregroundColor(.purple)
                Text("Current Plan:")
                    .foregroundColor(.secondary)
                Spacer()
                Text(subscriptionManager.currentTier.displayName)
                    .fontWeight(.semibold)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            // Pro Access Status
            HStack {
                Image(systemName: subscriptionManager.hasProAccess ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .foregroundColor(subscriptionManager.hasProAccess ? .green : .red)
                Text("Pro Access:")
                    .foregroundColor(.secondary)
                Spacer()
                Text(subscriptionManager.hasProAccess ? "Active" : "Inactive")
                    .fontWeight(.semibold)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            // Trial Status
            if subscriptionManager.isInTrialPeriod, let trialEnd = subscriptionManager.trialEndDate {
                HStack {
                    Image(systemName: "clock.fill")
                        .foregroundColor(.orange)
                    Text("Trial ends:")
                        .foregroundColor(.secondary)
                    Spacer()
                    Text(trialEnd, style: .date)
                        .fontWeight(.semibold)
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
            
            // Expiration Date
            if let expiration = subscriptionManager.expirationDate, !subscriptionManager.isInTrialPeriod {
                HStack {
                    Image(systemName: subscriptionManager.willRenew ? "arrow.clockwise" : "calendar.badge.exclamationmark")
                        .foregroundColor(subscriptionManager.willRenew ? .blue : .orange)
                    Text(subscriptionManager.willRenew ? "Renews:" : "Expires:")
                        .foregroundColor(.secondary)
                    Spacer()
                    Text(expiration, style: .date)
                        .fontWeight(.semibold)
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
            
            // Restore Purchases Button
            Button(action: {
                Task {
                    let success = await subscriptionManager.restorePurchases()
                    // Show alert based on success
                }
            }) {
                HStack {
                    Image(systemName: "arrow.clockwise")
                    Text("Restore Purchases")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.purple.opacity(0.2))
                .foregroundColor(.purple)
                .cornerRadius(12)
            }
            
            // Error Message
            if let error = subscriptionManager.errorMessage {
                Text(error)
                    .foregroundColor(.red)
                    .font(.caption)
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
    }
}
```

---

## Part 5: Display RevenueCat Paywall

Use RevenueCat's native paywall UI:

```swift
//
//  PaywallView.swift
//

import SwiftUI
import RevenueCat
import RevenueCatUI

struct PaywallView: View {
    
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @Environment(\.dismiss) var dismiss
    
    @State private var showPaywall = false
    
    var body: some View {
        VStack(spacing: 20) {
            // Header
            VStack(spacing: 12) {
                Image(systemName: "sparkles")
                    .font(.system(size: 60))
                    .foregroundColor(.purple)
                
                Text("Unlock Pro Features")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Get unlimited access to all meditations, phases, and journal entries")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            .padding(.top, 40)
            
            Spacer()
            
            // Features List
            VStack(alignment: .leading, spacing: 16) {
                FeatureRow(icon: "infinity", title: "Unlimited Journal Entries", color: .purple)
                FeatureRow(icon: "leaf.fill", title: "All 10 Manifestation Phases", color: .green)
                FeatureRow(icon: "speaker.wave.2.fill", title: "12 Guided Meditations", color: .blue)
                FeatureRow(icon: "sparkles", title: "AI Wisdom Chat", color: .orange)
                FeatureRow(icon: "photo.fill", title: "Vision Boards", color: .pink)
            }
            .padding()
            
            Spacer()
            
            // Subscribe Button
            Button(action: {
                showPaywall = true
            }) {
                Text("Start Free Trial")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color.purple, Color.blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
            }
            .padding(.horizontal)
            
            // Terms
            Text("7-day free trial, then auto-renews")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Button("Restore Purchases") {
                Task {
                    await subscriptionManager.restorePurchases()
                }
            }
            .font(.caption)
            .padding(.bottom)
        }
        .sheet(isPresented: $showPaywall) {
            // RevenueCat Native Paywall
            PaywallViewContent()
        }
    }
}

// RevenueCat Paywall Content
struct PaywallViewContent: View {
    
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        if let offering = subscriptionManager.currentOffering {
            PaywallView(offering: offering)
                .onPurchaseCompleted { customerInfo in
                    // Purchase successful
                    print("✅ Purchase completed!")
                    dismiss()
                }
                .onRestoreCompleted { customerInfo in
                    // Restore successful
                    print("✅ Restore completed!")
                    dismiss()
                }
                .onPurchaseCancelled {
                    // User cancelled
                    print("ℹ️ Purchase cancelled")
                }
                .onPurchaseFailure { error in
                    // Purchase failed
                    print("❌ Purchase failed: \(error.localizedDescription)")
                }
        } else {
            // Loading or error state
            VStack(spacing: 20) {
                ProgressView()
                Text("Loading subscription options...")
                    .foregroundColor(.secondary)
            }
            .onAppear {
                Task {
                    await subscriptionManager.fetchOfferings()
                }
            }
        }
    }
}

// Feature Row Component
struct FeatureRow: View {
    let icon: String
    let title: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)
            
            Text(title)
                .font(.body)
            
            Spacer()
            
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
        }
    }
}
```

---

## Part 6: Add Customer Center

Create a settings view with Customer Center:

```swift
//
//  SettingsView.swift
//

import SwiftUI
import RevenueCat
import RevenueCatUI

struct SettingsView: View {
    
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @State private var showCustomerCenter = false
    
    var body: some View {
        NavigationView {
            List {
                // Subscription Section
                Section("Subscription") {
                    HStack {
                        Text("Current Plan")
                        Spacer()
                        Text(subscriptionManager.currentTier.displayName)
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("Status")
                        Spacer()
                        Text(subscriptionManager.hasProAccess ? "Active" : "Inactive")
                            .foregroundColor(subscriptionManager.hasProAccess ? .green : .secondary)
                    }
                    
                    if subscriptionManager.hasProAccess {
                        Button(action: {
                            showCustomerCenter = true
                        }) {
                            HStack {
                                Image(systemName: "person.crop.circle.badge.checkmark")
                                Text("Manage Subscription")
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                    } else {
                        NavigationLink(destination: PaywallView()) {
                            HStack {
                                Image(systemName: "crown.fill")
                                    .foregroundColor(.purple)
                                Text("Upgrade to Pro")
                            }
                        }
                    }
                }
                
                // Account Section
                Section("Account") {
                    Button("Restore Purchases") {
                        Task {
                            await subscriptionManager.restorePurchases()
                        }
                    }
                    
                    Button("Refresh Subscription Status") {
                        Task {
                            await subscriptionManager.refreshCustomerInfo()
                        }
                    }
                }
            }
            .navigationTitle("Settings")
            .sheet(isPresented: $showCustomerCenter) {
                // RevenueCat Customer Center
                CustomerCenterView()
            }
        }
    }
}

// Customer Center View
struct CustomerCenterView: View {
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            RevenueCatUI.CustomerCenterView()
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Done") {
                            dismiss()
                        }
                    }
                }
        }
    }
}
```

---

## Part 7: Content Gating

Protect premium content with entitlement checks:

```swift
//
//  ProtectedContentView.swift
//

import SwiftUI

struct ProtectedContentView: View {
    
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @State private var showPaywall = false
    
    var body: some View {
        Group {
            if subscriptionManager.hasProAccess {
                // Show premium content
                PremiumContentView()
            } else {
                // Show locked state
                LockedContentView(showPaywall: $showPaywall)
            }
        }
        .sheet(isPresented: $showPaywall) {
            PaywallView()
        }
    }
}

struct PremiumContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 60))
                .foregroundColor(.green)
            
            Text("Premium Content Unlocked!")
                .font(.title)
                .fontWeight(.bold)
            
            Text("You have full access to all features")
                .foregroundColor(.secondary)
            
            // Your premium content here
        }
        .padding()
    }
}

struct LockedContentView: View {
    @Binding var showPaywall: Bool
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "lock.fill")
                .font(.system(size: 60))
                .foregroundColor(.purple)
            
            Text("Premium Feature")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Upgrade to Pro to unlock this content")
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: {
                showPaywall = true
            }) {
                Text("Unlock Now")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.purple)
                    .cornerRadius(12)
            }
            .padding(.horizontal)
        }
        .padding()
    }
}
```

---

## Part 8: Configure Products in RevenueCat Dashboard

### Step 1: Create Entitlement

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Entitlements**
3. Click **"+ New Entitlement"**
4. **Identifier:** `Manifest the Unseen Pro` (must match your code)
5. **Display Name:** "Pro Access"
6. Click **"Save"**

### Step 2: Create Products in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app
3. Go to **"In-App Purchases"**
4. Create these 3 products:

**Product 1: Monthly Subscription**
- **Product ID:** `monthly`
- **Type:** Auto-Renewable Subscription
- **Duration:** 1 month
- **Price:** (Your price)

**Product 2: Yearly Subscription**
- **Product ID:** `yearly`
- **Type:** Auto-Renewable Subscription
- **Duration:** 1 year
- **Price:** (Your price with savings)

**Product 3: Lifetime Purchase**
- **Product ID:** `lifetime`
- **Type:** Non-Consumable
- **Price:** (One-time price)

### Step 3: Import to RevenueCat

1. In RevenueCat Dashboard, go to **"Products"**
2. Click **"Import from App Store Connect"**
3. Select all 3 products
4. Map each to `Manifest the Unseen Pro` entitlement

### Step 4: Create Offering

1. Go to **"Offerings"**
2. Create **"current"** offering (default)
3. Add all 3 products as packages:
   - `monthly` → Package type: Monthly
   - `yearly` → Package type: Annual
   - `lifetime` → Package type: Lifetime

### Step 5: Configure Paywall

1. Go to **"Paywalls"** in dashboard
2. Click **"+ New Paywall"**
3. Choose a template or create custom
4. Link to **"current"** offering
5. Customize colors, text, and layout
6. Click **"Save"**

---

## Part 9: Testing

### Test with Sandbox Account

1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. Run app and attempt purchase
4. Sign in with sandbox account when prompted
5. Complete purchase
6. Verify entitlement is granted

### Test Scenarios

- [ ] View paywall
- [ ] Purchase monthly subscription
- [ ] Purchase yearly subscription
- [ ] Purchase lifetime
- [ ] Restore purchases
- [ ] Cancel subscription (in sandbox)
- [ ] Check entitlement status
- [ ] Open Customer Center
- [ ] Test content gating

---

## Part 10: Best Practices

### 1. Always Handle Errors

```swift
do {
    let customerInfo = try await Purchases.shared.customerInfo()
    // Success
} catch {
    // Handle error gracefully
    print("Error: \(error.localizedDescription)")
}
```

### 2. Cache Subscription Status

The `SubscriptionManager` uses `@Published` properties to cache status and avoid unnecessary API calls.

### 3. Use Delegate for Real-Time Updates

```swift
extension SubscriptionManager: PurchasesDelegate {
    func purchases(_ purchases: Purchases, receivedUpdated customerInfo: CustomerInfo) {
        // Updates happen automatically
    }
}
```

### 4. Implement Proper Loading States

Always show loading indicators during async operations:
```swift
@Published var isLoading: Bool = false
```

### 5. User-Friendly Error Messages

Don't show raw errors to users:
```swift
errorMessage = "Failed to load subscription options"
```

---

## Complete Example App Flow

```swift
import SwiftUI

@main
struct ManifestTheUnseenApp: App {
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(subscriptionManager)
                .task {
                    await subscriptionManager.fetchOfferings()
                }
        }
    }
}

struct ContentView: View {
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
            
            ProtectedContentView()
                .tabItem {
                    Label("Premium", systemImage: "star")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
    }
}
```

---

## Troubleshooting

### Issue: "Invalid API Key"
- Verify key in RevenueCat dashboard
- Ensure no extra spaces in key string
- Check you're using the correct platform key

### Issue: "No offerings found"
- Verify "current" offering exists in dashboard
- Check products are added to offering
- Wait a few minutes for changes to propagate

### Issue: "Purchase failed"
- Verify sandbox tester is signed in
- Check products exist in App Store Connect
- Ensure products are imported to RevenueCat

---

## Next Steps

1. Customize the paywall design in RevenueCat dashboard
2. Add analytics tracking for purchase events
3. Implement promotional offers
4. Set up webhooks for backend sync
5. Test thoroughly before production release

---

## Resources

- [RevenueCat iOS Documentation](https://www.revenuecat.com/docs/getting-started/installation/ios)
- [Paywall Documentation](https://www.revenuecat.com/docs/tools/paywalls)
- [Customer Center Docs](https://www.revenuecat.com/docs/tools/customer-center)
- [Swift SDK Reference](https://sdk.revenuecat.com/ios/index.html)

---

**Your implementation is complete!** 🎉

You now have a fully functional subscription system with:
✅ RevenueCat SDK integration
✅ Subscription management
✅ Native paywall UI
✅ Customer Center
✅ Content gating
✅ Error handling

<citations>
<document>
<document_type>WEB_PAGE</document_type>
<document_id>https://www.revenuecat.com/docs/getting-started/installation/ios#install-via-swift-package-manager</document_id>
</document>
<document>
<document_type>WEB_PAGE</document_type>
<document_id>https://www.revenuecat.com/docs/tools/paywalls</document_id>
</document>
<document>
<document_type>WEB_PAGE</document_type>
<document_id>https://www.revenuecat.com/docs/tools/customer-center</document_id>
</document>
</citations>
