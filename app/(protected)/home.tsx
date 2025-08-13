import { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'components/SearchBar';
import { CategoryTabs } from 'components/CategoryTabs';
import { FileUpload } from 'components/FileUpload';
import { FileGrid } from 'components/FileGrid';
import { FilePreview } from 'components/FilePreview';
import { StorageInfo } from 'components/StorageInfo';
import { VaultFile } from 'types/vault';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthState } from '../../utils/authState';
import { deleteFileFromVault } from '../../utils/fileStorage';

export default function VaultScreen() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'document' | 'image' | 'audio' | 'other'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lockApp } = useAuthState();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const savedFiles = await AsyncStorage.getItem('vaultFiles');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);

        setFiles(parsedFiles);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      Alert.alert('Error', 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const saveFiles = async (newFiles: VaultFile[]) => {
    try {
      await AsyncStorage.setItem('vaultFiles', JSON.stringify(newFiles));
    } catch (error) {
      console.error('Error saving files:', error);
    }
  };

  const handleFileUpload = (newFiles: VaultFile[]) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    saveFiles(updatedFiles);
  };

  const filteredFiles = files.filter((file) => {
    const matchesCategory = activeCategory === 'all' || file.type === activeCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const deleteFile = async (fileId: string) => {
    try {
      const fileToDelete = files.find((f) => f.id === fileId);
      if (fileToDelete) {
        // Delete the file from vault storage
        await deleteFileFromVault(fileToDelete);

        // Update the files list
        const updatedFiles = files.filter((f) => f.id !== fileId);
        setFiles(updatedFiles);
        saveFiles(updatedFiles);

        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete file from vault');
    }
  };

  // Create a single data item for the FlatList
  const contentData = [{ id: 'content' }];

  const renderContent = () => {
    return (
      <View className="space-y-4">
        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          fileCounts={{
            all: files.length,
            document: files.filter((f) => f.type === 'document').length,
            image: files.filter((f) => f.type === 'image').length,
            audio: files.filter((f) => f.type === 'audio').length,
            other: files.filter((f) => f.type === 'other').length,
          }}
        />

        {/* Storage Info */}
        {files.length > 0 && <StorageInfo files={files} />}

        {/* File Upload */}
        <FileUpload onFileUpload={handleFileUpload} />

        {/* Files Grid */}
        <FileGrid files={filteredFiles} onFileClick={setSelectedFile} onFileDelete={deleteFile} />

        {/* Empty State */}
        {filteredFiles.length === 0 && files.length > 0 && (
          <View className="items-center py-12">
            <Text className="text-lg text-muted-foreground">
              No files found matching your criteria
            </Text>
          </View>
        )}

        {files.length === 0 && (
          <View className="items-center py-12">
            <MaterialIcons name="security" size={56} color="#6b7280" />
            <Text className="mb-2 mt-4 text-xl font-medium text-foreground">
              Your vault is empty
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              Upload your first document, image, or audio file to get started
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border bg-background/95 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MaterialIcons name="security" size={18} color="white" />
            </View>
            <Text className="text-lg font-medium text-foreground">Vault</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Text className="text-base text-muted-foreground">Secured</Text>
            </View>
            <TouchableOpacity onPress={lockApp} className="h-8 w-8 items-center justify-center">
              <MaterialIcons name="lock" size={18} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(protected)/settings')}
              className="h-8 w-8 items-center justify-center">
              <MaterialIcons name="settings" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="security" size={56} color="#6366f1" />
          <Text className="mt-4 text-xl font-medium text-foreground">Loading Vault...</Text>
        </View>
      ) : (
        <FlatList
          data={contentData}
          renderItem={() => renderContent()}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          removeClippedSubviews={false}
        />
      )}

      {/* File Preview Modal */}
      {selectedFile && <FilePreview file={selectedFile} onClose={() => setSelectedFile(null)} />}
    </SafeAreaView>
  );
}
