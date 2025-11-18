# Authentication Providers Configuration

**Project**: Manifest the Unseen
**Last Updated**: November 17, 2025

This document provides step-by-step instructions for configuring authentication providers in Supabase.

---

## Table of Contents

1. [Apple Sign-In Configuration](#apple-sign-in-configuration)
2. [Email/Password Configuration](#emailpassword-configuration)
3. [Google OAuth (Optional)](#google-oauth-optional)
4. [Testing Authentication](#testing-authentication)
5. [React Native Integration](#react-native-integration)

---

## Apple Sign-In Configuration

Apple Sign-In is the **primary authentication method** for iOS. It's required by Apple for apps that offer social login.

### Prerequisites

- Apple Developer Account (enrolled in Apple Developer Program - $99/year)
- Access to Apple Developer Console
- Supabase project created

### Step 1: Create Services ID in Apple Developer Console

1. Go to [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)
2. Click the **"+"** button to create a new identifier
3. Select **"Services IDs"** and click **Continue**
4. Configure:
   - **Description**: `Manifest the Unseen Authentication`
   - **Identifier**: `com.yourcompany.manifesttheunseen.services`
     - Use reverse domain notation
     - Must be unique across Apple's ecosystem
     - Cannot be changed later
   - Click **Continue**, then **Register**

### Step 2: Enable Sign in with Apple

1. Find your newly created Services ID in the list
2. Click on it to edit
3. Check **"Sign in with Apple"**
4. Click **"Configure"** next to Sign in with Apple
5. **Primary App ID**: Select your iOS app's Bundle ID (e.g., `com.yourcompany.manifesttheunseen`)
6. **Domains and Subdomains**: Leave empty for now (we'll add after Supabase setup)
7. **Return URLs**: Leave empty for now
8. Click **Save** (we'll come back to this)

### Step 3: Create Sign in with Apple Key

1. In Apple Developer Console, go to **Certificates, Identifiers & Profiles** → **Keys**
2. Click the **"+"** button
3. Configure:
   - **Key Name**: `Manifest the Unseen Sign in with Apple Key`
   - Check **"Sign in with Apple"**
   - Click **"Configure"** next to Sign in with Apple
   - Select your **Primary App ID**
   - Click **Save**
4. Click **Continue**, then **Register**
5. **Download the `.p8` file** - you can only download this ONCE!
   - Save it securely (e.g., in 1Password or another password manager)
   - Note the **Key ID** (10-character string shown on the page)
6. Also note your **Team ID**:
   - Found in Apple Developer Console → **Membership** section
   - 10-character alphanumeric string

**Important**: Store these securely:
- `.p8` file (private key)
- Key ID
- Team ID
- Services ID

### Step 4: Configure Apple Sign-In in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** and toggle to **Enabled**
3. Fill in the form:
   - **Services ID**: `com.yourcompany.manifesttheunseen.services` (from Step 1)
   - **Authorized Client IDs**: Add your iOS Bundle ID(s)
     - `com.yourcompany.manifesttheunseen` (production)
     - `com.yourcompany.manifesttheunseen.dev` (development, if separate)
   - **Team ID**: Your Apple Team ID (from Step 3)
   - **Key ID**: The Key ID from your `.p8` file (from Step 3)
   - **Private Key**: Open the `.p8` file in a text editor and paste the **entire contents** (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
4. Click **Save**
5. **Copy the Redirect URL** shown at the bottom:
   - Format: `https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback`
   - You'll need this for the next step

### Step 5: Add Redirect URL to Apple Services ID

1. Go back to Apple Developer Console → **Identifiers** → Your Services ID
2. Click **"Configure"** next to Sign in with Apple
3. **Domains and Subdomains**: Add `[YOUR_PROJECT_ID].supabase.co`
   - Example: `abcdefghij.supabase.co`
   - Do NOT include `https://`
4. **Return URLs**: Add the Supabase redirect URL from Step 4
   - Example: `https://abcdefghij.supabase.co/auth/v1/callback`
   - Must be exact match (case-sensitive)
5. Click **Save**, then **Continue**, then **Save** again
6. Wait 5-10 minutes for Apple's servers to propagate the changes

### Step 6: Test Apple Sign-In

**Option A: Test in Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Sign in with Apple"**
3. Should redirect to Apple login page

**Option B: Test with React Native** (recommended)
- See [React Native Integration](#react-native-integration) section below

---

## Email/Password Configuration

Email/Password is the **secondary authentication method**, used as a fallback if users don't want to use Apple Sign-In.

### Step 1: Enable Email Provider

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Email** and toggle to **Enabled**
3. Configure settings:
   - **Confirm email**: ✅ **Enabled** (recommended for production)
     - Users must click a link in their email to confirm
     - Prevents fake signups
   - **Secure email change**: ✅ **Enabled**
     - Requires confirmation on both old and new email addresses
   - **Secure password change**: ✅ **Enabled**
     - Requires current password to change password

### Step 2: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize templates for branding:

**Confirm Signup Template:**
```html
<h2>Welcome to Manifest the Unseen!</h2>
<p>You're one step away from starting your manifestation journey.</p>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Your Email</a></p>
<p>Or use this code: <strong>{{ .Token }}</strong></p>
<p>If you didn't create this account, please ignore this email.</p>
```

**Reset Password Template:**
```html
<h2>Reset Your Password</h2>
<p>We received a request to reset your password for Manifest the Unseen.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>Or use this code: <strong>{{ .Token }}</strong></p>
<p>If you didn't request this, please ignore this email.</p>
```

### Step 3: Configure Email Settings

**For Development (Supabase's built-in SMTP):**
- Uses Supabase's SMTP server (limited to 4 emails per hour per user)
- Good for testing, NOT for production

**For Production (Custom SMTP - recommended):**
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (e.g., SendGrid, AWS SES, Mailgun):
   - **SMTP Host**: `smtp.sendgrid.net` (example)
   - **SMTP Port**: `587` (TLS) or `465` (SSL)
   - **SMTP User**: Your SMTP username
   - **SMTP Password**: Your SMTP password
   - **Sender Email**: `noreply@manifesttheunseen.com`
   - **Sender Name**: `Manifest the Unseen`
3. Click **Save**
4. Test by sending a password reset email

### Step 4: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. **Site URL**: `https://manifesttheunseen.com` (production) or `manifesttheunseen://` (deep link for mobile)
3. **Redirect URLs**: Add allowed redirect URLs:
   - `manifesttheunseen://auth/callback` (iOS deep link)
   - `http://localhost:3000` (web development)
   - `http://localhost:19006` (Expo development)
   - Production web URL when deployed

---

## Google OAuth (Optional)

Google OAuth is optional but recommended for users who prefer Google login.

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `Manifest the Unseen`
3. Enable **Google+ API** in **APIs & Services** → **Library**
4. Go to **APIs & Services** → **Credentials**
5. Click **"Create Credentials"** → **"OAuth client ID"**
6. Configure:
   - **Application type**: `Web application`
   - **Name**: `Manifest the Unseen Supabase Auth`
   - **Authorized JavaScript origins**: Leave empty
   - **Authorized redirect URIs**: Add Supabase redirect URL
     - `https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback`
7. Click **Create**
8. Copy **Client ID** and **Client Secret**

### Step 2: Configure Google Provider in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and toggle to **Enabled**
3. Paste:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Click **Save**

### Step 3: Configure iOS (React Native)

1. Add Google OAuth to your iOS app:
   - Follow [react-native-google-signin](https://github.com/react-native-google-signin/google-signin) guide
   - Add URL scheme to `Info.plist`
2. Test Google Sign-In in your app

---

## Testing Authentication

### Test Email/Password Signup

**Using Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Enter test email and password
4. User should appear in the list

**Using JavaScript:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'secure-password-123',
  options: {
    data: {
      full_name: 'Test User',
    },
  },
});

console.log('User:', data.user);
console.log('Session:', data.session);
```

### Test Apple Sign-In

**Prerequisites:**
- Physical iOS device OR Simulator with Apple ID signed in
- React Native app configured (see below)

**Test Flow:**
1. Tap "Sign in with Apple" button in your app
2. Apple Sign-In sheet appears
3. Select Apple ID or create new
4. Choose to share or hide email
5. Tap "Continue"
6. App receives user token and creates session

### Test Email/Password Login

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'secure-password-123',
});

console.log('Session:', data.session);
console.log('User:', data.user);
```

---

## React Native Integration

### Install Dependencies

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install react-native-url-polyfill

# For Apple Sign-In
npm install @invertase/react-native-apple-authentication

# For Google Sign-In (optional)
npm install @react-native-google-signin/google-signin
```

### Configure Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Implement Apple Sign-In

```typescript
import { supabase } from './lib/supabase';
import { appleAuth } from '@invertase/react-native-apple-authentication';

async function signInWithApple() {
  try {
    // Perform Apple authentication
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Get credential state
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      // Sign in to Supabase
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: appleAuthRequestResponse.identityToken!,
        nonce: appleAuthRequestResponse.nonce,
      });

      if (error) throw error;

      console.log('Signed in:', data.user);
      return data.user;
    }
  } catch (error) {
    console.error('Apple Sign-In error:', error);
  }
}
```

### Implement Email/Password Signup

```typescript
import { supabase } from './lib/supabase';

async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  console.log('User created:', data.user);
  return data.user;
}

async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  console.log('Signed in:', data.session);
  return data.session;
}
```

### Listen for Auth State Changes

```typescript
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function useAuth() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        console.log('Session:', session);

        if (event === 'SIGNED_IN') {
          // Navigate to home screen
        } else if (event === 'SIGNED_OUT') {
          // Navigate to login screen
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}
```

---

## Troubleshooting

### Apple Sign-In: "Invalid Redirect URI"

**Cause:** Redirect URL in Apple Services ID doesn't match Supabase URL.

**Solution:**
1. Verify redirect URL in Supabase Dashboard (Authentication → Providers → Apple)
2. Verify redirect URL in Apple Developer Console (Services ID → Configure)
3. Ensure exact match (case-sensitive, no trailing slash)
4. Wait 5-10 minutes for Apple to propagate changes

### Email/Password: "Email rate limit exceeded"

**Cause:** Supabase's built-in SMTP has a rate limit (4 emails/hour/user).

**Solution:**
1. Wait 1 hour, or
2. Configure custom SMTP provider (SendGrid, AWS SES)

### General: "Invalid JWT" or "Auth session missing"

**Cause:** Session expired or not persisted.

**Solution:**
1. Check `AsyncStorage` is configured in Supabase client
2. Ensure `autoRefreshToken: true` is set
3. Call `supabase.auth.getSession()` to restore session on app launch

---

## Next Steps

After configuring authentication providers:

1. ✅ Apple Sign-In configured
2. ✅ Email/Password configured
3. ✅ OAuth providers configured (optional)

**Proceed to:**
- Implement authentication UI in React Native app
- Test auth flows on physical device
- Configure deep linking for email confirmations
- Set up analytics for auth events

**References:**
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Apple Sign-In Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [React Native Apple Authentication](https://github.com/invertase/react-native-apple-authentication)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)

---

**Document Version:** 1.0
**Last Updated:** November 17, 2025
