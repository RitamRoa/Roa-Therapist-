# 📱 Android Deployment Guide - Peace of Mind App

## Current Status ✅

- ✅ Production build completed successfully
- ✅ Android platform added to project
- ⚠️ Java version incompatibility detected (Java 23 vs Gradle 8.0.2)

## 🎯 Method 1: Install Android Studio (Recommended)

### Step 1: Install Android Studio

1. Download Android Studio from: https://developer.android.com/studio
2. Install it in your Applications folder
3. Open Android Studio and complete the setup wizard
4. Install Android SDK and required tools

### Step 2: Fix Java Version Issue

Android Studio comes with its own JDK. We need to use Java 17 or 21 for Gradle:

```bash
# Option A: Install Java 17 using Homebrew
brew install openjdk@17

# Set JAVA_HOME for this project
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

### Step 3: Open Project in Android Studio

```bash
cd "/Users/ritam/Desktop/Peace of mind"
npx cap open android
```

This will open the Android folder in Android Studio.

### Step 4: Build APK in Android Studio

1. Wait for Gradle sync to complete (first time takes 5-10 minutes)
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5: Install on Your Redmi 13

**Option A: Direct USB Connection**

1. Enable **Developer Options** on your Redmi 13:
   - Go to Settings → About phone
   - Tap "MIUI version" 7 times
   - Developer options will appear in Settings
2. Enable **USB Debugging** in Developer Options
3. Connect phone to Mac via USB
4. In Android Studio, click the **Run** button (green play icon)
5. Select your Redmi 13 from the device list

**Option B: Transfer APK File**

1. Copy the APK: `android/app/build/outputs/apk/debug/app-debug.apk`
2. Transfer to phone via:
   - AirDrop (if supported)
   - Google Drive / Cloud storage
   - USB cable (copy to Downloads folder)
   - Email to yourself
3. On phone, open the APK file
4. Allow installation from unknown sources if prompted
5. Install the app

---

## 🚀 Method 2: Build APK Without Android Studio (Faster)

This method builds the APK directly from command line, then you transfer it to your phone.

### Step 1: Fix Java Version

```bash
# Install Java 17 (compatible with Gradle 8)
brew install openjdk@17

# Use Java 17 for this session
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java version
java -version  # Should show version 17
```

### Step 2: Build the APK

```bash
cd "/Users/ritam/Desktop/Peace of mind"

# Rebuild with correct Java version
npm run build
npx cap sync android

# Build debug APK
cd android
./gradlew assembleDebug
```

### Step 3: Find Your APK

The APK will be at:

```
/Users/ritam/Desktop/Peace of mind/android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Transfer to Redmi 13

**Method A: Using Google Drive**

1. Upload `app-debug.apk` to Google Drive
2. Open Google Drive on your Redmi 13
3. Download and install the APK

**Method B: Using AirDrop/Nearby Share**

1. Use Nearby Share or email to send APK to phone
2. Open the APK file on your phone
3. Install (enable "Install from unknown sources" if needed)

**Method C: Using USB Cable**

```bash
# Find your APK
open "/Users/ritam/Desktop/Peace of mind/android/app/build/outputs/apk/debug"

# Connect phone via USB, enable File Transfer mode
# Drag and drop app-debug.apk to phone's Downloads folder
# On phone, use File Manager to install the APK
```

---

## 🔧 Method 3: Using Expo Application Services (EAS) - Cloud Build

If local builds are problematic, use EAS to build in the cloud:

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Initialize EAS

```bash
cd "/Users/ritam/Desktop/Peace of mind"
eas build:configure
```

### Step 3: Build for Android

```bash
eas build --platform android --profile preview
```

This builds your APK in the cloud and provides a download link!

---

## 📦 Method 4: Quick Export Using Capacitor Live Update

For quick testing, you can use the web version as PWA:

### On Your Redmi 13:

1. Open Chrome browser
2. Navigate to your laptop's IP address (find it with `ifconfig | grep inet`)
3. Start dev server: `npm start -- --host`
4. Visit: `http://YOUR_IP_ADDRESS:3000`
5. In Chrome menu → "Add to Home Screen"
6. The app will work like a native app!

---

## 🛠️ Troubleshooting

### Java Version Issues

If you see "Unsupported class file major version":

```bash
# Install Java 17
brew install openjdk@17

# Make it default
export JAVA_HOME=/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home

# Restart your terminal
```

### Gradle Sync Failed

```bash
cd android
./gradlew clean
./gradlew build --refresh-dependencies
```

### MIUI Installation Blocked

On Redmi phones with MIUI:

1. Settings → Privacy protection → Special permissions
2. Install unknown apps → Enable for File Manager/Chrome
3. Try installing again

### USB Debugging Not Working

1. Enable Developer Options (tap MIUI version 7 times)
2. Enable USB Debugging
3. Enable USB Debugging (Security settings)
4. Allow installation via USB

---

## 📝 Quick Command Reference

```bash
# Build production version
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK (requires Java 17)
cd android && ./gradlew assembleDebug

# Build release APK (signed)
cd android && ./gradlew assembleRelease
```

---

## 🎯 Recommended Approach for Redmi 13

**For First-Time Setup:**

1. Install Java 17: `brew install openjdk@17`
2. Set JAVA_HOME to Java 17
3. Run `cd android && ./gradlew assembleDebug`
4. Copy APK to Google Drive
5. Download on Redmi 13 and install

**For Future Updates:**

1. `npm run build`
2. `npx cap sync android`
3. `cd android && ./gradlew assembleDebug`
4. Transfer new APK to phone

---

## ✅ Next Steps

Choose the method that works best for you:

- **Easiest**: Method 4 (PWA) - No installation needed
- **Best for Development**: Method 1 (Android Studio)
- **Fastest**: Method 2 (Command Line APK)
- **Most Reliable**: Method 3 (Cloud Build)

Good luck! 🚀
