import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import { PinSetup } from 'components/PinSetup';
import { useAuthState } from '../utils/authState';

export default function Index() {
  const { setupPin, login, password } = useAuthState();

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
      console.log('error', error);
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
      console.log('error', error);
      Alert.alert('Error', 'Authentication failed');
    }
  };

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
