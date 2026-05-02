import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types';

import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { AddTripScreen } from './src/screens/AddTripScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { RouteResultScreen } from './src/screens/RouteResultScreen';
import { RouteMapScreen } from './src/screens/RouteMapScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { TripDetailScreen } from './src/screens/TripDetailScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SelectHistoryScreen } from './src/screens/SelectHistoryScreen';
import { SimpleMapScreen } from './src/screens/SimpleMapScreen';
import { ReviewTripScreen } from './src/screens/ReviewTripScreen';
import { BufferTripsScreen } from './src/screens/BufferTripsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { NavigationActiveScreen } from './src/screens/NavigationActiveScreen';
import { PlaceDetailsScreen } from './src/screens/PlaceDetailsScreen';
import { MapSearchScreen } from './src/screens/MapSearchScreen';
import { DirectionsScreen } from './src/screens/DirectionsScreen';
import { FloatingNavigationButton } from './src/components/FloatingNavigationButton';
import { BackgroundNavigationService } from './src/services/BackgroundNavigationService';
import { FloatingWindowService } from './src/services/FloatingWindowService';
import { LocationProvider } from './src/context/LocationContext';
import { OngoingTripProvider } from './src/context/OngoingTripContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [navigationRef, setNavigationRef] = useState<any>(null);

  useEffect(() => {
    // Initialize floating window service on app startup
    const initializeFloatingWindow = async () => {
      try {
        console.log('[App] Initializing floating window service...');
        await FloatingWindowService.initialize();
        console.log('[App] Floating window service initialized');
      } catch (error) {
        console.error('[App] Error initializing floating window:', error);
      }
    };

    initializeFloatingWindow();

    // Resume navigation on app startup
    BackgroundNavigationService.resumeNavigationIfActive();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LocationProvider>
          <OngoingTripProvider>
            <NavigationContainer
              ref={(ref) => {
                setNavigationRef(ref);
              }}
            >
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddTrip" component={AddTripScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="MapSearch" component={MapSearchScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="BufferTrips" component={BufferTripsScreen} />
            <Stack.Screen name="RouteResult" component={RouteResultScreen} />
            <Stack.Screen name="RouteMap" component={RouteMapScreen} />
            <Stack.Screen name="NavigationActive" component={NavigationActiveScreen} />
            <Stack.Screen name="Directions" component={DirectionsScreen} />
            <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SelectHistory" component={SelectHistoryScreen} />
            <Stack.Screen name="SimpleMap" component={SimpleMapScreen} />
            <Stack.Screen name="ReviewTrip" component={ReviewTripScreen} />
          </Stack.Navigator>
          
          {/* Floating Navigation Button - Only shows during active navigation */}
          <FloatingNavigationButton
            onPress={() => {
              navigationRef?.navigate('Directions');
            }}
            hideOnInactiveNav={true}
          />
        </NavigationContainer>
        </OngoingTripProvider>
        </LocationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
