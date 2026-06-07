// Quran Data Utility
// Loads and merges Quran data for the React Native app

// Only load surah info on startup (small file)
const surahInfo = require('../data/surah.json');

// Cache for loaded surah data
const surahDataCache = {};
let processedSurahs = null;

// Helper: create a map for fast lookup
function createVerseMap(arr, field) {
  const map = {};
  arr.forEach(v => {
    const key = `${v.chapter_number}:${v.Ayah_number}`;
    map[key] = v[field];
  });
  return map;
}

// Helper: create a map for nested verse structure (for Urdu and transliteration)
function createNestedVerseMap(arr, field) {
  const map = {};
  arr.forEach(surah => {
    if (surah.verses && Array.isArray(surah.verses)) {
      surah.verses.forEach(verse => {
        const key = `${surah.id}:${verse.id}`;
        map[key] = verse[field];
      });
    }
  });
  return map;
}

// Main function to get all surahs (without verse data)
function getAllSurahs() {
  try {
    // Return cached data if available
    if (processedSurahs) {
      console.log('Returning cached surahs:', processedSurahs.length);
      return processedSurahs;
    }

    console.log('Loading surah info...');
    console.log('Surah info length:', surahInfo.length);

    // Build the surah array (without verses initially)
    const allSurahs = surahInfo.map((surah) => {
      const surahNumber = parseInt(surah.index);
      return {
        surahNumber: surahNumber,
        name: surah.title || `Surah ${surahNumber}`,
        nameArabic: surah.titleAr || '',
        meaning: surah.title || `Surah ${surahNumber}`,
        revelationType: surah.type || 'Unknown',
        totalVerses: surah.count || 0,
        description: `${surah.type || 'Unknown'} surah revealed in ${surah.place || 'Unknown'}`,
        verses: [], // Empty initially, will be loaded on demand
        _verseData: null, // Internal flag to track if verses are loaded
      };
    });

    console.log('Processed surahs (without verses):', allSurahs.length);
    processedSurahs = allSurahs;
    return allSurahs;
  } catch (error) {
    console.error('Error in getAllSurahs:', error);
    return [];
  }
}

// Function to load verses for a specific surah on demand
function getSurahVerses(surahNumber) {
  try {
    // Check cache first
    const cacheKey = `surah-${surahNumber.toString().padStart(3, '0')}`;
    if (surahDataCache[cacheKey]) {
      console.log(`Returning cached verses for surah ${surahNumber}`);
      return surahDataCache[cacheKey];
    }

    // Load from split file
    const fileName = `surah-${surahNumber.toString().padStart(3, '0')}.json`;
    const filePath = require.resolve(`../data/quran-surahs/${fileName}`);
    const surahData = require(filePath);

    console.log(`Loading verses for surah ${surahNumber} from split file`);
    console.log(`Found ${surahData.arEn.length} verses in ar-en data`);

    // Merge the data
    const surahVerses = surahData.arEn.map((v, index) => {
      const urduText = surahData.ur[index]?.translation || '';
      const translitText = surahData.transliteration[index]?.transliteration || '';

      return {
        ayah: v.Ayah_number,
        arabic: normalizeArabicText(v.content_ar),
        english: v.content_en,
        urdu: urduText,
        transliteration: translitText,
      };
    });

    // Cache the result
    surahDataCache[cacheKey] = surahVerses;

    console.log(`Loaded ${surahVerses.length} verses for surah ${surahNumber}`);
    return surahVerses;
  } catch (error) {
    console.error('Error loading surah verses:', error);
    return [];
  }
}

