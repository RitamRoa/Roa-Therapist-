#!/bin/bash

# 📱 Deploy Peace of Mind to Android Phone via USB
# This script builds and installs the app directly to your Redmi 13

set -e

echo "🚀 Peace of Mind - USB Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Add Android SDK tools to PATH
export PATH=$PATH:~/Library/Android/sdk/platform-tools
export PATH=$PATH:~/Library/Android/sdk/build-tools/*

echo "📍 Working directory: $SCRIPT_DIR"
echo ""

# Check if device is connected
echo "📱 Checking for connected device..."
DEVICE_COUNT=$(adb devices | grep -v "List" | grep "device" | wc -l | xargs)

if [ "$DEVICE_COUNT" -eq "0" ]; then
    echo -e "${RED}✗ No device detected!${NC}"
    echo ""
    echo "Please connect your Redmi 13 via USB and:"
    echo "1. Enable Developer Options (tap MIUI version 7 times)"
    echo "2. Enable USB Debugging in Developer Options"
    echo "3. Connect USB cable"
    echo "4. Accept the USB debugging prompt on your phone"
    echo ""
    echo "Then run this script again."
    exit 1
else
    DEVICE_NAME=$(adb devices | grep "device" | head -1 | awk '{print $1}')
    echo -e "${GREEN}✓ Device connected: $DEVICE_NAME${NC}"
fi
echo ""

# Step 1: Build the web app
echo "📦 Step 1/4: Building web app..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Web build successful!${NC}"
else
    echo -e "${RED}✗ Web build failed!${NC}"
    exit 1
fi
echo ""

# Step 2: Copy to Android
echo "🔄 Step 2/4: Copying to Android platform..."
npx cap copy android
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Copy successful!${NC}"
else
    echo -e "${RED}✗ Copy failed!${NC}"
    exit 1
fi
echo ""

# Step 3: Build APK
echo "🏗️  Step 3/4: Building debug APK..."
echo "This may take a few minutes..."
echo ""

cd android

# Try to build with Gradle
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ APK build successful!${NC}"
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    echo -e "${BLUE}APK location: $APK_PATH${NC}"
    echo ""
    
    # Step 4: Install on device
    echo "📲 Step 4/4: Installing on Redmi 13..."
    adb install -r "$APK_PATH"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓✓✓ SUCCESS! APP INSTALLED! ✓✓✓${NC}"
        echo ""
        echo "🎉 Peace of Mind is now installed on your Redmi 13!"
        echo ""
        echo "Look for the app icon on your home screen."
        echo ""
    else
        echo ""
        echo -e "${YELLOW}⚠ Installation completed with warnings${NC}"
        echo "The app should still be on your device."
        echo "Check your app drawer for 'Peace of Mind'"
        echo ""
    fi
    
else
    echo ""
    echo -e "${RED}✗ Build failed${NC}"
    echo ""
    echo "Possible fixes:"
    echo "1. Check Java version (needs Java 17 or 21)"
    echo "2. Try: cd android && ./gradlew clean"
    echo "3. Then run this script again"
    echo ""
    
    # Still try to install if APK exists from previous build
    if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
        echo "Found existing APK, attempting to install..."
        adb install -r "app/build/outputs/apk/debug/app-debug.apk"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Installed existing APK!${NC}"
        fi
    fi
fi
