import 'dotenv/config';

export default {
  name: process.env.EXPO_PUBLIC_APP_NAME || 'EcoGo',
  slug: 'ecogo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'ecogo',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ecogo.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.ecogo.app',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET'
    ]
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow EcoGo to access your camera to identify and document species.'
      }
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow EcoGo to use your location to enhance your species discovery experience.'
      }
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow EcoGo to access your photos to save your species discoveries.',
        savePhotosPermission: 'Allow EcoGo to save photos of species to your photo library.',
        isAccessMediaLocationEnabled: true
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'EcoGo',
  }
}; 