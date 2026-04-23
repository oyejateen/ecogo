import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { colors } from '../../src/theme/colors';
import { useColorScheme } from '../../src/components/useColorScheme';
import { useClientOnlyValue } from '../../src/components/useClientOnlyValue';

// Custom tab bar icon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={26} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#333' : '#F1F1F1',
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        // Disable the static render of the header on web
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <TabBarIcon name="explore" color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="camera-tab"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Pressable 
              style={{
                backgroundColor: colors.primary,
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <MaterialIcons name="camera-alt" size={28} color="white" />
            </Pressable>
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default behavior
            e.preventDefault();
            // Navigate to the camera screen
            navigation.navigate('camera');
          },
        })}
      />
      
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <TabBarIcon name="photo-library" color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
