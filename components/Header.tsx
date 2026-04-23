import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const router = useRouter();

  return (
    <View className="bg-primary p-4 pt-12 flex-row items-center">
      {showBackButton && (
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color="white" 
          onPress={() => router.back()}
          className="mr-2"
        />
      )}
      <Text className="text-white text-xl font-bold">{title}</Text>
    </View>
  );
};

export default Header; 