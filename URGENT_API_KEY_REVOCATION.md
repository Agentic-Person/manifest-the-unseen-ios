# 🚨 URGENT: API Key Revocation Instructions
## Manifest the Unseen - Security Incident Response

**Date:** December 12, 2025
**Severity:** CRITICAL
**Status:** IMMEDIATE ACTION REQUIRED

---

## ⚠️ CRITICAL: Keys Have Been Exposed

The following API keys were committed to git and are publicly accessible if this repository is public or shared:

1. **OpenAI API Key**
2. **Anthropic API Key**
3. **Supabase Service Role Key**
4. **RevenueCat iOS API Key**

**Action Required:** Revoke ALL keys immediately (within the next hour).

---

## Step-by-Step Revocation Process

### 1. OpenAI API Key 🔴 CRITICAL

**Exposed Key:** `sk-proj-CLuU6Ec...` (check your local .env file for the full key)

**Steps:**
1. Go to https://platform.openai.com/api-keys
2. Log in to your OpenAI account
3. Find the key starting with `sk-proj-CLuU6Ec...`
4. Click "Revoke" or the delete icon
5. Create a new API key
6. Save the new key to your password manager (NOT git)
7. Update your `.env` file locally (do NOT commit)

**Estimated Impact if Compromised:**
- Cost: Up to your billing limit
- Risk: Unauthorized API usage, quota exhaustion
- Data: Potential access to conversation history if keys are linked

---

### 2. Anthropic API Key 🔴 CRITICAL

**Exposed Key:** `sk-ant-api03-avtdaN5...` (check your local .env file for the full key)

**Steps:**
1. Go to https://console.anthropic.com/settings/keys
2. Log in to your Anthropic account
3. Find the key starting with `sk-ant-api03-avtdaN5...`
4. Click "Revoke API Key" or delete
5. Create a new API key
6. Save the new key to your password manager (NOT git)
7. Update your `.env` file locally (do NOT commit)

**Estimated Impact if Compromised:**
- Cost: Up to your billing limit
- Risk: Unauthorized Claude API usage
- Data: Potential access to your account usage stats

---

### 3. Supabase Service Role Key 🔴 CRITICAL - HIGHEST RISK

**Exposed Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (truncated in this doc)

**Steps:**
1. Go to https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/settings/api
2. Log in to your Supabase account
3. Navigate to Project Settings → API
4. Under "Project API keys", find "service_role" key
5. Click "Reset service_role key"
6. Confirm the reset (this will invalidate the old key immediately)
7. Copy the new service_role key
8. **IMPORTANT:** Service role key should NEVER be in client-side code
   - Only use in backend/Edge Functions
   - Remove from `.env` files in mobile app
9. Save to your password manager

**Estimated Impact if Compromised:**
- **CRITICAL:** Complete database access bypassing Row Level Security
- Risk: Attacker can read/modify/delete ALL user data
- Risk: Can escalate privileges for any user
- Risk: Can access all tables including auth.users
- Cost: Potential data breach, GDPR violations

**Additional Actions:**
1. Check Supabase logs for unauthorized access (Settings → Logs)
2. Review recent database queries (SQL Editor → History)
3. Monitor for unusual activity in the next 48 hours
4. Consider rotating database password if suspicious activity found

---

### 4. RevenueCat iOS API Key 🟠 HIGH PRIORITY

**Exposed Key:** `appl_syRiYucCEYWABHxxiKjporBRJVM`

**Steps:**
1. Go to https://app.revenuecat.com/settings/keys
2. Log in to your RevenueCat account
3. Navigate to Settings → API Keys
4. Find the iOS key `appl_syRiYucCEYWABHxxiKjporBRJVM`
5. Click "Regenerate Key" or "Delete"
6. Create a new public Apple key
7. Save the new key to your password manager
8. Update your `.env` file locally (do NOT commit)

**Estimated Impact if Compromised:**
- Risk: Potential subscription fraud
- Risk: Unauthorized access to user subscription status
- Cost: Minimal (read-only key, but still sensitive)

**Additional Actions:**
1. Review recent subscription events in RevenueCat dashboard
2. Check for unusual patterns or anomalies
3. Monitor for the next 24-48 hours

---

## After Revocation: Update Your Local Environment

Once you've revoked and created new keys:

1. **Update your local `.env` file** with new keys:
```bash
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile

# Edit .env with new keys (use your preferred editor)
notepad .env
```

2. **VERIFY .env is in .gitignore**:
```bash
# Should return .env (confirming it's ignored)
git check-ignore mobile/.env
```

3. **Test the new keys work**:
```bash
# Run the app locally to verify
npm run ios
```

---

## Git History Cleanup (CRITICAL)

Even after revoking keys, they remain in git history. The cleanup agents are working on this, but here's what's happening:

### What's Being Cleaned:
- `mobile/.env` - Contains OpenAI, Anthropic, RevenueCat keys
- `.env.local` - Contains Supabase service role key, dev credentials
- Any other `.env*` files in history

### Cleanup Methods:
1. **Option A: BFG Repo-Cleaner** (recommended, faster)
   - Download from https://rtyley.github.io/bfg-repo-cleaner/
   - Run: `bfg --delete-files .env --no-blob-protection`

2. **Option B: git filter-branch** (built-in, slower)
   - Run: `git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch mobile/.env .env.local' --prune-empty --tag-name-filter cat -- --all`

