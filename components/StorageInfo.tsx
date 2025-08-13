import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { VaultFile } from '../types/vault';

interface StorageInfoProps {
  files: VaultFile[];
}

export function StorageInfo({ files }: StorageInfoProps) {
  const [storageInfo, setStorageInfo] = useState<{
    totalSize: number;
    fileCount: number;
    vaultSize: number;
  }>({ totalSize: 0, fileCount: files.length, vaultSize: 0 });

  useEffect(() => {
    calculateStorageInfo();
  }, [files]);

  const calculateStorageInfo = async () => {
    try {
      const vaultDir = `${FileSystem.documentDirectory}vault/`;
      const dirInfo = await FileSystem.getInfoAsync(vaultDir);

      let vaultSize = 0;
      if (dirInfo.exists) {
        // Calculate total size of files in vault
        for (const file of files) {
          const fileInfo = await FileSystem.getInfoAsync(file.uri);
          if (fileInfo.exists && fileInfo.size) {
            vaultSize += fileInfo.size;
          }
        }
      }

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      setStorageInfo({
        totalSize,
        fileCount: files.length,
        vaultSize,
      });
    } catch (error) {
      console.error('Error calculating storage info:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View className="my-4 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="storage" size={18} color="#6b7280" />
          <Text className="text-base font-medium text-foreground">Vault Storage</Text>
        </View>
        <TouchableOpacity onPress={calculateStorageInfo}>
          <MaterialIcons name="refresh" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="mt-3 space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-base text-muted-foreground">Files</Text>
          <Text className="text-base font-medium text-foreground">{storageInfo.fileCount}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-base text-muted-foreground">Total Size</Text>
          <Text className="text-base font-medium text-foreground">
            {formatFileSize(storageInfo.totalSize)}
          </Text>
        </View>
      </View>
    </View>
  );
}
