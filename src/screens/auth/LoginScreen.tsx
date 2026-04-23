import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { 
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { validateEmail } from '../../utils/validation';

// Register for redirect URI
WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

const LoginScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { signIn, signInWithGoogleIdToken } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get Google client ID from environment variables or Config
  const webClientId = Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID;

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    redirectUri: makeRedirectUri({
      scheme: 'ecogo'
    }),
    scopes: ['profile', 'email']
  });

  // Handle Google Sign-In response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const auth = getAuth();

  const handleLogin = async () => {
    // Reset error message
    setErrorMessage('');
    
    // Validate form
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(email, password);
      // Navigation will be handled by auth state listener
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMessage('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed login attempts. Please try again later');
      } else {
        setErrorMessage('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setGoogleLoading(true);
      await signInWithGoogleIdToken(idToken);
      // The navigation will be handled by the auth state change in AuthContext
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignInNative = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Handle Google sign-in with Firebase
      // Implementation will depend on your Firebase setup
    } catch (error) {
      console.error(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setErrorMessage('Google Play Services not available');
      } else {
        setErrorMessage('Something went wrong with Google Sign-In');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <StyledScrollView 
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: insets.bottom || 20
        }}
      >
        {/* Header with back button */}
        <StyledView className="flex-row items-center px-6 py-4">
          <StyledTouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </StyledTouchableOpacity>
        </StyledView>
        
        <StyledView className="flex-1 px-8 pt-4">
          {/* Logo and Title */}
          <StyledView className="items-center mb-8">
            <MaterialIcons name="eco" size={52} color={colors.primary} />
            <StyledText className="text-3xl font-bold text-text mt-2">Login</StyledText>
            <StyledText className="text-text/70 text-center mt-1">
              Welcome back! Sign in to continue
            </StyledText>
          </StyledView>

          {/* Error Message */}
          {errorMessage ? (
            <StyledView className="bg-red-50 p-3 rounded-lg mb-4">
              <StyledText className="text-red-600">{errorMessage}</StyledText>
            </StyledView>
          ) : null}

          {/* Login Form */}
          <StyledView className="mb-6">
            <StyledText className="text-text font-medium mb-1.5">Email</StyledText>
            <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 mb-4">
              <MaterialIcons name="email" size={20} color={colors.text} style={{ opacity: 0.5 }} />
              <StyledTextInput
                className="flex-1 py-3 px-2 text-text"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </StyledView>

            <StyledText className="text-text font-medium mb-1.5">Password</StyledText>
            <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 mb-2">
              <MaterialIcons name="lock" size={20} color={colors.text} style={{ opacity: 0.5 }} />
              <StyledTextInput
                className="flex-1 py-3 px-2 text-text"
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <StyledTouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color={colors.text} 
                  style={{ opacity: 0.5 }}
                />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Forgot Password */}
            <StyledTouchableOpacity 
              className="self-end mb-6"
              onPress={() => router.push('/forgot-password')}
            >
              <StyledText className="text-primary">Forgot Password?</StyledText>
            </StyledTouchableOpacity>

            {/* Login Button */}
            <StyledTouchableOpacity
              className={`bg-primary rounded-lg py-4 items-center ${isLoading ? 'opacity-70' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <StyledText className="text-white font-semibold text-lg">
                  Login
                </StyledText>
              )}
            </StyledTouchableOpacity>
          </StyledView>

          {/* OR Divider */}
          <StyledView className="flex-row items-center mb-6">
            <StyledView className="flex-1 h-px bg-gray-300" />
            <StyledText className="mx-4 text-gray-500">OR</StyledText>
            <StyledView className="flex-1 h-px bg-gray-300" />
          </StyledView>

          {/* Google Sign In */}
          <StyledTouchableOpacity
            className="flex-row justify-center items-center border border-gray-300 rounded-lg py-3 px-4 mb-6"
            onPress={handleGoogleSignInNative}
            disabled={isLoading}
          >
            <StyledImage 
              source={require('../../../assets/images/google.png')} 
              className="w-5 h-5 mr-3"
            />
            <StyledText className="text-text font-medium">
              Continue with Google
            </StyledText>
          </StyledTouchableOpacity>

          {/* Sign Up Link */}
          <StyledView className="flex-row justify-center">
            <StyledText className="text-text/70">
              Don't have an account?{' '}
            </StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/register')}>
              <StyledText className="text-primary font-medium">
                Register
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
};

export default LoginScreen; 