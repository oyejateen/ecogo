import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  StatusBar,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImageBackground = styled(ImageBackground);
const StyledImage = styled(Image);

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <StyledImageBackground
      source={require('../../../assets/images/welcome-bg.jpg')} // You'll need to add this image
      className="flex-1"
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Overlay */}
      <StyledView className="flex-1 bg-black/50">
        {/* Top Logo Area */}
        <StyledView 
          style={{ paddingTop: insets.top + 20 }}
          className="items-center mb-4"
        >
          <MaterialIcons name="eco" size={60} color={colors.primary} />
          <StyledText className="text-3xl font-bold text-white mt-2">EcoGo</StyledText>
          <StyledText className="text-white/80 text-center mt-1 px-12">
            Scan, identify, and learn about nature
          </StyledText>
        </StyledView>

        {/* Illustrations/Features */}
        <StyledView className="flex-1 justify-center px-8">
          <StyledView className="bg-white/10 rounded-2xl p-6 backdrop-blur-md mb-4">
            <StyledView className="flex-row items-center mb-3">
              <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              <StyledText className="text-white font-semibold text-lg ml-2">
                Instant Recognition
              </StyledText>
            </StyledView>
            <StyledText className="text-white/90">
              Take photos of plants and animals to instantly identify them with our AI
            </StyledText>
          </StyledView>

          <StyledView className="bg-white/10 rounded-2xl p-6 backdrop-blur-md mb-4">
            <StyledView className="flex-row items-center mb-3">
              <MaterialIcons name="book" size={24} color={colors.primary} />
              <StyledText className="text-white font-semibold text-lg ml-2">
                Learn More
              </StyledText>
            </StyledView>
            <StyledText className="text-white/90">
              Discover detailed information about species and how to help protect them
            </StyledText>
          </StyledView>

          <StyledView className="bg-white/10 rounded-2xl p-6 backdrop-blur-md">
            <StyledView className="flex-row items-center mb-3">
              <MaterialIcons name="public" size={24} color={colors.primary} />
              <StyledText className="text-white font-semibold text-lg ml-2">
                Contribute
              </StyledText>
            </StyledView>
            <StyledText className="text-white/90">
              Join our community of nature enthusiasts and help map biodiversity
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Bottom Action Buttons */}
        <StyledView 
          className="px-8 mb-8"
          style={{ paddingBottom: insets.bottom ? insets.bottom : 24 }}
        >
          <StyledTouchableOpacity
            className="bg-primary rounded-lg py-4 items-center mb-4"
            onPress={() => router.push('/register')}
          >
            <StyledText className="text-white font-semibold text-lg">
              Create Account
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            className="bg-white/20 rounded-lg py-4 items-center"
            onPress={() => router.push('/login')}
          >
            <StyledText className="text-white font-semibold text-lg">
              Login
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledText className="text-white/60 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledImageBackground>
  );
};

export default WelcomeScreen; 