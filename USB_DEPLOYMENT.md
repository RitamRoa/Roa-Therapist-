# 📱 Quick USB Deployment Guide

## Steps to Install App on Your Redmi 13:

### 1️⃣ Connect Your Phone

**On Redmi 13:**

- Go to **Settings → About phone**
- Tap **"MIUI version"** 7 times (enables Developer Options)
- Go to **Settings → Additional settings → Developer options**
- Enable **"USB debugging"**
- Enable **"Install via USB"** (if available)
- Connect USB cable to Mac

**On Mac:**

- Accept the USB debugging authorization prompt that appears on your phone
- Run: `~/Library/Android/sdk/platform-tools/adb devices`
- You should see your device listed

---

### 2️⃣ Build and Install

**Quick Command (Do Everything at Once):**

```bash
cd "/Users/ritam/Desktop/Peace of mind"
npm run build && npx cap copy android && cd android && ../gradlew assembleDebug && adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**Or Use the Automated Script:**

```bash
cd "/Users/ritam/Desktop/Peace of mind"
./deploy-to-phone.sh
```

---

### 3️⃣ Manual Step-by-Step (If Script Fails)

```bash
# 1. Build web assets
npm run build

# 2. Copy to Android
npx cap copy android

# 3. Build APK
cd android
./gradlew assembleDebug

# 4. Install to phone
~/Library/Android/sdk/platform-tools/adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔧 Troubleshooting

**"No devices attached"**

```bash
# Check connection
~/Library/Android/sdk/platform-tools/adb devices

# If unauthorized, revoke and re-accept on phone
~/Library/Android/sdk/platform-tools/adb kill-server
~/Library/Android/sdk/platform-tools/adb start-server
```

**"Gradle build failed"**

- This is likely the Java 23 vs Java 17 issue
- The APK should still exist from previous build
- Try: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

**"Installation failed"**

- Uninstall old version first: `adb uninstall com.peaceofmind.app`
- Then install again: `adb install app/build/outputs/apk/debug/app-debug.apk`

---

## 📦 Quick Update (After First Install)

When you make changes and want to update the app:

```bash
npm run build && npx cap copy android && ~/Library/Android/sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

(This skips the Gradle build and uses the existing APK)

---

## 🎯 Alias for Easy Access

Add this to your `~/.zshrc`:

```bash
alias adb='~/Library/Android/sdk/platform-tools/adb'
alias deploy-peace='cd "/Users/ritam/Desktop/Peace of mind" && ./deploy-to-phone.sh'
```

Then just run: `deploy-peace`

---

## ✅ Success Indicators

You'll know it worked when:

- ✅ Terminal shows "Success" after adb install
- ✅ "Peace of Mind" app icon appears on your Redmi 13
- ✅ You can open and use the app offline
- ✅ All features work (Chat, Notes, Tasks)

---

## 🚀 First Time Setup

Since the Android platform is already added, you just need to:

1. **Connect phone** → Enable USB debugging
2. **Run script** → `./deploy-to-phone.sh`
3. **Open app** → Look for "Peace of Mind" on your phone

That's it! 🎉
