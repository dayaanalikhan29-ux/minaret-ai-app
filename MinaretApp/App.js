import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AskAIScreen from './screens/AskAIScreen';
import QuranScreen from './screens/QuranScreen';
import HadithScreen from './screens/HadithScreen';
import PrayerScreen from './screens/PrayerScreen';
import AboutScreen from './screens/AboutScreen';
import HomeScreen from './screens/HomeScreen';
import { View, Text, TouchableOpacity, Animated, Dimensions, StatusBar, StyleSheet, Alert, Platform } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

// Load Google Fonts for web
if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link);
  
  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://fonts.gstatic.com';
  link2.crossOrigin = 'anonymous';
  document.head.appendChild(link2);
  
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2ea',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bismillahBg: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 42, // bigger for visibility
    color: '#b89c3a',
    opacity: 0.32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    zIndex: 0,
  },
  topNav: {
    width: '100%',
    height: 80,
    backgroundColor: '#f5f2ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ece7d8',
    zIndex: 2,
  },
  navLeft: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#181818',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(184, 156, 58, 0.1)',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181818',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height - 112, // Account for top and bottom nav
    zIndex: 1,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginTop: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 7,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#444',
    marginBottom: 21,
    textAlign: 'center',
    fontWeight: '400',
  },
  askAiBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e5ddc7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
    marginTop: 20,
    zIndex: 2,
    overflow: 'hidden',
  },
  askAiBtnTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonContent: {
    alignItems: 'center',
    gap: 12,
  },
  aiText: {
    color: '#181818',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

function MainTabs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#d4af37' : '#bfa14a',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          backgroundColor: isDark ? '#181818' : '#f5f2ea',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333' : '#ece7d8',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Quran') {
            return <MaterialCommunityIcons name="book-open-page-variant" size={size} color={color} />;
          } else if (route.name === 'Hadith') {
            return <MaterialCommunityIcons name="book-variant" size={size} color={color} />;
          } else if (route.name === 'Ask AI') {
            return <Ionicons name="chatbubble-ellipses" size={size} color={color} />;
          } else if (route.name === 'Prayer') {
            return <MaterialCommunityIcons name="mosque" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quran" component={QuranScreen} />
      <Tab.Screen name="Hadith" component={HadithScreen} />
      <Tab.Screen 
        name="Ask AI" 
        component={AskAIScreen} 
        options={{ unmountOnBlur: false }} 
      />
      <Tab.Screen name="Prayer" component={PrayerScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Loading fonts...');
        await Font.loadAsync({
          'Amiri': require('./assets/fonts/Amiri-Regular.ttf'),
          'NotoNaskhArabic': require('./assets/fonts/NotoNaskhArabic-Regular.ttf'),
          'ScheherazadeNew': require('./assets/fonts/ScheherazadeNew-Regular.ttf'),
          'KFGQPCUthmanTahaNaskh': require('./assets/fonts/KFGQPC-Uthman-Taha-Naskh.ttf'),
        });
        console.log('Fonts loaded successfully!');
        console.log('Available fonts:', await Font.loadAsync({}));
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue without custom fonts
      }
    }
    loadFonts();
  }, []);

  console.log('App MOUNT');
  
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f2ea' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
