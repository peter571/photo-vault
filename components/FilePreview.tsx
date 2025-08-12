import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from 'expo-audio';
import { MaterialIcons } from '@expo/vector-icons';
import { VaultFile } from '../types/vault';

interface FilePreviewProps {
  file: VaultFile;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Video player setup - only create when file is video type
  const videoPlayer = useVideoPlayer(file.type === 'video' ? file.uri : null);

  const { isPlaying: videoIsPlaying } = useEvent(videoPlayer, 'playingChange', {
    isPlaying: videoPlayer?.playing || false,
  });

  // Access video properties directly from player
  const videoCurrentTime = videoPlayer?.currentTime || 0;
  const videoDuration = videoPlayer?.duration || 0;

  // Audio player setup - only create when file is audio type
  const audioPlayer = useAudioPlayer(file.type === 'audio' ? { uri: file.uri } : null);
  const audioStatus = useAudioPlayerStatus(audioPlayer);

  // Set ready states when players are available
  useEffect(() => {
    if (videoPlayer && file.type === 'video') {
      console.log('Video player ready:', videoPlayer);
      setIsVideoReady(true);
    }
  }, [videoPlayer, file.type]);

  useEffect(() => {
    if (audioPlayer && file.type === 'audio') {
      console.log('Audio player ready:', audioPlayer);
      setIsAudioReady(true);
    }
  }, [audioPlayer, file.type]);

  // Debug logging
  useEffect(() => {
    console.log('FilePreview render:', {
      fileType: file.type,
      videoPlayer: !!videoPlayer,
      audioPlayer: !!audioPlayer,
      isVideoReady,
      isAudioReady,
      videoIsPlaying,
      audioStatus: audioStatus?.playing,
    });
  }, [
    file.type,
    videoPlayer,
    audioPlayer,
    isVideoReady,
    isAudioReady,
    videoIsPlaying,
    audioStatus,
  ]);

