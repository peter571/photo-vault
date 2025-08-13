import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PinSetup } from '../../components/PinSetup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthState } from '../../utils/authState';

export default function SettingsScreen() {
  const [showPinChange, setShowPinChange] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const { logout, setPassword } = useAuthState();

  const handleLogout = async () => {
    try {
      logout();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handlePinChange = async (newPin: string) => {
    try {
      setPassword(newPin);
      setShowPinChange(false);
      Alert.alert('Success', 'PIN changed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to change PIN');
    }
  };

  const handlePinRemove = async () => {
    Alert.alert(
      'Remove PIN',
      'Are you sure you want to remove the PIN? This will make your vault less secure.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              logout();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove PIN');
            }
          },
        },
      ]
    );
  };

  const settingsItems = [
    {
      title: 'Change PIN',
      subtitle: 'Update your vault PIN',
      icon: 'lock',
      onPress: () => setShowPinChange(true),
    },
    {
      title: 'Biometric Authentication',
      subtitle: 'Use fingerprint or face ID',
      icon: 'fingerprint',
      type: 'switch' as const,
      value: biometricEnabled,
      onValueChange: setBiometricEnabled,
    },
    {
      title: 'Auto Lock',
      subtitle: 'Lock vault when app is backgrounded',
      icon: 'timer',
      type: 'switch' as const,
      value: autoLockEnabled,
      onValueChange: setAutoLockEnabled,
    },
    {
      title: 'Export Data',
      subtitle: 'Backup your vault files',
      icon: 'cloud-download',
      onPress: () => Alert.alert('Coming Soon', 'Export feature will be available soon'),
    },
    {
      title: 'Clear Cache',
      subtitle: 'Free up storage space',
      icon: 'cleaning-services',
      onPress: () => Alert.alert('Success', 'Cache cleared successfully'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'info',
      onPress: () => Alert.alert('About', 'Vault Mobile App v1.0.0\nA secure file storage app'),
    },
  ];

  if (showPinChange) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-border p-4">
          <TouchableOpacity onPress={() => setShowPinChange(false)} className="p-2">
            <MaterialIcons name="arrow-back" size={28} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-foreground">Change PIN</Text>
          <View className="w-10" />
        </View>
        <PinSetup onPinSet={handlePinChange} isInitialSetup={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 gap-4 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border p-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <MaterialIcons name="arrow-back" size={28} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-lg font-medium text-foreground">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1">
        {/* Settings List */}
        <View className="gap-4 p-2">
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              disabled={item.type === 'switch'}
              className="flex-row items-center justify-between rounded-lg border border-border bg-card p-4">
              <View className="flex-1 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MaterialIcons name={item.icon as any} size={22} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-medium text-foreground">{item.title}</Text>
                  <Text className="text-base text-muted-foreground">{item.subtitle}</Text>
                </View>
              </View>

              {item.type === 'switch' ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                  thumbColor={item.value ? '#ffffff' : '#f3f4f6'}
                />
              ) : (
                <MaterialIcons name="chevron-right" size={22} color="#6b7280" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <View className="gap-2 p-4">
          <Text className="text-xl font-medium text-foreground">Danger Zone</Text>

          <TouchableOpacity
            onPress={handlePinRemove}
            className="flex-row items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <MaterialIcons name="lock-open" size={22} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-medium text-red-600">Remove PIN</Text>
                <Text className="text-base text-red-500">Make vault less secure</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#dc2626" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <MaterialIcons name="logout" size={22} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-medium text-red-600">Logout</Text>
                <Text className="text-base text-red-500">Sign out of vault</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
