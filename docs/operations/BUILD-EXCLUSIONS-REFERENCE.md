# Build Exclusions Reference

**Purpose**: Keep large development files OUT of git version control and EAS iOS builds

**Last Updated**: 2026-01-19

---

## 🎯 Excluded Folders (Total: ~3GB)

| Folder | Size | Excluded From | Reason |
|--------|------|---------------|--------|
| `meditation-audio/.wip/` | 855MB | Git + EAS Builds | Uncompressed WAV work files |
| `snips/` | 247MB | Git + EAS Builds | Code snippets & screenshots |
| `meditation-audio/` | ~1GB | Git + EAS Builds | Audio hosted on Supabase Storage |
| `web/.next/` | ~311MB | Git (regenerates) | Next.js build cache |
| `node_modules/` | ~850MB | Git (regenerates) | Dependencies |

---

## 📝 How Exclusions Work

### 1. Git Exclusions (`.gitignore`)

Located at: **root/.gitignore**

```gitignore
# Audio content (stored in Supabase Storage, not git)
meditation-audio/
meditation-audio/.wip/
*.m4a
*.mp3
*.wav

# Screenshots and snips (local development only)
snips/
test-screenshots/
Screenshot*.png
```

**Effect**: These files/folders never get committed to git or pushed to GitHub.

---

### 2. EAS Build Exclusions (`mobile/.easignore`)

Located at: **mobile/.easignore**

```
# Large audio files - meditation audio is streamed from Supabase Storage
../meditation-audio/

# Snips folder (240MB of code snippets)
../snips/

# Documentation and marketing (not needed in app)
../docs/
../marketing/
../web/
../tools/
```

**Effect**: These files/folders are never uploaded during `eas build` commands, reducing:
- Upload time to EAS servers
- Build time
- Final app binary size

---

### 3. Asset Bundle Patterns (`mobile/app.json`)

Located at: **mobile/app.json** (lines 10-16)

```json
"assetBundlePatterns": [
  "assets/icon.png",
  "assets/splash-v2.png",
  "assets/adaptive-icon.png",
  "src/assets/images-compressed/**/*",
  "src/assets/icons/**/*"
]
```

**Effect**: ONLY these asset patterns are bundled into the iOS app binary. Everything else is excluded.

**Note**: Meditation audio is NOT listed here because it's streamed from Supabase Storage, not bundled in the app.

---

## ✅ Verification

Run this script anytime to verify exclusions are working:

```bash
bash verify-build-exclusions.sh
```

Expected output: **"ALL CHECKS PASSED"**

---

## 🚨 What To Do If Files Reappear in Builds

If you notice large files being included in builds again:

### Step 1: Verify Ignore Files Are Intact

```bash
# Check .gitignore
grep "meditation-audio" .gitignore
grep "snips" .gitignore

# Check .easignore
grep "meditation-audio" mobile/.easignore
grep "snips" mobile/.easignore
```

### Step 2: Check for Tracked Files

```bash
# See if any audio files are tracked
git ls-files | grep -E '\.(m4a|mp3|wav)$'

# See if snips is tracked
git ls-files | grep snips/

# Result should be EMPTY (no output)
```

### Step 3: Remove from Git If Needed

```bash
# Remove folder from git tracking (keeps local files)
git rm --cached -r meditation-audio/
git rm --cached -r snips/

# Commit the removal
git commit -m "chore: remove large folders from git tracking"
git push
```

### Step 4: Verify Asset Bundle Patterns

Open `mobile/app.json` and verify `assetBundlePatterns` does NOT include:
- `meditation-audio`
- `snips`
- `docs`
- Any wildcard patterns like `**/*` (too broad)

---

## 📊 Size Impact

**Without Exclusions**:
- Git repository: ~2.5GB
- EAS build upload: ~2GB+
- Build time: 15-20 minutes

**With Exclusions** ✅:
- Git repository: ~161MB
- EAS build upload: <100MB
- Build time: 5-8 minutes

---

## 🔐 Why This Configuration Is "Baked In"

1. **.gitignore** - Standard git feature, honored by all git clients
2. **.easignore** - Official EAS Build feature, always respected during `eas build`
3. **assetBundlePatterns** - Expo config, defines EXACT assets to bundle (allowlist, not blocklist)

These are industry-standard mechanisms that won't break unless you manually edit the config files.

---

## 📝 Maintenance Notes

**If you add new large folders**:
1. Add to `.gitignore` (for git exclusion)
2. Add to `mobile/.easignore` (for EAS build exclusion)
3. Verify NOT in `assetBundlePatterns` in app.json
4. Run `bash verify-build-exclusions.sh` to confirm

**If meditation audio changes**:
- Upload new files to Supabase Storage via `tools/meditation-upload/upload.js`
- Do NOT commit audio files to git
- Audio files should only exist locally for backup/upload purposes

---

## 🎯 Quick Reference Commands

```bash
# Verify exclusions are working
bash verify-build-exclusions.sh

# Check what's in git
git ls-files | wc -l              # Should be ~999 files
git ls-files | grep meditation    # Should be EMPTY

# Check folder sizes
du -sh meditation-audio/.wip snips meditation-audio

# Clean build cache (safe to delete)
rm -rf web/.next

# Optimize git repository
git gc --aggressive --prune=now
```

---

**Questions?** Re-run `bash verify-build-exclusions.sh` to diagnose issues.
