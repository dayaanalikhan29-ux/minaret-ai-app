import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  Platform,
  findNodeHandle,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllSurahs, getSurahVerses } from '../utils/quranData';
import { useTheme } from '../theme/ThemeContext';

// Popular verse nicknames mapping (same as web project)
const verseNicknames = {
  'ayat ul kursi': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
  'verse of the throne': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
  'ayatul kursi': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
  'verse of light': { surah: 24, verse: 35, name: 'Verse of Light' },
  'ayat an-nur': { surah: 24, verse: 35, name: 'Verse of Light' },
  'ayatul nur': { surah: 24, verse: 35, name: 'Verse of Light' },
  'al-fatiha': { surah: 1, verse: 1, name: 'Al-Fatiha (The Opening)' },
  'fatiha': { surah: 1, verse: 1, name: 'Al-Fatiha (The Opening)' },
  'the opening': { surah: 1, verse: 1, name: 'Al-Fatiha (The Opening)' },
  'yaseen': { surah: 36, verse: 1, name: 'Yaseen' },
  'ya-sin': { surah: 36, verse: 1, name: 'Yaseen' },
  'ya sin': { surah: 36, verse: 1, name: 'Yaseen' },
  'al-mulk': { surah: 67, verse: 1, name: 'Al-Mulk (The Sovereignty)' },
  'mulk': { surah: 67, verse: 1, name: 'Al-Mulk (The Sovereignty)' },
  'the sovereignty': { surah: 67, verse: 1, name: 'Al-Mulk (The Sovereignty)' }
};

const { width, height } = Dimensions.get('window');

