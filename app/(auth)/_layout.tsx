import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
} 