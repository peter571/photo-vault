import { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PinSetup } from 'components/PinSetup';
import { useAuthState } from '../utils/authState';

export default function Index() {
  const { isAuthenticated, isInitialized, isAppLocked, setupPin, login, password } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // Check if user should be redirected to protected area
  //   if (isAuthenticated && !isAppLocked && isInitialized) {
  //     // Use setTimeout to avoid immediate navigation during render
  //     setTimeout(() => {
  //       // If the
  //       router.replace('/(protected)');
  //     }, 0);
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [isAuthenticated, isAppLocked, isInitialized]);

  const handlePinSetup = async (pin: string) => {
    // This is called when no password exists yet (first time setup)
    try {
      const success = await setupPin(pin);
      if (success) {
        router.replace('/(protected)/home');
      } else {
        Alert.alert('Error', 'Failed to setup PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to setup PIN');
    }
  };

  const handlePinEntry = async (pin: string) => {
    // This is called when a password already exists (login/unlock)
    try {
      const success = await login(pin);
      if (success) {
        router.replace('/(protected)/home');
      } else {
        Alert.alert('Error', 'Incorrect PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <MaterialIcons name="security" size={48} color="#6366f1" />
        <Text className="mt-4 text-lg font-medium text-foreground">Loading Vault...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {password ? (
        // User has already set up a PIN - show login screen
        <PinSetup onPinSet={handlePinEntry} isInitialSetup={false} existingPin={password} />
      ) : (
        // First time user - show setup screen
        <PinSetup onPinSet={handlePinSetup} isInitialSetup={true} />
      )}
    </View>
  );
}
