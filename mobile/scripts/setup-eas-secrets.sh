#!/bin/bash

# =============================================================================
# EAS Secrets Setup Script
# =============================================================================
# This script helps you set up EAS Secrets for Manifest the Unseen.
# Run this script ONCE after setting up your Expo account and EAS CLI.
#
# Prerequisites:
#   1. Install EAS CLI: npm install -g eas-cli
#   2. Login to Expo: eas login
#   3. Have your API keys ready (Supabase, RevenueCat)
#
# Usage:
#   chmod +x scripts/setup-eas-secrets.sh
#   ./scripts/setup-eas-secrets.sh
# =============================================================================

set -e  # Exit on error

echo "======================================"
echo "Manifest the Unseen - EAS Secrets Setup"
echo "======================================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ Error: EAS CLI is not installed"
    echo "Install it with: npm install -g eas-cli"
    exit 1
fi

echo "✅ EAS CLI is installed"

# Check if logged in
if ! eas whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Expo"
    echo "Login with: eas login"
    exit 1
fi

echo "✅ Logged in to Expo as: $(eas whoami)"
echo ""

# Function to create secret with confirmation
create_secret() {
    local name=$1
    local description=$2
    local example=$3

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Setting up: $name"
    echo "Description: $description"
    echo "Example: $example"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    read -p "Enter value for $name (or press Enter to skip): " value

    if [ -z "$value" ]; then
        echo "⏭️  Skipped $name"
        echo ""
        return
    fi

    # Check if secret already exists
    if eas secret:list 2>/dev/null | grep -q "$name"; then
        echo "⚠️  Secret $name already exists"
        read -p "Do you want to delete and recreate it? (y/N): " confirm

        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo "Deleting existing secret..."
            eas secret:delete --name "$name" --non-interactive || true
        else
            echo "⏭️  Keeping existing secret"
            echo ""
            return
        fi
    fi

    # Create the secret
    echo "Creating secret..."
    if eas secret:create --scope project --name "$name" --value "$value"; then
        echo "✅ Successfully created $name"
    else
        echo "❌ Failed to create $name"
    fi
    echo ""
}

echo "This script will help you set up the following EAS Secrets:"
echo ""
echo "1. EXPO_PUBLIC_SUPABASE_URL"
echo "2. EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "3. EXPO_PUBLIC_REVENUECAT_IOS_KEY"
echo ""
echo "These secrets are used for production and preview builds."
echo "For local development, use the .env file instead."
echo ""
read -p "Press Enter to continue..."
echo ""

# Supabase URL
create_secret \
    "EXPO_PUBLIC_SUPABASE_URL" \
    "Supabase project URL" \
    "https://your-project-ref.supabase.co"

# Supabase Anon Key
create_secret \
    "EXPO_PUBLIC_SUPABASE_ANON_KEY" \
    "Supabase anon/public key (safe for mobile apps)" \
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# RevenueCat iOS Key
create_secret \
    "EXPO_PUBLIC_REVENUECAT_IOS_KEY" \
    "RevenueCat iOS SDK key" \
    "appl_your_ios_key_here"

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Current EAS Secrets:"
eas secret:list
echo ""
echo "Next Steps:"
echo "1. Verify all secrets are listed above"
echo "2. Set up backend secrets in Supabase Edge Functions (see EAS_SECRETS_SETUP.md)"
echo "3. Test with a preview build: eas build --profile preview --platform ios"
echo ""
echo "For more information, see: EAS_SECRETS_SETUP.md"
echo ""
