# React Native New Architecture Setup Guide

This project is configured with React Native's **New Architecture** enabled for optimal performance and modern development practices.

## ✅ What's Enabled

### New Architecture Features
- ✅ **Fabric Renderer** - Modern rendering system with better performance
- ✅ **TurboModules** - Faster JavaScript ↔ Native bridge communication
- ✅ **Hermes Engine** - Optimized JavaScript engine for faster startup
- ✅ **Concurrent Rendering** - Better responsiveness with async rendering
- ✅ **TypeScript Support** - Full type safety out of the box

## 📋 Configuration Details

### Android Configuration
**File**: `android/gradle.properties`
```properties
newArchEnabled=true          # Enable new architecture
hermesEnabled=true           # Use Hermes JS engine
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

### iOS Configuration
**File**: `ios/Podfile`
- Automatically configured for new architecture
- Uses modern linking strategy

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm or yarn
- For Android: Android Studio, Android SDK
- For iOS: Xcode 16+, iOS 13.4+

### Installation

```bash
cd RNNewArchApp

# Install dependencies (already done)
npm install

# or
yarn install
```

### Running on Android

```bash
# Start Metro bundler
npm start

# In another terminal, run on Android device/emulator
npm run android
```

**Requirements:**
- Android device or emulator running API level 24+
- Minimum SDK version: 24
- Target SDK version: 36

### Running on iOS

```bash
# Install pods
cd ios
pod install
cd ..

# Run on simulator or device
npm run ios
```

**Requirements:**
- iOS 13.4+
- Xcode 16+

## 📦 Key Dependencies

```json
{
  "react": "19.2.0",
  "react-native": "0.83.1",
  "@react-native/new-app-screen": "0.83.1",
  "react-native-safe-area-context": "^5.5.2"
}
```

## 🔧 Available Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
npm test           # Run tests
npm run lint       # Run ESLint
```

## 📚 Project Structure

```
RNNewArchApp/
├── App.tsx                 # Main app component
├── index.js               # App entry point
├── android/               # Android native code
├── ios/                   # iOS native code
├── __tests__/             # Test files
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── metro.config.js        # Metro bundler config
└── babel.config.js        # Babel config
```

## 🎯 Best Practices for New Architecture

### 1. Component Development
```tsx
import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyComponent = memo(({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
});

export default MyComponent;
```

### 2. Performance Optimization
- Use `React.memo()` for functional components
- Leverage `useCallback` for event handlers
- Implement `useFocusEffect` for screen-specific logic
- Use `FlatList` for long lists with proper keys

### 3. State Management
- Consider using Redux, Zustand, or Context API
- Avoid prop drilling with deep component trees
- Use atomic state updates

### 4. TypeScript Usage
```tsx
interface Props {
  title: string;
  count: number;
  onPress: () => void;
}

const Component: React.FC<Props> = ({ title, count, onPress }) => {
  // Component code
};
```

## 🐛 Troubleshooting

### Issue: Build fails on Android
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: Build fails on iOS
**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

### Issue: Metro bundler not starting
**Solution:**
```bash
npm start -- --reset-cache
```

### Issue: New Architecture not being used
**Verify:**
1. Android: Check `android/gradle.properties` has `newArchEnabled=true`
2. Run: `npm start -- --verbose` and look for Fabric/TurboModule messages
3. Clear cache and rebuild

## 📖 Resources

- [React Native Official Docs](https://reactnative.dev)
- [New Architecture Migration Guide](https://reactnative.dev/docs/new-architecture-intro)
- [Fabric Documentation](https://reactnative.dev/architecture/fabric-renderer)
- [TurboModules Guide](https://reactnative.dev/docs/modules-android)
- [Hermes Engine](https://hermesengine.dev)

## ⚡ Performance Tips

1. **Use Hermes** - Already enabled, provides ~20% startup improvement
2. **Enable Lean Core** - Reduce bundle size by removing unused modules
3. **Use ProGuard** - Minify Java bytecode (enabled in release builds)
4. **Lazy Loading** - Load components on demand
5. **Image Optimization** - Use appropriately sized images

## 🔐 Stability Assurance

This project is configured for maximum stability:
- ✅ Latest React Native version (0.83.1)
- ✅ LTS React version (19.2.0)
- ✅ TypeScript enabled by default
- ✅ ESLint configured
- ✅ Jest testing framework
- ✅ Proper error boundaries
- ✅ Safe area handling with SafeAreaProvider

## 📝 Notes

- The new architecture is now production-ready as of React Native 0.73+
- Hermes engine is recommended for better performance
- TypeScript provides compile-time safety
- All dependencies are regularly maintained

---

**Last Updated**: January 2026
**React Native Version**: 0.83.1
**Node Version Required**: ≥ 20
