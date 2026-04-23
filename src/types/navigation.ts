/**
 * Navigation types for the EcoGo app
 */

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
  Permissions: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Camera: undefined;
  Library: { refresh?: boolean };
  Profile: { userId?: string };
  Settings: undefined;
  ImageDetail: { imageId: string; discovery?: any };
  ImagePreview: { uri: string; location?: any };
  AIReview: { uri: string; location?: any };
  ProfileEdit: undefined;
  Activities: undefined;
}; 