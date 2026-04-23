import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert
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
const StyledSwitch = styled(Switch);

// Types
interface RatingItem {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: string;
}

// Temporary mock service for Gemini Vision while we work on real integration
const mockGeminiVisionService = {
  identifySpecies: async (imageUri: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data
    return {
      name: 'Eastern Tiger Swallowtail',
      category: 'butterfly',
      rarity: 'Common',
      description: 'The Eastern Tiger Swallowtail is a species of swallowtail butterfly native to North America. It is one of the most familiar butterflies in the eastern United States.',
      funFact: 'The caterpillars of this species change appearance as they grow. Young caterpillars resemble bird droppings, which helps protect them from predators.',
      brainrotDescription: 'This fabulous yellow fashionista of the sky is serving LOOKS with those tiger stripes! The ultimate trendsetter in butterfly couture, turning every garden into its personal runway.',
    };
  }
};

export default function AIReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uri, location } = useLocalSearchParams<{ uri: string; location: string }>();
  const { user } = useAuth();

  const [analyzing, setAnalyzing] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [speciesInfo, setSpeciesInfo] = useState<any | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'brainrot'>('info');
  const [ratings, setRatings] = useState<RatingItem[]>([
    { id: 'vibes', name: 'Vibes', value: 0, icon: 'mood', color: '#FF6B6B' },
    { id: 'aesthetic', name: 'Aesthetic', value: 0, icon: 'palette', color: '#4ECDC4' },
    { id: 'composition', name: 'Composure', value: 0, icon: 'crop', color: '#FFD166' },
    { id: 'lighting', name: 'Lighting', value: 0, icon: 'wb-sunny', color: '#FF9F1C' },
    { id: 'overall', name: 'Overall', value: 0, icon: 'star', color: '#FFD700' },
  ]);

  useEffect(() => {
    // Use mock service to analyze the image
    identifySpecies();
  }, [uri]);

  const identifySpecies = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      // Use the mock GeminiVision service to identify the species
      const result = await mockGeminiVisionService.identifySpecies(uri as string);
      setSpeciesInfo(result);

      // Generate random ratings between 3-5 for demo purposes
      const updatedRatings = ratings.map(rating => ({
        ...rating,
        value: Math.floor(Math.random() * 3) + 3 // Random value between 3-5
      }));
      setRatings(updatedRatings);

      // Extract tags based on species info
      const generatedTags = generateTagsFromSpecies(result);
      setTags(generatedTags);

    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateTagsFromSpecies = (speciesInfo: any): string[] => {
    const tags = [];
    
    // Add category as a tag
    tags.push(speciesInfo.category.toLowerCase());
    
    // Add rarity as a tag
    tags.push(speciesInfo.rarity.toLowerCase());
    
    // Add first word of species name as a tag
    const firstWord = speciesInfo.name.split(' ')[0].toLowerCase();
    tags.push(firstWord);
    
    // Add some additional tags based on the description
    const descriptionWords = speciesInfo.description.split(' ');
    const keywordMap: {[key: string]: string} = {
      "beautiful": "beauty",
      "rare": "rare",
      "forest": "forest",
      "wild": "wildlife",
      "water": "aquatic",
      "flower": "flowering",
      "insect": "insects",
      "bird": "birds",
      "mammal": "mammals",
      "tree": "trees",
      "ocean": "ocean",
      "mountain": "mountains",
      "river": "rivers",
      "lake": "lakes"
    };
    
    for (const word of descriptionWords) {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:()"']/g, '');
      if (keywordMap[cleanWord] && !tags.includes(keywordMap[cleanWord])) {
        tags.push(keywordMap[cleanWord]);
      }
    }
    
    // Limit to 5 tags
    return tags.slice(0, 5);
  };

  const handlePublish = async () => {
    try {
      // In a real app, this would save to a database
      Alert.alert(
        "Discovery Saved",
        "Your discovery has been saved to your library.",
        [
          { text: "OK", onPress: () => router.push('/(tabs)/library') }
        ]
      );
    } catch (error) {
      console.error('Error publishing discovery:', error);
      Alert.alert("Error", "Failed to save your discovery. Please try again.");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Discovery?",
      "Are you sure you want to discard this discovery?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() }
      ]
    );
  };

  const renderRatingBar = (rating: RatingItem) => (
    <StyledView className="flex-row items-center mb-3" key={rating.id}>
      <StyledView className="flex-row items-center w-32">
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

  return (
    <StyledView 
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <StyledView className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
        <StyledTouchableOpacity
          className="p-2"
          onPress={handleCancel}
        >
          <MaterialIcons name="close" size={24} color={colors.textDark} />
        </StyledTouchableOpacity>
        
        <StyledText className="text-lg font-bold text-gray-800">
          AI Review
        </StyledText>
        
        <StyledTouchableOpacity
          className="p-2"
          onPress={handlePublish}
          disabled={analyzing || !!error}
        >
          <MaterialIcons 
            name="check" 
            size={24} 
            color={analyzing || !!error ? colors.textLight : colors.success} 
          />
        </StyledTouchableOpacity>
      </StyledView>
      
      {analyzing ? (
        <StyledView className="flex-1 justify-center items-center p-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <StyledText className="mt-4 text-gray-700 text-center text-lg">
            AI is identifying your discovery...
          </StyledText>
          <StyledText className="mt-2 text-gray-500 text-center">
            This may take a moment as we analyze your image to identify the species.
          </StyledText>
        </StyledView>
      ) : error ? (
        <StyledView className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="error-outline" size={60} color={colors.error} />
          <StyledText className="mt-4 text-gray-800 text-center text-lg">
            {error}
          </StyledText>
          <StyledTouchableOpacity
            className="mt-6 bg-primary py-2 px-6 rounded-lg"
            onPress={() => identifySpecies()}
          >
            <StyledText className="text-white font-medium">
              Try Again
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Preview Image */}
          <StyledView className="relative">
            <StyledImage 
              source={{ uri: uri as string }} 
              className="w-full h-72"
              resizeMode="cover"
            />
            
            {/* Species info overlay */}
            <StyledView className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
              <StyledView className="flex-row items-center mb-1">
                <StyledText className="text-white text-xl font-bold mr-2">
                  {speciesInfo.name}
                </StyledText>
                <StyledView className={`px-2 py-1 rounded-full ${getRarityColor(speciesInfo.rarity)}`}>
                  <StyledText className="text-white text-xs">
                    {speciesInfo.rarity}
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-white text-sm opacity-80">
                {speciesInfo.category}
              </StyledText>
            </StyledView>
          </StyledView>
          
          {/* Public Toggle */}
          <StyledView className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
            <StyledView>
              <StyledText className="text-gray-800 font-medium">
                Make Public
              </StyledText>
              <StyledText className="text-gray-500 text-xs">
                Share this discovery with the community
              </StyledText>
            </StyledView>
            <StyledSwitch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
              thumbColor={isPublic ? colors.primary : '#F5F5F5'}
            />
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
                Information
              </StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity 
              className={`flex-1 py-3 ${activeTab === 'brainrot' ? 'border-b-2 border-primary' : ''}`}
              onPress={() => setActiveTab('brainrot')}
            >
              <StyledText 
                className={`text-center ${activeTab === 'brainrot' ? 'text-primary font-medium' : 'text-gray-500'}`}
              >
                Fun Description
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          
          {/* Tab content */}
          <StyledView className="p-4">
            {activeTab === 'info' ? (
              <StyledView>
                <StyledText className="text-lg font-bold text-gray-800 mb-2">
                  About This Species
                </StyledText>
                <StyledText className="text-gray-700 mb-4">
                  {speciesInfo.description}
                </StyledText>
                
                <StyledText className="text-lg font-bold text-gray-800 mb-2">
                  Fun Fact
                </StyledText>
                <StyledText className="text-gray-700 mb-4 italic">
                  {speciesInfo.funFact}
                </StyledText>
                
                <StyledText className="text-lg font-bold text-gray-800 mb-2">
                  AI Ratings
                </StyledText>
                {ratings.map(rating => renderRatingBar(rating))}
                
                <StyledText className="text-lg font-bold text-gray-800 mb-2 mt-4">
                  Tags
                </StyledText>
                <StyledView className="flex-row flex-wrap">
                  {tags.map(tag => (
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
            ) : (
              <StyledView>
                <StyledText className="text-lg font-bold text-gray-800 mb-2">
                  AI's Quirky Take
                </StyledText>
                <StyledText className="text-gray-700 mb-4 italic">
                  {speciesInfo.brainrotDescription}
                </StyledText>
                
                <StyledView className="bg-yellow-50 rounded-lg p-4 mt-4">
                  <StyledText className="text-yellow-800 text-sm italic">
                    Note: This fun description was generated by AI and may contain creative liberties for entertainment purposes.
                  </StyledText>
                </StyledView>
              </StyledView>
            )}
          </StyledView>
          
          {/* Save button */}
          <StyledView className="px-4 py-4 mb-8">
            <StyledTouchableOpacity
              className="bg-primary py-3 rounded-lg"
              onPress={handlePublish}
            >
              <StyledText className="text-white font-medium text-center">
                Save to Library
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      )}
    </StyledView>
  );
} 