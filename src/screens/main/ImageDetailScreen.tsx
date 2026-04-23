import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { styled } from 'nativewind';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);
const StyledFlatList = styled(FlatList);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

// Types
interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: number;
}

interface RatingItem {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
}

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
    funFact: string;
  };
  ratings: RatingItem[];
  tags: string[];
  likes: number;
  comments: Comment[];
  timestamp: number;
  isLiked: boolean;
  isPublic: boolean;
}

// Sample data for development
const SAMPLE_POST: PostData = {
  id: 'disc-1',
  uri: 'https://picsum.photos/seed/1/500/500',
  userId: 'user-1',
  username: 'natureexplorer',
  userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  speciesInfo: {
    name: 'Eastern Tiger Swallowtail',
    category: 'Butterfly',
    rarity: 'Common',
    description: 'The Eastern Tiger Swallowtail is a species of swallowtail butterfly native to North America. It is one of the most familiar butterflies in the eastern United States.',
    funFact: 'The caterpillars of this species change appearance as they grow. Young caterpillars resemble bird droppings, which helps protect them from predators.',
  },
  ratings: [
    { id: 'r1', name: 'Rarity', value: 3, icon: 'star', color: '#FFD700' },
    { id: 'r2', name: 'Beauty', value: 5, icon: 'favorite', color: '#FF4081' },
    { id: 'r3', name: 'Ecological Value', value: 4, icon: 'eco', color: '#4CAF50' },
  ],
  tags: ['butterfly', 'insect', 'pollinator', 'yellow'],
  likes: 24,
  comments: [
    {
      id: 'c1',
      userId: 'user-2',
      username: 'butterfly_lover',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Beautiful specimen! I saw one of these in my garden last week.',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'c2',
      userId: 'user-3',
      username: 'insect_photographer',
      userAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      text: 'Great shot! What camera did you use?',
      timestamp: Date.now() - 43200000,
    },
  ],
  timestamp: Date.now() - 172800000,
  isLiked: false,
  isPublic: true,
};

