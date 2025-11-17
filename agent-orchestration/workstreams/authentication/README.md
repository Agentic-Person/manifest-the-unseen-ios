# Authentication Workstream

**Status**: Not Started
**Timeline**: Weeks 3-4 (Phase 1)
**Priority**: P0 - Critical Path

---

## Overview

Authentication is the foundation of the entire app. Users must be able to securely sign up, log in, and maintain sessions across app sessions. This workstream includes Apple Sign-In (primary), email/password (backup), and biometric re-authentication for journal access.

## Timeline

- **Planning**: Week 2
- **Implementation**: Weeks 3-4
- **Testing**: Week 4
- **Maintenance**: Ongoing

## Key Agents Involved

- **Primary**: Backend Specialist (Supabase Auth, RLS)
- **Support**: Frontend Specialist (UI, biometrics)
- **Review**: Security Auditor (auth flow security)

## Key Tasks

1. **Backend: Supabase Auth Setup** (Backend Specialist)
   - Configure Apple Sign-In provider
   - Configure email/password provider
   - Create users table with RLS
   - Set up auth webhooks

2. **Frontend: Auth UI** (Frontend Specialist)
   - Welcome/onboarding screens
   - Apple Sign-In button
   - Email/password forms
   - Loading and error states
   - Biometric setup (Face ID/Touch ID)

3. **Session Management** (Frontend Specialist)
   - Session persistence (Zustand + secure storage)
   - Auto-refresh tokens
   - Logout functionality
   - Session expiry handling

4. **Security Review** (Security Auditor)
   - Review auth flow
   - Validate token storage
   - Test for auth bypasses

## Dependencies

**Blocks**:
- All user-specific features (workbook, journal, meditation, AI chat, vision boards)
- Subscription system

**Blocked By**:
- Supabase project creation (Week 1)
- Apple Developer account setup (Week 1)

## Success Metrics

- Users can sign up in < 30 seconds
- Login success rate > 95%
- Session persists across app restarts
- Biometric re-auth works for journal access
- No auth-related crashes

## Testing Checklist

- [ ] Apple Sign-In works on device
- [ ] Email signup works with valid email
- [ ] Email login works with correct credentials
- [ ] Session persists after app kill
- [ ] Biometric lock prevents journal access
- [ ] Logout clears session data
- [ ] Error messages are helpful

## Technical Details

**Auth Providers**:
- **Apple Sign-In** (primary) - Required by Apple for social login
- **Email/Password** (backup) - For users without Apple ID

**Storage**:
- Supabase session tokens in react-native-keychain (secure)
- User profile in Supabase users table

**Biometric**:
- Face ID / Touch ID for journal re-authentication
- Optional (user can enable/disable)

**RLS Policies**:
```sql
-- Users can view and update their own profile
CREATE POLICY "Users own profile" ON users
  FOR ALL USING (auth.uid() = id);
```

## Resources

- **PRD**: Section 8.2 - Authentication
- **TDD**: Section 6 - Authentication Implementation
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Apple Sign-In**: https://developer.apple.com/sign-in-with-apple/

## Current Status

**Not Started**

## Notes

(Add implementation notes, decisions, gotchas here as work progresses)
