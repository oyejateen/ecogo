import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileEditScreen({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [pronouns, setPronouns] = useState(userProfile?.pronouns || '');
  const [profileImage, setProfileImage] = useState<string | null>(userProfile?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setUsername(userProfile.username || '');
      setBio(userProfile.bio || '');
      setPronouns(userProfile.pronouns || '');
      setProfileImage(userProfile.photoURL);
    }
  }, [userProfile]);

  const handlePickImage = async () => {
    setShowPhotoOptions(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required", 
        "You need to grant access to your photos to select a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    setShowPhotoOptions(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required", 
        "You need to grant access to your camera to take a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert("Missing Information", "Please enter your name");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Missing Information", "Please enter a username");
      return;
    }

    try {
      setLoading(true);
      
      // Save profile data using the Auth context
      await updateUserProfile({
        displayName,
        username,
        bio,
        photoURL: profileImage,
        pronouns
      });
      
      Alert.alert("Success", "Profile updated successfully");
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const renderPhotoOptionsModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showPhotoOptions}
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/60 justify-end"
          activeOpacity={1} 
          onPress={() => setShowPhotoOptions(false)}
        >
          <View className="bg-gray-900 rounded-t-3xl">
            <View className="py-6 px-4">
              <Text className="text-white text-xl font-bold text-center mb-4">Change Profile Photo</Text>
              
              <TouchableOpacity 
                className="flex-row items-center p-4 bg-gray-800 rounded-xl mb-2" 
                onPress={handleTakePhoto}
              >
                <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
                <Text className="text-white ml-3 text-base">Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center p-4 bg-gray-800 rounded-xl mb-2" 
                onPress={handlePickImage}
              >
                <MaterialIcons name="photo-library" size={24} color={colors.primary} />
                <Text className="text-white ml-3 text-base">Choose from Gallery</Text>
              </TouchableOpacity>
              
              {profileImage && (
                <TouchableOpacity 
                  className="flex-row items-center p-4 bg-gray-800 rounded-xl mb-2" 
                  onPress={() => {
                    setProfileImage(null);
                    setShowPhotoOptions(false);
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="#FF6B6B" />
                  <Text className="text-white ml-3 text-base">Remove Current Photo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                className="p-4 bg-gray-800 rounded-xl mt-4" 
                onPress={() => setShowPhotoOptions(false)}
              >
                <Text className="text-white text-center font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View className="flex-1 bg-gray-900" style={{ paddingTop: insets.top }}>
        <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="text-emerald-500 font-bold">Save</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <TouchableOpacity 
              className="mb-2"
              onPress={() => setShowPhotoOptions(true)}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-24 h-24 rounded-full" />
              ) : (
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  className="w-24 h-24 rounded-full items-center justify-center"
                >
                  <MaterialIcons name="person" size={60} color="#fff" />
                </LinearGradient>
              )}
              
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 items-center justify-center">
                <MaterialIcons name="photo-camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <Text className="text-gray-400 text-sm mt-2">
              Tap to change profile photo
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-gray-400 text-sm mb-1">Name</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="Enter your name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
            
            <Text className="text-gray-400 text-sm mb-1">Username</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="Enter a username"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <Text className="text-gray-400 text-sm mb-1">Pronouns (optional)</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="Add your pronouns"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={pronouns}
              onChangeText={setPronouns}
              autoCapitalize="none"
            />
            
            <Text className="text-gray-400 text-sm mb-1">Bio</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg h-24"
              placeholder="Tell us about yourself"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>
      
      {renderPhotoOptionsModal()}
    </Modal>
  );
} 