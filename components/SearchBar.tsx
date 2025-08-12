import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center gap-2 rounded-lg border border-border px-2 ${Platform.OS === 'ios' ? 'py-4' : 'py-0'}`}>
      <MaterialIcons name="search" size={20} color="#6b7280" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search files..."
        placeholderTextColor="#6b7280"
        className="bg-input-background flex-1 text-foreground"
        style={{ fontSize: 16 }}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange('')}
          className="items-center justify-center rounded-full bg-muted">
          <MaterialIcons name="close" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}
