import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar, StyleSheet, Alert, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.02, 1],
  });

  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181818' : '#f5f2ea' }]}> 
      {/* Background with overlay */}
      <View style={[styles.backgroundOverlay, { backgroundColor: isDark ? 'rgba(24,24,24,0.95)' : 'rgba(255,255,255,0.9)' }]} />
      {/* Faint Bismillah Calligraphy */}
      <Text style={[styles.bismillahBg, { color: isDark ? '#FFD700' : '#b89c3a', opacity: isDark ? 0.18 : 0.32 }]}
        aria-hidden="true">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </Text>
      {/* Top Navigation Bar */}
      <View style={[styles.topNav, { backgroundColor: isDark ? '#181818' : '#f5f2ea', borderBottomColor: isDark ? '#333' : '#ece7d8' }]}> 
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', letterSpacing: 0.4, color: isDark ? '#d4af37' : '#181818', marginRight: 10 }}>MINARET</Text>
          <Ionicons name="ios-business" size={32} color={isDark ? '#FFD700' : '#bfa14a'} />
          <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 12 }}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={28} color={isDark ? '#FFD700' : '#222'} />
          </TouchableOpacity>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              Alert.alert(
                'Coming Soon! 🚀',
                'Advanced chat features are being developed. Stay tuned for more exciting features!',
                [ { text: 'OK', style: 'default' } ]
              );
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color={isDark ? '#FFD700' : '#181818'} />
            <Text style={[styles.navButtonText, { color: isDark ? '#FFD700' : '#181818' }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation && navigation.navigate ? navigation.navigate('About') : null}
          >
            <Ionicons name="information-circle" size={20} color={isDark ? '#FFD700' : '#181818'} />
            <Text style={[styles.navButtonText, { color: isDark ? '#FFD700' : '#181818' }]}>About</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Main Hero Section */}
      <View style={styles.main}>
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: isDark ? '#FFD700' : '#181818' }]}>Get Closer to Islam</Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? '#ccc' : '#444' }]}>Ask Your Questions — AI-Powered Answers</Text>
          <Animated.View 
            style={[
              styles.askAiBtn,
              {
                backgroundColor: isDark ? '#232323' : '#e5ddc7',
                shadowColor: isDark ? '#FFD700' : '#000',
                transform: [ { translateY }, { scale } ]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.askAiBtnTouchable}
              onPress={() => navigation && navigation.navigate ? navigation.navigate('Ask AI') : null}
            >
              <View style={styles.aiButtonContent}>
                <Text style={[styles.aiText, { color: isDark ? '#FFD700' : '#181818' }]}>Ask AI</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bismillahBg: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    zIndex: 0,
  },
  topNav: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    zIndex: 2,
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
    marginLeft: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height - 112,
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
    marginBottom: 7,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  heroSubtitle: {
    fontSize: 20,
    marginBottom: 21,
    textAlign: 'center',
    fontWeight: '400',
  },
  askAiBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowOffset: { width: 0, height: 8 },
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
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

export default HomeScreen; 