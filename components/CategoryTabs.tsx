import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from 'components/ui/Badge';

interface CategoryTabsProps {
  activeCategory: 'all' | 'document' | 'image' | 'audio' | 'other';
  onCategoryChange: (category: 'all' | 'document' | 'image' | 'audio' | 'other') => void;
  fileCounts: {
    all: number;
    document: number;
    image: number;
    audio: number;
    other: number;
  };
}

const categories = [
  { id: 'all' as const, label: 'All', icon: 'grid-on' },
  { id: 'document' as const, label: 'Docs', icon: 'description' },
  { id: 'image' as const, label: 'Images', icon: 'image' },
  { id: 'audio' as const, label: 'Audio', icon: 'music-note' },
  { id: 'other' as const, label: 'Other', icon: 'folder' },
];

export function CategoryTabs({ activeCategory, onCategoryChange, fileCounts }: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}>
      <View className="my-4 flex-row space-x-2">
        {categories.map((category) => {
          const count = fileCounts[category.id];
          const isActive = activeCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onCategoryChange(category.id)}
              className={`mr-2 flex-row items-center rounded-full border px-4 py-2 ${
                isActive ? 'border-primary bg-primary' : 'border-border bg-background'
              }`}>
              <MaterialIcons
                name={category.icon as any}
                size={18}
                color={isActive ? 'white' : '#374151'}
              />
              <Text
                className={`ml-2 text-base ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                {category.label}
              </Text>
              {count > 0 && (
                <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-1">
                  {count}
                </Badge>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