  const handleDelete = () => {
    Alert.alert('Delete File', `Are you sure you want to delete "${file.name}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onClose();
          // Note: Actual deletion should be handled by parent component
        },
      },
    ]);
  };

  const renderVideoPlayer = () => {
    return (
      <View className="flex-1 items-center justify-center">
        {!isVideoReady && (
          <View className="mb-4 items-center">
            <Text className="text-muted-foreground">Loading video player...</Text>
          </View>
        )}

        <VideoView
          player={videoPlayer}
          style={{ width: width - 32, height: height * 0.6 }}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls={false}
        />

        {/* Custom Video Controls */}
        <View className="mt-4 flex-row items-center justify-center gap-2 space-x-4">
          <TouchableOpacity
            onPress={handleVideoReplay}
            className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <MaterialIcons name="replay" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={videoIsPlaying ? handleVideoPause : handleVideoPlay}
            className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            <MaterialIcons name={videoIsPlaying ? 'pause' : 'play-arrow'} size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVideoStop}
            className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <MaterialIcons name="stop" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Video Progress */}
        {videoDuration > 0 && (
          <View className="mt-4 w-full px-4">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">{formatTime(videoCurrentTime)}</Text>
              <Text className="text-sm text-muted-foreground">{formatTime(videoDuration)}</Text>
            </View>
            <View className="h-2 w-full rounded-full bg-muted">
              <View
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${(videoCurrentTime / videoDuration) * 100}%`,
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAudioPlayer = () => {
    return (
      <View className="flex-1 items-center justify-center p-6">
        {!isAudioReady && (
          <View className="mb-4 items-center">
            <Text className="text-muted-foreground">Loading audio player...</Text>
          </View>
        )}

        {/* Audio Visualizer Placeholder */}
        <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <MaterialIcons
            name={audioStatus?.playing ? 'music-note' : 'music-off'}
            size={64}
            color="#3b82f6"
          />
        </View>

        <Text className="mb-4 text-center text-xl font-semibold text-foreground">{file.name}</Text>

        {/* Audio Progress */}
        {audioStatus && (
          <View className="mb-6 w-full px-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">
                {formatTime(audioStatus.currentTime || 0)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {formatTime(audioStatus.duration || 0)}
              </Text>
            </View>
            <View className="h-2 w-full rounded-full bg-muted">
              <View
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${((audioStatus.currentTime || 0) / (audioStatus.duration || 1)) * 100}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Audio Controls */}
        <View className="flex-row items-center justify-center gap-2 space-x-6">
          <TouchableOpacity
            onPress={handleAudioReplay}
            className="h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MaterialIcons name="replay" size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (audioStatus?.playing) {
                handleAudioPause();
              } else {
                handleAudioPlay();
              }
            }}
            className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            <MaterialIcons
              name={audioStatus?.playing ? 'pause' : 'play-arrow'}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAudioStop}
            className="h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MaterialIcons name="stop" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFileContent = () => {
    switch (file.type) {
      case 'image':
        return (
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: file.uri }}
              style={{ width: width - 32, height: height * 0.6 }}
              contentFit="contain"
              className="rounded-lg"
            />
          </View>
        );

      case 'video':
        return renderVideoPlayer();

      case 'audio':
        return renderAudioPlayer();

      default:
        return (
          <View className="flex-1 items-center justify-center p-6">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-muted">
              <MaterialIcons
                name={file.type === 'document' ? 'description' : 'insert-drive-file'}
                size={48}
                color="#6b7280"
              />
            </View>
            <Text className="mb-2 text-center text-lg font-medium text-foreground">
              {file.name}
            </Text>
            <Text className="text-center text-muted-foreground">
              This file type cannot be previewed directly
            </Text>
          </View>
        );
    }
  };

  // Cleanup players when component unmounts
  useEffect(() => {
    return () => {
      try {
        if (file.type === 'audio' && audioPlayer && isAudioReady) {
          audioPlayer.pause();
        }
        if (file.type === 'video' && videoPlayer && isVideoReady) {
          videoPlayer.pause();
        }
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, [file.type, audioPlayer, videoPlayer, isAudioReady, isVideoReady]);

  const handleVideoPause = () => {
    try {
      if (videoPlayer && isVideoReady && videoIsPlaying) {
        videoPlayer.pause();
      }
    } catch (error) {
      console.log('Video pause error:', error);
    }
  };

  const handleVideoPlay = () => {
    try {
      if (videoPlayer && isVideoReady && !videoIsPlaying) {
        videoPlayer.play();
      }
    } catch (error) {
      console.log('Video play error:', error);
    }
  };

  const handleVideoStop = () => {
    try {
      if (videoPlayer && isVideoReady) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
      }
    } catch (error) {
      console.log('Video stop error:', error);
    }
  };

  const handleVideoReplay = () => {
    try {
      if (videoPlayer && isVideoReady) {
        videoPlayer.currentTime = 0;
        videoPlayer.play();
      }
    } catch (error) {
      console.log('Video replay error:', error);
    }
  };

  const handleAudioPlay = () => {
    try {
      if (audioPlayer && isAudioReady && audioStatus && !audioStatus.playing) {
        audioPlayer.play();
      }
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const handleAudioPause = () => {
    try {
      if (audioPlayer && isAudioReady && audioStatus && audioStatus.playing) {
        audioPlayer.pause();
      }
    } catch (error) {
      console.log('Audio pause error:', error);
    }
  };

  const handleAudioStop = () => {
    try {
      if (audioPlayer && isAudioReady) {
        audioPlayer.pause();
      }
    } catch (error) {
      console.log('Audio stop error:', error);
    }
  };

  const handleAudioReplay = () => {
    try {
      if (audioPlayer && isAudioReady) {
        audioPlayer.seekTo(0);
      }
    } catch (error) {
      console.log('Audio replay error:', error);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border p-4">
          <TouchableOpacity onPress={onClose} className="p-2">
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text className="mx-4 flex-1 text-center font-medium text-foreground" numberOfLines={1}>
            {file.name}
          </Text>

          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={handleDelete} className="p-2">
              <MaterialIcons name="delete" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* File Content */}
        <ScrollView className="flex-1">{renderFileContent()}</ScrollView>

        {/* File Info */}
        <View className="border-t border-border bg-card p-4">
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Type</Text>
              <Text className="capitalize text-foreground">{file.type}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Size</Text>
              <Text className="text-foreground">{formatFileSize(file.size)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Added</Text>
              <Text className="text-foreground">{formatDate(file.uploadDate)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">MIME Type</Text>
              <Text className="text-xs text-foreground">{file.mimeType}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