// Normalize Arabic text to use consistent Unicode characters
function normalizeArabicText(text) {
  if (!text) return text;
  
  return text
    // Normalize Unicode to NFC form (combines characters properly)
    .normalize('NFC')
    // Remove zero-width characters that can cause rendering issues
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize common Arabic character variations to standard forms
    .replace(/ٱ/g, 'ا')  // U+0671 to U+0627 (alif with hamza above)
    .replace(/ٲ/g, 'ا')  // U+0672 to U+0627 (alif with hamza below)
    .replace(/ٳ/g, 'ا')  // U+0673 to U+0627 (alif with hamza wasla)
    .replace(/ٴ/g, 'ء')  // U+0674 to U+0621 (high hamza)
    .replace(/ٵ/g, 'آ')  // U+0675 to U+0622 (alif with hamza madda)
    .replace(/ٶ/g, 'ؤ')  // U+0676 to U+0624 (waw with hamza)
    .replace(/ٷ/g, 'ئ')  // U+0677 to U+0626 (ya with hamza)
    .replace(/ٸ/g, 'ي')  // U+0678 to U+064A (ya with hamza)
    // Normalize diacritical marks (harakat) to standard forms
    .replace(/[\u064B-\u065F]/g, (match) => {
      // Map all Arabic diacritical marks to their standard forms
      const diacriticsMap = {
        '\u064B': '\u064B', // Fathatan
        '\u064C': '\u064C', // Dammatan
        '\u064D': '\u064D', // Kasratan
        '\u064E': '\u064E', // Fatha
        '\u064F': '\u064F', // Damma
        '\u0650': '\u0650', // Kasra
        '\u0651': '\u0651', // Shadda
        '\u0652': '\u0652', // Sukun
        '\u0653': '\u0653', // Maddah above
        '\u0654': '\u0654', // Hamza above
        '\u0655': '\u0655', // Hamza below
        '\u0656': '\u0656', // Subscript alef
        '\u0657': '\u0657', // Inverted damma
        '\u0658': '\u0658', // Mark noon ghunna
        '\u0659': '\u0659', // Zwarakay
        '\u065A': '\u065A', // Vowel sign small v above
        '\u065B': '\u065B', // Vowel sign small v below
        '\u065C': '\u065C', // Vowel sign small inverted v above
        '\u065D': '\u065D', // Vowel sign small inverted v below
        '\u065E': '\u065E', // Vowel sign small inverted v below
        '\u065F': '\u065F', // Vowel sign small inverted v below
      };
      return diacriticsMap[match] || match;
    })
    // Normalize Persian/Urdu characters to Arabic equivalents
    .replace(/ک/g, 'ك')  // Persian kaf to Arabic kaf
    .replace(/ی/g, 'ي')  // Persian ya to Arabic ya
    .replace(/گ/g, 'ك')  // Persian gaf to Arabic kaf
    .replace(/چ/g, 'ج')  // Persian che to Arabic jeem
    .replace(/پ/g, 'ب')  // Persian pe to Arabic beh
    .replace(/ژ/g, 'ز')  // Persian zhe to Arabic zain
    .replace(/ګ/g, 'ك')  // Pashto gaf to Arabic kaf
    .replace(/ڼ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ړ/g, 'ر')  // Pashto re to Arabic ra
    .replace(/ږ/g, 'ز')  // Pashto zhe to Arabic zain
    .replace(/ښ/g, 'س')  // Pashto sin to Arabic sin
    .replace(/څ/g, 'ج')  // Pashto tse to Arabic jeem
    .replace(/ځ/g, 'ح')  // Pashto tse to Arabic ha
    .replace(/ډ/g, 'د')  // Pashto dal to Arabic dal
    .replace(/ڊ/g, 'ذ')  // Pashto zal to Arabic thal
    .replace(/ڋ/g, 'ع')  // Pashto ain to Arabic ain
    .replace(/ڍ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڎ/g, 'ق')  // Pashto qaf to Arabic qaf
    .replace(/ڏ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڐ/g, 'ل')  // Pashto lam to Arabic lam
    .replace(/ڑ/g, 'م')  // Pashto mim to Arabic mim
    .replace(/ڒ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ړ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ڔ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ڕ/g, 'ي')  // Pashto ya to Arabic ya
    .replace(/ږ/g, 'ى')  // Pashto ye to Arabic alif maksura
    .replace(/ڗ/g, 'ة')  // Pashto taa marbuta to Arabic taa marbuta
    .replace(/ژ/g, 'ز')  // Pashto zhe to Arabic zain
    .replace(/ڙ/g, 'ر')  // Pashto re to Arabic ra
    .replace(/ښ/g, 'س')  // Pashto sin to Arabic sin
    .replace(/ڛ/g, 'ش')  // Pashto sheen to Arabic sheen
    .replace(/ڜ/g, 'ص')  // Pashto sad to Arabic sad
    .replace(/ڝ/g, 'ض')  // Pashto dad to Arabic dad
    .replace(/ڞ/g, 'ط')  // Pashto tah to Arabic tah
    .replace(/ڟ/g, 'ظ')  // Pashto zah to Arabic zah
    .replace(/ڠ/g, 'ع')  // Pashto ain to Arabic ain
    .replace(/ڡ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڢ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڣ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڤ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڥ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڦ/g, 'ف')  // Pashto fe to Arabic fe
    .replace(/ڧ/g, 'ق')  // Pashto qaf to Arabic qaf
    .replace(/ڨ/g, 'ق')  // Pashto qaf to Arabic qaf
    .replace(/ڪ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ګ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڬ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڭ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڮ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/گ/g, 'ك')  // Pashto gaf to Arabic kaf
    .replace(/ڰ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڱ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڲ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڳ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڴ/g, 'ك')  // Pashto kaf to Arabic kaf
    .replace(/ڵ/g, 'ل')  // Pashto lam to Arabic lam
    .replace(/ڶ/g, 'ل')  // Pashto lam to Arabic lam
    .replace(/ڷ/g, 'ل')  // Pashto lam to Arabic lam
    .replace(/ڸ/g, 'ل')  // Pashto lam to Arabic lam
    .replace(/ڹ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ں/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ڻ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ڼ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ڽ/g, 'ن')  // Pashto nun to Arabic nun
    .replace(/ھ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ڿ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ۀ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ہ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ۂ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ۃ/g, 'ه')  // Pashto he to Arabic ha
    .replace(/ۄ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۅ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۆ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۇ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۈ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۉ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۊ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ۋ/g, 'و')  // Pashto waw to Arabic waw
    .replace(/ی/g, 'ي')  // Pashto ya to Arabic ya
    .replace(/ۍ/g, 'ي')  // Pashto ya to Arabic ya
    .replace(/ێ/g, 'ي')  // Pashto ya to Arabic ya
    .replace(/ۏ/g, 'ي')  // U+06CF to U+064A
    .replace(/ې/g, 'ي')  // U+06D0 to U+064A
    .replace(/ۑ/g, 'ي')  // U+06D1 to U+064A
    .replace(/ے/g, 'ي')  // U+06D2 to U+064A
    .replace(/ۓ/g, 'ي')  // U+06D3 to U+064A
    .replace(/ۖ/g, '')   // Remove special marks
    .replace(/ۗ/g, '')   // Remove special marks
    .replace(/ۘ/g, '')   // Remove special marks
    .replace(/ۙ/g, '')   // Remove special marks
    .replace(/ۚ/g, '')   // Remove special marks
    .replace(/ۛ/g, '')   // Remove special marks
    .replace(/ۜ/g, '')   // Remove special marks
    .replace(/۝/g, '')   // Remove special marks
    .replace(/۞/g, '')   // Remove special marks
    .replace(/۟/g, '')   // Remove special marks
    .replace(/۠/g, '')   // Remove special marks
    .replace(/ۡ/g, '')   // Remove special marks
    .replace(/ۢ/g, '')   // Remove special marks
    .replace(/ۣ/g, '')   // Remove special marks
    .replace(/ۤ/g, '')   // Remove special marks
    .replace(/ۥ/g, '')   // Remove special marks
    .replace(/ۦ/g, '')   // Remove special marks
    .replace(/ۧ/g, '')   // Remove special marks
    .replace(/ۨ/g, '')   // Remove special marks
    .replace(/۩/g, '')   // Remove special marks
    .replace(/۪/g, '')   // Remove special marks
    .replace(/۫/g, '')   // Remove special marks
    .replace(/۬/g, '')   // Remove special marks
    .replace(/ۭ/g, '')   // Remove special marks
    .replace(/ۮ/g, '')   // Remove special marks
    .replace(/ۯ/g, '')   // Remove special marks
    .replace(/۰/g, '0')  // Persian digits to Arabic
    .replace(/۱/g, '1')
    .replace(/۲/g, '2')
    .replace(/۳/g, '3')
    .replace(/۴/g, '4')
    .replace(/۵/g, '5')
    .replace(/۶/g, '6')
    .replace(/۷/g, '7')
    .replace(/۸/g, '8')
    .replace(/۹/g, '9');
}

module.exports = {
  getAllSurahs,
  getSurahVerses,
}; 