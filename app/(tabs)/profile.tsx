import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  Modal, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import ProfileEditScreen from '../../src/components/ProfileEditScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface PostData {
  id: string;
  uri: string;
  userId: string;
  username: string;
  userAvatar: string;
  speciesInfo: {
    name: string;
    category: string;
    rarity: string;
    description: string;
  };
  tags: string[];
  likes: number;
  comments: any[];
  timestamp: number;
  isLiked: boolean;
  isPublic: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, userProfile, reloadUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'public' | 'private'>('all');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });
  
  // Use actual user profile data from AuthContext
  const user = {
    name: userProfile?.displayName || 'Nature Explorer',
    username: userProfile?.username || '@naturelover',
    bio: userProfile?.bio || 'Capturing the beauty of nature one photo at a time. Wildlife photographer and nature enthusiast.',
    avatar: userProfile?.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  useEffect(() => {
    loadUserPosts();
    
    // We don't need to handle navigation focus events with Expo Router
    // as the component will remount when navigated to
  }, []);

  // Update stats when items change
  useEffect(() => {
    // Calculate real stats based on items
    const publicItems = userPosts.filter(item => item.isPublic);
    const privateItems = userPosts.filter(item => !item.isPublic);
    
    setStats({
      posts: userPosts.length,
      followers: 0, // This would come from a real database in a production app
      following: 0  // This would come from a real database in a production app
    });
  }, [userPosts]);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      const postsJson = await AsyncStorage.getItem('user_posts');
      if (postsJson) {
        const posts = JSON.parse(postsJson);
        // Only show posts belonging to the current user
        const filteredPosts = posts.filter(
          (post: PostData) => post.userId === userProfile?.username
        );
        setUserPosts(filteredPosts);
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = userPosts.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'public') return item.isPublic;
    if (activeTab === 'private') return !item.isPublic;
    return true;
  });

  const renderItem = ({ item }: { item: PostData }) => {
    return (
      <TouchableOpacity 
        className="mr-2 mb-2 overflow-hidden rounded-lg"
        style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
        onPress={() => {
          router.push({
            pathname: '/image-detail',
            params: { postId: item.id }
          });
        }}
      >
        <Image source={{ uri: item.uri }} className="w-full h-full" />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
          <View className="flex-1">
            <Text className="text-white font-bold text-sm" numberOfLines={1}>
              {item.speciesInfo?.name || 'Unknown Species'}
            </Text>
            <Text className="text-white/70 text-xs" numberOfLines={1}>
              {item.speciesInfo?.category || 'Uncategorized'}
            </Text>
          </View>
          <View className="absolute top-2 right-2 bg-gray-700/70 rounded-full p-1">
            <MaterialIcons 
              name={item.isPublic ? 'public' : 'lock'} 
              size={16} 
              color="#fff" 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await logout();
              // Auth state change will handle navigation
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setLogoutLoading(false);
              setSettingsModalVisible(false);
            }
          }
        }
      ]
    );
  };

  const handleNavigateToSettings = (section: string) => {
    setSettingsModalVisible(false);
    
    // Navigate to settings with the selected section
    router.push({
      pathname: '/settings',
      params: { section }
    });
  };

  const renderSettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={settingsModalVisible}
      onRequestClose={() => setSettingsModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-900 rounded-t-3xl">
          <View className="border-b border-gray-800 p-4 flex-row justify-between items-center">
            <Text className="text-white text-lg font-bold">Settings</Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4 max-h-96">
            <TouchableOpacity 
              className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg"
              onPress={() => {
                setSettingsModalVisible(false);
                setEditProfileModalVisible(true);
              }}
            >
              <MaterialIcons name="person" size={24} color="#fff" />
              <Text className="text-white text-base ml-3 flex-1">Edit Profile</Text>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg"
              onPress={() => handleNavigateToSettings('privacy')}
            >
              <MaterialIcons name="privacy-tip" size={24} color="#fff" />
              <Text className="text-white text-base ml-3 flex-1">Privacy</Text>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg"
              onPress={() => handleNavigateToSettings('help')}
            >
              <MaterialIcons name="help" size={24} color="#fff" />
              <Text className="text-white text-base ml-3 flex-1">Help & Support</Text>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg"
              onPress={() => handleNavigateToSettings('about')}
            >
              <MaterialIcons name="info" size={24} color="#fff" />
              <Text className="text-white text-base ml-3 flex-1">About EcoGo</Text>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center p-3 mb-2 bg-gray-800 rounded-lg"
              onPress={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <MaterialIcons name="logout" size={24} color="#FF6B6B" />
                  <Text className="text-[#FF6B6B] text-base ml-3">Logout</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderPosts = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-gray-500 mt-4">Loading your discoveries...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="error" size={48} color={colors.error} />
          <Text className="text-gray-500 mt-4">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-gray-800 px-4 py-2 rounded-lg"
            onPress={loadUserPosts}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-8">
          <MaterialIcons name="photo-library" size={64} color="rgba(255,255,255,0.2)" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            No discoveries yet
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-4">
            Use the camera to capture and identify some plant and animal species
          </Text>
          <TouchableOpacity 
            className="bg-emerald-600 px-6 py-3 rounded-full"
            onPress={() => router.push('/camera')}
          >
            <Text className="text-white font-bold">Start Discovering</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: SPACING }}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        {/* Profile Header */}
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Text className="text-white text-xl font-bold">{user.name}</Text>
              {userProfile?.pronouns && (
                <Text className="text-gray-500 ml-2">({userProfile.pronouns})</Text>
              )}
            </View>
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
              onPress={() => setSettingsModalVisible(true)}
            >
              <MaterialIcons name="settings" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row mt-4">
            <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-800">
              <Image 
                source={{ uri: user.avatar }} 
                className="w-full h-full"
              />
            </View>
            
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-gray-500 mb-1">{user.username}</Text>
              <Text className="text-white">{user.bio}</Text>
              
              <TouchableOpacity 
                className="bg-gray-800 px-3 py-1 rounded-lg mt-2 self-start"
                onPress={() => setEditProfileModalVisible(true)}
              >
                <Text className="text-white">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row justify-around mt-6 pb-3 border-b border-gray-800">
            <View className="items-center">
              <Text className="text-white font-bold">{stats.posts}</Text>
              <Text className="text-gray-500">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold">{stats.followers}</Text>
              <Text className="text-gray-500">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold">{stats.following}</Text>
              <Text className="text-gray-500">Following</Text>
            </View>
          </View>
          
          <View className="flex-row mt-4">
            <TouchableOpacity 
              className={`flex-1 items-center py-2 border-b-2 ${activeTab === 'all' ? 'border-emerald-500' : 'border-transparent'}`}
              onPress={() => setActiveTab('all')}
            >
              <Text className={activeTab === 'all' ? 'text-emerald-500' : 'text-gray-500'}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 items-center py-2 border-b-2 ${activeTab === 'public' ? 'border-emerald-500' : 'border-transparent'}`}
              onPress={() => setActiveTab('public')}
            >
              <Text className={activeTab === 'public' ? 'text-emerald-500' : 'text-gray-500'}>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 items-center py-2 border-b-2 ${activeTab === 'private' ? 'border-emerald-500' : 'border-transparent'}`}
              onPress={() => setActiveTab('private')}
            >
              <Text className={activeTab === 'private' ? 'text-emerald-500' : 'text-gray-500'}>
                Private
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Posts Grid */}
        <View className="flex-1">
          {renderPosts()}
        </View>
      </View>
      
      {/* Settings Modal */}
      {renderSettingsModal()}
      
      {/* Edit Profile Modal */}
      <ProfileEditScreen 
        visible={editProfileModalVisible}
        onClose={() => {
          setEditProfileModalVisible(false);
          reloadUserProfile();
        }}
      />
    </SafeAreaView>
  );
} 