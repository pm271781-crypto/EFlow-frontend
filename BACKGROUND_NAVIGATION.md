# Background Navigation Feature

## Overview
Full background navigation support with foreground notifications. Users can minimize the app or switch to other apps while navigation continues seamlessly in the background.

## Features

### 1. **Background Location Tracking**
   - Continuous GPS updates even when app is minimized
   - Works across app restarts
   - Persists navigation state to AsyncStorage

### 2. **Foreground Service Notification**
   - Always-on notification showing:
     - Current step number and instruction
     - Real-time distance to next turn
     - Quick action buttons (Stop/Resume)
   - Keeps location tracking alive even when app is closed

### 3. **Floating Navigation Button**
   - Appears on all screens during active navigation
   - Collapsible/expandable UI
   - Shows:
     - Current step number
     - Distance to next turn
     - Live instruction preview
   - Quick access to navigation screen
   - One-tap stop navigation

### 4. **Navigation Persistence**
   - Automatically resumes on app startup
   - Navigation state saved to AsyncStorage
   - Survives app crashes and restarts

### 5. **Multi-Screen Navigation Access**
   - Floating button visible everywhere
   - Quick jump to full navigation screen
   - Resume from anywhere in the app

## How It Works

### Starting Navigation
```
User taps "Start Navigation"
  ↓
Location permission granted
  ↓
BackgroundNavigationService.startBackgroundNavigation()
  ↓
Service starts location tracking
Service shows foreground notification
Service saves state to AsyncStorage
  ↓
Floating button appears on all screens
```

### During Navigation
- **Foreground Service** continuously tracks location
- **State updates** pushed to subscribed listeners
- **UI updates** in real-time across all screens
- **Notifications** update with current step & distance
- **Step progression** automatic based on proximity

### Switching Apps
1. User presses home button
2. Foreground service keeps running
3. Notification shows current step
4. Location tracking continues
5. User switches back to app
6. UI syncs with background service state

### App Restart
1. App launches
2. `App.tsx` calls `resumeNavigationIfActive()`
3. Service restores state from AsyncStorage
4. Navigation resumes automatically
5. Floating button appears
6. User can continue from where they left off

### Stopping Navigation
- Tap "Stop Navigation" in expanded floating button
- Or go to Directions screen and tap "Exit"
- Service clears location tracking
- Notification dismissed
- Floating button disappears

## Architecture

### Services
- **BackgroundNavigationService.ts** - Core navigation service with:
  - Location tracking (using react-native-geolocation-service)
  - State management with subscribers
  - Foreground notification handling (react-native-notifee)
  - AsyncStorage persistence
  - Step progression logic

### Components
- **FloatingNavigationButton.tsx** - Global floating UI showing:
  - Collapsed button (minimal, always visible during navigation)
  - Expanded panel (detailed view with actions)
  - Real-time distance and step updates
  - Quick navigation jump

### Screens
- **DirectionsScreen.tsx** - Main navigation interface:
  - Uses BackgroundNavigationService
  - Subscribes to state updates
  - Shows full map + instructions
  - Start/stop navigation controls

### App Integration
- **App.tsx** - Adds:
  - FloatingNavigationButton to all screens
  - Auto-resume navigation on startup
  - Navigation ref for quick access

## File Structure

```
src/
├── services/
│   └── BackgroundNavigationService.ts    # Core background service
├── components/
│   └── FloatingNavigationButton.tsx      # Global floating UI
└── screens/
    └── DirectionsScreen.tsx              # Navigation interface

App.tsx                                   # App-level integration
AndroidManifest.xml                       # Permissions
Info.plist                                # iOS permissions
```

## Configuration

### Android Permissions (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### iOS Permissions (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to your location for turn-by-turn navigation</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs access to your location for turn-by-turn navigation</string>
```

## Usage Examples

### Start Navigation
```typescript
await BackgroundNavigationService.startBackgroundNavigation(
  origin: { latitude: 31.5, longitude: 74.3 },
  destination: { latitude: 31.6, longitude: 74.4 },
  routeInfo: { steps: [...], ... },
  currentStepIndex: 0
);
```

### Stop Navigation
```typescript
await BackgroundNavigationService.stopBackgroundNavigation();
```

### Subscribe to Updates
```typescript
const unsubscribe = BackgroundNavigationService.subscribe((state) => {
  console.log('Current location:', state.currentLocation);
  console.log('Distance to next step:', state.distanceToNextStep);
});

