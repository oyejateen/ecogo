import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { Link, useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImageBackground = styled(ImageBackground);

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <StyledView className="flex-1 bg-black">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StyledImageBackground
        source={require('../../assets/images/nature-bg.jpg')}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          className="flex-1 justify-between"
        >
          <StyledView 
            className="flex-1 justify-between p-6"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <StyledView className="items-center mt-24">
              <Animated.View
                style={[
                  {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: 'rgba(31, 180, 76, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <MaterialIcons name="eco" size={60} color="#ffffff" />
              </Animated.View>
              <Animated.Text
                style={[
                  {
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 16,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                EcoGo
              </Animated.Text>
              <Animated.Text
                style={[
                  {
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    maxWidth: width * 0.8,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                Discover the beauty of nature around you
              </Animated.Text>
            </StyledView>

            <Animated.View
              style={[
                {
                  width: '100%',
                  marginBottom: Platform.OS === 'ios' ? 20 : 40,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <StyledTouchableOpacity
                className="bg-primary py-4 rounded-full items-center"
                onPress={() => router.push('/(auth)/login')}
              >
                <StyledText className="text-white text-base font-semibold">
                  Get Started
                </StyledText>
              </StyledTouchableOpacity>

              <StyledView className="flex-row justify-center items-center mt-6">
                <StyledText className="text-white text-sm">
                  Already have an account?
                </StyledText>
                <Link href="/(auth)/login" asChild>
                  <StyledTouchableOpacity className="ml-1">
                    <StyledText className="text-primary text-sm font-semibold">
                      Log In
                    </StyledText>
                  </StyledTouchableOpacity>
                </Link>
              </StyledView>

              <StyledTouchableOpacity
                className="mt-6"
                onPress={() => {/* Open terms and privacy */}}
              >
                <StyledText className="text-white/70 text-xs text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </StyledText>
              </StyledTouchableOpacity>
            </Animated.View>
          </StyledView>
        </LinearGradient>
      </StyledImageBackground>
    </StyledView>
  );
} 