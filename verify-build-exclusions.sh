#!/bin/bash
# Build Exclusion Verification Script
# Run this to verify meditation-audio, snips, and other large folders are excluded
# Usage: bash verify-build-exclusions.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Build Exclusion Verification - Manifest the Unseen        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

echo "📋 Checking Git Ignore Status..."
echo "─────────────────────────────────"

# Check meditation-audio/.wip
if git check-ignore -q meditation-audio/.wip/test.txt 2>/dev/null; then
    echo -e "${GREEN}✅ meditation-audio/.wip/ - IGNORED by git${NC}"
else
    echo -e "${RED}❌ meditation-audio/.wip/ - NOT IGNORED${NC}"
    ((ERRORS++))
fi

# Check snips
if git check-ignore -q snips/test.txt 2>/dev/null; then
    echo -e "${GREEN}✅ snips/ - IGNORED by git${NC}"
else
    echo -e "${RED}❌ snips/ - NOT IGNORED${NC}"
    ((ERRORS++))
fi

# Check meditation-audio
if git check-ignore -q meditation-audio/test.m4a 2>/dev/null; then
    echo -e "${GREEN}✅ meditation-audio/ - IGNORED by git${NC}"
else
    echo -e "${RED}❌ meditation-audio/ - NOT IGNORED${NC}"
    ((ERRORS++))
fi

# Check for tracked audio files
AUDIO_COUNT=$(git ls-files | grep -E '\.(m4a|mp3|wav)$' | wc -l)
if [ "$AUDIO_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No audio files tracked in git (0 files)${NC}"
else
    echo -e "${RED}❌ $AUDIO_COUNT audio files are tracked in git${NC}"
    ((ERRORS++))
fi

echo ""
echo "📦 Checking EAS Build Exclusions (.easignore)..."
echo "─────────────────────────────────────────────────"

if grep -q "../meditation-audio/" mobile/.easignore 2>/dev/null; then
    echo -e "${GREEN}✅ meditation-audio/ in .easignore${NC}"
else
    echo -e "${RED}❌ meditation-audio/ NOT in .easignore${NC}"
    ((ERRORS++))
fi

if grep -q "../snips/" mobile/.easignore 2>/dev/null; then
    echo -e "${GREEN}✅ snips/ in .easignore${NC}"
else
    echo -e "${RED}❌ snips/ NOT in .easignore${NC}"
    ((ERRORS++))
fi

if grep -q "../docs/" mobile/.easignore 2>/dev/null; then
    echo -e "${GREEN}✅ docs/ in .easignore${NC}"
else
    echo -e "${YELLOW}⚠️  docs/ not in .easignore (may bloat builds)${NC}"
fi

echo ""
echo "🎯 Checking Asset Bundle Patterns (app.json)..."
echo "───────────────────────────────────────────────"

if grep -q "assetBundlePatterns" mobile/app.json 2>/dev/null; then
    echo -e "${GREEN}✅ assetBundlePatterns defined in app.json${NC}"
    echo "   Bundled assets:"
    grep -A 5 "assetBundlePatterns" mobile/app.json | grep '"' | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  No assetBundlePatterns in app.json${NC}"
fi

echo ""
echo "📊 Folder Size Report..."
echo "───────────────────────"

if [ -d "meditation-audio/.wip" ]; then
    WIP_SIZE=$(du -sh meditation-audio/.wip 2>/dev/null | cut -f1)
    echo -e "meditation-audio/.wip:  ${YELLOW}$WIP_SIZE${NC} (excluded from builds)"
fi

if [ -d "snips" ]; then
    SNIPS_SIZE=$(du -sh snips 2>/dev/null | cut -f1)
    echo -e "snips/:                 ${YELLOW}$SNIPS_SIZE${NC} (excluded from builds)"
fi

if [ -d "meditation-audio" ]; then
    AUDIO_SIZE=$(du -sh meditation-audio 2>/dev/null | cut -f1)
    echo -e "meditation-audio/:      ${YELLOW}$AUDIO_SIZE${NC} (excluded from builds)"
fi

echo ""
echo "══════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - Build exclusions are properly configured!${NC}"
else
    echo -e "${RED}❌ FOUND $ERRORS ISSUE(S) - Build exclusions may not be working!${NC}"
    echo -e "${YELLOW}Fix the issues above to ensure large folders don't bloat your builds.${NC}"
fi

echo "══════════════════════════════════════════════════════════════"
echo ""
