import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthState } from '../utils/authState';
import '../global.css';

export default function RootLayout() {
  const { lockApp, isAuthenticated } = useAuthState();
  const lockAppRef = useRef(lockApp);

  // Update ref when lockApp changes
  useEffect(() => {
    lockAppRef.current = lockApp;
  }, [lockApp]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Lock the app when it goes to background or becomes inactive
        if (isAuthenticated) {
          lockAppRef.current();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isAuthenticated]); // Only depend on isAuthenticated, not lockApp

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(protected)" />
      </Stack>
    </>
  );
}
