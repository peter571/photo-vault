export interface VaultFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'other';
  size: number;
  uploadDate: Date;
  uri: string;
  mimeType: string;
}
