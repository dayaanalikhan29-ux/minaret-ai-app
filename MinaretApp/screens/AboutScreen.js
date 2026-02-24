import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

export default function AboutScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const darkStyles = {
    backgroundColor: '#181818',
    card: '#232323',
    text: '#fff',
    accent: '#d4af37',
    border: '#333',
    // ... add more as needed
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f2ea' }}>
      {/* Web-only: Add custom scrollbar style */}
      {Platform.OS === 'web' && (
        <style>{`
          #about-web-scroll::-webkit-scrollbar {
            width: 12px;
            background: #ece7d8;
          }
          #about-web-scroll::-webkit-scrollbar-thumb {
            background: #bfa14a;
            border-radius: 8px;
          }
          #about-web-scroll {
            scrollbar-width: thin;
            scrollbar-color: #bfa14a #ece7d8;
            height: 100vh;
            overflow-y: auto;
          }
        `}</style>
      )}
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Close About"
      >
        <Ionicons name="close" size={32} color="#bfa14a" />
      </TouchableOpacity>
      <ScrollView
        style={Platform.OS === 'web' ? styles.webScroll : styles.container}
        contentContainerStyle={styles.content}
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={true}
        {...(Platform.OS === 'web' ? { nativeID: 'about-web-scroll' } : {})}
      >
        <View style={styles.headerSection}>
          <MaterialCommunityIcons name="mosque" size={48} color="#14b8a6" style={styles.headerIcon} />
          <Text style={styles.title}>About Minaret App</Text>
          <Text style={styles.subtitle}>
            Your modern, all-in-one Islamic companion—thoughtfully crafted to bring the beauty, knowledge, and spirituality of Islam to your daily life, wherever you are.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ What Makes Minaret App Special?</Text>
          <View style={styles.bulletRow}><Ionicons name="book" size={22} color="#bfa14a" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Quran Explorer:</Text> Immerse yourself in the Holy Quran with elegant typography, translation, and intuitive navigation.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="book-variant" size={22} color="#bfa14a" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>14,000+ Authentic Hadiths:</Text> Instantly access a vast collection of Sahih hadiths, organized by topic and source, with powerful search and filtering.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="clock-outline" size={22} color="#bfa14a" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Prayer Times & Tools:</Text> Get accurate, location-based prayer times, a stunning countdown to the next prayer, and interactive features like alarms, special prayers, and step-by-step guides for Wudu and Salah.</Text></View>
          <View style={styles.bulletRow}><Ionicons name="chatbubble-ellipses" size={22} color="#bfa14a" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>AI Islamic Assistant:</Text> Ask any question about Islam and receive instant, trustworthy answers powered by advanced AI, trained on authentic sources.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="palette" size={22} color="#bfa14a" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Seamless, Modern Design:</Text> Enjoy a visually rich, responsive interface with light and dark themes, beautiful icons, and smooth, intuitive navigation.</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕌 Why Choose Minaret App?</Text>
          <View style={styles.bulletRow}><Ionicons name="apps" size={22} color="#14b8a6" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Comprehensive:</Text> Everything you need—Quran, Hadith, Prayer, and AI—unified in one elegant app.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="shield-check" size={22} color="#14b8a6" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Authentic & Trustworthy:</Text> All content is sourced from reliable, scholarly Islamic references.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="account-heart" size={22} color="#14b8a6" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>User-Focused:</Text> Designed for clarity, speed, and beauty—making spiritual connection easy for everyone, from beginners to advanced.</Text></View>
          <View style={styles.bulletRow}><MaterialCommunityIcons name="update" size={22} color="#14b8a6" style={styles.bulletIcon} /><Text style={styles.bulletText}><Text style={styles.bold}>Always Evolving:</Text> Built with love and feedback from the community, Minaret App is always growing to serve you better.</Text></View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerQuote}>
            <Text style={styles.bold}>Minaret App</Text>: Your daily source of guidance, knowledge, and spiritual connection.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f2ea',
  },
  webScroll: {
    backgroundColor: '#f5f2ea',
    height: '100vh',
    overflowY: 'auto',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 24 : 44,
    right: 24,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 6,
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#14b8a6',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#bfa14a',
    marginBottom: 18,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#181818',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#14b8a6',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  footerQuote: {
    fontSize: 16,
    color: '#bfa14a',
    fontWeight: '700',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 