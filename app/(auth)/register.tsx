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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { styled } from 'nativewind';
import { useAuth } from '../../src/contexts/AuthContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service');
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      // The navigation will be handled by the auth state change in the root layout
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      // The navigation will be handled by the auth state change in the root layout
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <StyledScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 20, 
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
          minHeight: '100%'
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decorative elements - can be custom views with absolute positioning */}
        <StyledView className="absolute top-0 left-0 w-32 h-32 rounded-br-full bg-primary/10" />
        <StyledView className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full bg-primary/20" />
        <StyledView className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full bg-primary/15" />
        
        <StyledView className="flex-row items-center justify-center mb-12">
          <StyledView className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-2">
            <MaterialIcons name="eco" size={24} color={colors.primary} />
          </StyledView>
          <StyledText className="text-3xl font-bold text-primary">EcoGo</StyledText>
        </StyledView>

        <StyledView className="mb-8">
          <StyledView className="flex-row mb-6">
            <Link href="/(auth)/login" asChild>
              <StyledTouchableOpacity 
                className="flex-1 py-2 border-b-2 border-gray-200"
              >
                <StyledText className="text-center text-gray-400">Login</StyledText>
              </StyledTouchableOpacity>
            </Link>
            <StyledTouchableOpacity 
              className="flex-1 py-2 border-b-2 border-primary"
            >
              <StyledText className="text-center text-primary font-semibold">Register</StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledText className="text-gray-700 font-medium mb-1 mt-4">Email Address</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
            <MaterialIcons name="email" size={20} color={colors.textLight} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Your email"
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </StyledView>

          <StyledText className="text-gray-700 font-medium mb-1">Password</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
            <MaterialIcons name="lock" size={20} color={colors.textLight} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Your password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <StyledTouchableOpacity 
              className="p-1"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"}
                size={20} 
                color={colors.textLight} 
              />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledText className="text-gray-700 font-medium mb-1">Confirm Password</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
            <MaterialIcons name="lock" size={20} color={colors.textLight} />
            <StyledTextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Confirm your password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <StyledTouchableOpacity 
              className="p-1"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={20} 
                color={colors.textLight} 
              />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="flex-row items-center mb-6">
            <StyledTouchableOpacity 
              className="w-6 h-6 border border-gray-300 rounded mr-2 items-center justify-center"
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              {agreeTerms && (
                <MaterialIcons name="check" size={16} color={colors.primary} />
              )}
            </StyledTouchableOpacity>
            <StyledText className="text-gray-700 text-sm flex-1">
              I agree to the{' '}
              <StyledText className="text-primary">Terms of Service</StyledText>
              {' '}and{' '}
              <StyledText className="text-primary">Privacy Policy</StyledText>
            </StyledText>
          </StyledView>

          <StyledTouchableOpacity
            className="bg-primary py-3 rounded-lg mb-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <StyledText className="text-white text-center font-semibold">Create Account</StyledText>
            )}
          </StyledTouchableOpacity>

          <StyledView className="flex-row items-center mb-4">
            <StyledView className="flex-1 h-px bg-gray-300" />
            <StyledText className="mx-4 text-gray-500 text-sm">OR</StyledText>
            <StyledView className="flex-1 h-px bg-gray-300" />
          </StyledView>

          <StyledTouchableOpacity
            className="bg-white border border-gray-300 py-3 rounded-lg flex-row justify-center items-center"
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <>
                <StyledView className="mr-2">
                  <MaterialIcons name="login" size={20} color={colors.textDark} />
                </StyledView>
                <StyledText className="text-gray-800 font-medium">Continue with Google</StyledText>
              </>
            )}
          </StyledTouchableOpacity>
        </StyledView>

        <StyledView className="mt-auto">
          <StyledView className="flex-row justify-center">
            <StyledText className="text-gray-600">Already have an account? </StyledText>
            <Link href="/(auth)/login" asChild>
              <StyledTouchableOpacity>
                <StyledText className="text-primary font-semibold">Login</StyledText>
              </StyledTouchableOpacity>
            </Link>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
} 