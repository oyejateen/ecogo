import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useNavigation } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const { userProfile } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGamePress = (game: string) => {
    setSelectedGame(game);
    
    // Show an alert for now - in the future this would navigate to the game screen
    Alert.alert(
      `${game}`,
      `This feature is coming soon! Stay tuned for exciting ${game.toLowerCase()} gameplay.`,
      [
        { 
          text: 'Can\'t Wait!', 
          onPress: () => console.log(`User is excited about ${game}`) 
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        {/* Header with user avatar and options */}
        <View className="flex-row justify-between items-center my-4">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <Image 
              source={{ uri: userProfile?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg' }}
              className="w-full h-full"
            />
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-lg bg-gray-100 justify-center items-center">
            <Ionicons name="grid-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Main Feature Banner */}
        <TouchableOpacity 
          className="h-44 rounded-2xl overflow-hidden mb-6"
          onPress={() => handleGamePress('Know Your Nature')}
        >
          <ImageBackground
            source={require('@/assets/images/nature-bg.jpg')}
            className="flex-1 justify-center"
            imageStyle={{ borderRadius: 20 }}
          >
            <View className="flex-row p-5 bg-[rgba(250,204,21,0.85)]">
              <View className="flex-2 justify-center">
                <Text className="text-2xl font-bold text-black mb-2">Know Your Nature</Text>
                <Text className="text-sm text-gray-800 mb-3">Test your knowledge about plants & wildlife</Text>
                <TouchableOpacity className="bg-[#7e57c2] px-4 py-2 rounded-full self-start">
                  <Text className="text-white font-bold text-sm">Play Quiz</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center justify-center">
                <View className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.5)] justify-center items-center">
                  <MaterialCommunityIcons name="flower" size={60} color="#333" />
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Grid of Games */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <TouchableOpacity 
            className="w-[48%] h-30 rounded-xl p-4 mb-4 justify-between bg-[#7e57c2]"
            onPress={() => handleGamePress('Grow Your Tree')}
          >
            <View>
              <Text className="text-white font-bold">Grow Your Tree</Text>
              <Text className="text-white text-xs opacity-80">Virtual tree growing</Text>
            </View>
            <View className="items-end">
              <MaterialCommunityIcons name="tree" size={36} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-[48%] h-30 rounded-xl p-4 mb-4 justify-center items-center bg-[#ff9800]"
            onPress={() => handleGamePress('Score')}
          >
            <View className="flex-row items-center">
              <FontAwesome5 name="medal" size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">Score</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-[48%] h-30 rounded-xl p-4 mb-4 justify-between bg-[#00bcd4]"
            onPress={() => handleGamePress('Learn To Learn')}
          >
            <View className="items-center justify-center">
              <MaterialIcons name="help" size={40} color="#fff" />
            </View>
            <Text className="text-white font-bold text-center mt-2">Learn To Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-[48%] h-30 rounded-xl p-4 mb-4 justify-between bg-[#e91e63]"
            onPress={() => handleGamePress('Arcade Arena')}
          >
            <Text className="text-white font-bold">Arcade Arena</Text>
            <View className="items-end">
              <FontAwesome5 name="gamepad" size={36} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          className="bg-[#42e2b8] rounded-full py-4 items-center mb-6"
          onPress={() => handleGamePress('Random Game')}
        >
          <Text className="text-white font-bold text-lg">PLAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 