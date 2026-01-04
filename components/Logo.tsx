import React from 'react';
import { Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ImageStyle | ViewStyle;
}

export function Logo({ size = 'medium', style }: LogoProps) {
  const sizeStyles = {
    small: { width: 80, height: 30 },
    medium: { width: 120, height: 45 },
    large: { width: 200, height: 75 },
  };

  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={[styles.logo, sizeStyles[size], style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    // Estilos base serão aplicados via sizeStyles
  },
});

