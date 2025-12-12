@echo off
REM =============================================================================
REM EAS Secrets Setup Script (Windows)
REM =============================================================================
REM This script helps you set up EAS Secrets for Manifest the Unseen.
REM Run this script ONCE after setting up your Expo account and EAS CLI.
REM
REM Prerequisites:
REM   1. Install EAS CLI: npm install -g eas-cli
REM   2. Login to Expo: eas login
REM   3. Have your API keys ready (Supabase, RevenueCat)
REM
REM Usage:
REM   cd mobile\scripts
REM   setup-eas-secrets.bat
REM =============================================================================

echo ======================================
echo Manifest the Unseen - EAS Secrets Setup
echo ======================================
echo.

REM Check if EAS CLI is installed
where eas >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] EAS CLI is not installed
    echo Install it with: npm install -g eas-cli
    pause
    exit /b 1
)

echo [OK] EAS CLI is installed
echo.

echo ======================================
echo IMPORTANT INSTRUCTIONS
echo ======================================
echo.
echo This script will guide you through setting up EAS Secrets.
echo You'll need the following information ready:
echo.
echo 1. Supabase URL (from https://supabase.com/dashboard)
echo 2. Supabase Anon Key (from Project Settings -^> API)
echo 3. RevenueCat iOS Key (from https://app.revenuecat.com/)
echo.
echo For security, we'll use the EAS CLI commands directly.
echo.
pause
echo.

echo ======================================
echo Step 1: Verify EAS Login
echo ======================================
echo.
echo Checking who is logged in...
eas whoami
echo.

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Not logged in to Expo
    echo Please run: eas login
    pause
    exit /b 1
)

echo [OK] You are logged in to Expo
echo.
pause
echo.

echo ======================================
echo Step 2: List Existing Secrets
echo ======================================
echo.
echo Current EAS Secrets:
eas secret:list
echo.
pause
echo.

echo ======================================
echo Step 3: Create/Update Secrets
echo ======================================
echo.
echo Copy and run these commands one at a time:
echo.
echo -- Supabase URL --
echo eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_SUPABASE_URL"
echo.
echo -- Supabase Anon Key --
echo eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_ANON_KEY"
echo.
echo -- RevenueCat iOS Key --
echo eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "YOUR_IOS_KEY"
echo.
echo.
echo IMPORTANT:
echo - Replace YOUR_SUPABASE_URL with your actual Supabase URL
echo - Replace YOUR_ANON_KEY with your actual Supabase anon key
echo - Replace YOUR_IOS_KEY with your actual RevenueCat iOS key
echo.
echo If a secret already exists, delete it first:
echo   eas secret:delete --name SECRET_NAME
echo.
pause
echo.

echo ======================================
echo Step 4: Verify Secrets (Optional)
echo ======================================
echo.
set /p verify="Do you want to list secrets now to verify? (Y/N): "
if /i "%verify%"=="Y" (
    echo.
    echo Current EAS Secrets:
    eas secret:list
    echo.
)

echo ======================================
echo Setup Instructions Complete!
echo ======================================
echo.
echo Next Steps:
echo 1. Manually run the eas secret:create commands above with your real values
echo 2. Set up backend secrets in Supabase Edge Functions
echo 3. Test with: eas build --profile preview --platform ios
echo.
echo For detailed documentation, see: EAS_SECRETS_SETUP.md
echo.
pause
