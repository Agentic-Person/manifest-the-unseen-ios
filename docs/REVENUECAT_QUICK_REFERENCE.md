# RevenueCat Setup - Quick Reference Card

Quick copy-paste reference for setting up RevenueCat.

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

| Tier | Monthly | Yearly | Savings |
|------|---------|--------|---------|
| **Novice Path** | $7.99 | $59.99 | 37% |
| **Awakening Path** | $12.99 | $99.99 | 36% |
| **Enlightenment Path** | $19.99 | $149.99 | 37% |

**Trial:** 7 days (all products)

---

## 🎯 Feature Access by Tier

### Free (No Subscription)
- ✓ Phases 1-2
- ✓ 0 meditations
- ✓ 5 journal entries/month
- ✓ 3 AI chats/day

### Novice Path
- ✓ Phases 1-5
- ✓ 3 guided meditations
- ✓ 50 journal entries/month
- ✓ 10 AI chats/day

### Awakening Path ⭐ Most Popular
- ✓ Phases 1-8
- ✓ 6 guided meditations
- ✓ 200 journal entries/month
- ✓ 50 AI chats/day
- ✓ Voice transcription
- ✓ Vision boards

### Enlightenment Path 👑 Premium
- ✓ All 10 phases
- ✓ 18 guided meditations (all)
- ✓ Unlimited journal entries
- ✓ Unlimited AI chats
- ✓ Voice transcription
- ✓ Vision boards
- ✓ Priority support

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
manifest_novice_monthly       → novice_path
manifest_novice_yearly        → novice_path
manifest_awakening_monthly    → awakening_path
manifest_awakening_yearly     → awakening_path
manifest_enlightenment_monthly → enlightenment_path
manifest_enlightenment_yearly  → enlightenment_path
```

---

## 🔧 Environment Variable

**File:** `mobile/.env`

```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_api_key_here
```

---

## ✅ Implementation Checklist

Copy this to track your progress:

```markdown
- [ ] RevenueCat account created
- [ ] iOS app added to RevenueCat project
- [ ] API key copied and saved
- [ ] API key added to mobile/.env
- [ ] 3 entitlements created in RevenueCat
- [ ] 6 products created in App Store Connect
- [ ] App Store Connect integrated with RevenueCat
- [ ] 6 products imported to RevenueCat
- [ ] Products mapped to entitlements
- [ ] "current" offering created
- [ ] 6 packages added to offering
- [ ] App.tsx updated with initialization
- [ ] EAS development build created
- [ ] Tested on iPhone
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

**Last Updated:** December 8, 2025
