import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { useAuth } from '../src/contexts/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { logout, userProfile } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    profilePrivate: false,
    hideLocation: true
  });
  
  // Set initial active section from route params if available
  useEffect(() => {
    if (params.section) {
      setActiveSection(params.section as string);
    }
  }, [params.section]);

  // Load privacy settings and terms acceptance status
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        // Load terms status
        const acceptedStatus = await AsyncStorage.getItem('terms_accepted');
        if (acceptedStatus !== null) {
          setTermsAccepted(acceptedStatus === 'true');
        }
        
        // Load privacy settings
        const privacyData = await AsyncStorage.getItem('privacy_settings');
        if (privacyData) {
          setPrivacySettings(JSON.parse(privacyData));
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    
    loadUserSettings();
  }, []);

  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem('terms_accepted', 'true');
      setTermsAccepted(true);
      
      // Show confirmation and close the section
      Alert.alert(
        'Terms Accepted',
        'Thank you for accepting the Terms of Service.',
        [{ text: 'OK', onPress: () => setActiveSection(null) }]
      );
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
      Alert.alert('Error', 'Could not save your preferences. Please try again.');
    }
  };

  const togglePrivacySetting = async (setting: keyof typeof privacySettings) => {
    try {
      const updatedSettings = {
        ...privacySettings,
        [setting]: !privacySettings[setting]
      };
      
      await AsyncStorage.setItem('privacy_settings', JSON.stringify(updatedSettings));
      setPrivacySettings(updatedSettings);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      Alert.alert('Error', 'Could not save your preferences. Please try again.');
    }
  };

  // Define the sections and their content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'privacy':
        return (
          <View className="p-4">
            <Text className="text-white text-xl font-bold mb-1">Privacy Settings</Text>
            <Text className="text-gray-400 mb-6">
              Control your privacy settings and manage who can see your content.
            </Text>
            
            <View className="mb-6">
              <Text className="text-white font-bold mb-4">Profile Privacy</Text>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
                onPress={() => togglePrivacySetting('profilePrivate')}
              >
                <Text className="text-white">Make profile private</Text>
                <MaterialIcons 
                  name={privacySettings.profilePrivate ? "toggle-on" : "toggle-off"} 
                  size={24} 
                  color={privacySettings.profilePrivate ? colors.primary : "rgba(255,255,255,0.7)"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
                onPress={() => togglePrivacySetting('hideLocation')}
              >
                <Text className="text-white">Hide location data</Text>
                <MaterialIcons 
                  name={privacySettings.hideLocation ? "toggle-on" : "toggle-off"} 
                  size={24} 
                  color={privacySettings.hideLocation ? colors.primary : "rgba(255,255,255,0.7)"} 
                />
              </TouchableOpacity>
            </View>
            
            <View className="mb-6">
              <Text className="text-white font-bold mb-4">Data Usage</Text>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
                onPress={() => {
                  Alert.alert('Data Management', 'This would open data management settings');
                }}
              >
                <Text className="text-white">Manage data</Text>
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color="rgba(255,255,255,0.5)" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
                onPress={() => {
                  Alert.alert('Download Data', 'This would start downloading your data');
                }}
              >
                <Text className="text-white">Download your data</Text>
                <MaterialIcons 
                  name="chevron-right" 
                  size={24} 
                  color="rgba(255,255,255,0.5)" 
                />
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'help':
        return (
          <View className="p-4">
            <Text className="text-white text-xl font-bold mb-1">Help & Support</Text>
            <Text className="text-gray-400 mb-6">
              Get help with EcoGo and connect with our support team.
            </Text>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => {
                Alert.alert('FAQs', 'This would open the FAQ page');
              }}
            >
              <View className="w-10 h-10 rounded-full bg-emerald-800 items-center justify-center mr-3">
                <MaterialIcons name="help-outline" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Frequently Asked Questions</Text>
                <Text className="text-gray-400">Find answers to common questions</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => {
                Alert.alert('Contact Support', 'This would open contact options');
              }}
            >
              <View className="w-10 h-10 rounded-full bg-blue-800 items-center justify-center mr-3">
                <MaterialIcons name="contact-support" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Contact Support</Text>
                <Text className="text-gray-400">Get in touch with our support team</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => {
                Alert.alert('Report Bug', 'This would open the bug reporting form');
              }}
            >
              <View className="w-10 h-10 rounded-full bg-red-800 items-center justify-center mr-3">
                <MaterialIcons name="bug-report" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Report a Bug</Text>
                <Text className="text-gray-400">Help us improve by reporting issues</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => {
                Alert.alert('Feature Request', 'This would open the feature request form');
              }}
            >
              <View className="w-10 h-10 rounded-full bg-yellow-800 items-center justify-center mr-3">
                <MaterialIcons name="lightbulb" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Suggest a Feature</Text>
                <Text className="text-gray-400">Share your ideas for improving EcoGo</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>
        );
        
      case 'about':
        return (
          <View className="p-4">
            <Text className="text-white text-xl font-bold mb-1">About EcoGo</Text>
            <Text className="text-gray-400 mb-6">
              Learn about the app, our mission, and our team.
            </Text>
            
            <View className="bg-gray-800 p-4 rounded-xl mb-6">
              <Text className="text-white font-bold mb-2">App Version</Text>
              <Text className="text-gray-400">1.0.0</Text>
            </View>
            
            <View className="bg-gray-800 p-4 rounded-xl mb-6">
              <Text className="text-white font-bold mb-2">Our Mission</Text>
              <Text className="text-gray-400">
                EcoGo aims to connect people with nature through technology, 
                encouraging exploration, discovery, and conservation of the natural world.
                By identifying and documenting species, users contribute to a collective 
                knowledge base and develop a deeper appreciation for biodiversity.
              </Text>
            </View>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
              onPress={() => {
                Alert.alert('Terms of Service', 'This would open the terms of service');
              }}
            >
              <Text className="text-white">Terms of Service</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
              onPress={() => {
                Alert.alert('Privacy Policy', 'This would open the privacy policy');
              }}
            >
              <Text className="text-white">Privacy Policy</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
              onPress={() => {
                Alert.alert('Open Source Licenses', 'This would open the licenses info');
              }}
            >
              <Text className="text-white">Open Source Licenses</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
          </View>
        );
        
      case 'account':
        return (
          <View className="p-4">
            <Text className="text-white text-xl font-bold mb-1">Account Settings</Text>
            <Text className="text-gray-400 mb-6">
              Manage your account, data, and connected services.
            </Text>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
              onPress={() => router.push('/change-password')}
            >
              <Text className="text-white">Change Password</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3"
              onPress={() => {
                Alert.alert('Email Preferences', 'This would open email settings');
              }}
            >
              <Text className="text-white">Email Preferences</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-6"
              onPress={() => {
                Alert.alert('Connected Accounts', 'This would show connected social accounts');
              }}
            >
              <Text className="text-white">Connected Accounts</Text>
              <MaterialIcons 
                name="chevron-right" 
                size={24} 
                color="rgba(255,255,255,0.5)" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-red-900 p-4 rounded-xl mb-3 items-center"
              onPress={() => handleLogout()}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-bold">Log Out</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-800 p-4 rounded-xl mb-3 items-center"
              onPress={() => handleDeleteAccount()}
              disabled={deleteAccountLoading}
            >
              {deleteAccountLoading ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <Text className="text-red-500">Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>
        );
        
      default:
        return (
          <View className="p-4">
            <View className="items-center justify-center py-6">
              <View className="w-20 h-20 rounded-full bg-emerald-800 items-center justify-center mb-3">
                <MaterialIcons name="settings" size={36} color="#fff" />
              </View>
              <Text className="text-white text-xl font-bold mb-1">Settings</Text>
              <Text className="text-gray-400 text-center mb-8">
                Customize your EcoGo experience to suit your preferences
              </Text>
            </View>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => setActiveSection('account')}
            >
              <View className="w-10 h-10 rounded-full bg-blue-800 items-center justify-center mr-3">
                <MaterialIcons name="account-circle" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Account</Text>
                <Text className="text-gray-400">Manage your account settings</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => setActiveSection('privacy')}
            >
              <View className="w-10 h-10 rounded-full bg-emerald-800 items-center justify-center mr-3">
                <MaterialIcons name="privacy-tip" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Privacy</Text>
                <Text className="text-gray-400">Control your privacy settings</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => setActiveSection('help')}
            >
              <View className="w-10 h-10 rounded-full bg-purple-800 items-center justify-center mr-3">
                <MaterialIcons name="help" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">Help & Support</Text>
                <Text className="text-gray-400">Get help and contact support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row bg-gray-800 p-4 rounded-xl mb-4"
              onPress={() => setActiveSection('about')}
            >
              <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center mr-3">
                <MaterialIcons name="info" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1">About</Text>
                <Text className="text-gray-400">About EcoGo and our mission</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>
        );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLogoutLoading(true);
              await logout();
              // Navigation will be handled by auth state change
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setLogoutLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'All your data will be permanently removed. Are you absolutely sure?',
              [
                { text: 'No, Keep My Account', style: 'cancel' },
                { 
                  text: 'Yes, Delete Everything', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setDeleteAccountLoading(true);
                      // This would call a function to delete the account
                      // For now, just show an alert
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      Alert.alert(
                        'Account Scheduled for Deletion',
                        'Your account and all associated data will be deleted soon.'
                      );
                      await logout();
                    } catch (error) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    } finally {
                      setDeleteAccountLoading(false);
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => {
            if (activeSection === null) {
              router.back();
            } else {
              setActiveSection(null);
            }
          }}
        >
          <MaterialIcons 
            name={activeSection === null ? "arrow-back" : "arrow-back"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">
          {activeSection === null 
            ? 'Settings' 
            : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
          }
        </Text>
        <View style={{ width: 24 }} /> {/* Empty view for centering */}
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1">
        {renderSectionContent()}
      </ScrollView>
    </SafeAreaView>
  );
} 