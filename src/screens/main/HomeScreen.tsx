import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

// Temporary data for discoveries
const RECENT_DISCOVERIES = [
  {
    id: '1',
    name: 'Eastern Tiger Swallowtail',
    type: 'Butterfly',
    image: 'https://via.placeholder.com/120',
    date: '2 days ago'
  },
  {
    id: '2',
    name: 'Northern Cardinal',
    type: 'Bird',
    image: 'https://via.placeholder.com/120',
    date: '1 week ago'
  }
];

// Temporary data for activities
const ACTIVITIES = [
  {
    id: '1',
    title: 'Plant Identification Challenge',
    participants: 134,
    image: 'https://via.placeholder.com/100',
    days: 5
  },
  {
    id: '2',
    title: 'Butterfly Watch 2023',
    participants: 89,
    image: 'https://via.placeholder.com/100',
    days: 12
  }
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StyledScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <StyledView className="px-4 py-4 flex-row justify-between items-center">
          <StyledView>
            <StyledText className="text-lg text-gray-500">Hello,</StyledText>
            <StyledText className="text-2xl font-bold text-gray-800">
              {userProfile?.displayName || 'Nature Explorer'}
            </StyledText>
          </StyledView>
          
          <StyledTouchableOpacity 
            className="p-2 bg-gray-100 rounded-full"
            onPress={() => navigation.navigate('Camera' as never)}
          >
            <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Hero Section */}
        <StyledView className="px-4 py-4">
          <StyledView className="bg-green-50 p-4 rounded-xl">
            <StyledView className="flex-row">
              <StyledView className="flex-1">
                <StyledText className="text-lg font-bold text-gray-800 mb-2">
                  Discover the World Around You
                </StyledText>
                <StyledText className="text-gray-600 mb-4">
                  Take photos of plants and animals to identify them
                </StyledText>
                <StyledTouchableOpacity 
                  className="bg-primary py-2 px-4 rounded-lg self-start"
                  onPress={() => navigation.navigate('Camera' as never)}
                >
                  <StyledText className="text-white font-medium">
                    Start Exploring
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
              <MaterialIcons name="nature" size={70} color={colors.primary} style={{ opacity: 0.7 }} />
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Quick Actions */}
        <StyledView className="px-4 py-2">
          <StyledText className="text-lg font-bold text-gray-800 mb-3">
            Quick Actions
          </StyledText>
          <StyledView className="flex-row justify-between">
            <StyledTouchableOpacity 
              className="bg-amber-50 rounded-xl p-3 items-center w-[calc(33%-8px)]"
              onPress={() => navigation.navigate('Camera' as never)}
            >
              <MaterialIcons name="camera-alt" size={28} color={colors.accent} />
              <StyledText className="text-gray-800 text-sm mt-1">Camera</StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity 
              className="bg-blue-50 rounded-xl p-3 items-center w-[calc(33%-8px)]"
              onPress={() => navigation.navigate('Library' as never)}
            >
              <MaterialIcons name="photo-library" size={28} color={colors.info} />
              <StyledText className="text-gray-800 text-sm mt-1">Library</StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity 
              className="bg-green-50 rounded-xl p-3 items-center w-[calc(33%-8px)]"
              onPress={() => navigation.navigate('Activities' as never)}
            >
              <MaterialIcons name="directions-walk" size={28} color={colors.primary} />
              <StyledText className="text-gray-800 text-sm mt-1">Activities</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* Recent Discoveries */}
        <StyledView className="px-4 py-4">
          <StyledView className="flex-row justify-between items-center mb-3">
            <StyledText className="text-lg font-bold text-gray-800">
              Recent Discoveries
            </StyledText>
            <StyledTouchableOpacity onPress={() => navigation.navigate('Library' as never)}>
              <StyledText className="text-primary">See All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          
          {RECENT_DISCOVERIES.length > 0 ? (
            RECENT_DISCOVERIES.map(item => (
              <StyledTouchableOpacity 
                key={item.id}
                className="flex-row bg-gray-50 rounded-xl p-3 mb-3"
                onPress={() => navigation.navigate('ImageDetail' as never, { imageId: item.id } as never)}
              >
                <StyledImage 
                  source={{ uri: item.image }} 
                  className="w-16 h-16 rounded-lg"
                  resizeMode="cover"
                />
                <StyledView className="ml-3 flex-1 justify-center">
                  <StyledText className="text-gray-800 font-medium">{item.name}</StyledText>
                  <StyledText className="text-gray-500 text-sm">{item.type}</StyledText>
                  <StyledText className="text-gray-400 text-xs">{item.date}</StyledText>
                </StyledView>
                <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
              </StyledTouchableOpacity>
            ))
          ) : (
            <StyledView className="bg-gray-50 rounded-xl p-4 items-center">
              <MaterialIcons name="search" size={40} color={colors.textLight} />
              <StyledText className="text-gray-500 mt-2 text-center">
                No discoveries yet. Start exploring to identify plants and animals!
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        {/* Community Activities */}
        <StyledView className="px-4 py-4 mb-6">
          <StyledView className="flex-row justify-between items-center mb-3">
            <StyledText className="text-lg font-bold text-gray-800">
              Community Activities
            </StyledText>
            <StyledTouchableOpacity onPress={() => navigation.navigate('Activities' as never)}>
              <StyledText className="text-primary">See All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {ACTIVITIES.map(activity => (
              <StyledTouchableOpacity 
                key={activity.id}
                className="bg-gray-50 rounded-xl p-3 mr-4 w-48"
              >
                <StyledImage 
                  source={{ uri: activity.image }} 
                  className="w-full h-24 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <StyledText className="text-gray-800 font-medium">{activity.title}</StyledText>
                <StyledView className="flex-row justify-between mt-2">
                  <StyledText className="text-gray-500 text-xs">
                    {activity.participants} participants
                  </StyledText>
                  <StyledText className="text-primary text-xs">
                    {activity.days} days left
                  </StyledText>
                </StyledView>
              </StyledTouchableOpacity>
            ))}
          </StyledScrollView>
        </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 