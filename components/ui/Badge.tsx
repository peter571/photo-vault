import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

const badgeVariants = {
  default: 'bg-primary border-transparent',
  secondary: 'bg-secondary border-transparent',
  destructive: 'bg-destructive border-transparent',
  outline: 'border border-border bg-transparent',
};

const textVariants = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-white',
  outline: 'text-foreground',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <View
      className={`inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 ${badgeVariants[variant]} ${className}`}>
      <Text className={`text-xs font-medium ${textVariants[variant]}`}>{children}</Text>
    </View>
  );
}
