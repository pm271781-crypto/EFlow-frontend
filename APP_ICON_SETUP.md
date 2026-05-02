# BestROutes App Icon Setup Guide

Your custom app icon is located at: `assets/app_icon.png`

## Quick Setup Using Online Tool (Recommended)

### Option 1: Using AppIcon.co (Easiest)
1. Go to https://www.appicon.co/
2. Upload `assets/app_icon.png`
3. Select both Android and iOS
4. Click "Generate"
5. Download the generated files
6. Follow the instructions below to replace the icons

---

## Manual Setup Instructions

### For Android

#### Step 1: Generate Icon Sizes
You need these sizes for Android:
- **mdpi**: 48x48px
- **hdpi**: 72x72px
- **xhdpi**: 96x96px
- **xxhdpi**: 144x144px
- **xxxhdpi**: 192x192px

#### Step 2: Replace Android Icons
Navigate to: `android/app/src/main/res/`

Replace the following files:
```
android/app/src/main/res/
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
    └── ic_launcher_round.png (192x192)
```

#### Step 3: Update Android Manifest (if needed)
File: `android/app/src/main/AndroidManifest.xml`

Ensure the icon is referenced:
```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    ...>
```

---

### For iOS

#### Step 1: Generate Icon Sizes
You need these sizes for iOS:
- 20x20 (iPhone Notification)
- 29x29 (iPhone Settings)
- 40x40 (iPhone Spotlight)
- 60x60 (iPhone App)
- 76x76 (iPad App)
- 83.5x83.5 (iPad Pro App)
- 1024x1024 (App Store)

And their @2x and @3x variants.

#### Step 2: Open Xcode
1. Navigate to `ios/` folder
2. Open `RNNewArchApp.xcworkspace` in Xcode
3. In the left sidebar, click on `RNNewArchApp` project
4. Select `Images.xcassets`
5. Click on `AppIcon`

#### Step 3: Drag and Drop Icons
Drag your generated icon files into the appropriate slots in Xcode's AppIcon section.

**OR** manually replace files in:
```
ios/RNNewArchApp/Images.xcassets/AppIcon.appiconset/
```

---

## Quick Commands to Rebuild

### Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### iOS
```bash
cd ios
rm -rf build
pod install
cd ..
npx react-native run-ios
```

---

## Alternative: Use react-native-make

Install the package:
```bash
npm install -g @bam.tech/react-native-make
```

Generate icons automatically:
```bash
react-native set-icon --path ./assets/app_icon.png
```

This will automatically generate and place all required icon sizes for both platforms!

---

## Verification

### Android
- Check the app drawer after installation
- The icon should appear with your custom design

### iOS
- Check the home screen after installation
- The icon should appear with your custom design

---

## Notes
- The icon image should be square (1024x1024 recommended)
- Use PNG format with transparency if needed
- For best results, use a design that works well at small sizes
- Test on actual devices to ensure the icon looks good

---

## Current Icon Location
Your source icon: `assets/app_icon.png`
