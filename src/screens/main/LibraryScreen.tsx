import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledFlatList = styled(FlatList);
const StyledScrollView = styled(ScrollView);

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 8;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface Discovery {
  id: string;
  uri: string;
  name: string;
  category: string;
  date: string;
  location?: string;
}

// Sample data
const SAMPLE_DISCOVERIES: Discovery[] = Array(20).fill(null).map((_, index) => ({
  id: `disc-${index}`,
  uri: `https://picsum.photos/seed/${index}/500/500`,
  name: ['Eastern Tiger Swallowtail', 'Northern Cardinal', 'American Robin', 'Red Oak', 'Blue Jay', 'Monarch Butterfly', 'White Pine', 'Sugar Maple'][Math.floor(Math.random() * 8)],
  category: ['Bird', 'Butterfly', 'Tree', 'Flower', 'Mammal'][Math.floor(Math.random() * 5)],
  date: `${Math.floor(Math.random() * 30) + 1} days ago`,
  location: `${['Central Park', 'Riverside', 'Mountain View', 'Lakeside Trail'][Math.floor(Math.random() * 4)]}`
}));

const LibraryScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'plants' | 'animals' | 'favorites'>('all');

  // Load data on first render
  useEffect(() => {
    loadDiscoveries();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Library screen gained focus, refreshing data');
      loadDiscoveries();
      return () => {
        // Optional cleanup
      };
    }, [])
  );

  const loadDiscoveries = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from a database
      // For now, we're using sample data
      setTimeout(() => {
        setDiscoveries(SAMPLE_DISCOVERIES);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading discoveries:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDiscoveries();
    setRefreshing(false);
  };

  const filteredDiscoveries = useCallback(() => {
    switch (activeTab) {
      case 'plants':
        return discoveries.filter(item => 
          item.category === 'Tree' || item.category === 'Flower');
      case 'animals':
        return discoveries.filter(item => 
          item.category === 'Bird' || item.category === 'Butterfly' || item.category === 'Mammal');
      case 'favorites':
        // In a real app, this would filter based on user favorites
        return discoveries.filter((_, index) => index % 3 === 0);
      default:
        return discoveries;
    }
  }, [discoveries, activeTab]);

  const renderTabs = () => (
    <StyledScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="px-4 pb-2"
    >
      <StyledTouchableOpacity 
        className={`mr-3 py-2 px-4 rounded-full ${activeTab === 'all' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setActiveTab('all')}
      >
        <StyledText className={activeTab === 'all' ? 'text-white' : 'text-gray-700'}>
          All
        </StyledText>
      </StyledTouchableOpacity>
      
      <StyledTouchableOpacity 
        className={`mr-3 py-2 px-4 rounded-full ${activeTab === 'plants' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setActiveTab('plants')}
      >
        <StyledText className={activeTab === 'plants' ? 'text-white' : 'text-gray-700'}>
          Plants
        </StyledText>
      </StyledTouchableOpacity>
      
      <StyledTouchableOpacity 
        className={`mr-3 py-2 px-4 rounded-full ${activeTab === 'animals' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setActiveTab('animals')}
      >
        <StyledText className={activeTab === 'animals' ? 'text-white' : 'text-gray-700'}>
          Animals
        </StyledText>
      </StyledTouchableOpacity>
      
      <StyledTouchableOpacity 
        className={`mr-3 py-2 px-4 rounded-full ${activeTab === 'favorites' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setActiveTab('favorites')}
      >
        <StyledText className={activeTab === 'favorites' ? 'text-white' : 'text-gray-700'}>
          Favorites
        </StyledText>
      </StyledTouchableOpacity>
    </StyledScrollView>
  );

  const renderItem = ({ item }: { item: Discovery }) => (
    <StyledTouchableOpacity 
      className="rounded-xl overflow-hidden bg-white shadow-sm m-1"
      style={{ width: ITEM_WIDTH }}
      onPress={() => router.push({
        pathname: '/image-detail',
        params: { id: item.id }
      })}
    >
      <StyledImage 
        source={{ uri: item.uri }} 
        className="w-full h-32"
        resizeMode="cover"
      />
      <StyledView className="p-2">
        <StyledText className="text-gray-800 font-medium" numberOfLines={1}>
          {item.name}
        </StyledText>
        <StyledText className="text-gray-500 text-xs">
          {item.category}
        </StyledText>
        <StyledView className="flex-row justify-between items-center mt-1">
          <StyledText className="text-gray-400 text-xs">
            {item.date}
          </StyledText>
          <MaterialIcons 
            name="favorite-border" 
            size={16} 
            color={colors.textLight} 
          />
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );

  const renderEmptyList = () => (
    <StyledView className="flex-1 justify-center items-center py-10">
      <MaterialIcons name="photo-library" size={60} color={colors.textLight} />
      <StyledText className="text-gray-500 mt-4 text-center px-6">
        No discoveries yet. Start exploring to identify plants and animals!
      </StyledText>
      <StyledTouchableOpacity 
        className="mt-6 bg-primary py-2 px-6 rounded-lg"
        onPress={() => router.push('/camera')}
      >
        <StyledText className="text-white font-medium">
          Start Exploring
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <StyledView className="flex-row justify-between items-center px-4 py-3">
        <StyledText className="text-2xl font-bold text-gray-800">
          Your Discoveries
        </StyledText>
        
        <StyledView className="flex-row">
          <StyledTouchableOpacity 
            className="p-2 ml-2"
            onPress={() => {/* Implement search */}}
          >
            <MaterialIcons name="search" size={24} color={colors.textDark} />
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity 
            className="p-2 ml-2"
            onPress={() => router.push('/camera')}
          >
            <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
      
      {/* Tabs */}
      {renderTabs()}
      
      {/* Content */}
      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <StyledText className="text-gray-500 mt-4">
            Loading your discoveries...
          </StyledText>
        </StyledView>
      ) : (
        <StyledFlatList
          data={filteredDiscoveries()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={{ padding: SPACING }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default LibraryScreen; 