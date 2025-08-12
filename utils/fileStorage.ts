import * as FileSystem from 'expo-file-system';
import { VaultFile } from '../types/vault';

// Get the app's internal storage directory
const getVaultDirectory = () => {
  return `${FileSystem.documentDirectory}vault/`;
};

// Ensure the vault directory exists
export const ensureVaultDirectory = async () => {
  const vaultDir = getVaultDirectory();
  const dirInfo = await FileSystem.getInfoAsync(vaultDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(vaultDir, { intermediates: true });
  }

  return vaultDir;
};

// Generate a unique filename to avoid conflicts
const generateUniqueFilename = (originalName: string, id: string) => {
  const extension = originalName.includes('.')
    ? originalName.substring(originalName.lastIndexOf('.'))
    : '';
  const nameWithoutExt = originalName.includes('.')
    ? originalName.substring(0, originalName.lastIndexOf('.'))
    : originalName;

  // Clean the filename to be filesystem-safe
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${cleanName}_${id}${extension}`;
};

// Copy file to vault storage and return new VaultFile
export const copyFileToVault = async (
  sourceUri: string,
  originalName: string,
  mimeType: string,
  fileSize: number
): Promise<VaultFile> => {
  try {
    // Ensure vault directory exists
    const vaultDir = await ensureVaultDirectory();

    // Generate unique ID and filename
    const id = Math.random().toString(36).substr(2, 9);
    const uniqueFilename = generateUniqueFilename(originalName, id);
    const destinationUri = `${vaultDir}${uniqueFilename}`;

    // Copy the file to vault storage
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    // Create and return the vault file object
    const vaultFile: VaultFile = {
      id,
      name: originalName,
      type: getFileType(mimeType),
      size: fileSize,
      uploadDate: new Date(),
      uri: destinationUri, // This now points to the vault storage
      mimeType,
    };

    return vaultFile;
  } catch (error) {
    console.error('Error copying file to vault:', error);
    throw new Error('Failed to copy file to vault storage');
  }
};

// Get file type from MIME type
const getFileType = (mimeType: string): VaultFile['type'] => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text'))
    return 'document';
  return 'other';
};

// Delete file from vault storage
export const deleteFileFromVault = async (file: VaultFile): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(file.uri);
    }
  } catch (error) {
    console.error('Error deleting file from vault:', error);
    throw new Error('Failed to delete file from vault storage');
  }
};

// Get vault storage usage
export const getVaultStorageInfo = async () => {
  try {
    const vaultDir = getVaultDirectory();
    const dirInfo = await FileSystem.getInfoAsync(vaultDir);

    if (!dirInfo.exists) {
      return { totalSize: 0, fileCount: 0 };
    }

    // Note: FileSystem doesn't provide direct directory size calculation
    // This is a simplified implementation
    return { totalSize: 0, fileCount: 0 };
  } catch (error) {
    console.error('Error getting vault storage info:', error);
    return { totalSize: 0, fileCount: 0 };
  }
};

// Check if a file is stored in vault storage
export const isFileInVault = (fileUri: string): boolean => {
  const vaultDir = getVaultDirectory();
  return fileUri.startsWith(vaultDir);
};
