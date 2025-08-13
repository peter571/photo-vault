import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { VaultFile } from '../types/vault';
import { copyFileToVault } from '../utils/fileStorage';

interface FileUploadProps {
  onFileUpload: (files: VaultFile[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDocumentPicker = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const vaultFiles: VaultFile[] = [];

        for (const asset of result.assets) {
          try {
            const vaultFile = await copyFileToVault(
              asset.uri,
              asset.name || 'Unknown file',
              asset.mimeType || '',
              asset.size || 0
            );
            vaultFiles.push(vaultFile);
          } catch (error) {
            console.error('Error copying file to vault:', error);
            Alert.alert('Error', `Failed to copy ${asset.name || 'file'} to vault`);
          }
        }

        if (vaultFiles.length > 0) {
          onFileUpload(vaultFiles);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = async (source: 'camera' | 'library') => {
    try {
      setIsLoading(true);

      // Request permissions based on source
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Camera Permission', 'Please grant camera access to take photos and videos');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Photo Library Permission',
            'Please grant photo library access to select photos and videos'
          );
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 1,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const vaultFiles: VaultFile[] = [];

        for (const asset of result.assets) {
          try {
            const vaultFile = await copyFileToVault(
              asset.uri,
              asset.fileName || `Media_${Date.now()}`,
              asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
              asset.fileSize || 0
            );
            vaultFiles.push(vaultFile);
          } catch (error) {
            console.error('Error copying file to vault:', error);
            Alert.alert('Error', `Failed to copy ${asset.fileName || 'media file'} to vault`);
          }
        }

        if (vaultFiles.length > 0) {
          onFileUpload(vaultFiles);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images or videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setIsLoading(true);

      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Please grant camera access to take photos and videos');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const vaultFiles: VaultFile[] = [];

        for (const asset of result.assets) {
          try {
            const vaultFile = await copyFileToVault(
              asset.uri,
              asset.fileName || `Camera_${Date.now()}`,
              asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
              asset.fileSize || 0
            );
            vaultFiles.push(vaultFile);
          } catch (error) {
            console.error('Error copying file to vault:', error);
            Alert.alert('Error', `Failed to copy ${asset.fileName || 'camera file'} to vault`);
          }
        }

        if (vaultFiles.length > 0) {
          onFileUpload(vaultFiles);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo or video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="rounded-xl border-2 border-dashed border-border bg-background p-6">
      <View className="items-center space-y-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MaterialIcons
            name={isLoading ? 'hourglass-empty' : 'cloud-upload'}
            size={24}
            color="#6b7280"
          />
        </View>

        <View className="my-2 items-center">
          <Text className="mb-1 font-semibold text-foreground">
            {isLoading ? 'Uploading...' : 'Upload files'}
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            Tap to select files from your device
          </Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleCameraCapture}
            disabled={isLoading}
            className="flex-row items-center rounded-lg bg-primary px-3 py-2">
            <MaterialIcons name="camera-alt" size={16} color="white" />
            <Text className="ml-1 text-sm text-primary-foreground">Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleImagePicker('library')}
            disabled={isLoading}
            className="flex-row items-center rounded-lg bg-secondary px-3 py-2">
            <MaterialIcons name="photo-library" size={16} color="#374151" />
            <Text className="ml-1 text-sm text-secondary-foreground">Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDocumentPicker}
            disabled={isLoading}
            className="flex-row items-center rounded-lg bg-secondary px-3 py-2">
            <MaterialIcons name="description" size={16} color="#374151" />
            <Text className="ml-1 text-sm text-secondary-foreground">Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
