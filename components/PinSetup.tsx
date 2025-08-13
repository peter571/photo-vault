import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PinSetupProps {
  onPinSet: (pin: string) => void;
  isInitialSetup: boolean;
  existingPin?: string | null;
}

export function PinSetup({ onPinSet, isInitialSetup, existingPin }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  const MIN_PIN_LENGTH = 4;
  const MAX_PIN_LENGTH = 15;

  const handlePinSubmit = () => {
    if (pin.length < MIN_PIN_LENGTH || pin.length > MAX_PIN_LENGTH) {
      Alert.alert(
        'Error',
        `PIN must be between ${MIN_PIN_LENGTH} and ${MAX_PIN_LENGTH} characters`
      );
      return;
    }

    if (isInitialSetup) {
      if (!showConfirm) {
        setShowConfirm(true);
        setConfirmPin('');
        setTimeout(() => confirmPinInputRef.current?.focus(), 100);
      } else {
        if (pin !== confirmPin) {
          Alert.alert('Error', 'PINs do not match');
          setConfirmPin('');
          return;
        }
        onPinSet(pin);
      }
    } else {
      if (pin === existingPin) {
        onPinSet(pin);
      } else {
        Alert.alert('Error', 'Incorrect PIN');
        setPin('');
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace' && pin.length === 0 && showConfirm) {
      setShowConfirm(false);
      setConfirmPin('');
      setTimeout(() => pinInputRef.current?.focus(), 100);
    }
  };

  const renderPinInput = (
    value: string,
    onChangeText: (text: string) => void,
    showPin: boolean,
    setShowPin: (show: boolean) => void,
    placeholder: string,
    ref?: any,
    isConfirmMode?: boolean
  ) => {
    const handleChangeText = (text: string) => {
      if (text.length <= MAX_PIN_LENGTH) {
        onChangeText(text);
      }
    };

    return (
      <View className="gap-2 space-y-4">
        <Text className="text-center text-sm text-muted-foreground">{placeholder}</Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          maxLength={MAX_PIN_LENGTH}
          secureTextEntry={!showPin}
          placeholder={
            isConfirmMode
              ? `Confirm PIN (${MIN_PIN_LENGTH}-${MAX_PIN_LENGTH} characters)`
              : isInitialSetup
                ? `Create PIN (${MIN_PIN_LENGTH}-${MAX_PIN_LENGTH} characters)`
                : `Enter PIN (${MIN_PIN_LENGTH}-${MAX_PIN_LENGTH} characters)`
          }
          placeholderTextColor="#6b7280"
          className="rounded-lg border border-border bg-background px-4 py-3 text-center text-lg font-medium text-foreground"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPin(!showPin)}
          className="my-2 flex-row items-center justify-center gap-2 space-x-2">
          <MaterialIcons
            name={showPin ? 'visibility-off' : 'visibility'}
            size={20}
            color="#6b7280"
          />
          <Text className="text-sm text-muted-foreground">{showPin ? 'Hide PIN' : 'Show PIN'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const isPinValid = pin.length >= MIN_PIN_LENGTH && pin.length <= MAX_PIN_LENGTH;
  const isConfirmValid = showConfirm
    ? confirmPin.length >= MIN_PIN_LENGTH && confirmPin.length <= MAX_PIN_LENGTH
    : true;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center bg-background px-6">
      <View className="space-y-8">
        {/* Header */}
        <View className="items-center space-y-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            <MaterialIcons name="security" size={32} color="white" />
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">
              {isInitialSetup ? 'Set Up PIN' : 'Enter PIN'}
            </Text>
            <Text className="mt-2 text-center text-muted-foreground">
              {isInitialSetup
                ? `Create a PIN (${MIN_PIN_LENGTH}-${MAX_PIN_LENGTH} characters) to secure your vault`
                : 'Enter your PIN to access the vault'}
            </Text>
          </View>
        </View>

        {/* PIN Input */}
        {!showConfirm
          ? renderPinInput(pin, setPin, showPin, setShowPin, 'Enter your PIN', pinInputRef, false)
          : renderPinInput(
              confirmPin,
              setConfirmPin,
              showConfirmPin,
              setShowConfirmPin,
              'Confirm your PIN',
              confirmPinInputRef,
              true
            )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handlePinSubmit}
          disabled={!isPinValid || (showConfirm && !isConfirmValid)}
          className={`items-center rounded-lg px-6 py-3 ${
            isPinValid && (!showConfirm || isConfirmValid) ? 'bg-primary' : 'bg-muted'
          }`}>
          <Text
            className={`font-medium ${
              isPinValid && (!showConfirm || isConfirmValid)
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}>
            {isInitialSetup ? (showConfirm ? 'Confirm PIN' : 'Continue') : 'Unlock Vault'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
