import Constants from 'expo-constants';

// Config interface
interface AppConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  google: {
    cloudApiKey: string;
    clientId: string;
    mapsApiKey: string;
  };
  mongodb: {
    uri: string;
    dbName: string;
  };
  app: {
    name: string;
  };
}

// Get environment variables
const getConfig = (): AppConfig => {
  // Use Expo Constants to access environment variables defined in app.config.js
  const extraConfig = Constants.expoConfig?.extra || {};

  return {
    firebase: {
      apiKey: extraConfig.FIREBASE_API_KEY || '',
      authDomain: extraConfig.FIREBASE_AUTH_DOMAIN || '',
      projectId: extraConfig.FIREBASE_PROJECT_ID || '',
      storageBucket: extraConfig.FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: extraConfig.FIREBASE_MESSAGING_SENDER_ID || '',
      appId: extraConfig.FIREBASE_APP_ID || '',
    },
    google: {
      cloudApiKey: extraConfig.GOOGLE_CLOUD_API_KEY || '',
      clientId: extraConfig.GOOGLE_CLIENT_ID || '',
      mapsApiKey: extraConfig.GOOGLE_MAPS_API_KEY || '',
    },
    mongodb: {
      uri: extraConfig.MONGODB_URI || '',
      dbName: extraConfig.MONGODB_DB_NAME || '',
    },
    app: {
      name: extraConfig.EXPO_PUBLIC_APP_NAME || 'EcoGo',
    },
  };
};

export default getConfig(); 