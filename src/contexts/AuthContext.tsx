import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail } from 'firebase/auth';

// Import firebase services
import { auth, signInWithGoogle } from '../services/firebase';

export interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  photoURL: string | null;
  pronouns?: string;
}

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isSignedIn: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasCompletedProfileSetup: boolean;
  setHasCompletedProfileSetup: (value: boolean) => void;
  reloadUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  username: '',
  bio: '',
  photoURL: null,
  pronouns: ''
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedProfileSetup, setHasCompletedProfileSetup] = useState(false);

  // Load profile setup status
  useEffect(() => {
    const loadProfileSetupStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasCompletedProfileSetup');
        if (value !== null) {
          setHasCompletedProfileSetup(value === 'true');
        }
      } catch (error) {
        console.error('Error loading profile setup status:', error);
      }
    };

    loadProfileSetupStatus();
  }, []);

  // Save profile setup status
  useEffect(() => {
    const saveProfileSetupStatus = async () => {
      try {
        await AsyncStorage.setItem('hasCompletedProfileSetup', String(hasCompletedProfileSetup));
      } catch (error) {
        console.error('Error saving profile setup status:', error);
      }
    };

    saveProfileSetupStatus();
  }, [hasCompletedProfileSetup]);

  // Load user profile from AsyncStorage when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          // Try to load profile from AsyncStorage
          const storedProfile = await AsyncStorage.getItem(`userProfile:${user.uid}`);
          
          if (storedProfile) {
            // Parse the stored profile
            const parsedProfile = JSON.parse(storedProfile);
            
            // Create a complete profile with all required fields
            const completeProfile = {
              ...DEFAULT_PROFILE,
              ...parsedProfile,
              displayName: parsedProfile.displayName || user.displayName || '',
              photoURL: parsedProfile.photoURL || user.photoURL,
            };
            
            // Update state with the complete profile
            setUserProfile(completeProfile);
            
            // Also update Firebase profile if needed
            if (user.displayName !== completeProfile.displayName || user.photoURL !== completeProfile.photoURL) {
              await updateProfile(user, {
                displayName: completeProfile.displayName,
                photoURL: completeProfile.photoURL,
              });
            }
          } else {
            // No stored profile, create a default one
            const defaultProfile = {
              ...DEFAULT_PROFILE,
              displayName: user.displayName || '',
              photoURL: user.photoURL,
            };
            
            // Save the default profile to AsyncStorage
            await AsyncStorage.setItem(`userProfile:${user.uid}`, JSON.stringify(defaultProfile));
            
            // Update state with the default profile
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          
          // Fallback to a basic profile if there's an error
          const fallbackProfile = {
            ...DEFAULT_PROFILE,
            displayName: user.displayName || '',
            photoURL: user.photoURL,
          };
          
          setUserProfile(fallbackProfile);
        }
      } else {
        // No user, clear profile
        setUserProfile(null);
      }
    };

    loadUserProfile();
  }, [user]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Reset profile setup flag for new users
      setHasCompletedProfileSetup(false);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogleIdToken = async (idToken: string) => {
    try {
      await signInWithGoogle(idToken);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user is signed in');

    try {
      // Create a complete profile object by merging existing profile with new data
      const updatedProfile = { 
        ...DEFAULT_PROFILE,
        ...userProfile, 
        ...profileData 
      };
      
      // Update Firebase profile if displayName or photoURL is changed
      if (profileData.displayName || profileData.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: profileData.displayName || user.displayName,
          photoURL: profileData.photoURL !== undefined ? profileData.photoURL : user.photoURL,
        });
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(`userProfile:${user.uid}`, JSON.stringify(updatedProfile));
      
      // Update local state
      setUserProfile(updatedProfile as UserProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const reloadUserProfile = async () => {
    if (!user) return;
    
    try {
      // Try to load profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem(`userProfile:${user.uid}`);
      
      if (storedProfile) {
        // Parse the stored profile
        const parsedProfile = JSON.parse(storedProfile);
        
        // Create a complete profile with all required fields
        const completeProfile = {
          ...DEFAULT_PROFILE,
          ...parsedProfile,
          displayName: parsedProfile.displayName || user.displayName || '',
          photoURL: parsedProfile.photoURL || user.photoURL,
        };
        
        // Update state with the complete profile
        setUserProfile(completeProfile);
      } else {
        // No stored profile, create a default one
        const defaultProfile = {
          ...DEFAULT_PROFILE,
          displayName: user.displayName || '',
          photoURL: user.photoURL,
        };
        
        // Save the default profile to AsyncStorage
        await AsyncStorage.setItem(`userProfile:${user.uid}`, JSON.stringify(defaultProfile));
        
        // Update state with the default profile
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error reloading user profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isSignedIn: !!user,
        signUp,
        signIn,
        signInWithGoogleIdToken,
        updateUserProfile,
        logout,
        resetPassword,
        hasCompletedProfileSetup,
        setHasCompletedProfileSetup,
        reloadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 