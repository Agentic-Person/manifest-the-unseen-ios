# Deployment Guides

**Quick Navigation for iOS App Deployment**

---

## 📚 Table of Contents

### Essential Guides (Read These First)

1. **[iOS Mobile Workflow](ios-mobile-workflow.md)** 🎯
   - Complete guide for React Native + Expo development
   - Local dev → GitHub → EAS Build → TestFlight → App Store
   - Tech stack breakdown, key concepts, troubleshooting
   - **Start here** if you're new to iOS development

2. **[App Store Submission Survival Guide](app-store-submission-survival-guide.md)** ⭐ NEW
   - Avoid common rejection reasons
   - Privacy Questionnaire deep dive
   - Apple Guidelines compliance
   - Reusable for ANY iOS app project
   - **Use this before EVERY submission**

---

### Supporting Guides

3. **[Build Optimization](build-optimization.md)**
   - Reduce build times
   - Optimize bundle size
   - Performance improvements

4. **[Migration Instructions](migration-instructions.md)**
   - Database migrations with Supabase
   - Schema changes
   - Data migration patterns

5. **[Deployment Summary](deployment-summary.md)**
   - Quick reference for deployment commands
   - Checklists and timelines

---

## 🚀 Quick Start Workflow

### For First-Time iOS Development

1. Read: [iOS Mobile Workflow](ios-mobile-workflow.md)
   - Understand the complete development lifecycle
   - Set up your environment
   - Learn key concepts

2. Read: [App Store Submission Survival Guide](app-store-submission-survival-guide.md)
   - Learn what to avoid
   - Understand App Store requirements
   - Prepare for submission

3. Start building your app!

---

### For App Store Submission

**Checklist**:

1. ✅ Complete [App Store Submission Survival Guide Pre-Submission Checklist](app-store-submission-survival-guide.md#pre-submission-checklist)

2. ✅ Fill out Privacy Questionnaire (use [Privacy Questionnaire Deep Dive](app-store-submission-survival-guide.md#privacy-questionnaire-deep-dive))

3. ✅ Test on TestFlight (follow [Testing Before Submission](app-store-submission-survival-guide.md#testing-before-submission))

4. ✅ Submit for Review

---

## 📋 Key Documents by Use Case

### "I want to understand the full iOS workflow"
→ **[iOS Mobile Workflow](ios-mobile-workflow.md)**

### "I'm about to submit to App Store"
→ **[App Store Submission Survival Guide](app-store-submission-survival-guide.md)**

### "My app got rejected"
→ **[Handling Rejections](app-store-submission-survival-guide.md#handling-rejections)**

### "I need to fill out the Privacy Questionnaire"
→ **[Privacy Questionnaire Deep Dive](app-store-submission-survival-guide.md#privacy-questionnaire-deep-dive)**

### "How do I optimize my build?"
→ **[Build Optimization](build-optimization.md)**

### "I need to run a database migration"
→ **[Migration Instructions](migration-instructions.md)**

---

## 🎯 Most Important Takeaways

### For New iOS Developers

1. **Privacy Questionnaire is #1 rejection reason**
   - Spend time getting it right
   - Check what your SDKs collect (not just your code)
   - Device ID is almost always collected

2. **Privacy Policy is required**
   - Must be live before submission
   - Must match questionnaire
   - Must be mobile-responsive

3. **Legal links must work**
   - Test on real iPhone
   - Must open in Safari
   - No 404 errors

4. **Apple Sign-In is mandatory** (if using OAuth)
   - Use official component
   - Follow HIG exactly

5. **Test on real devices**
   - Simulator isn't enough
   - Use TestFlight before App Review

---

## 🔗 External Resources

- **Apple Developer**: https://developer.apple.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Supabase Docs**: https://supabase.com/docs

---

## 📝 Document Status

| Document | Last Updated | Status |
|----------|--------------|--------|
| iOS Mobile Workflow | Dec 12, 2025 | ✅ Current |
| App Store Submission Survival Guide | Jan 15, 2026 | ✅ Current |
| Build Optimization | - | - |
| Migration Instructions | - | - |
| Deployment Summary | - | - |

---

**Need help?** Check the [main docs README](../../README.md) for full documentation navigation.
