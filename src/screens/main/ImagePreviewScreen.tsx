import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { colors } from '../../theme/colors';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ImagePreviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uri, location } = useLocalSearchParams<{ uri: string; location: string }>();

  const handleNext = () => {
    router.push({
      pathname: '/ai-review',
      params: { 
        uri,
        location
      }
    });
  };

  const handleDelete = () => {
    // Logic to delete the image
    router.back();
  };

  const handleShare = () => {
    // Logic to share the image
    // Implementation will be added later
  };

  return (
    <StyledView 
      className="flex-1 bg-black"
      style={{ paddingTop: insets.top }}
    >
      <StyledView className="flex-1 justify-center items-center">
        <StyledImage 
          source={{ uri: uri as string }} 
          className="w-full h-full" 
          resizeMode="contain" 
        />
        
        <StyledTouchableOpacity 
          className="absolute bottom-5 bg-primary flex-row items-center px-5 py-3 rounded-full shadow-md"
          onPress={handleNext}
        >
          <StyledText className="text-white text-lg font-bold mr-2">
            Identify
          </StyledText>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView 
        className="flex-row justify-around p-4 border-t border-white/10"
        style={{ paddingBottom: insets.bottom || 16 }}
      >
        <StyledTouchableOpacity 
          className="items-center"
          onPress={handleShare}
        >
          <MaterialIcons name="share" size={24} color="#fff" />
          <StyledText className="text-white mt-1">Share</StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity 
          className="items-center"
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={24} color="#fff" />
          <StyledText className="text-white mt-1">Delete</StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity 
          className="items-center"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <StyledText className="text-white mt-1">Back</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
} 