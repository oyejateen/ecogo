import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StatusBar,
  ScrollView,
} from 'react-native';
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

// Register for redirect URI
WebBrowser.maybeCompleteAuthSession();

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const { signUp, signInWithGoogleIdToken } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      // The navigation will be handled by the auth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setGoogleLoading(true);
      await signInWithGoogleIdToken(idToken);
      // The navigation will be handled by the auth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <StyledScrollView 
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Area */}
        <StyledView className="items-center mb-8 mt-6">
          <MaterialIcons name="eco" size={48} color={colors.primary} />
          <StyledText className="text-2xl font-bold text-gray-900 mt-2">EcoGo</StyledText>
        </StyledView>

        {/* Form Container */}
        <StyledView className="bg-white rounded-xl p-6 shadow-md">
          {/* Tabs */}
          <StyledView className="flex-row mb-6 border-b border-gray-200">
            <StyledTouchableOpacity 
              className="pb-3 px-4"
              onPress={() => router.push('/login')}
            >
              <StyledText className="text-gray-500">Login</StyledText>
            </StyledTouchableOpacity>
            
            <StyledTouchableOpacity className="pb-3 px-4 border-b-2 border-primary">
              <StyledText className="text-primary font-semibold">Register</StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Email Field */}
          <StyledText className="text-gray-700 mb-2 font-medium">Email Address</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
            <MaterialIcons name="email" size={22} color={colors.textSecondary} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Your email"
              placeholderTextColor={colors.neutral[400]}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </StyledView>

          {/* Password Field */}
          <StyledText className="text-gray-700 mb-2 font-medium">Password</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
            <MaterialIcons name="lock" size={22} color={colors.textSecondary} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Create password"
              placeholderTextColor={colors.neutral[400]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <StyledTouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"}
                size={22} 
                color={colors.textSecondary} 
              />
            </StyledTouchableOpacity>
          </StyledView>

          {/* Confirm Password Field */}
          <StyledText className="text-gray-700 mb-2 font-medium">Confirm Password</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-6">
            <MaterialIcons name="lock" size={22} color={colors.textSecondary} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Confirm password"
              placeholderTextColor={colors.neutral[400]}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <StyledTouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22} 
                color={colors.textSecondary} 
              />
            </StyledTouchableOpacity>
          </StyledView>

          {/* Register Button */}
          <StyledTouchableOpacity
            className={`rounded-lg py-3 items-center justify-center ${loading ? 'bg-primary/70' : 'bg-primary'}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <StyledText className="text-white font-semibold">Create Account</StyledText>
            )}
          </StyledTouchableOpacity>

          {/* Divider */}
          <StyledView className="flex-row items-center my-6">
            <StyledView className="flex-1 h-px bg-gray-200" />
            <StyledText className="mx-4 text-gray-500 text-sm">OR</StyledText>
            <StyledView className="flex-1 h-px bg-gray-200" />
          </StyledView>

          {/* Google Button */}
          <StyledTouchableOpacity
            className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3 px-4"
            onPress={() => promptAsync()}
            disabled={googleLoading || !request}
          >
            {googleLoading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <>
                <MaterialIcons name="email" size={20} color="#000" />
                <StyledText className="ml-2 text-gray-800 font-medium">Continue with Google</StyledText>
              </>
            )}
          </StyledTouchableOpacity>

          {/* Terms */}
          <StyledText className="text-gray-500 text-xs text-center mt-6">
            By registering, you agree to our Terms of Service and Privacy Policy
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
};

export default RegisterScreen; 