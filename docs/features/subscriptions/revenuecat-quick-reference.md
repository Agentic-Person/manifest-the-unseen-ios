# RevenueCat Setup - Quick Reference Card

Quick copy-paste reference for setting up RevenueCat.

**Last Updated**: 2025-12-11
**Model**: Three-Tier (Novice + Awakening + Enlightenment)

---

## 📋 Required Information

### Entitlement IDs (Must Match Exactly)
```
novice_path
awakening_path
enlightenment_path
```

### Product IDs (Must Match Exactly)
```
manifest_novice_monthly
manifest_novice_yearly
manifest_awakening_monthly
manifest_awakening_yearly
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

| Tier | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Novice Path** | $7.99 | $79.92 | Workbook + Progress + Music |
| **Awakening Path** ⭐ | $19.99 | $199.90 | + Guided Meditations + Guru Analysis + Analytics |
| **Enlightenment Path** 👑 | $49.99 | $499.90 | + Coming Soon features |

**Trial:** 7 days (all products)
**Yearly = 2 months free (~17% discount)**

---

## 🎯 Feature Access by Tier

### Free (No Subscription)
- ✗ No workbook phases
- ✗ No meditations
- ✗ No Guru access

### Novice Path - Begin Your Journey
- ✓ All 10 workbook phases
- ✓ Progress tracking
- ✓ PDF Manuscript
- ✓ 6 meditation music tracks
- ✓ Vision boards
- ✗ No guided meditations
- ✗ No Guru access

### Awakening Path ⭐ Most Popular
- ✓ Everything in Novice, plus:
- ✓ **6 guided meditations**
- ✓ **Guru workbook analysis**
- ✓ **Advanced analytics**
- ✓ Priority support

### Enlightenment Path 👑 Complete Experience
- ✓ Everything in Awakening, plus:
- 🔜 Coming Soon: Full Guru AI chat
- 🔜 Coming Soon: Voice journaling
- 🔜 Coming Soon: 12+ meditation tracks
- ✓ Early access to new features

---

## 📝 Copy-Paste Values

### RevenueCat Dashboard

**Project Name:**
```
Manifest the Unseen
```

**Entitlements:**
1. Identifier: `novice_path`, Display: "Novice Path"
2. Identifier: `awakening_path`, Display: "Awakening Path"
3. Identifier: `enlightenment_path`, Display: "Enlightenment Path"

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
Awakening Path Monthly
Awakening Path Yearly
Enlightenment Path Monthly
Enlightenment Path Yearly
```

---

## 🔗 Product → Entitlement Mapping

```
manifest_novice_monthly        → novice_path
manifest_novice_yearly         → novice_path
manifest_awakening_monthly     → awakening_path
manifest_awakening_yearly      → awakening_path
manifest_enlightenment_monthly → enlightenment_path
manifest_enlightenment_yearly  → enlightenment_path
```

---

## 🔧 Environment Variable

**File:** `mobile/.env`

```env
# Production key (current)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_syRiYucCEYWABHxxiKjporBRJVM
```

---

## ✅ Implementation Checklist

```markdown
- [x] RevenueCat account created
- [x] iOS app added to RevenueCat project
- [x] Production API key obtained
- [x] API key added to eas.json production env
- [ ] 3 entitlements created in RevenueCat
- [ ] 6 products created in App Store Connect
- [ ] App Store Connect integrated with RevenueCat
- [ ] 6 products imported to RevenueCat
- [ ] Products mapped to entitlements
- [ ] "current" offering created
- [ ] 6 packages added to offering
- [x] App.tsx updated with initialization
- [ ] Production build submitted
- [ ] Tested on iPhone via TestFlight
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

**Last Updated:** December 11, 2025
