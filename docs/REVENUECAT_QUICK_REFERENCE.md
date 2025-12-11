# RevenueCat Setup - Quick Reference Card

Quick copy-paste reference for setting up RevenueCat.

**Last Updated**: 2025-12-10
**Model**: Two-Tier (Novice + Enlightenment)

---

## 📋 Required Information

### Entitlement IDs (Must Match Exactly)
```
novice_path
enlightenment_path
```

### Product IDs (Must Match Exactly)
```
manifest_novice_monthly
manifest_novice_yearly
manifest_enlightenment_monthly
manifest_enlightenment_yearly
```

### Offering ID
```
current
```
*(Must be named "current" - SDK looks for this by default)*

---

## 💰 Pricing Structure

| Tier | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| **Novice Path** ⭐ | $7.99 | $59.99 | 37% |
| **Enlightenment Path** | $19.99 | $149.99 | 37% |

**Trial:** 7 days (all products)

---

## 🎯 Feature Access by Tier

### Free (No Subscription)
- ✗ No workbook phases
- ✗ No meditations
- ✗ No Guru AI chat

### Novice Path ⭐ Most Popular
- ✓ All 10 workbook phases
- ✓ All 18 guided meditations
- ✓ All breathing exercises
- ✓ All meditation music
- ✓ Vision boards
- ✓ Progress tracking
- ✗ **NO Guru AI chat**

### Enlightenment Path 👑 Premium
- ✓ All 10 workbook phases
- ✓ All 18 guided meditations
- ✓ All breathing exercises
- ✓ All meditation music
- ✓ Vision boards
- ✓ Progress tracking
- ✓ **Guru AI chat** (exclusive)

---

## 📝 Copy-Paste Values

### RevenueCat Dashboard

**Project Name:**
```
Manifest the Unseen
```

**Entitlements:**
1. Identifier: `novice_path`, Display: "Novice Path"
2. Identifier: `enlightenment_path`, Display: "Enlightenment Path"

**Offering:**
- Identifier: `current`
- Display Name: "Standard Offering"

---

## 🍎 App Store Connect

**Subscription Group:**
```
manifest_subscriptions
```

**Product Reference Names:**
```
Novice Path Monthly
Novice Path Yearly
Enlightenment Path Monthly
Enlightenment Path Yearly
```

---

## 🔗 Product → Entitlement Mapping

```
manifest_novice_monthly        → novice_path
manifest_novice_yearly         → novice_path
manifest_enlightenment_monthly → enlightenment_path
manifest_enlightenment_yearly  → enlightenment_path
```

---

## 🔧 Environment Variable

**File:** `mobile/.env`

```env
# Test key (current)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=test_BNBlDdtGQwZdpmfspkxtempIcYP

# Production key (get from RevenueCat dashboard)
# EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_YOUR_PRODUCTION_KEY_HERE
```

---

## ✅ Implementation Checklist

```markdown
- [x] RevenueCat account created
- [x] iOS app added to RevenueCat project
- [x] API key copied and saved
- [x] API key added to mobile/.env
- [x] 2 entitlements created in RevenueCat
- [x] 4 products created in App Store Connect
- [x] App Store Connect integrated with RevenueCat
- [x] 4 products imported to RevenueCat
- [x] Products mapped to entitlements
- [x] "current" offering created
- [x] 4 packages added to offering
- [x] App.tsx updated with initialization
- [ ] EAS development build created
- [ ] Tested on iPhone
- [ ] Production API key obtained
- [ ] Production build submitted
```

---

## 🚀 Quick Test Commands

**Build for simulator:**
```bash
cd mobile
eas build --profile development --platform ios
```

**Start dev server:**
```bash
npx expo start --dev-client
```

**Production build:**
```bash
eas build --profile production --platform ios
```

**Submit to App Store:**
```bash
eas submit --platform ios
```

---

## 🐛 Quick Troubleshooting

**Issue:** No offerings available
→ Check "current" offering exists and has packages

**Issue:** Purchase failed
→ Sign out of App Store, use sandbox account

**Issue:** Product not found
→ Verify product IDs match exactly (case-sensitive)

**Issue:** Entitlement not granted
→ Check product is mapped to entitlement in RevenueCat

---

## 📚 Key Resources

- **RevenueCat Dashboard:** https://app.revenuecat.com/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **Full Setup Guide:** `docs/REVENUECAT_SETUP_CHECKLIST.md`

---

**Last Updated:** December 10, 2025
