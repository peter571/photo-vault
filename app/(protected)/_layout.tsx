import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthState } from '../../utils/authState';

export default function ProtectedLayout() {
  const { isAppLocked, isInitialized } = useAuthState();

  // Handle navigation when app is locked or not initialized
  useEffect(() => {
    if (isAppLocked || !isInitialized) {
      router.replace('/');
    }
  }, [isAppLocked, isInitialized]);

  // Don't render protected screens if app is locked
  if (isAppLocked || !isInitialized) {
    return null; // Return null instead of calling router.replace during render
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