export default function QuranScreen() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [currentView, setCurrentView] = useState('surah-list'); // 'surah-list' or 'surah-content'
  const [showUrdu, setShowUrdu] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [verseOfDay, setVerseOfDay] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [targetVerse, setTargetVerse] = useState(null);
  const [scrollToVerse, setScrollToVerse] = useState(false);
  const [versePositions, setVersePositions] = useState({});
  
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const flatListRef = useRef(null);
  const scrollViewRef = useRef(null);
  const verseRefs = useRef({});

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const darkStyles = {
    backgroundColor: '#111111',
    card: '#1a1a1a',
    text: '#fff',
    accent: '#c3a545',
    border: '#c3a545',
    gold: '#c3a545',
    verseBg: '#181818',
    verseText: '#fff',
    verseBorder: '#c3a545',
    // ... add more as needed
  };

  const normalizeSearchQuery = (query) => {
    return query.toLowerCase().trim();
  };

  const checkVerseNicknames = (query) => {
    const normalizedQuery = normalizeSearchQuery(query);
    
    // Direct nickname match
    if (verseNicknames[normalizedQuery]) {
      return verseNicknames[normalizedQuery];
    }
    
    // Partial nickname match
    for (const [nickname, info] of Object.entries(verseNicknames)) {
      if (nickname.includes(normalizedQuery) || normalizedQuery.includes(nickname)) {
        return info;
      }
    }
    
    return null;
  };

  const parseNaturalLanguage = (query) => {
    const normalizedQuery = query.toLowerCase();
    
    // Multiple patterns for natural language parsing (from web project)
    const patterns = [
      // "Surah 5 Verse 2" or "Surah 7 Ayah 15"
      /surah\s+(\d+)\s+(?:verse|ayah|ayat)\s+(\d+)/i,
      // "Surah Baqarah Verse 255" or "Surah Yaseen Ayah 9"
      /surah\s+([a-z\s-]+)\s+(?:verse|ayah|ayat)\s+(\d+)/i,
      // "Surah 5 2" or "Surah 7 15"
      /surah\s+(\d+)\s+(\d+)/i,
      // "Surah Al-Baqarah 255" or "Surah Yaseen 9"
      /surah\s+([a-z\s-]+)\s+(\d+)/i,
      // "Baqarah 255" or "Yaseen 9"
      /^([a-z\s-]+)\s+(\d+)$/i,
      // "SurahAlbaqarah255" (no spaces)
      /surah([a-z]+)(\d+)/i,
      // "Albaqarah255" (no spaces)
      /^([a-z]+)(\d+)$/i,
      // "verse X:Y" patterns
      /verse\s+(\d+):(\d+)/i,
      // Direct verse reference "2:255"
      /^(\d+):(\d+)$/
    ];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = normalizedQuery.match(pattern);
      if (match) {
        // Check if this is the direct verse reference pattern (last pattern)
        if (i === patterns.length - 1) {
          // Direct verse reference pattern "2:255"
          const surahNumber = parseInt(match[1]);
          const verseNumber = parseInt(match[2]);
          const surah = surahs.find(s => s.surahNumber === surahNumber);
          return surah ? { type: 'exactVerse', surah: surahNumber, verse: verseNumber } : null;
        } else if (i === 0 || i === 2) {
          // "Surah 5 Verse 2" or "Surah 5 2" patterns
          const surahNumber = parseInt(match[1]);
          const verseNumber = parseInt(match[2]);
          const surah = surahs.find(s => s.surahNumber === surahNumber);
          return surah ? { type: 'exactVerse', surah: surahNumber, verse: verseNumber } : null;
        } else {
          // Natural language pattern with surah names
          const surahName = match[1].trim();
          const verseNumber = parseInt(match[2]);
          
          // Find Surah by name
          const surah = findSurahByName(surahName);
          if (surah && verseNumber > 0) {
            return { type: 'exactVerse', surah: surah.surahNumber, verse: verseNumber };
          }
        }
      }
    }
    
    return null;
  };

  const findSurahByName = (name) => {
    const normalizedName = normalizeSearchQuery(name);
    
    return surahs.find(surah => {
      const surahName = normalizeSearchQuery(surah.name);
      const surahMeaning = normalizeSearchQuery(surah.meaning);
      const surahArabic = surah.nameArabic ? normalizeSearchQuery(surah.nameArabic) : '';
      
      // Remove common prefixes
      const cleanName = normalizedName.replace(/^(al-|the\s+)/i, '');
      const cleanSurahName = surahName.replace(/^(al-|the\s+)/i, '');
      const cleanSurahMeaning = surahMeaning.replace(/^(al-|the\s+)/i, '');
      
      return surahName.includes(cleanName) ||
             surahMeaning.includes(cleanName) ||
             surahArabic.includes(cleanName) ||
             cleanSurahName.includes(cleanName) ||
             cleanSurahMeaning.includes(cleanName) ||
             // Handle variations without spaces
             surahName.replace(/\s+/g, '').includes(cleanName.replace(/\s+/g, '')) ||
             surahMeaning.replace(/\s+/g, '').includes(cleanName.replace(/\s+/g, ''));
    });
  };

  // Calculate relevance score for verse matches (from web project)
  const calculateRelevance = (text, query) => {
    const words = query.split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (text.includes(word)) {
        score += 1;
        // Bonus for exact word match
        if (text.includes(` ${word} `) || text.startsWith(word) || text.endsWith(word)) {
          score += 0.5;
        }
      }
    });
    
    return score;
  };

  const performEnhancedSearch = (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    console.log('🔍 Performing search for:', query);
    console.log('📚 Total surahs available:', surahs.length);
    console.log('🔤 Testing patterns for:', query);

    const results = {
      nicknameMatch: null,
      exactVerse: null,
      surahs: [],
      verses: []
    };

    // Check for verse nicknames first
    const nicknameMatch = checkVerseNicknames(query);
    console.log('⭐ Nickname match:', nicknameMatch);
    if (nicknameMatch) {
      results.nicknameMatch = nicknameMatch;
    }

    // Check for natural language parsing
    const naturalLanguageMatch = parseNaturalLanguage(query);
    console.log('🔤 Natural language match:', naturalLanguageMatch);
    if (naturalLanguageMatch) {
      if (naturalLanguageMatch.type === 'exactVerse') {
        results.exactVerse = naturalLanguageMatch;
      }
    }

    // Search surahs with enhanced matching (from web project)
    const surahResults = surahs.filter(surah => {
      const normalizedName = normalizeSearchQuery(surah.name);
      const normalizedMeaning = normalizeSearchQuery(surah.meaning);
      const normalizedArabic = surah.nameArabic ? normalizeSearchQuery(surah.nameArabic) : '';
      const number = surah.surahNumber.toString();
      
      // Remove "surah" prefix if present in query
      const cleanQuery = normalizeSearchQuery(query.replace(/^surah\s+/i, ''));
      
      // Check for exact surah number match first (e.g., "surah 7" should match surah 7)
      if (/^\d+$/.test(cleanQuery)) {
        return number === cleanQuery;
      }
      
      return normalizedName.includes(cleanQuery) ||
             normalizedMeaning.includes(cleanQuery) ||
             normalizedArabic.includes(cleanQuery) ||
             number.includes(cleanQuery) ||
             // Handle variations like "Al Anaam" vs "Al-Anaam"
             normalizedName.replace(/\s+/g, '').includes(cleanQuery.replace(/\s+/g, '')) ||
             // Handle "Surah" prefix variations
             `surah ${normalizedName}`.includes(cleanQuery) ||
             `surah ${normalizedMeaning}`.includes(cleanQuery);
    }).slice(0, 10);

    results.surahs = surahResults;

    // Search verses only in selected surah if available, otherwise skip verse search
    const verseResults = [];
    const maxResults = 10;
    
    if (selectedSurah && selectedSurah.verses) {
      console.log('🔍 Searching verses in selected surah:', selectedSurah.name);
      
      for (const verse of selectedSurah.verses) {
        if (verseResults.length >= maxResults) break;
        
        const englishText = (verse.english || '').toLowerCase();
        const arabicText = (verse.arabic || '').toLowerCase();
        
        const normalizedQuery = normalizeSearchQuery(query);
        
        // Check if query matches English translation
        if (englishText.includes(normalizedQuery)) {
          verseResults.push({
            surah: selectedSurah,
            verse: verse,
            matchType: 'english',
            query: query,
            relevance: calculateRelevance(englishText, normalizedQuery)
          });
        }
        // Check if query matches Arabic text
        else if (arabicText.includes(normalizedQuery)) {
          verseResults.push({
            surah: selectedSurah,
            verse: verse,
            matchType: 'arabic',
            query: query,
            relevance: calculateRelevance(arabicText, normalizedQuery)
          });
        }
      }
    } else {
      console.log('⚠️ No selected surah with verses available for verse search');
    }
    
    // Sort by relevance
    results.verses = verseResults.sort((a, b) => b.relevance - a.relevance);

    console.log('📊 Final results:', {
      nicknameMatch: results.nicknameMatch,
      exactVerse: results.exactVerse,
      surahsCount: results.surahs.length,
      versesCount: results.verses.length
    });

    setSearchResults(results);
  };

  const handleSearchInput = (text) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search if query is empty
    if (!text.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    
    // Set searching state
    setIsSearching(true);
    
    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      performEnhancedSearch(text);
      setIsSearching(false);
    }, 300);
  };

  const handleSearchResultSelect = (result) => {
    try {
      console.log('🎯 Handling search result selection:', result);
      
      if (result.type === 'nickname') {
        // For nickname matches, result.surah and result.verse are the numbers
        const surah = surahs.find(s => s.surahNumber === result.surah);
        if (surah) {
          console.log('📖 Opening surah for nickname:', surah.name, 'verse:', result.verse);
          console.log('🎯 Setting target verse to:', result.verse);
          setTargetVerse(result.verse);
          setScrollToVerse(true);
          handleSurahSelect(surah);
        }
      } else if (result.type === 'exactVerse') {
        const surah = surahs.find(s => s.surahNumber === result.surah);
        if (surah) {
          console.log('📖 Opening surah for exact verse:', surah.name, 'verse:', result.verse);
          console.log('🎯 Setting target verse to:', result.verse);
          setTargetVerse(result.verse);
          setScrollToVerse(true);
          handleSurahSelect(surah);
        }
      } else if (result.type === 'surah') {
        console.log('📖 Opening surah:', result.surah.name);
        setTargetVerse(null);
        setScrollToVerse(false);
        handleSurahSelect(result.surah);
      }
      
      setSearchQuery('');
      setShowSearchModal(false);
      setSearchResults(null);
    } catch (error) {
      console.error('Error handling search result selection:', error);
    }
  };

  useEffect(() => {
    // Load Quran data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        const allSurahs = getAllSurahs();
        if (allSurahs.length === 0) {
          const fallbackSurahs = [
            {
              surahNumber: 1,
              name: 'Al-Fatiha',
              nameArabic: 'الفاتحة',
              meaning: 'The Opening',
              revelationType: 'Meccan',
              totalVerses: 7,
              description: 'The opening chapter of the Quran',
              verses: []
            }
          ];
          setSurahs(fallbackSurahs);
          setFilteredSurahs(fallbackSurahs);
          setLoading(false);
          return;
        }
        setSurahs(allSurahs);
        setFilteredSurahs(allSurahs);
        setLoading(false);
        // Pick a random verse for Verse of the Day
        const surah = allSurahs[Math.floor(Math.random() * allSurahs.length)];
        if (surah && surah.verses && surah.verses.length > 0) {
          const verse = surah.verses[Math.floor(Math.random() * surah.verses.length)];
          setVerseOfDay({
            arabic: verse.arabic,
            translation: verse.english,
            reference: `${surah.name} ${surah.surahNumber}:${verse.ayah}`
          });
        }
      } catch (e) {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Filter surahs based on search query
    try {
      if (searchQuery.trim() === '') {
        setFilteredSurahs(surahs);
      } else {
        const filtered = surahs.filter(surah => {
          try {
            return (
              (surah.name && surah.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (surah.nameArabic && surah.nameArabic.includes(searchQuery)) ||
              (surah.meaning && surah.meaning.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (surah.surahNumber && surah.surahNumber.toString().includes(searchQuery))
            );
          } catch (error) {
            return false;
          }
        });
        setFilteredSurahs(filtered);
      }
    } catch (error) {
      setFilteredSurahs(surahs);
    }
  }, [searchQuery, surahs]);

  // Handle scrolling to target verse when surah content is loaded
  useEffect(() => {
    if (scrollToVerse && targetVerse && selectedSurah && selectedSurah.verses && scrollViewRef.current) {
      console.log('🎯 Attempting to scroll to verse:', targetVerse);
      console.log('📖 Total verses available:', selectedSurah.verses.length);
      
      // Find the verse index - try both string and number comparison
      let verseIndex = selectedSurah.verses.findIndex(verse => 
        parseInt(verse.ayah) === parseInt(targetVerse) || 
        verse.ayah === targetVerse ||
        verse.ayah === targetVerse.toString()
      );
      
      console.log('📖 Found verse at index:', verseIndex);
      
      if (verseIndex !== -1) {
        // Try to get the actual position of the verse
        const verseKey = `verse-${targetVerse}`;
        const verseRef = verseRefs.current[verseKey];
        
        if (verseRef) {
          console.log('📖 Found verse ref, measuring position...');
          verseRef.measure((x, y, width, height, pageX, pageY) => {
            console.log('📖 Verse position:', { x, y, pageX, pageY });
            const scrollPosition = pageY - 100; // Offset for header
            
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                y: scrollPosition,
                animated: true
              });
              setScrollToVerse(false);
              setTargetVerse(null);
            }, 500);
          });
        } else {
          console.log('📖 No verse ref found, using fallback calculation');
          // Fallback to approximate calculation
          const headerHeight = 250;
          const verseHeight = 200;
          const scrollPosition = headerHeight + (verseHeight * verseIndex);
          
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              y: scrollPosition,
              animated: true
            });
            setScrollToVerse(false);
            setTargetVerse(null);
          }, 1500);
        }
      } else {
        console.log('❌ Verse not found, resetting scroll state');
        setScrollToVerse(false);
        setTargetVerse(null);
      }
    }
  }, [scrollToVerse, targetVerse, selectedSurah]);

  useEffect(() => {
    async function loadAllVerses() {
      const allSurahs = getAllSurahs();
      let allVerses = [];
      for (const surah of allSurahs) {
        const verses = getSurahVerses(surah.surahNumber);
        allVerses = allVerses.concat(
          verses.map(verse => ({
            ...verse,
            surahName: surah.name,
            surahNumber: surah.surahNumber
          }))
        );
      }
      if (allVerses.length > 0) {
        const verse = allVerses[Math.floor(Math.random() * allVerses.length)];
        setVerseOfDay({
          arabic: verse.arabic,
          translation: verse.english,
          reference: `${verse.surahName} ${verse.surahNumber}:${verse.ayah}`
        });
      } else {
        setVerseOfDay(null);
      }
    }
    loadAllVerses();
  }, []);

  const handleSurahSelect = async (surah) => {
    try {
      console.log('Selecting surah:', surah.name);
      setSelectedSurah(surah);
      setCurrentView('surah-content');
      setSearchQuery('');
      setShowSearch(false);
      
      // Clear verse refs for new surah
      verseRefs.current = {};
      
      // Load verses on demand
      if (!surah._verseData) {
        console.log('Loading verses for surah:', surah.surahNumber);
        const verses = getSurahVerses(surah.surahNumber);
        console.log('Loaded verses sample:', verses.slice(0, 2).map(v => ({
          ayah: v.ayah,
          urdu: v.urdu ? v.urdu.substring(0, 30) + '...' : 'NO URDU',
          transliteration: v.transliteration ? v.transliteration.substring(0, 30) + '...' : 'NO TRANSLITERATION'
        })));
        
        // Debug: Check specific verses
        console.log('🔍 Checking verse 255 specifically...');
        const verse255 = verses.find(v => parseInt(v.ayah) === 255);
        console.log('📖 Verse 255 found:', !!verse255);
        if (verse255) {
          console.log('📖 Verse 255 data:', {
            ayah: verse255.ayah,
            arabicLength: verse255.arabic?.length || 0,
            englishLength: verse255.english?.length || 0
          });
        }
        
        // Check last few verses
        console.log('📖 Last 5 verses:', verses.slice(-5).map(v => ({ ayah: v.ayah, number: parseInt(v.ayah) })));
        
        setSelectedSurah(prev => ({
          ...prev,
          verses: verses,
          _verseData: true
        }));
      }
    } catch (error) {
      console.error('Error selecting surah:', error);
      Alert.alert('Error', 'Failed to open surah. Please try again.');
    }
  };

  const handleBackToSurahs = () => {
    setCurrentView('surah-list');
    setSelectedSurah(null);
  };



  const handleVerseOfDayClick = () => {
    if (verseOfDay?.reference) {
      // Parse the reference to get surah and verse
      const match = verseOfDay.reference.match(/(\d+):(\d+)/);
      if (match) {
        const surahNumber = parseInt(match[1]);
        const verseNumber = parseInt(match[2]);
        const surah = surahs.find(s => s.surahNumber === surahNumber);
        if (surah) {
          console.log('📖 Opening verse of the day:', surah.name, 'verse:', verseNumber);
          setTargetVerse(verseNumber);
          setScrollToVerse(true);
          handleSurahSelect(surah);
        }
      }
    }
  };

  // Debug function to test ayat ul kursi
  const debugAyatUlKursi = () => {
    console.log('🔍 Testing ayat ul kursi search...');
    const nicknameMatch = checkVerseNicknames('ayat ul kursi');
    console.log('⭐ Nickname match result:', nicknameMatch);
    
    if (nicknameMatch) {
      const surah = surahs.find(s => s.surahNumber === nicknameMatch.surah);
      if (surah) {
        console.log('📖 Found surah:', surah.name);
        console.log('🎯 Target verse:', nicknameMatch.verse);
        console.log('📖 Surah has verses loaded:', !!surah.verses);
        console.log('📖 Number of verses:', surah.verses?.length || 0);
        
        if (surah.verses && surah.verses.length > 0) {
          console.log('📖 First 5 verses:', surah.verses.slice(0, 5).map(v => ({ 
            ayah: v.ayah, 
            number: parseInt(v.ayah),
            hasArabic: !!v.arabic,
            hasEnglish: !!v.english
          })));
          console.log('📖 Last 5 verses:', surah.verses.slice(-5).map(v => ({ 
            ayah: v.ayah, 
            number: parseInt(v.ayah),
            hasArabic: !!v.arabic,
            hasEnglish: !!v.english
          })));
          
          // Check if verse 255 exists
          const verse255 = surah.verses.find(v => parseInt(v.ayah) === 255);
          console.log('📖 Verse 255 found:', !!verse255);
          if (verse255) {
            console.log('📖 Verse 255 data:', { 
              ayah: verse255.ayah, 
              arabicLength: verse255.arabic?.length || 0,
              englishLength: verse255.english?.length || 0
            });
          }
        }
        
        setTargetVerse(nicknameMatch.verse);
        setScrollToVerse(true);
        handleSurahSelect(surah);
      }
    }
  };

  // Debug function to test manual scrolling
  const debugManualScroll = () => {
    if (selectedSurah && selectedSurah.verses && scrollViewRef.current) {
      console.log('🔍 Testing manual scroll...');
      console.log('📖 Total verses:', selectedSurah.verses.length);
      
      // Try scrolling to a known position
      const testPosition = 1000; // 1000 pixels down
      console.log('📖 Scrolling to test position:', testPosition);
      
      scrollViewRef.current.scrollTo({
        y: testPosition,
        animated: true
      });
    } else {
      console.log('❌ No surah selected or no scroll ref');
    }
  };

  const renderSurahItem = ({ item }) => {
    try {
      return (
        <TouchableOpacity
          style={[styles.surahItem, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
          onPress={() => handleSurahSelect(item)}
        >
          <View style={[styles.surahNumber, isDark && { backgroundColor: darkStyles.verseBg, borderColor: darkStyles.verseBorder }]}>
            <Text style={[styles.surahNumberText, isDark && { color: darkStyles.verseText }]}>{item.surahNumber || '?'}</Text>
          </View>
          <View style={styles.surahInfo}>
            <Text style={[styles.surahName, isDark && { color: darkStyles.text }]}>{item.name || 'Unknown'}</Text>
            <Text style={[styles.surahArabic, isDark && { color: darkStyles.gold }]}>{item.nameArabic || ''}</Text>
            <Text style={[styles.surahMeaning, isDark && { color: darkStyles.text }]}>{item.meaning || 'Unknown'}</Text>
            <Text style={[styles.surahType, isDark && { color: darkStyles.text }]}>{item.revelationType || 'Unknown'}</Text>
            <Text style={[styles.surahVerses, isDark && { color: darkStyles.gold }]}>{item.totalVerses || 0} verses</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering surah item:', item, error);
      return (
        <View style={styles.surahItem}>
          <Text>Error loading surah</Text>
        </View>
      );
    }
  };

  const renderSurahContent = () => {
    try {
      if (!selectedSurah) {
        console.log('No selected surah');
        return null;
      }

      console.log('Rendering surah content for:', selectedSurah.name);
      console.log('Verses count:', selectedSurah.verses?.length || 0);
      console.log('ACTUAL VERSES DATA:', selectedSurah.verses);

      const flatListData = [
        { type: 'header', surah: selectedSurah },
        ...(selectedSurah.verses || []).map(verse => ({ type: 'verse', ...verse }))
      ];
      
      console.log('FlatList data length:', flatListData.length);
      console.log('Number of verse items:', flatListData.filter(item => item.type === 'verse').length);

      return (
        <View style={[styles.surahContentContainer, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
          <ScrollView
            ref={scrollViewRef}
            style={[styles.versesFlatList, isDark && { backgroundColor: 'transparent' }]}
            contentContainerStyle={styles.versesList}
            showsVerticalScrollIndicator={true}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              setShowScrollToTop(offsetY > 200);
            }}
            scrollEventThrottle={16}
          >
            {/* Header */}
            <View style={[styles.surahHeaderSection, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
              <View style={styles.surahHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackToSurahs}
                >
                  <Ionicons name="arrow-back" size={24} color="#181818" />
                  <Text style={styles.backButtonText}>Back to Surahs</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.surahTitleContainer}>
                <Text style={[styles.surahTitle, isDark && { color: darkStyles.text }]}>{selectedSurah.name || 'Unknown'}</Text>
                <Text style={[styles.surahTitleArabic, isDark && { color: darkStyles.gold }]}>{selectedSurah.nameArabic || ''}</Text>
                <Text style={[styles.surahSubtitle, isDark && { color: darkStyles.text }]}>{selectedSurah.meaning || 'Unknown'}</Text>
                <Text style={[styles.surahVersesCount, isDark && { color: darkStyles.text }]}>{selectedSurah.totalVerses || 0} verses</Text>
              </View>

              <View style={styles.languageControls}>
                <TouchableOpacity
                  style={[styles.toggleButton, showUrdu && styles.toggleButtonActive, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                  onPress={() => setShowUrdu(!showUrdu)}
                >
                  <Text style={[styles.toggleButtonText, showUrdu && styles.toggleButtonTextActive, isDark && { color: darkStyles.text }]}>
                    Urdu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, showTransliteration && styles.toggleButtonActive, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                  onPress={() => setShowTransliteration(!showTransliteration)}
                >
                  <Text style={[styles.toggleButtonText, showTransliteration && styles.toggleButtonTextActive, isDark && { color: darkStyles.text }]}>
                    Transliteration
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* All Verses */}
            {(selectedSurah.verses || []).map((verse, index) => (
              <View 
                key={`verse-${verse.ayah}-${index}`} 
                style={[styles.verseContainer, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                ref={(ref) => {
                  if (ref) {
                    verseRefs.current[`verse-${verse.ayah}`] = ref;
                  }
                }}
              >
                <View style={styles.verseHeader}>
                  <View style={styles.verseNumber}>
                    <Text style={[styles.verseNumberText, isDark && { color: darkStyles.verseText }]}>{verse.ayah || '?'}</Text>
                  </View>
                  <Text style={[styles.verseDecoration, isDark && { color: darkStyles.gold }]}>﷽</Text>
                </View>
                
                <Text style={[styles.verseArabic, isDark && { color: darkStyles.verseText }]}>{verse.arabic || ''}</Text>
                <Text style={[styles.verseEnglish, isDark && { color: darkStyles.text }]}>{verse.english || ''}</Text>
                
                {showUrdu && verse.urdu && (
                  <Text style={[styles.verseUrdu, isDark && { color: darkStyles.text }]}>{verse.urdu}</Text>
                )}
                
                {showTransliteration && verse.transliteration && (
                  <Text style={[styles.verseTransliteration, isDark && { color: darkStyles.text }]}>{verse.transliteration}</Text>
                )}
              </View>
            ))}
          </ScrollView>
          
          {/* Scroll to Top Button */}
          {showScrollToTop && (
            <TouchableOpacity
              style={[styles.scrollToTopButton, isDark && { backgroundColor: darkStyles.gold }]}
              onPress={() => {
                // Scroll to top
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
              }}
            >
              <Ionicons name="arrow-up" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      );
    } catch (error) {
      console.error('Error in renderSurahContent:', error);
      return (
        <View style={[styles.surahContentContainer, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
          <View style={styles.surahHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToSurahs}
            >
              <Ionicons name="arrow-back" size={24} color="#181818" />
              <Text style={styles.backButtonText}>Back to Surahs</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderContent}>
            <Text style={[styles.placeholderText, isDark && { color: darkStyles.text }]}>Error loading surah content</Text>
          </View>
        </View>
      );
    }
  };

  const renderSurahListHeader = () => (
    <View style={[styles.surahListContainer, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, isDark && { color: darkStyles.text }]}>Assalamualaikum</Text>
        <Text style={[styles.welcomeSubtitle, isDark && { color: darkStyles.text }]}>May today bring you closer to Allah</Text>
      </View>

      {/* Surah count display */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 16, color: '#bfa14a', fontWeight: 'bold' }}>
          Showing {filteredSurahs.length} surahs
        </Text>
      </View>

      <TouchableOpacity style={[styles.verseOfDay, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]} onPress={handleVerseOfDayClick}>
        <View style={styles.verseOfDayHeader}>
          <Text style={[styles.verseOfDayTitle, isDark && { color: darkStyles.text }]}>Verse of the Day</Text>
          <Text style={[styles.verseOfDayDecoration, isDark && { color: darkStyles.gold }]}>﷽</Text>
        </View>
        <View style={styles.verseOfDayContent}>
          {verseOfDay ? (
            <>
              {verseOfDay.arabic && (
                <Text style={[styles.verseOfDayArabic, isDark && { color: darkStyles.text }]}>{verseOfDay.arabic}</Text>
              )}
              {verseOfDay.translation && (
                <Text style={[styles.verseOfDayTranslation, isDark && { color: darkStyles.text }]}>{verseOfDay.translation}</Text>
              )}
              {verseOfDay.reference && (
                <Text style={[styles.verseOfDayReference, isDark && { color: darkStyles.gold }]}>{verseOfDay.reference}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.verseOfDayArabic, isDark && { color: darkStyles.text }]}>Loading verse...</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={[styles.searchModalOverlay, isDark && { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
          <View style={[styles.searchModalContainer, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
            <View style={[styles.searchModalHeader, isDark && { borderBottomColor: darkStyles.border }]}>
              <Text style={[styles.searchModalTitle, isDark && { color: darkStyles.text }]}>Search Quran</Text>
              <TouchableOpacity
                style={styles.searchModalCloseButton}
                onPress={() => setShowSearchModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchModalInputContainer, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchModalIcon} />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchModalInput, isDark && { color: darkStyles.text }]}
                placeholder="Search surahs, verses, or keywords..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearchInput}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.searchModalClearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.searchModalResults}>
              {isSearching && (
                <View style={[styles.searchModalLoading, isDark && { backgroundColor: darkStyles.card }]}>
                  <ActivityIndicator size="small" color="#bfa14a" />
                  <Text style={[styles.searchModalLoadingText, isDark && { color: darkStyles.text }]}>Searching...</Text>
                </View>
              )}

              {!isSearching && searchQuery.length > 0 && searchResults && (
                <>
                  {/* Nickname Match */}
                  {searchResults && searchResults.nicknameMatch && (
                    <TouchableOpacity
                      style={[styles.searchModalResultItem, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                      onPress={() => handleSearchResultSelect({
                        type: 'nickname',
                        surah: searchResults.nicknameMatch.surah,
                        verse: searchResults.nicknameMatch.verse
                      })}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.searchModalResultIcon, isDark && { backgroundColor: darkStyles.verseBg }]}>
                        <Ionicons name="star" size={20} color="#bfa14a" />
                      </View>
                      <View style={styles.searchModalResultContent}>
                        <Text style={[styles.searchModalResultTitle, isDark && { color: darkStyles.text }]}>{searchResults.nicknameMatch.name}</Text>
                        <Text style={[styles.searchModalResultSubtitle, isDark && { color: darkStyles.text }]}>Popular verse</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  {/* Exact Verse Match */}
                  {searchResults && searchResults.exactVerse && !searchResults.nicknameMatch && (
                    <TouchableOpacity
                      style={[styles.searchModalResultItem, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                      onPress={() => handleSearchResultSelect({
                        type: 'exactVerse',
                        surah: searchResults.exactVerse.surah,
                        verse: searchResults.exactVerse.verse
                      })}
                    >
                      <View style={[styles.searchModalResultIcon, isDark && { backgroundColor: darkStyles.verseBg }]}>
                        <Ionicons name="locate" size={20} color="#bfa14a" />
                      </View>
                      <View style={styles.searchModalResultContent}>
                        <Text style={[styles.searchModalResultTitle, isDark && { color: darkStyles.text }]}>Verse {searchResults.exactVerse.surah}:{searchResults.exactVerse.verse}</Text>
                        <Text style={[styles.searchModalResultSubtitle, isDark && { color: darkStyles.text }]}>Exact verse reference</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  {/* Surah Results */}
                  {searchResults && searchResults.surahs && searchResults.surahs.length > 0 && (
                    <>
                      <View style={[styles.searchModalSectionHeader, isDark && { borderBottomColor: darkStyles.border }]}>
                        <Text style={[styles.searchModalSectionTitle, isDark && { color: darkStyles.text }]}>Surahs ({searchResults.surahs.length})</Text>
                      </View>
                      {searchResults.surahs.slice(0, 8).map((surah, index) => (
                        <TouchableOpacity
                          key={`surah-${surah.surahNumber}`}
                          style={[styles.searchModalResultItem, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                          onPress={() => handleSearchResultSelect({
                            type: 'surah',
                            surah: surah
                          })}
                        >
                          <View style={[styles.searchModalResultIcon, isDark && { backgroundColor: darkStyles.verseBg }]}>
                            <Ionicons name="book" size={20} color="#666" />
                          </View>
                          <View style={styles.searchModalResultContent}>
                            <Text style={[styles.searchModalResultTitle, isDark && { color: darkStyles.text }]}>
                              {surah.surahNumber}. {surah.name}
                            </Text>
                            <Text style={[styles.searchModalResultSubtitle, isDark && { color: darkStyles.text }]}>{surah.meaning} • {surah.totalVerses} verses</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                  
                  {/* Verse Results */}
                  {searchResults && searchResults.verses && searchResults.verses.length > 0 && (
                    <>
                      <View style={[styles.searchModalSectionHeader, isDark && { borderBottomColor: darkStyles.border }]}>
                        <Text style={[styles.searchModalSectionTitle, isDark && { color: darkStyles.text }]}>Verses ({searchResults.verses.length})</Text>
                      </View>
                      {searchResults.verses.slice(0, 8).map((result, index) => (
                        <TouchableOpacity
                          key={`verse-${result.verse.ayah}-${index}`}
                          style={[styles.searchModalResultItem, isDark && { backgroundColor: darkStyles.card, borderColor: darkStyles.border }]}
                          onPress={() => handleSearchResultSelect({
                            type: 'exactVerse',
                            surah: result.surah.surahNumber,
                            verse: result.verse.ayah
                          })}
                        >
                          <View style={[styles.searchModalResultIcon, isDark && { backgroundColor: darkStyles.verseBg }]}>
                            <Ionicons name="text" size={20} color="#666" />
                          </View>
                          <View style={styles.searchModalResultContent}>
                            <Text style={[styles.searchModalResultTitle, isDark && { color: darkStyles.text }]}>
                              {result.surah.name} {result.surah.surahNumber}:{result.verse.ayah}
                            </Text>
                            <Text style={[styles.searchModalResultSubtitle, isDark && { color: darkStyles.text }]} numberOfLines={2}>
                              {result.verse.english ? result.verse.english.substring(0, 80) + '...' : 'No translation'}
                            </Text>
                            <Text style={[styles.searchModalResultMatchType, isDark && { color: darkStyles.gold }]}>
                              {result.matchType === 'english' ? 'English match' : 'Arabic match'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}
                  
                  {/* No Results */}
                  {searchResults && (!searchResults.nicknameMatch && !searchResults.exactVerse && 
                    (!searchResults.surahs || searchResults.surahs.length === 0) && 
                    (!searchResults.verses || searchResults.verses.length === 0)) && (
                    <View style={[styles.searchModalNoResults, isDark && { backgroundColor: darkStyles.card }]}>
                      <Ionicons name="search" size={48} color="#ccc" />
                      <Text style={[styles.searchModalNoResultsTitle, isDark && { color: darkStyles.text }]}>No results found</Text>
                      <Text style={[styles.searchModalNoResultsText, isDark && { color: darkStyles.text }]}>
                        Try different keywords or check your spelling
                      </Text>
                    </View>
                  )}
                </>
              )}

              {!isSearching && searchQuery.length === 0 && (
                <View style={[styles.searchModalTips, isDark && { backgroundColor: darkStyles.card }]}>
                  <Text style={[styles.searchModalTipsTitle, isDark && { color: darkStyles.text }]}>Search Tips</Text>
                  <View style={[styles.searchModalTipItem, isDark && { borderBottomColor: darkStyles.border }]}>
                    <Ionicons name="star" size={16} color="#bfa14a" />
                    <Text style={[styles.searchModalTipText, isDark && { color: darkStyles.text }]}>Try "ayat ul kursi" for popular verses</Text>
                  </View>
                  <View style={[styles.searchModalTipItem, isDark && { borderBottomColor: darkStyles.border }]}>
                    <Ionicons name="book" size={16} color="#666" />
                    <Text style={[styles.searchModalTipText, isDark && { color: darkStyles.text }]}>Search surah names like "Al-Fatiha" or "Surah 7"</Text>
                  </View>
                  <View style={[styles.searchModalTipItem, isDark && { borderBottomColor: darkStyles.border }]}>
                    <Ionicons name="locate" size={16} color="#666" />
                    <Text style={[styles.searchModalTipText, isDark && { color: darkStyles.text }]}>Use "2:255" or "Surah 5 Verse 2"</Text>
                  </View>
                  <View style={[styles.searchModalTipItem, isDark && { borderBottomColor: darkStyles.border }]}>
                    <Ionicons name="text" size={16} color="#666" />
                    <Text style={[styles.searchModalTipText, isDark && { color: darkStyles.text }]}>Search for keywords in verse content</Text>
                  </View>
                  <View style={[styles.searchModalTipItem, isDark && { borderBottomColor: darkStyles.border }]}>
                    <Ionicons name="search" size={16} color="#666" />
                    <Text style={[styles.searchModalTipText, isDark && { color: darkStyles.text }]}>Try "Baqarah 255" or "Surah 5 2"</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
        <View style={[styles.header, isDark && { backgroundColor: darkStyles.backgroundColor, borderBottomColor: darkStyles.border }]}>
          <Text style={[styles.headerTitle, isDark && { color: darkStyles.text }]}>Quran</Text>
        </View>
        <View style={[styles.loadingContainer, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
          <ActivityIndicator size="large" color="#bfa14a" />
          <Text style={[styles.loadingText, isDark && { color: darkStyles.text }]}>Loading Quran...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentView === 'surah-content') {
    return (
      <SafeAreaView style={[styles.container, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
        <View style={[styles.header, isDark && { backgroundColor: darkStyles.backgroundColor, borderBottomColor: darkStyles.border }]}>
          <Text style={[styles.headerTitle, isDark && { color: darkStyles.text }]}>Quran</Text>
        </View>
        {renderSurahContent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: darkStyles.backgroundColor }]}>
      <View style={[styles.header, isDark && { backgroundColor: darkStyles.backgroundColor, borderBottomColor: darkStyles.border }]}>
        <Text style={[styles.headerTitle, isDark && { color: darkStyles.text }]}>Quran</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            setShowSearchModal(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }}
        >
          <Ionicons name="search" size={24} color="#181818" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredSurahs}
          renderItem={renderSurahItem}
          keyExtractor={(item, index) => (item.surahNumber ? `surah-${item.surahNumber}` : `surah-${index}`)}
          showsVerticalScrollIndicator={true}
          ListHeaderComponent={renderSurahListHeader}
          contentContainerStyle={styles.surahList}
          style={{ flex: 1 }}
          initialNumToRender={114}
          maxToRenderPerBatch={114}
          windowSize={114}
          removeClippedSubviews={false}
          getItemLayout={(data, index) => ({
            length: 80, // Approximate height of each surah item
            offset: 80 * index,
            index,
          })}
        />
      </View>
    </SafeAreaView>
  );
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
  searchButton: {
    padding: 8,
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
  surahListContainer: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#181818',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  verseOfDay: {
    backgroundColor: '#f0e6d0',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.2)',
    activeOpacity: 0.8,
  },
  verseOfDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseOfDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
  },
  verseOfDayDecoration: {
    fontSize: 24,
    color: '#bfa14a',
  },
  verseOfDayContent: {
    alignItems: 'center',
  },
  verseOfDayArabic: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 32,
    paddingVertical: 6,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: 'NotoNaskhArabic',
  },
  verseOfDayTranslation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : Platform.OS === 'ios' ? 'Playfair Display' : 'serif',
  },
  verseOfDayReference: {
    fontSize: 14,
    color: '#bfa14a',
    fontWeight: '500',
  },
  verseOfDayClickHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 161, 74, 0.2)',
  },
  verseOfDayClickText: {
    fontSize: 12,
    color: '#bfa14a',
    marginLeft: 6,
    fontStyle: 'italic',
  },
  searchContainer: {
    marginBottom: 20,
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
    outline: 'none',
    border: 'none',
    background: 'transparent',
    ...(Platform.OS === 'web' && {
      outline: 'none',
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    }),
  },
  surahList: {
    paddingBottom: 20,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.1)',
  },
  surahNumber: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f5f2ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#bfa14a',
  },
  surahNumberText: {
    color: '#181818',
    fontSize: 16,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 2,
  },
  surahArabic: {
    fontSize: 16,
    color: '#bfa14a',
    marginBottom: 3,
    lineHeight: 26,
    paddingVertical: 3,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'web' ? 'Amiri, serif' : 'Amiri',
    fontWeight: '500',
    letterSpacing: 0,
  },
  surahMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  surahType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  surahVerses: {
    fontSize: 12,
    color: '#bfa14a',
    fontWeight: '500',
  },
  surahContentContainer: {
    flex: 1,
    backgroundColor: '#f5f2ea',
    position: 'relative',
  },
  surahHeaderSection: {
    backgroundColor: '#f5f2ea',
    padding: 20,
    paddingBottom: 30,
  },
  versesFlatList: {
    flex: 1,
    backgroundColor: 'transparent',
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
  surahHeader: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#181818',
    marginLeft: 8,
    fontWeight: '500',
  },
  surahTitleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  surahTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 5,
  },
  surahTitleArabic: {
    fontSize: 24,
    color: '#bfa14a',
    marginBottom: 8,
    lineHeight: 48,
    paddingVertical: 16,
    paddingHorizontal: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'web' ? 'Amiri, serif' : 'Amiri',
    textAlign: 'right',
    direction: 'rtl',
    fontWeight: '600',
    letterSpacing: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderRightWidth: 3,
    borderRightColor: '#c3a545',
    textShadowColor: 'rgba(191, 161, 74, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  surahSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  surahVersesCount: {
    fontSize: 14,
    color: '#999',
  },
  languageControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  toggleButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(191, 161, 74, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButtonActive: {
    backgroundColor: 'linear-gradient(135deg, #bfa14a 0%, #d4b76b 100%)',
    borderColor: '#bfa14a',
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  placeholderText: {
    fontSize: 18,
    color: '#181818',
    marginBottom: 10,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  versesList: {
    paddingBottom: 20,
  },
  verseContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 5,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.2)',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f2ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#bfa14a',
  },
  verseNumberText: {
    color: '#181818',
    fontSize: 18,
    fontWeight: '800',
  },
  verseDecoration: {
    fontSize: 20,
    color: '#bfa14a',
  },
  verseArabic: {
    fontSize: 24,
    fontWeight: '500',
    color: '#181818',
    marginBottom: 16,
    textAlign: 'right',
    lineHeight: 48,
    paddingVertical: 16,
    paddingHorizontal: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'web' ? 'Amiri, serif' : 'Amiri',
    letterSpacing: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderRightWidth: 3,
    borderRightColor: '#c3a545',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  verseEnglish: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'Georgia',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  verseUrdu: {
    fontSize: 19,
    color: '#000000',
    marginBottom: 10,
    lineHeight: 28,
    textAlign: 'right',
    paddingVertical: 4,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontFamily: Platform.OS === 'web' ? 'Noto Nastaliq Urdu, serif' : Platform.OS === 'ios' ? 'Noto Nastaliq Urdu' : 'serif',
    fontWeight: 'bold',
  },
  verseTransliteration: {
    fontSize: 15,
    color: '#000000',
    fontStyle: 'italic',
    lineHeight: 20,
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : Platform.OS === 'ios' ? 'Playfair Display' : 'serif',
    fontWeight: 'bold',
  },
  searchDropdown: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.2)',
    maxHeight: 400,
  },
  searchDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  searchDropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181818',
  },
  searchDropdownScroll: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f2ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  searchSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchNoResults: {
    padding: 30,
    alignItems: 'center',
  },
  searchNoResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  searchNoResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // Search Modal Styles
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  searchModalContainer: {
    backgroundColor: '#f5f2ea',
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ece7d8',
  },
  searchModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181818',
  },
  searchModalCloseButton: {
    padding: 8,
  },
  searchModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
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
  searchModalIcon: {
    marginRight: 10,
  },
  searchModalInput: {
    flex: 1,
    fontSize: 16,
    color: '#181818',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    ...(Platform.OS === 'web' && {
      outline: 'none',
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    }),
  },
  searchModalResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchModalResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.1)',
  },
  searchModalResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f2ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  searchModalResultContent: {
    flex: 1,
  },
  searchModalResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 4,
  },
  searchModalResultSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  searchModalResultMatchType: {
    fontSize: 12,
    color: '#bfa14a',
    fontWeight: '500',
    marginTop: 2,
  },
  searchModalSectionHeader: {
    paddingHorizontal: 4,
    paddingVertical: 16,
    marginBottom: 8,
  },
  searchModalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchModalNoResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  searchModalNoResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  searchModalNoResultsTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  searchModalTips: {
    padding: 20,
  },
  searchModalTipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 16,
  },
  searchModalTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchModalTipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  searchModalLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchModalLoadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreButton: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: '#bfa14a',
    shadowColor: '#bfa14a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(191, 161, 74, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  loadMoreButtonLoading: {
    backgroundColor: '#a08a3a',
    shadowOpacity: 0.2,
  },
  loadMoreButtonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  loadMoreIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadMoreButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  loadMoreSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },
  loadMoreButtonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 27,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(191, 161, 74, 0.6)',
    zIndex: 1,
  },
  loadMoreSpinner: {
    marginBottom: 8,
  },
}); 