3. **Option C: git-filter-repo** (recommended by git maintainers)
   - Install: `pip install git-filter-repo`
   - Run: `git filter-repo --path mobile/.env --invert-paths`

**The cleanup agent is handling this for you.**

### After Cleanup:
```bash
# Force push to remote (ONLY if repo is private or you're the only contributor)
git push origin --force --all
git push origin --force --tags

# Notify any collaborators to re-clone the repository
```

⚠️ **WARNING:** If this is a shared repository, coordinate with your team before force-pushing.

---

## Prevention: Set Up EAS Secrets (REQUIRED)

The EAS Secrets setup agent is configuring this, but here's what you'll need to run:

```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login to Expo
eas login

# Set up secrets (run these with your NEW keys)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://zbyszxtwzoylyygtexdr.supabase.co" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_NEW_ANON_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "YOUR_NEW_OPENAI_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_ANTHROPIC_API_KEY --value "YOUR_NEW_ANTHROPIC_KEY" --type string
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "YOUR_NEW_REVENUECAT_KEY" --type string

# Verify secrets are set
eas secret:list
```

**Note:** Replace `YOUR_NEW_*_KEY` with the actual new keys you just created.

---

## Monitoring for Unauthorized Usage

### Check for Unauthorized API Usage:

#### OpenAI:
1. Go to https://platform.openai.com/usage
2. Check for unusual spikes in usage
3. Review usage by date/time
4. Look for patterns that don't match your development schedule

#### Anthropic:
1. Go to https://console.anthropic.com/settings/billing
2. Review recent usage
3. Check for unexpected API calls

#### Supabase:
1. Go to https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr/logs/explorer
2. Filter logs by time range (last 24 hours)
3. Look for unusual patterns:
   - Large number of queries from unknown IPs
   - Database modifications you didn't make
   - New user signups you don't recognize

#### RevenueCat:
1. Go to https://app.revenuecat.com/charts/active-subscriptions
2. Check for unusual subscription events
3. Review customer list for unknown entries

---

## Timeline of Actions

### Immediate (Next 1 Hour) 🔴:
- [ ] Revoke OpenAI API key
- [ ] Revoke Anthropic API key
- [ ] Reset Supabase service role key
- [ ] Regenerate RevenueCat iOS key
- [ ] Create new keys and save to password manager

### Today 🟠:
- [ ] Update local `.env` with new keys (do NOT commit)
- [ ] Wait for git cleanup agents to complete
- [ ] Set up EAS Secrets with new keys
- [ ] Test app with new keys
- [ ] Review API usage logs for suspicious activity

### This Week 🟡:
- [ ] Monitor API usage for next 7 days
- [ ] Implement additional security measures (agents are working on this)
- [ ] Set up pre-commit hooks to prevent future key commits
- [ ] Review access logs and audit trails

---

## Notification Requirements

### If Repository is Public:
- Consider this a **data breach**
- Document the incident
- Notify any users if their data was potentially exposed
- Review legal requirements (GDPR, CCPA, etc.)

### If Repository is Private:
- Audit who has access to the repository
- Consider rotating all credentials as a precaution
- Review git history for when keys were first committed

---

## Cost Estimates if Keys Were Abused

**Worst-case scenarios:**

| Service | Daily Limit | Potential Cost |
|---------|-------------|----------------|
| OpenAI | Billing limit | Up to your billing cap |
| Anthropic | Billing limit | Up to your billing cap |
| Supabase | No API cost | Data breach risk (incalculable) |
| RevenueCat | N/A | Minimal (read-only key) |

**Recommended Actions:**
1. Set up billing alerts on OpenAI and Anthropic (if not already)
2. Set spending limits on API platforms
3. Monitor daily for next 7 days

---

## Post-Incident Review

After completing all actions, document:

1. **When keys were first committed:** Check git log
   ```bash
   git log --all --full-history -- "mobile/.env"
   ```

2. **Who had access:** Review repository collaborators

3. **How long keys were exposed:** Calculate time from first commit to now

4. **Any suspicious activity detected:** Document in incident log

5. **Preventive measures implemented:**
   - Pre-commit hooks
   - EAS Secrets
   - Security training

---

## Support & Resources

**If you need help:**
- OpenAI Support: https://help.openai.com
- Anthropic Support: support@anthropic.com
- Supabase Support: https://supabase.com/support
- RevenueCat Support: https://www.revenuecat.com/support

**Security Best Practices:**
- Never commit API keys to git
- Use environment variables for all secrets
- Use secret management services (EAS Secrets, AWS Secrets Manager, etc.)
- Set up pre-commit hooks to scan for secrets
- Regular security audits
- Principle of least privilege (don't use service_role key in client apps)

---

## Checklist Summary

### Immediate Actions (Do Now):
- [ ] Revoke OpenAI key
- [ ] Revoke Anthropic key
- [ ] Reset Supabase service_role key
- [ ] Regenerate RevenueCat key
- [ ] Create new keys
- [ ] Save new keys to password manager

### Today:
- [ ] Update local .env (do NOT commit)
- [ ] Set up EAS Secrets
- [ ] Test app with new keys
- [ ] Check for unauthorized usage

### This Week:
- [ ] Monitor API usage daily
- [ ] Complete git history cleanup
- [ ] Implement prevention measures
- [ ] Document incident

---

**Last Updated:** December 12, 2025
**Status:** Action Required
**Priority:** CRITICAL - P0

**DO NOT commit this file to git if it contains actual key values.**
