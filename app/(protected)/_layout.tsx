import { router, Stack } from 'expo-router';
import { useAuthState } from '../../utils/authState';

export default function ProtectedLayout() {
  const { isAppLocked, isInitialized, lockApp } = useAuthState();

  // Don't render protected screens if app is locked
  if (isAppLocked || !isInitialized) {
    router.replace('/');
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
