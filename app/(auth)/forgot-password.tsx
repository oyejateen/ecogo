import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useAuth } from '../../src/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email address',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
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
        {/* Decorative elements */}
        <StyledView className="absolute top-0 left-0 w-32 h-32 rounded-br-full bg-primary/10" />
        <StyledView className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full bg-primary/20" />
        
        <StyledTouchableOpacity 
          className="p-2 mb-6 self-start"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.textDark} />
        </StyledTouchableOpacity>

        <StyledView className="mb-8">
          <StyledText className="text-2xl font-bold text-gray-800 mb-2">Reset Password</StyledText>
          <StyledText className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password
          </StyledText>

          <StyledText className="text-gray-700 font-medium mb-1 mt-4">Email Address</StyledText>
          <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-6">
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

          <StyledTouchableOpacity
            className="bg-primary py-3 rounded-lg mb-4"
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <StyledText className="text-white text-center font-semibold">Send Reset Link</StyledText>
            )}
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledKeyboardAvoidingView>
  );
} 