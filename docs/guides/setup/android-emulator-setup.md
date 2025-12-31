# Android Emulator Setup for Windows

Complete guide to setting up Android Studio and Android emulator for developing Manifest the Unseen on Windows with Expo.

## Prerequisites

- **Windows 10/11** (64-bit)
- **8GB+ RAM** (16GB recommended for smooth emulator performance)
- **10GB+ free disk space** (for Android Studio + SDK + emulator)
- **Virtualization enabled in BIOS** (Intel VT-x or AMD-V)
- **Node.js 18+** installed (verify with `node --version`)

## Step 1: Install Android Studio

### Download and Install

1. Visit [Android Studio download page](https://developer.android.com/studio)
2. Download Android Studio for Windows (latest stable version)
3. Run the installer (`android-studio-XXXX.exe`)
4. Follow the setup wizard:
   - **Installation Type**: Choose "Standard"
   - **SDK Components**: Ensure these are checked:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device (AVD)
   - **Accept licenses** when prompted
5. Click "Finish" and wait for initial setup to complete

### First Launch Configuration

1. Launch Android Studio
2. If prompted to import settings, choose "Do not import settings"
3. Complete the setup wizard:
   - Choose theme (Darcula or Light)
   - Verify SDK components are selected
   - Click "Finish" to download components (~2-3 GB)

## Step 2: Install Required SDK Tools

### Open SDK Manager

1. In Android Studio welcome screen, click **Configure → SDK Manager**
   - Or from a project: **Tools → SDK Manager**
2. Note the **Android SDK Location** (usually `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`)

### Install SDK Platforms

1. Click the **SDK Platforms** tab
2. Check these versions:
   - ✅ **Android 14.0 (UpsideDownCake)** - API Level 34 (latest)
   - ✅ **Android 13.0 (Tiramisu)** - API Level 33 (recommended)
   - ✅ **Android 12.0 (S)** - API Level 31 (backup)
3. Check "Show Package Details" to see system images
4. For each platform, select:
   - **x86_64** or **ARM 64 v8a** system image (for best performance)

### Install SDK Build Tools

1. Click the **SDK Tools** tab
2. Check "Show Package Details"
3. Ensure these are installed:
   - ✅ **Android SDK Build-Tools** (latest version, e.g., 34.0.0)
   - ✅ **Android Emulator** (latest)
   - ✅ **Android SDK Platform-Tools** (latest)
   - ✅ **Intel x86 Emulator Accelerator (HAXM)** - for Intel CPUs
   - ✅ **Google Play Services** (optional, for Google services)
4. Click **Apply** → **OK** to download and install
5. Wait for downloads to complete (may take 10-20 minutes)

## Step 3: Configure Environment Variables

### Set ANDROID_HOME

1. Open **System Properties**:
   - Press `Win + X` → **System**
   - Click **Advanced system settings** (on the right)
   - Click **Environment Variables**

2. In **System variables**, click **New**:
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`
   - Replace `[YourUsername]` with your Windows username
   - Click **OK**

### Add to PATH

1. Still in **System variables**, find **Path** and click **Edit**
2. Click **New** and add these two entries:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   ```
3. Click **OK** on all dialogs
4. **Restart your terminal** (or Command Prompt/PowerShell) for changes to take effect

### Verify Installation

Open a new terminal and run:
```bash
# Check Android SDK is accessible
adb --version
# Should show: Android Debug Bridge version 1.0.XX

# Check emulator is accessible
emulator -version
# Should show: Android emulator version X.XX
```

If commands are not recognized, verify environment variables and restart terminal.

## Step 4: Create Android Virtual Device (AVD)

### Using Device Manager

1. In Android Studio, click **Tools → Device Manager**
   - Or click the phone icon in the toolbar
2. Click **Create Virtual Device**

### Select Device Definition

1. Choose a device from the list:
   - **Recommended**: **Pixel 5** (6.0" display, 1080x2340, 440 dpi)
   - **Alternative**: **Pixel 6 Pro** (larger screen for tablet testing)
2. Click **Next**

### Select System Image

1. Choose a system image:
   - **Recommended**: **API 33 (Android 13.0)** with **x86_64** or **ARM64**
   - Click **Download** next to the image if not installed
2. Wait for download to complete
3. Select the downloaded image and click **Next**

### Configure AVD

1. **AVD Name**: `Pixel_5_API_33` (or your preference)
2. **Startup orientation**: Portrait
3. **Graphics**: Hardware - GLES 2.0 (for better performance)
4. Click **Show Advanced Settings** to optimize:
   - **Boot option**: Quick Boot (faster subsequent starts)
   - **RAM**: 2048 MB (or 4096 MB if you have 16GB+ RAM)
   - **VM heap**: 512 MB
   - **Internal Storage**: 2048 MB
   - **SD card**: 512 MB (optional)
   - **Enable Device Frame**: Yes (to see device bezel)
5. Click **Finish**

Your emulator is now created and ready to use!

## Step 5: Start the Android Emulator

### From Device Manager

1. Open **Device Manager** in Android Studio
2. Find your AVD (e.g., `Pixel_5_API_33`)
3. Click the **Play (▶)** button
4. Wait for emulator to boot (first boot may take 2-3 minutes)

### From Command Line

```bash
# List available AVDs
emulator -list-avds
# Should show: Pixel_5_API_33

# Start the emulator
emulator -avd Pixel_5_API_33

# Start with specific options (faster startup)
emulator -avd Pixel_5_API_33 -no-snapshot-load
```

### Verify Emulator is Running

```bash
# Check connected devices
adb devices
# Should show something like:
# List of devices attached
# emulator-5554   device
```

The emulator is now running and ready to receive apps!

## Step 6: Run the App on Emulator

### Using Expo (Recommended for this project)

1. **Start the emulator** (if not already running)
2. **Open a terminal** in the project directory:
   ```bash
   cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile
   ```
3. **Start Expo dev server**:
   ```bash
   npm start
   # Or: npx expo start
   ```
4. **Press `a`** in the terminal to open on Android emulator
   - Expo will automatically detect the running emulator
   - App will build and install (~30 seconds first time)
   - Metro bundler will send JavaScript bundle to the emulator

### Alternative: Install Expo Go App

1. **Start the emulator**
2. **Open Play Store** in the emulator (Google Play icon)
3. **Sign in** with a Google account (or create one)
4. **Search for "Expo Go"** and install
5. **Start Expo dev server**:
   ```bash
   npm start
   ```
6. **Open Expo Go** on the emulator
7. **Enter the URL** shown in terminal (e.g., `exp://192.168.X.X:8081`)

### Build and Run Native Binary

For testing native modules (when you add them later):
```bash
# Build and run Android app
npm run android
# Or: npx expo run:android

# This will:
# 1. Generate native Android project
# 2. Build APK
# 3. Install on emulator
# 4. Launch the app
```

## Troubleshooting

### Emulator Won't Start

**Error: "Intel HAXM is required"**
- Install HAXM from SDK Manager (Tools tab)
- Or download directly: https://github.com/intel/haxm/releases
- Ensure virtualization is enabled in BIOS

**Error: "VT-x is not available"**
1. Restart PC and enter BIOS (usually F2, F10, or DEL during boot)
2. Find "Virtualization Technology" or "VT-x" (Intel) / "AMD-V" (AMD)
3. Set to **Enabled**
4. Save and exit BIOS

**Error: "Hyper-V is blocking emulator"**
- Disable Hyper-V in Windows:
  ```powershell
  # Run as Administrator
  bcdedit /set hypervisorlaunchtype off
  ```
- Restart your PC
- Note: This will disable WSL2 and Docker Desktop (Hyper-V backend)

**Emulator is very slow**
- Allocate more RAM in AVD settings (2-4 GB)
- Use x86_64 system image (faster than ARM on Intel/AMD PCs)
- Enable "Graphics: Hardware - GLES 2.0" in AVD config
- Close other applications to free up resources
- Ensure Quick Boot is enabled

### adb not found

**Error: "adb is not recognized"**
1. Verify `ANDROID_HOME` environment variable:
   ```bash
   echo %ANDROID_HOME%
   # Should show: C:\Users\...\Android\Sdk
   ```
2. Verify `Path` includes `%ANDROID_HOME%\platform-tools`
3. **Restart terminal** (environment variables load on new sessions)
4. If still not working, add the full path:
   - Add to Path: `C:\Users\[YourUsername]\AppData\Local\Android\Sdk\platform-tools`

### Metro Bundler Connection Failed

**Error: "Could not connect to development server"**
- Ensure emulator is running: `adb devices`
- Restart Metro bundler: `npm start` (press `r` to reload)
- Clear Metro cache: `npm start -- --reset-cache`
- Check firewall isn't blocking Node.js

**Error: "Unable to resolve module"**
- Clear cache and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  npm start -- --reset-cache
  ```

### App Crashes on Startup

1. **Check Metro logs** for errors (red text in terminal)
2. **Shake emulator** (Ctrl + M or click "..." in emulator toolbar)
3. **Open Dev Menu** → **Reload** or **Debug**
4. **Check Supabase connection** (verify .env file exists)

## Performance Optimization

### Faster Emulator Startup

1. **Enable Quick Boot** in AVD settings (default)
2. **Keep emulator running** between sessions (don't close)
3. **Use snapshot**: Saves emulator state for instant resume
4. **Cold Boot only when needed**: Right-click AVD → "Cold Boot Now"

### Better Performance

- **Close Android Studio** when running emulator (saves ~2GB RAM)
- **Use lightweight IDE** (VS Code) instead of Android Studio for coding
- **Limit emulator resources** to 2GB RAM (unless you have 16GB+)
- **Disable animations** in emulator: Settings → Developer Options → Window/Transition/Animator scale → 0.5x

### Hardware Acceleration

- **Intel**: HAXM (installed via SDK Manager)
- **AMD**: Built-in with Windows Hypervisor Platform
- **Graphics**: Always use "Hardware - GLES 2.0" (not Software)

## Quick Reference

### Daily Development Workflow

```bash
# Terminal 1: Start emulator (if not running)
emulator -avd Pixel_5_API_33

# Terminal 2: Start Expo dev server
cd C:\projects\mobileApps\manifest-the-unseen-ios\mobile
npm start

# Press 'a' to open on Android emulator
# Code on Windows → Auto-refresh on emulator (~2 seconds)
```

### Useful ADB Commands

```bash
# List connected devices
adb devices

# Install APK manually
adb install path/to/app.apk

# View device logs
adb logcat

# Screen recording
adb shell screenrecord /sdcard/demo.mp4
# Stop with Ctrl+C, then pull file:
adb pull /sdcard/demo.mp4

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Restart adb server (if connection issues)
adb kill-server
adb start-server
```

### Emulator Shortcuts

- **Ctrl + M**: Open React Native dev menu
- **Ctrl + H**: Home button
- **Ctrl + Left/Right**: Rotate screen
- **Ctrl + Up/Down**: Volume up/down
- **F11**: Fullscreen emulator
- **Ctrl + Shift + V**: Paste clipboard to emulator

## Next Steps

After setup:
1. **Run the app**: `cd mobile && npm start` → press `a`
2. **Test authentication**: Sign up with email in the emulator
3. **Enable hot reload**: Save a file in VS Code → see changes in emulator
4. **Explore features**: Navigation, design system, auth screens

For iOS testing on real device, see: [docs/ios-expo-go-setup.md](./ios-expo-go-setup.md)

## Resources

- [Android Studio Download](https://developer.android.com/studio)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Expo Android Setup](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Android Emulator Guide](https://developer.android.com/studio/run/emulator)

---

**Setup Status**: Android emulator ready for development with Expo Go or native builds.
