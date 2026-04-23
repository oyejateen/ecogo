import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Load environment variables
const getEnvVars = () => {
  // For local development with Expo, use process.env
  // For production builds, use Constants.expoConfig?.extra
  return {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || Constants.expoConfig?.extra?.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || Constants.expoConfig?.extra?.FIREBASE_APP_ID,
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY || Constants.expoConfig?.extra?.GOOGLE_CLOUD_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID,
    MONGODB_URI: process.env.MONGODB_URI || Constants.expoConfig?.extra?.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || Constants.expoConfig?.extra?.MONGODB_DB_NAME,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY,
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_NAME || 'EcoGo',
  };
};

export default getEnvVars(); 