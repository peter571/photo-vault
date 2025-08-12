import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { VaultFile } from '../types/vault';

interface FileGridProps {
  files: VaultFile[];
  onFileClick: (file: VaultFile) => void;
  onFileDelete: (fileId: string) => void;
}

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 48) / numColumns; // 48 = padding (16) * 2 + gap (16)

const getFileIcon = (type: VaultFile['type']) => {
  switch (type) {
    case 'image':
      return 'image';
    case 'document':
      return 'description';
    case 'audio':
      return 'music-note';
    case 'video':
      return 'video-library';
    default:
      return 'insert-drive-file';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function FileGrid({ files, onFileClick, onFileDelete }: FileGridProps) {
  const handleDelete = (file: VaultFile) => {
    Alert.alert('Delete File', `Are you sure you want to delete "${file.name}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onFileDelete(file.id),
      },
    ]);
  };

  const renderFileItem = ({ item, index }: { item: VaultFile; index: number }) => {
    const isLastRow =
      Math.floor(index / numColumns) === Math.floor((files.length - 1) / numColumns);
    const itemsInLastRow = files.length % numColumns;
    const isOnlyItemInLastRow = isLastRow && itemsInLastRow === 1;

    return (
      <View
        className="m-2"
        style={{
          width: isOnlyItemInLastRow ? itemWidth : undefined,
          flex: isOnlyItemInLastRow ? 0 : 1,
        }}>
        <TouchableOpacity
          onPress={() => onFileClick(item)}
          onLongPress={() => handleDelete(item)}
          className="flex-1 rounded-lg border border-border bg-card p-3">
          <View className="flex-1 items-center justify-center space-y-2">
            {/* File Icon */}
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <MaterialIcons name={getFileIcon(item.type) as any} size={24} color="#6b7280" />
            </View>

            {/* File Name */}
            <Text
              className="text-center text-sm font-medium text-foreground"
              numberOfLines={2}
              ellipsizeMode="tail">
              {item.name}
            </Text>

            {/* File Info */}
            <View className="items-center space-y-1">
              <Text className="text-xs text-muted-foreground">{formatFileSize(item.size)}</Text>
              <Text className="text-xs text-muted-foreground">{formatDate(item.uploadDate)}</Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive">
              <MaterialIcons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={files}
      renderItem={renderFileItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={6}
    />
  );
}
