import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { colors } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CameraScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Request permissions
  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      setHasPermission(
        cameraStatus === 'granted' && 
        mediaStatus === 'granted'
      );
      
      if (locationStatus === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
    };

    getPermissions();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || isTakingPicture) return;
    
    try {
      setIsTakingPicture(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      // Try to get location again if we don't have it
      let currentLocation = location;
      if (!currentLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
          }
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
      
      // Navigate to preview screen with the photo
      navigation.navigate('ImagePreview' as never, { 
        uri: photo.uri,
        location: currentLocation 
      } as never);
      
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsTakingPicture(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case FlashMode.off:
          return FlashMode.on;
        case FlashMode.on:
          return FlashMode.auto;
        case FlashMode.auto:
          return FlashMode.off;
        default:
          return FlashMode.off;
      }
    });
  };

  // Handle permission denied
  if (hasPermission === false) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-white">
        <MaterialIcons name="no-photography" size={60} color={colors.error} />
        <StyledText className="text-lg text-gray-800 mt-4 mb-2">
          Camera Permission Denied
        </StyledText>
        <StyledText className="text-gray-600 text-center px-6 mb-6">
          Please enable camera access in your device settings to use this feature.
        </StyledText>
        <StyledTouchableOpacity
          className="bg-primary py-3 px-6 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <StyledText className="text-white font-medium">
            Go Back
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
        <StyledText className="text-gray-600 mt-4">
          Requesting camera permissions...
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        type={cameraType}
        flashMode={flashMode}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Top controls */}
        <StyledView 
          style={{ paddingTop: insets.top || 20 }}
          className="flex-row justify-between items-center px-4 py-2"
        >
          <StyledTouchableOpacity
            className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </StyledTouchableOpacity>
          
          <StyledView className="flex-row">
            <StyledTouchableOpacity
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center mr-2"
              onPress={toggleFlashMode}
            >
              <MaterialIcons 
                name={
                  flashMode === FlashMode.on ? "flash-on" : 
                  flashMode === FlashMode.auto ? "flash-auto" : 
                  "flash-off"
                } 
                size={24} 
                color="white" 
              />
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
              onPress={() => navigation.navigate('Library' as never)}
            >
              <MaterialIcons name="photo-library" size={24} color="white" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
        
        {/* Bottom controls */}
        <StyledView 
          style={{ paddingBottom: insets.bottom || 20 }}
          className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center py-6"
        >
          <StyledTouchableOpacity
            className="w-16 h-16 rounded-full bg-transparent items-center justify-center"
          >
            {/* Empty view for layout purposes */}
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity
            className={`w-18 h-18 rounded-full items-center justify-center ${
              isTakingPicture ? 'opacity-50' : ''
            }`}
            onPress={takePicture}
            disabled={isTakingPicture}
          >
            <StyledView className="w-18 h-18 rounded-full border-4 border-white justify-center items-center">
              <StyledView className="w-14 h-14 rounded-full bg-white" />
            </StyledView>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity
            className="w-16 h-16 rounded-full bg-black/30 items-center justify-center"
            onPress={toggleCameraType}
          >
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </StyledTouchableOpacity>
        </StyledView>
      </Camera>
      
      {/* Processing overlay */}
      {isProcessing && (
        <StyledView className="absolute inset-0 bg-black/70 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <StyledText className="text-white mt-4">
            Processing image...
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};

export default CameraScreen; 