export default function ImageDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'ratings' | 'comments'>('info');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Animation for like button
  const likeAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Print debug info 
    console.log('ImageDetailScreen mounted with id:', id);
    
    // Return early if no id
    if (!id) {
      setLoading(false);
      setError('No discovery ID provided');
      return;
    }
    
    // Load post data
    loadPostData();
  }, [id]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, we would fetch from a database
      // For now, just use sample data
      setTimeout(() => {
        setPost(SAMPLE_POST);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading post data:', error);
      setError('Failed to load discovery data');
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    if (!post) return;

    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Update post data
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1
    });
  };

  const handleSubmitComment = async () => {
    if (!post || !commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);

      const newComment: Comment = {
        id: Date.now().toString(),
        userId: user?.uid || 'anonymous',
        username: user?.displayName || 'Anonymous User',
        userAvatar: user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        text: commentText.trim(),
        timestamp: Date.now(),
      };

      // Update post with new comment
      setPost({
        ...post,
        comments: [newComment, ...post.comments],
      });
      
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderRatingBar = (rating: RatingItem) => (
    <StyledView className="flex-row items-center mb-2" key={rating.id}>
      <StyledView className="flex-row items-center w-40">
        <MaterialIcons name={rating.icon as any} size={18} color={rating.color} />
        <StyledText className="ml-2 text-gray-700">{rating.name}</StyledText>
      </StyledView>
      <StyledView className="flex-row flex-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <MaterialIcons
            key={index}
            name="star"
            size={18}
            color={index < rating.value ? rating.color : '#e0e0e0'}
          />
        ))}
      </StyledView>
    </StyledView>
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <StyledView className="p-3 border-b border-gray-100">
      <StyledView className="flex-row">
        <StyledImage 
          source={{ uri: item.userAvatar }} 
          className="w-10 h-10 rounded-full"
        />
        <StyledView className="flex-1 ml-3">
          <StyledView className="flex-row items-center">
            <StyledText className="font-medium text-gray-800">{item.username}</StyledText>
            <StyledText className="text-xs text-gray-500 ml-2">
              {new Date(item.timestamp).toLocaleDateString()}
            </StyledText>
          </StyledView>
          <StyledText className="text-gray-700 mt-1">{item.text}</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'very rare': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <StyledView 
        className="flex-1 justify-center items-center bg-white"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <StyledText className="mt-4 text-gray-500">
          Loading discovery...
        </StyledText>
      </StyledView>
    );
  }

  if (error || !post) {
    return (
      <StyledView 
        className="flex-1 justify-center items-center bg-white"
        style={{ paddingTop: insets.top }}
      >
        <MaterialIcons name="error-outline" size={60} color={colors.error} />
        <StyledText className="mt-4 text-gray-800 text-lg">
          {error || 'Failed to load discovery'}
        </StyledText>
        <StyledTouchableOpacity
          className="mt-6 bg-primary py-2 px-6 rounded-lg"
          onPress={handleBack}
        >
          <StyledText className="text-white font-medium">
            Go Back
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  }

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <StyledView className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
        <StyledTouchableOpacity
          className="p-2"
          onPress={handleBack}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.textDark} />
        </StyledTouchableOpacity>
        
        <StyledText className="text-lg font-bold text-gray-800">
          Discovery Details
        </StyledText>
        
        <StyledTouchableOpacity
          className="p-2"
          onPress={() => {/* Implement share */}}
        >
          <MaterialIcons name="share" size={24} color={colors.textDark} />
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <StyledView className="relative">
          <StyledImage 
            source={{ uri: post.uri }} 
            className="w-full h-72"
            resizeMode="cover"
          />
          
          {/* Species info overlay */}
          <StyledView className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <StyledView className="flex-row items-center mb-1">
              <StyledText className="text-white text-xl font-bold mr-2">
                {post.speciesInfo.name}
              </StyledText>
              <StyledView className={`px-2 py-1 rounded-full ${getRarityColor(post.speciesInfo.rarity)}`}>
                <StyledText className="text-white text-xs">
                  {post.speciesInfo.rarity}
                </StyledText>
              </StyledView>
            </StyledView>
            <StyledText className="text-white text-sm opacity-80">
              {post.speciesInfo.category}
            </StyledText>
          </StyledView>
        </StyledView>
        
        {/* User info & likes */}
        <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <StyledView className="flex-row items-center">
            <StyledImage 
              source={{ uri: post.userAvatar }} 
              className="w-8 h-8 rounded-full"
            />
            <StyledText className="ml-2 text-gray-800">
              {post.username}
            </StyledText>
          </StyledView>
          
          <StyledView className="flex-row items-center">
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <StyledTouchableOpacity
                className="flex-row items-center p-2"
                onPress={handleLike}
              >
                <MaterialIcons 
                  name={post.isLiked ? "favorite" : "favorite-border"}
                  size={24} 
                  color={post.isLiked ? colors.error : colors.textDark} 
                />
                <StyledText className="ml-1 text-gray-800">
                  {post.likes}
                </StyledText>
              </StyledTouchableOpacity>
            </Animated.View>
          </StyledView>
        </StyledView>
        
        {/* Tabs */}
        <StyledView className="flex-row border-b border-gray-100">
          <StyledTouchableOpacity 
            className={`flex-1 py-3 ${activeTab === 'info' ? 'border-b-2 border-primary' : ''}`}
            onPress={() => setActiveTab('info')}
          >
            <StyledText 
              className={`text-center ${activeTab === 'info' ? 'text-primary font-medium' : 'text-gray-500'}`}
            >
              Info
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity 
            className={`flex-1 py-3 ${activeTab === 'ratings' ? 'border-b-2 border-primary' : ''}`}
            onPress={() => setActiveTab('ratings')}
          >
            <StyledText 
              className={`text-center ${activeTab === 'ratings' ? 'text-primary font-medium' : 'text-gray-500'}`}
            >
              Ratings
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity 
            className={`flex-1 py-3 ${activeTab === 'comments' ? 'border-b-2 border-primary' : ''}`}
            onPress={() => setActiveTab('comments')}
          >
            <StyledText 
              className={`text-center ${activeTab === 'comments' ? 'text-primary font-medium' : 'text-gray-500'}`}
            >
              Comments ({post.comments.length})
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        
        {/* Tab content */}
        <StyledView className="p-4">
          {activeTab === 'info' && (
            <StyledView>
              <StyledText className="text-lg font-bold text-gray-800 mb-2">
                Description
              </StyledText>
              <StyledText className="text-gray-700 mb-4">
                {post.speciesInfo.description}
              </StyledText>
              
              <StyledText className="text-lg font-bold text-gray-800 mb-2">
                Fun Fact
              </StyledText>
              <StyledText className="text-gray-700 mb-4 italic">
                {post.speciesInfo.funFact}
              </StyledText>
              
              <StyledText className="text-lg font-bold text-gray-800 mb-2">
                Tags
              </StyledText>
              <StyledView className="flex-row flex-wrap">
                {post.tags.map(tag => (
                  <StyledView 
                    key={tag} 
                    className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <StyledText className="text-gray-700">
                      #{tag}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>
            </StyledView>
          )}
          
          {activeTab === 'ratings' && (
            <StyledView>
              <StyledText className="text-lg font-bold text-gray-800 mb-4">
                Ratings
              </StyledText>
              {post.ratings.map(rating => renderRatingBar(rating))}
            </StyledView>
          )}
          
          {activeTab === 'comments' && (
            <StyledView>
              {/* Comment input */}
              <StyledView className="flex-row items-center mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <StyledTextInput
                  className="flex-1 px-4 py-2 text-gray-700"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <StyledTouchableOpacity
                  className={`px-4 py-2 ${commentText.trim() ? 'bg-primary' : 'bg-gray-200'}`}
                  disabled={!commentText.trim() || submittingComment}
                  onPress={handleSubmitComment}
                >
                  {submittingComment ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialIcons 
                      name="send" 
                      size={20} 
                      color={commentText.trim() ? "white" : colors.textLight} 
                    />
                  )}
                </StyledTouchableOpacity>
              </StyledView>
              
              {/* Comments list */}
              {post.comments.length > 0 ? (
                <StyledFlatList
                  data={post.comments}
                  renderItem={renderComment}
                  keyExtractor={item => item.id}
                />
              ) : (
                <StyledView className="py-8 items-center">
                  <MaterialIcons name="chat-bubble-outline" size={40} color={colors.textLight} />
                  <StyledText className="text-gray-500 mt-2 text-center">
                    No comments yet. Be the first to comment!
                  </StyledText>
                </StyledView>
              )}
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
} 