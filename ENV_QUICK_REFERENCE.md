# .env Files - Quick Reference Card

## Files in This Repository

### ✅ SAFE - Tracked in Git (Templates Only)
```
.env.example                        (Root - comprehensive reference)
mobile/.env.example                 (Mobile app configuration)
tools/youtube-scraper/.env.example  (Backend tool configuration)
```

### ⚠️ SENSITIVE - Local Only (NOT in Git)
```
mobile/.env                         (Contains real API keys)
.env.local                          (Contains real API keys)
tools/youtube-scraper/.env          (Contains service role key)
```

## Quick Commands

### Before Committing
```bash
# Verify no .env files are staged
git status | grep ".env"
# Should only show .env.example files

# Verify .gitignore is working
git check-ignore -v mobile/.env
# Should show: .gitignore:44:.env mobile/.env
```

### Setup for New Developers
```bash
# 1. Copy templates
cp mobile/.env.example mobile/.env

# 2. Fill in keys (get from team lead)
nano mobile/.env

# 3. Verify git ignores it
git status
# Should NOT show mobile/.env
```

### Verify Git History is Clean
```bash
# Check if any .env files were ever committed
git log --all --full-history -- "mobile/.env" ".env.local"
# Should return nothing

# List all .env files in git
git ls-files | grep ".env"
# Should only show .env.example files
```

### Emergency: If .env is Accidentally Committed
```bash
# 1. IMMEDIATELY revoke all API keys
# - Supabase: Project Settings → API → Reset keys
# - OpenAI: https://platform.openai.com/api-keys → Revoke
# - Anthropic: https://console.anthropic.com/ → Revoke

# 2. Remove from git (if not pushed yet)
git reset HEAD mobile/.env
git commit --amend

# 3. Remove from history (if already pushed)
# See ENV_SECURITY_GUIDE.md → "Key Exposure Response"
```

## Key Types

### SAFE for Mobile App (EXPO_PUBLIC_ prefix)
- ✅ `EXPO_PUBLIC_SUPABASE_URL`
- ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `EXPO_PUBLIC_REVENUECAT_IOS_KEY`

### NEVER in Mobile App (Server-side only)
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `OPENAI_API_KEY`
- ❌ `ANTHROPIC_API_KEY`

## File Locations

| File | Purpose | Contains |
|------|---------|----------|
| `mobile/.env` | Mobile app config | Supabase anon, RevenueCat SDK |
| `.env.local` | Root config (legacy) | AI keys, service role key |
| `tools/youtube-scraper/.env` | Backend tool | Service role key, OpenAI |

## Documentation

- **Full Guide**: `ENV_SECURITY_GUIDE.md` (340 lines)
- **Audit Report**: `ENV_CLEANUP_REPORT.md` (this audit)
- **This Card**: Quick reference (you are here)

## Status Check

**Last Verified**: 2025-12-12
**Git History**: ✅ Clean (no .env files ever committed)
**Protection**: ✅ .gitignore properly configured
**Risk Level**: 🟢 LOW

## Need Help?

1. Read `ENV_SECURITY_GUIDE.md` for detailed procedures
2. Check `ENV_CLEANUP_REPORT.md` for audit findings
3. Contact team lead for API keys

---

**Remember**: NEVER commit files named `.env` (without .example)!