// Later: unsubscribe()
```

### Check Navigation State
```typescript
const state = BackgroundNavigationService.getNavigationState();
if (state.isNavigating) {
  console.log(`Step ${state.currentStepIndex} of ${state.routeInfo.steps.length}`);
}
```

### Resume on App Start
```typescript
// Called automatically in App.tsx
await BackgroundNavigationService.resumeNavigationIfActive();
```

## UI Components

### Floating Button (Collapsed)
- Green background with navigation icon
- Shows current step and distance
- Tap to expand detailed view
- Visible during active navigation

### Expanded Panel
- Full step instruction
- Current step number
- Distance to next turn (meters/km)
- Two action buttons:
  - **View** - Opens full navigation screen
  - **Stop** - Stop navigation with confirmation

### Notification
- Always-on foreground service notification
- Shows current instruction
- Updates with distance in real-time
- Action buttons: Stop, Resume
- Survives app minimize/background

## Real-Time Updates

### Update Frequency
- Location: Every 10 meters OR every 2-5 seconds
- Distance calculation: Continuous
- UI updates: As state changes
- Notification updates: When step changes

### Data Flow
```
GPS Location (Geolocation Service)
  ↓
Distance Calculation (Haversine)
  ↓
Step Progression Check (< 50m threshold)
  ↓
State Update
  ↓
AsyncStorage Save
  ↓
Notify Subscribers (UI Components)
  ↓
Update Notification (Foreground Service)
```

## Error Handling

### Location Permission Denied
- Android: Shows request dialog
- iOS: Directs to Settings
- User gets alert if denied

### Location Service Unavailable
- Shows error alert
- Navigation stops gracefully
- State saved before stopping

### Network Issues
- Doesn't affect location tracking
- Already fetched route is used
- No rerouting (can be added)

## Performance Considerations

### Battery Usage
- High-accuracy GPS: ~1-2% per hour
- Foreground service keeps app alive
- Consider using battery saver mode

### Network Usage
- No network needed for turn-by-turn
- Uses pre-fetched route
- Location updates are local only

### Memory
- State stored in memory + AsyncStorage
- Background service keeps running
- Automatic cleanup on stop

## Future Enhancements

### Voice Guidance
- Text-to-speech for instructions
- Distance announcements
- Turn warnings

### Rerouting
- Detect off-route deviations
- Auto-recalculate new route
- User notification

### ETA & Traffic
- Real-time ETA updates
- Traffic alerts
- Alternative route suggestions

### Lane Guidance
- Lane information display
- Recommended lane highlighting
- Turn anticipation

### Speed Monitoring
- Current speed display
- Speed limit warnings
- Safe driving alerts

## Testing Checklist

- [ ] Start navigation and minimize app
- [ ] Check notification shows correct step
- [ ] Move around and verify distance updates
- [ ] Switch to other app
- [ ] Return to app and verify sync
- [ ] Restart phone and check resume
- [ ] Close app completely
- [ ] Reopen app and verify resume
- [ ] Test stop navigation
- [ ] Test permission denial
- [ ] Test location unavailable error

## Troubleshooting

### Floating Button Not Appearing
- Check BackgroundNavigationService.isNavigating
- Verify FloatingNavigationButton is in App.tsx
- Check React Native version compatibility

### Notification Not Showing
- Android: Check notification permissions
- Verify notifee channel creation
- Check "Do Not Disturb" mode

### Location Not Updating
- Verify GPS is enabled
- Check location permissions granted
- Test with outdoor GPS signal
- Try clearing app cache

### Background Service Stopping
- Check Android battery optimization settings
- Verify foreground service permissions
- Test with app running in foreground

### State Not Persisting
- Check AsyncStorage availability
- Verify app isn't force-stopped
- Clear app data and restart

## Package Dependencies

```json
{
  "react-native-geolocation-service": "^5.3.1",
  "react-native-notifee": "^7.8.0",
  "react-native-background-timer": "^2.4.1"
}
```

## Links & References

- [react-native-geolocation-service](https://github.com/Agontuk/react-native-geolocation-service)
- [react-native-notifee](https://notifee.app/)
- [react-native-background-timer](https://github.com/ocetnik/react-native-background-timer)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
