import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { validateEmail } from '../../utils/validation';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleResetPassword = async () => {
    // Reset previous message
    setMessage({ type: '', text: '' });

    // Validate email
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Check your inbox for further instructions.' 
      });
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 flex-1">
        {/* Back button */}
        <TouchableOpacity 
          className="w-10 h-10 rounded-full items-center justify-center mb-4"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</Text>
          <Text className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Email</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-1 text-gray-800"
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Message */}
        {message.text ? (
          <View className={`p-3 rounded-lg mb-6 ${
            message.type === 'error' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <Text className={`${
              message.type === 'error' ? 'text-red-700' : 'text-green-700'
            }`}>
              {message.text}
            </Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          className={`py-4 rounded-lg items-center justify-center ${
            loading ? 'bg-gray-400' : 'bg-green-600'
          }`}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Reset Password</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text className="text-green-600 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen; 