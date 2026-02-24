import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function HadithScreen() {
  // Add error boundary
  try {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' or 'hadiths'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHadiths, setFilteredHadiths] = useState([]);
  const [showArabic, setShowArabic] = useState(true);
  const [hadiths, setHadiths] = useState([]);
  const [displayedHadiths, setDisplayedHadiths] = useState([]);
  const [hadithsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [surpriseHadith, setSurpriseHadith] = useState(null);
  
  const flatListRef = useRef(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const darkStyles = {
    backgroundColor: '#0c0c0c',
    card: 'rgba(26,26,26,0.8)',
    text: '#fff',
    secondary: '#cccccc',
    gold: '#d4af37',
    bronze: '#a6782e',
    border: 'rgba(255,255,255,0.1)',
    accent: '#d4af37',
    cardBorder: 'rgba(255,255,255,0.08)',
    inputBg: '#181818',
    inputBorder: '#333',
    inputText: '#fff',
    placeholder: '#888',
    badgeBg: 'rgba(212,175,55,0.12)',
    badgeText: '#d4af37',
    buttonBg: '#d4af37',
    buttonText: '#181818',
    shadow: '#000',
  };

  // Category definitions with keywords (from original web app)
  const categoryKeywords = {
    'Prayer': ['prayer', 'salah', 'namaz', 'worship', 'adhan', 'iqama', 'rakat'],
    'Honesty': ['honest', 'truth', 'trust', 'sincere', 'faithful', 'integrity'],
    'Jannah': ['paradise', 'jannah', 'heaven', 'reward', 'garden', 'eternal'],
    'Knowledge': ['knowledge', 'learn', 'study', 'education', 'wisdom', 'ilm'],
    'Charity': ['charity', 'sadaqah', 'zakat', 'give', 'help', 'generous'],
    'Family': ['family', 'marriage', 'wife', 'husband', 'children', 'parents'],
    'Patience': ['patience', 'endure', 'persevere', 'sabr', 'resilient', 'steadfast'],
    'Forgiveness': ['forgive', 'mercy', 'compassion', 'pardon', 'kindness', 'gentle'],
    'Dua': ['dua', 'supplication', 'pray', 'ask', 'invoke', 'seek'],
    'Good Character': ['character', 'manners', 'etiquette', 'good', 'virtue', 'morals'],
    'Repentance': ['repent', 'forgiveness', 'tawbah', 'sin', 'mistake', 'regret'],
    'Brotherhood': ['brother', 'unity', 'community', 'together', 'united', 'solidarity'],
    'General': []
  };

  const categories = [
    {
      id: 'All Hadiths',
      name: 'All Hadiths',
      icon: '🌟',
      description: 'Browse all 14,552 hadiths without category filtering',
      color: '#bfa14a'
    },
    {
      id: 'Prayer',
      name: 'Prayer',
      icon: '🕌',
      description: 'Hadiths about salah, prayer times, and worship',
      color: '#4caf50'
    },
    {
      id: 'Honesty',
      name: 'Honesty & Truthfulness',
      icon: '🤝',
      description: 'Hadiths about honesty, truthfulness, and trustworthiness',
      color: '#8bc34a'
    },
    {
      id: 'Jannah',
      name: 'Paradise (Jannah)',
      icon: '🌺',
      description: 'Hadiths about the rewards of Paradise and its descriptions',
      color: '#e91e63'
    },
    {
      id: 'Knowledge',
      name: 'Knowledge & Learning',
      icon: '📚',
      description: 'Hadiths about seeking knowledge and education',
      color: '#2196f3'
    },
    {
      id: 'Charity',
      name: 'Charity & Generosity',
      icon: '💰',
      description: 'Hadiths about giving charity and helping others',
      color: '#ff9800'
    },
    {
      id: 'Family',
      name: 'Family & Relationships',
      icon: '👨‍👩‍👧‍👦',
      description: 'Hadiths about family, marriage, and relationships',
      color: '#9c27b0'
    },
    {
      id: 'Patience',
      name: 'Patience & Perseverance',
      icon: '⏳',
      description: 'Hadiths about patience, endurance, and resilience',
      color: '#607d8b'
    },
    {
      id: 'Forgiveness',
      name: 'Forgiveness & Mercy',
      icon: '🤲',
      description: 'Hadiths about forgiveness, mercy, and compassion',
      color: '#4caf50'
    },
    {
      id: 'Dua',
      name: 'Supplication (Dua)',
      icon: '🙏',
      description: 'Hadiths about making dua and seeking Allah\'s help',
      color: '#795548'
    },
    {
      id: 'Good Character',
      name: 'Good Character & Manners',
      icon: '✨',
      description: 'Hadiths about good character, manners, and etiquette',
      color: '#00bcd4'
    },
    {
      id: 'Repentance',
      name: 'Repentance & Seeking Forgiveness',
      icon: '🔄',
      description: 'Hadiths about repentance and seeking Allah\'s forgiveness',
      color: '#f44336'
    },
    {
      id: 'Brotherhood',
      name: 'Brotherhood & Unity',
      icon: '🤝',
      description: 'Hadiths about brotherhood, unity, and community',
      color: '#3f51b5'
    },
    {
      id: 'General',
      name: 'General Hadiths',
      icon: '📖',
      description: 'All other hadiths that don\'t fit specific categories',
      color: '#9e9e9e'
    }
  ];

  // Load actual hadiths from your complete database
  const [actualHadiths, setActualHadiths] = useState([]);
  
  // Sample hadiths as fallback
  const sampleHadiths = [
    {
      id: 1,
      title: "The Five Pillars of Islam",
      narrator: "Abu Huraira",
      arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَصَوْمِ رَمَضَانَ، وَحَجِّ البَيْتِ",
      english: "The Prophet (ﷺ) said: 'Islam is built upon five (pillars): testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakah, fasting in Ramadan, and performing Hajj to the House.'",
      category: "Prayer",
      source: "Sahih Bukhari",
      reference: "Sahih Bukhari 8",
      grade: "Sahih"
    },
    {
      id: 2,
      title: "The Best of Deeds",
      narrator: "Abu Huraira",
      arabic: "سُئِلَ النَّبِيُّ ﷺ: أَيُّ العَمَلِ أَفْضَلُ؟ قَالَ: إِيمَانٌ بِاللَّهِ وَرَسُولِهِ. قِيلَ: ثُمَّ مَاذَا؟ قَالَ: جِهَادٌ فِي سَبِيلِ اللَّهِ. قِيلَ: ثُمَّ مَاذَا؟ قَالَ: حَجٌّ مَبْرُورٌ",
      english: "The Prophet (ﷺ) was asked: 'Which deed is the best?' He said: 'Faith in Allah and His Messenger.' He was asked: 'Then what?' He said: 'Jihad in the cause of Allah.' He was asked: 'Then what?' He said: 'An accepted Hajj.'",
      category: "Knowledge",
      source: "Sahih Bukhari",
      reference: "Sahih Bukhari 26",
      grade: "Sahih"
    }
  ];

  useEffect(() => {
    // Load actual hadith data
    const loadHadiths = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting to load hadiths...');
        
        // Try to load actual hadith data from the JSON file
        let hadithData;
        try {
          hadithData = require('../assets/hadiths.json');
          console.log('📚 Successfully loaded hadith data:', {
            totalHadiths: hadithData.length,
            sampleHadith: hadithData[0]
          });
        } catch (requireError) {
          console.error('❌ Error requiring hadiths.json:', requireError);
          throw requireError;
        }
        
        // Transform the data to match our expected format
        console.log('🔄 Transforming hadith data...');
        const transformedHadiths = hadithData.map((hadith, index) => ({
          id: index + 1,
          title: hadith.reference || `Hadith ${index + 1}`,
          narrator: hadith.english.split('Narrated ')[1]?.split(':')[0] || 'Unknown',
          arabic: hadith.arabic,
          english: hadith.english,
          category: hadith.categories?.[0] || 'General',
          source: hadith.source || 'Unknown',
          reference: hadith.reference || `Hadith ${index + 1}`,
          grade: 'Sahih', // Default grade
          categories: hadith.categories || []
        }));
        
        console.log('🔄 Categorizing hadiths...');
        // Categorize the hadiths using the keyword-based categorization
        const categorizedHadiths = categorizeHadiths(transformedHadiths);
        
        setActualHadiths(hadithData);
        setHadiths(categorizedHadiths);
        setFilteredHadiths(categorizedHadiths);
        
        // Extract unique categories for filter
        const allCategories = categorizedHadiths.flatMap(h => h.categories || [h.category]).filter(Boolean);
        const uniqueCategories = [...new Set(allCategories)];
        console.log('📂 Available categories:', uniqueCategories.length);
        console.log('📂 Sample categories:', uniqueCategories.slice(0, 10));
        
        // Debug category counts
        categories.forEach(cat => {
          const count = categorizedHadiths.filter(h => 
            h.category === cat.id || 
            (h.categories && h.categories.some(c => c === cat.id))
          ).length;
          console.log(`📊 ${cat.name}: ${count} hadiths`);
        });
        
        console.log('✅ Hadiths loaded successfully!');
        
      } catch (error) {
        console.error('❌ Error loading hadiths:', error);
        console.log('🔄 Falling back to sample data...');
        // Fallback to sample data if loading fails
        setHadiths(sampleHadiths);
        setFilteredHadiths(sampleHadiths);
      } finally {
        setLoading(false);
        console.log('🏁 Loading completed');
      }
    };
    
    loadHadiths();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      if (selectedCategory.id === 'All Hadiths') {
        // Show all hadiths without filtering
        setFilteredHadiths(hadiths);
        setDisplayedHadiths(hadiths.slice(0, hadithsPerPage));
      } else if (selectedCategory.id === 'Surprise') {
        // Show only the surprise hadith
        setFilteredHadiths(surpriseHadith ? [surpriseHadith] : []);
        setDisplayedHadiths(surpriseHadith ? [surpriseHadith] : []);
      } else {
        // Filter by specific category
        const filtered = hadiths.filter(hadith => 
          hadith.category === selectedCategory.id ||
          (hadith.categories && hadith.categories.some(cat => cat === selectedCategory.id))
        );
        setFilteredHadiths(filtered);
        setDisplayedHadiths(filtered.slice(0, hadithsPerPage));
      }
      setCurrentPage(1);
    }
  }, [selectedCategory, hadiths, surpriseHadith]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('hadiths');
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setCurrentView('welcome');
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleSurpriseMe = () => {
    if (hadiths && hadiths.length > 0) {
      // Get a random hadith that's different from the current one
      let randomHadith;
      do {
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        randomHadith = hadiths[randomIndex];
      } while (surpriseHadith && randomHadith.id === surpriseHadith.id && hadiths.length > 1);
      
      setSurpriseHadith(randomHadith);
      setSelectedCategory({ id: 'Surprise', name: 'Surprise Hadith' });
      setCurrentView('hadiths');
      setSearchQuery('');
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim()) {
      const filtered = hadiths.filter(hadith => 
        hadith.title.toLowerCase().includes(text.toLowerCase()) ||
        hadith.english.toLowerCase().includes(text.toLowerCase()) ||
        hadith.narrator.toLowerCase().includes(text.toLowerCase()) ||
        hadith.reference.toLowerCase().includes(text.toLowerCase()) ||
        (hadith.categories && hadith.categories.some(cat => cat.toLowerCase().includes(text.toLowerCase())))
      );
      setFilteredHadiths(filtered);
      setDisplayedHadiths(filtered.slice(0, hadithsPerPage));
    } else {
      if (selectedCategory && selectedCategory.id === 'All Hadiths') {
        // Show all hadiths when "All Hadiths" is selected and no search query
        setFilteredHadiths(hadiths);
        setDisplayedHadiths(hadiths.slice(0, hadithsPerPage));
      } else if (selectedCategory) {
        // Filter by specific category
        const filtered = hadiths.filter(hadith => 
          hadith.category === selectedCategory.id || 
          (hadith.categories && hadith.categories.some(cat => cat === selectedCategory.id))
        );
        setFilteredHadiths(filtered);
        setDisplayedHadiths(filtered.slice(0, hadithsPerPage));
      } else {
        // No category selected, show all
        setFilteredHadiths(hadiths);
        setDisplayedHadiths(hadiths.slice(0, hadithsPerPage));
      }
    }
    setCurrentPage(1);
  };

  const loadMoreHadiths = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * hadithsPerPage;
    const endIndex = startIndex + hadithsPerPage;
    const newHadiths = filteredHadiths.slice(startIndex, endIndex);
    
    setDisplayedHadiths(prev => [...prev, ...newHadiths]);
    setCurrentPage(nextPage);
  };

  // Function to categorize hadiths based on keywords (from original web app)
  const categorizeHadiths = (hadiths) => {
    return hadiths.map(hadith => {
      const text = `${hadith.arabic} ${hadith.english}`.toLowerCase();
      const categories = [];
      
      Object.entries(categoryKeywords).forEach(([categoryKey, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          categories.push(categoryKey);
        }
      });
      
      // If no categories found, add to "General"
      if (categories.length === 0) {
        categories.push('General');
      }
      
      return {
        ...hadith,
        categories: categories
      };
    });
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { borderLeftColor: item.color, backgroundColor: isDark ? '#181818' : styles.categoryCard.backgroundColor, borderLeftColor: isDark ? '#d4af37' : item.color }]}
      onPress={() => handleCategorySelect(item)}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={[styles.categoryName, { color: isDark ? '#fff' : styles.categoryName.color }]}>{item.name}</Text>
      </View>
      <Text style={[styles.categoryDescription, { color: isDark ? '#fff' : styles.categoryDescription.color }]}>{item.description}</Text>
      <View style={styles.categoryCount}>
        <Text style={[styles.categoryCountText, { color: isDark ? '#d4af37' : styles.categoryCountText.color, backgroundColor: isDark ? 'rgba(212,175,55,0.12)' : styles.categoryCountText.backgroundColor }]}>
          {item.id === 'All Hadiths' 
            ? '14,552 hadiths'
            : `${hadiths.filter(h => 
                h.category === item.id || 
                (h.categories && h.categories.some(cat => cat === item.id))
              ).length} hadiths`
          }
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHadithCard = ({ item }) => (
    <View style={[styles.hadithCard, { backgroundColor: isDark ? darkStyles.card : styles.hadithCard.backgroundColor, borderColor: isDark ? darkStyles.cardBorder : styles.hadithCard.borderColor, shadowColor: isDark ? darkStyles.shadow : styles.hadithCard.shadowColor }]}>
      <View style={styles.hadithHeader}>
        <View style={styles.hadithTitleSection}>
          <Text style={[styles.hadithTitle, { color: isDark ? darkStyles.text : styles.hadithTitle.color }]}>{item.title}</Text>
          <Text style={[styles.hadithNarrator, { color: isDark ? darkStyles.text : styles.hadithNarrator.color }]}>Narrated by: {item.narrator}</Text>
        </View>
      </View>

      {showArabic && (
        <View style={[styles.hadithArabic, { backgroundColor: isDark ? darkStyles.inputBg : styles.hadithArabic.backgroundColor, borderRightColor: isDark ? darkStyles.accent : styles.hadithArabic.borderRightColor }]}>
          <Text style={[styles.arabicText, { color: isDark ? darkStyles.inputText : styles.arabicText.color }]}>{item.arabic}</Text>
        </View>
      )}

      <View style={styles.hadithEnglish}>
        <Text style={[styles.englishText, { color: isDark ? darkStyles.text : styles.englishText.color }]}>{item.english}</Text>
      </View>

      <View style={styles.hadithFooter}>
        <View style={styles.hadithMeta}>
          <Text style={[styles.hadithSource, { color: isDark ? darkStyles.text : styles.hadithSource.color }]}>{item.source}</Text>
          <Text style={[styles.hadithReference, { color: isDark ? darkStyles.secondary : styles.hadithReference.color }]}>{item.reference}</Text>
          <Text style={[styles.hadithGrade, { color: isDark ? darkStyles.secondary : styles.hadithGrade.color }]}>{item.grade}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: isDark ? darkStyles.badgeBg : styles.categoryBadge.backgroundColor, borderColor: isDark ? darkStyles.cardBorder : styles.categoryBadge.borderColor }]}>
          <Text style={[styles.categoryBadgeText, { color: isDark ? darkStyles.badgeText : styles.categoryBadgeText.color }]}>
            {item.categories && item.categories.length > 0 ? item.categories[0] : item.category}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderWelcomeScreen = () => (
    <ScrollView style={styles.welcomeContainer} showsVerticalScrollIndicator={false}>
      {/* Spiritual Header */}
      <View style={styles.spiritualHeader}>
        <Text style={styles.mainQuote}>
          "The best of you are those who learn and teach the Hadith."
        </Text>
        <Text style={styles.arabicQuote}>
          قَدْ جَاءَكُم مِّنَ اللَّـهِ نُورٌ وَكِتَابٌ مُّبِينٌ
        </Text>
        <Text style={styles.verseReference}>— Surah Al-Ma'idah: 15</Text>
      </View>

      {/* Stats Line */}
      <View style={styles.statsLine}>
        <Text style={styles.statsText}>14,552 Sahih Hadiths Available</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.statsText}>Explore by Topic, Source, or Keyword</Text>
      </View>

      {/* Surprise Me Button */}
      <TouchableOpacity style={[styles.surpriseButton, { backgroundColor: isDark ? darkStyles.buttonBg : styles.surpriseButton.backgroundColor }]} onPress={handleSurpriseMe}>
        <MaterialCommunityIcons name="gift" size={24} color={isDark ? darkStyles.buttonText : styles.surpriseButtonText.color} />
        <Text style={[styles.surpriseButtonText, { color: isDark ? darkStyles.buttonText : styles.surpriseButtonText.color }]}>Surprise Me with 1 Hadith</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Choose a Topic to Explore</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesGrid}
        />
      </View>
    </ScrollView>
  );

  const renderHadithsScreen = () => (
    <View style={styles.hadithsContainer}>
      {/* Header */}
      <View style={[styles.hadithsHeader, { backgroundColor: isDark ? '#0c0c0c' : styles.hadithsHeader.backgroundColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToCategories}>
          <Ionicons name="arrow-back" size={24} color={isDark ? darkStyles.text : styles.backButtonText.color} />
          <Text style={[styles.backButtonText, { color: isDark ? darkStyles.text : styles.backButtonText.color }]}>Back to Categories</Text>
        </TouchableOpacity>
        <Text style={[styles.selectedCategoryTitle, { color: isDark ? darkStyles.text : styles.selectedCategoryTitle.color }]}>
          {selectedCategory?.name || 'All Hadiths'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: isDark ? darkStyles.inputBg : styles.searchInputContainer.backgroundColor, borderColor: isDark ? darkStyles.inputBorder : styles.searchInputContainer.borderColor }]}>
          <Ionicons name="search" size={20} color={isDark ? darkStyles.placeholder : '#666'} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? darkStyles.inputText : styles.searchInput.color }]}
            placeholder="Search hadiths..."
            placeholderTextColor={isDark ? darkStyles.placeholder : '#999'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? darkStyles.placeholder : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showArabic && styles.toggleButtonActive, { backgroundColor: isDark ? darkStyles.inputBg : styles.toggleButton.backgroundColor, borderColor: isDark ? darkStyles.inputBorder : styles.toggleButton.borderColor }]}
          onPress={() => setShowArabic(!showArabic)}
        >
          <Text style={[styles.toggleButtonText, showArabic && styles.toggleButtonTextActive, { color: isDark ? darkStyles.inputText : styles.toggleButtonText.color }]}>
            Arabic
          </Text>
        </TouchableOpacity>
        <Text style={[styles.resultsCount, { color: isDark ? darkStyles.text : styles.resultsCount.color }]}>
          {filteredHadiths.length} hadiths found
        </Text>
      </View>

      {/* Hadiths List */}
      <FlatList
        ref={flatListRef}
        data={displayedHadiths}
        renderItem={renderHadithCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.hadithsList}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setShowScrollToTop(offsetY > 200);
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={[styles.emptyState, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.emptyState.backgroundColor }]}>
            <Ionicons name="search" size={64} color={isDark ? darkStyles.secondary : '#ccc'} />
            <Text style={[styles.emptyStateTitle, { color: isDark ? darkStyles.text : styles.emptyStateTitle.color }]}>No hadiths found</Text>
            <Text style={[styles.emptyStateText, { color: isDark ? darkStyles.secondary : styles.emptyStateText.color }]}>
              Try adjusting your search or category filter
            </Text>
          </View>
        }
        ListFooterComponent={
          displayedHadiths.length < filteredHadiths.length && (
            <TouchableOpacity style={[styles.loadMoreButton, { backgroundColor: isDark ? darkStyles.buttonBg : styles.loadMoreButton.backgroundColor }]} onPress={loadMoreHadiths}>
              <Text style={[styles.loadMoreButtonText, { color: isDark ? darkStyles.buttonText : styles.loadMoreButtonText.color }]}>Load More Hadiths</Text>
            </TouchableOpacity>
          )
        }
      />
      
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <TouchableOpacity
          style={[styles.scrollToTopButton, { backgroundColor: isDark ? darkStyles.buttonBg : styles.scrollToTopButton.backgroundColor }]}
          onPress={() => {
            // Scroll to top
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
          }}
        >
          <Ionicons name="arrow-up" size={24} color={isDark ? darkStyles.buttonText : styles.scrollToTopButton.color} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.container.backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: isDark ? '#0c0c0c' : styles.header.backgroundColor }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#d4af37' : styles.headerTitle.color }]}>Hadith</Text>
        </View>
        <View style={[styles.loadingContainer, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.loadingContainer.backgroundColor }]}>
          <ActivityIndicator size="large" color={isDark ? darkStyles.gold : styles.loadingText.color} />
          <Text style={[styles.loadingText, { color: isDark ? darkStyles.text : styles.loadingText.color }]}>Loading Hadith Collection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error fallback - if something goes wrong, show at least the welcome screen
  if (!hadiths || hadiths.length === 0) {
    console.log('⚠️ No hadiths loaded, showing fallback');
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.container.backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: isDark ? '#0c0c0c' : styles.header.backgroundColor }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#d4af37' : styles.headerTitle.color }]}>Hadith</Text>
        </View>
        <View style={[styles.content, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.content.backgroundColor }]}>
          <View style={styles.welcomeContainer}>
            <View style={styles.spiritualHeader}>
              <Text style={styles.arabicQuote}>اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ</Text>
              <Text style={styles.mainQuote}>"O Allah, send prayers upon Muhammad"</Text>
              <Text style={styles.verseReference}>Hadith Collection</Text>
            </View>
            <View style={styles.statsLine}>
              <Text style={styles.statsText}>14,552 Sahih Hadiths Available</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.statsText}>Explore by Topic, Source, or Keyword</Text>
            </View>
            <Text style={{ textAlign: 'center', color: isDark ? darkStyles.secondary : '#666', marginBottom: 20 }}>
              Loading hadith collection...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.container.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#0c0c0c' : styles.header.backgroundColor }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#d4af37' : styles.headerTitle.color }]}>Hadith</Text>
      </View>
      
      <View style={[styles.content, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.content.backgroundColor }]}>
        {currentView === 'welcome' ? renderWelcomeScreen() : renderHadithsScreen()}
      </View>
    </SafeAreaView>
  );
  } catch (error) {
    console.error('❌ Error in HadithScreen:', error);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.container.backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: isDark ? '#0c0c0c' : styles.header.backgroundColor }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#d4af37' : styles.headerTitle.color }]}>Hadith</Text>
        </View>
        <View style={[styles.loadingContainer, { backgroundColor: isDark ? darkStyles.backgroundColor : styles.loadingContainer.backgroundColor }]}>
          <Text style={[styles.loadingText, { color: isDark ? darkStyles.text : styles.loadingText.color }]}>Error loading Hadith Collection</Text>
          <Text style={{ fontSize: 14, color: isDark ? darkStyles.secondary : '#999', marginTop: 10, textAlign: 'center' }}>
            Please try again later
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f2ea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ece7d8',
    backgroundColor: '#f5f2ea',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#181818',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    padding: 20,
  },
  spiritualHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainQuote: {
    fontSize: 28,
    fontWeight: '700',
    color: '#bfa14a',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 36,
  },
  arabicQuote: {
    fontSize: 20,
    color: '#bfa14a',
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? 'Amiri, serif' : 'Amiri',
    lineHeight: 32,
  },
  verseReference: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  statsLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    color: '#bfa14a',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  surpriseButton: {
    backgroundColor: '#bfa14a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginBottom: 40,
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  surpriseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesGrid: {
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#bfa14a',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181818',
    flex: 1,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  categoryCount: {
    alignSelf: 'flex-start',
  },
  categoryCountText: {
    fontSize: 12,
    color: '#bfa14a',
    fontWeight: '600',
    backgroundColor: 'rgba(191, 161, 74, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // Hadiths Screen Styles
  hadithsContainer: {
    flex: 1,
  },
  hadithsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ece7d8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#181818',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedCategoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181818',
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.15)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#181818',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(191, 161, 74, 0.3)',
  },
  toggleButtonActive: {
    backgroundColor: '#bfa14a',
    borderColor: '#bfa14a',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  hadithsList: {
    padding: 20,
    paddingTop: 0,
  },
  hadithCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.15)',
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  hadithTitleSection: {
    flex: 1,
  },
  hadithTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 5,
    lineHeight: 24,
  },
  hadithNarrator: {
    fontSize: 14,
    color: '#bfa14a',
    fontWeight: '600',
  },
  hadithActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
  hadithArabic: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(191, 161, 74, 0.05)',
    borderRadius: 12,
    borderRightWidth: 3,
    borderRightColor: '#bfa14a',
  },
  arabicText: {
    fontSize: 18,
    color: '#181818',
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: Platform.OS === 'web' ? 'Amiri, serif' : 'Amiri',
    fontWeight: '500',
  },
  hadithEnglish: {
    marginBottom: 15,
  },
  englishText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  hadithFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hadithMeta: {
    flex: 1,
  },
  hadithSource: {
    fontSize: 14,
    color: '#bfa14a',
    fontWeight: '600',
  },
  hadithReference: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  hadithGrade: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: 'rgba(191, 161, 74, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#bfa14a',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#bfa14a',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#bfa14a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
}); 