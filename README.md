# Photo Vault

A secure photo and file vault application built with Expo 53, React Native, and TypeScript.

## Features

- **Secure File Storage**: Store images, videos, audio files, and documents securely in the app's internal storage
- **True File Vaulting**: Files are copied to the app's private storage directory, ensuring they're isolated from the device's main storage
- **File Preview**:
  - **Images**: Full-screen image viewing with zoom and pan
  - **Videos**: Native video playback with custom controls, fullscreen support, and picture-in-picture
  - **Audio**: Audio player with progress bar, play/pause controls, and seek functionality
  - **Documents**: File information display for unsupported file types
- **File Management**: Upload and delete files with automatic cleanup
- **PIN Protection**: Secure access with PIN authentication
- **Auto-Lock**: App automatically locks when backgrounded or closed for enhanced security
- **Manual Lock**: Quick lock button in the header for immediate security
- **Search**: Find files quickly with search functionality
- **Categories**: Organize files by type (images, videos, audio, documents)
- **Storage Monitoring**: Track vault storage usage and file counts

## Tech Stack

- **Expo 53**: Latest Expo SDK with enhanced performance
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **NativeWind**: Tailwind CSS for React Native
- **expo-video**: High-performance video playback with background support
- **expo-audio**: Audio playback and recording capabilities
- **expo-image**: Optimized image loading and caching
- **Zustand**: Lightweight state management

## Video & Audio Features

### Video Playback

- Native video controls with custom UI
- Fullscreen and picture-in-picture support
- Background playback support
- Progress tracking and seek functionality
- Play, pause, stop, and replay controls

### Audio Playback

- Custom audio player interface
- Progress bar with time display
- Play, pause, and seek controls
- Background audio playback
- Visual feedback for playback state

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your device or simulator:

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## Configuration

The app is configured with the following plugins:

- **expo-video**: Video playback with background support and picture-in-picture
- **expo-audio**: Audio playback with microphone permissions
- **expo-image-picker**: File selection with camera and photo library access

## File Types Supported

- **Images**: JPEG, PNG, GIF, WebP, etc.
- **Videos**: MP4, MOV, AVI, etc.
- **Audio**: MP3, WAV, M4A, etc.
- **Documents**: PDF, DOC, TXT, etc.

## Security Features

- **PIN-based Authentication**: Secure access with customizable PIN
- **Auto-Lock**: App automatically locks when:
  - App goes to background
  - App becomes inactive
  - App is closed
- **Manual Lock**: Tap the lock icon in the header to immediately lock the app
- **Secure File Storage**: Files stored in app's private directory
- **True File Vaulting**: Files are copied to internal storage, not just referenced
- **No Cloud Dependencies**: Local storage only for maximum privacy
- **Automatic Cleanup**: Cleanup of orphaned files

## File Storage Implementation

The app implements true file vaulting by:

1. **Copying Files**: When files are selected, they're copied to the app's internal storage directory (`FileSystem.documentDirectory/vault/`)
2. **Unique Naming**: Files are given unique names to prevent conflicts
3. **Isolation**: Files are completely isolated from their original locations
4. **Cleanup**: Automatic cleanup of orphaned files and proper deletion from storage
5. **Migration**: Existing files are automatically migrated to the new storage system

### Storage Structure

```
app-documents/
└── vault/
    ├── image_abc123.jpg
    ├── document_def456.pdf
    └── video_ghi789.mp4
```

## Development

The project uses:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Expo Router for navigation

## License

MIT License
