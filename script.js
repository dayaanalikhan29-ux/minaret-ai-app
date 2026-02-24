// Quran Reader Application
// Main JavaScript file

// Global variables
let quranData = null;
let currentSurah = null;
let searchTimeout = null;
let searchDropdown = null;

// Popular verse nicknames mapping
const verseNicknames = {
    'ayat ul kursi': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
    'verse of the throne': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
    'ayatul kursi': { surah: 2, verse: 255, name: 'Ayat ul Kursi (The Verse of the Throne)' },
    'verse of light': { surah: 24, verse: 35, name: 'Verse of Light' },
    'ayat an-nur': { surah: 24, verse: 35, name: 'Verse of Light' },
    'ayatul nur': { surah: 24, verse: 35, name: 'Verse of Light' },
    'verse of light': { surah: 24, verse: 35, name: 'Verse of Light' },
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

// DOM elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const searchInput = document.getElementById('searchInput');
const searchWarning = document.getElementById('searchWarning');
const surahList = document.getElementById('surahList');
const currentSurahTitle = document.getElementById('currentSurahTitle');
const placeholder = document.querySelector('.placeholder');
const surahContent = document.getElementById('surahContent');
const surahInfo = document.getElementById('surahInfo');
const versesContainer = document.getElementById('versesContainer');
const backButton = document.getElementById('backButton');

// Initialize the application
async function init() {
    console.log('Initializing Quran Reader...');
    
    // Verify essential containers exist
    if (!versesContainer || !surahInfo || !surahList) {
        console.error('One or more critical containers are missing from the DOM!');
        return;
    }
    
    console.log('All containers found successfully');
    
    // Create search dropdown
    createSearchDropdown();
    
    // Setup static event listeners that don't depend on data
    setupEventListeners();

    try {
        // Load and process all necessary data
        await loadQuranData();
        console.log('Quran data loaded and processed successfully');
        
        // Now that data is ready, populate the Surah list
        populateSurahList();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application due to data loading error:', error);
        // Optionally, display a user-friendly error message on the screen
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.innerHTML = '<div class="error-message">Could not load the Quran. Please try refreshing the page.</div>';
        }
        document.getElementById('surah-title').innerText = "Error";
        throw error; // Re-throw the error to be caught by init
    } finally {
        // showLoadingIndicator(false); // Temporarily disabled
    }
}

// Create search dropdown
function createSearchDropdown() {
    searchDropdown = document.createElement('div');
    searchDropdown.className = 'search-dropdown hidden';
    searchDropdown.id = 'searchDropdown';
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(searchDropdown);
}

// Load Quran data from JSON file
async function loadQuranData() {
    try {
        // showLoadingIndicator(true, "Loading Quran data..."); // Temporarily disabled due to tooling issues
        const [mainResponse, urduResponse, transliterationResponse] = await Promise.all([
            fetch('data/ar-en.json'),
            fetch('data/ur.json'),
            fetch('data/en.transliteration.json')
        ]);

        if (!mainResponse.ok || !urduResponse.ok || !transliterationResponse.ok) {
            throw new Error('Failed to fetch one or more Quran data files.');
        }

        const mainData = await mainResponse.json();
        const urduData = await urduResponse.json();
        const transliterationData = await transliterationResponse.json();

        const mainVerseList = mainData.quran || mainData;
        const urduSurahs = urduData.quran || urduData;
        const transliterationSurahs = transliterationData.quran || transliterationData;

        // Create fast lookup maps for translations
        const urduMap = new Map();
        urduSurahs.forEach(surah => {
            surah.verses.forEach(verse => {
                const key = `${surah.id}:${verse.id}`;
                urduMap.set(key, verse.translation);
            });
        });

        const transliterationMap = new Map();
        transliterationSurahs.forEach(surah => {
            surah.verses.forEach(verse => {
                const key = `${surah.id}:${verse.id}`;
                transliterationMap.set(key, verse.transliteration);
            });
        });

        // Merge translations into the main data list
        mainVerseList.forEach(verse => {
            const key = `${verse.chapter_number}:${verse.Ayah_number}`;
            verse.content_ur = urduMap.get(key) || "Urdu translation not available.";
            verse.content_tr = transliterationMap.get(key) || "Transliteration not available.";
        });
        
        quranData = mainVerseList;
        processQuranData(); // Group the flat list into Surahs
        
        // The following lines are temporarily disabled to prevent a startup crash.
        // const randomSurah = quranData[Math.floor(Math.random() * quranData.length)];
        // const randomVerse = randomSurah.verses[Math.floor(Math.random() * randomSurah.verses.length)];
        // displayVerseOfTheDay(randomVerse);

    } catch (e) {
        console.error("Error loading Quran data:", e);
        const surahContent = document.getElementById('surah-content');
        surahContent.innerHTML = `<div class="error-message">Failed to load Quran data. Please check the data files and try again. Error: ${e.message}</div>`;
        document.getElementById('surah-title').innerText = "Error";
        throw e; // Re-throw the error to be caught by init
    } finally {
        // showLoadingIndicator(false); // Temporarily disabled
    }
}

// Process Quran data to group verses by Surah
function processQuranData() {
    if (!quranData || !Array.isArray(quranData)) {
        console.error('Invalid Quran data format');
        return;
    }

    // Group verses by Surah
    const surahs = {};
    
    quranData.forEach(verse => {
        const surahNumber = verse.chapter_number;
        if (!surahs[surahNumber]) {
            // Extract Arabic name from sura name field
            const suraNameParts = verse['sura name']?.split('--') || [];
            const englishName = suraNameParts[0] || `Surah ${surahNumber}`;
            const arabicName = suraNameParts[1] || '';
            
            surahs[surahNumber] = {
                number: surahNumber,
                name: englishName,
                nameArabic: arabicName,
                meaning: verse.meaning || '',
                verses: []
            };
        }
        surahs[surahNumber].verses.push(verse);
    });

    // Convert to array and sort by number
    quranData = Object.values(surahs).sort((a, b) => a.number - b.number);
    console.log('Processed Quran data:', quranData.length, 'surahs');
}

// Populate the Surah list in the sidebar
function populateSurahList() {
    if (!quranData || !Array.isArray(quranData)) return;

    surahList.innerHTML = '';
    
    quranData.forEach(surah => {
        const surahItem = createSurahItem(surah);
        surahList.appendChild(surahItem);
    });
}

// Create a Surah list item
function createSurahItem(surah) {
    const item = document.createElement('div');
    item.className = 'surah-item';
    item.dataset.surahNumber = surah.number;
    
    item.innerHTML = `
        <div class="surah-number">${surah.number}</div>
        <div class="surah-info">
            <div class="surah-name">${surah.name}</div>
            ${surah.nameArabic ? `<div class="surah-name-arabic">${surah.nameArabic}</div>` : ''}
            <div class="surah-details">${surah.verses.length} verses • ${surah.meaning}</div>
        </div>
    `;
    
    item.addEventListener('click', () => {
        console.log('Surah clicked:', surah.name, surah.number);
        selectSurah(surah);
        closeSidebarOnMobile();
    });
    
    return item;
}

// Select a Surah and display its content
function selectSurah(surah) {
    console.log('Selecting Surah:', surah);
    
    if (!surah || !surah.verses) {
        console.error('Invalid Surah data:', surah);
        return;
    }
    
    currentSurah = surah;
    
    // Update active state in sidebar
    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`[data-surah-number="${surah.number}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        console.log('Updated active state in sidebar');
    }
    
    // Update header with both names
    const headerText = surah.nameArabic ? 
        `${surah.name} - ${surah.nameArabic}` : 
        `${surah.name} - ${surah.meaning}`;
    currentSurahTitle.textContent = headerText;
    console.log('Updated header:', headerText);
    
    // Clear and prepare containers
    console.log('Clearing containers...');
    surahInfo.innerHTML = '';
    versesContainer.innerHTML = '';
    
    // Hide placeholder and show content
    console.log('Updating visibility...');
    placeholder.classList.add('hidden');
    surahContent.classList.remove('hidden');
    
    // Display Surah info
    console.log('Displaying Surah info...');
    displaySurahInfo(surah);
    
    // Display verses
    console.log('Displaying verses...');
    displayVerses(surah.verses);
    
    // Scroll to top of content area
    console.log('Scrolling to top...');
    scrollToTop();
    
    console.log(`Surah ${surah.number} (${surah.name}) loaded with ${surah.verses.length} verses`);
}

// Display Surah information with validation
function displaySurahInfo(surah) {
    if (!surah) {
        console.error('No Surah data provided for info display');
        return;
    }
    
    const surahInfoHTML = `
        <h2>${surah.name || 'Unknown Surah'}</h2>
        ${surah.nameArabic ? `<h3 class="surah-name-arabic">${surah.nameArabic}</h3>` : ''}
        <div class="surah-details">Surah ${surah.number} • ${surah.verses ? surah.verses.length : 0} verses</div>
        <div class="surah-translation">${surah.meaning || 'Translation not available'}</div>
    `;
    
    surahInfo.innerHTML = surahInfoHTML;
    console.log('Surah info displayed:', surahInfoHTML);
}

// Display verses with improved error handling
function displayVerses(verses) {
    console.log('Displaying verses:', verses);
    
    if (!verses || !Array.isArray(verses)) {
        console.error('Invalid verses data:', verses);
        versesContainer.innerHTML = '<div class="error-message">Error loading verses</div>';
        return;
    }
    
    // Clear the container first
    versesContainer.innerHTML = '';
    
    // Create and append each verse
    verses.forEach((verse, index) => {
        try {
            console.log(`Creating verse ${index + 1}:`, verse);
            const verseElement = createVerseElement(verse, index + 1);
            if (verseElement) {
                versesContainer.appendChild(verseElement);
                console.log(`Verse ${index + 1} added successfully`);
            } else {
                console.error(`Failed to create verse element for index ${index + 1}`);
            }
        } catch (error) {
            console.error(`Error creating verse ${index + 1}:`, error);
        }
    });
    
    console.log(`Successfully displayed ${verses.length} verses in container:`, versesContainer);
}

// Helper function to format transliteration for readability
function formatTransliteration(text) {
    if (!text) return '';
    // Capitalize important words
    const importantWords = [
        'allah', 'huwa', 'qayyoom', 'rahman', 'raheem', 'rasool', 'deen', 'kitab', 'muhammad', 'jannah', 'jahannam', 'malik', 'yaum', 'deen', 'ar-rahman', 'ar-raheem', 'al-hayy', 'al-qayyoom', 'al-malik', 'al-quddus', 'al-aziz', 'al-hakeem', 'al-aleem', 'al-kabeer', 'al-lateef', 'al-wadood', 'al-ghafoor', 'al-shakoor', 'al-azim', 'al-jabbar', 'al-mutakabbir', 'al-khaliq', 'al-bari', 'al-musawwir', 'al-ghaffar', 'al-qahhar', 'al-wahhab', 'al-razaq', 'al-fattah', 'al-aleem', 'al-qabid', 'al-basir', 'al-hakam', 'al-adl', 'al-latif', 'al-khabir', 'al-halim', 'al-azim', 'al-ghafur', 'al-shakur', 'al-ali', 'al-kabir', 'al-hafiz', 'al-muqit', 'al-hasib', 'al-jalil', 'al-karim', 'al-raqib', 'al-mujib', 'al-wasi', 'al-hakim', 'al-wadud', 'al-majid', 'al-baith', 'al-shahid', 'al-haqq', 'al-wakil', 'al-qawiyy', 'al-mateen', 'al-wali', 'al-hamid', 'al-muhsi', 'al-mubdi', 'al-muid', 'al-muhyi', 'al-mumit', 'al-hayy', 'al-qayyum', 'al-wajid', 'al-majid', 'al-wahid', 'al-ahad', 'al-samad', 'al-qadir', 'al-muqtadir', 'al-muqaddim', 'al-muakhkhir', 'al-awwal', 'al-akhir', 'al-zahir', 'al-batin', 'al-wali', 'al-mutaali', 'al-barr', 'al-tawwab', 'al-muntaqim', 'al-afuw', 'al-rauf', 'malik', 'yaum', 'deen'
    ];
    // Capitalize important words
    let formatted = text.replace(/\b([a-zA-Z\-']+)\b/g, (word) => {
        if (importantWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });
    // Add line breaks at common pauses (comma, semicolon, dash, or double space)
    formatted = formatted.replace(/([,;—\-])\s*/g, '$1<br>');
    // Add extra spacing after ayah endings (| or similar)
    formatted = formatted.replace(/\|/g, '<span style="display:inline-block;width:1em;"></span>');
    // Add a little more line height for readability
    return `<span style="line-height:2;">${formatted}</span>`;
}

// Create a verse element with enhanced validation
function createVerseElement(verse, verseNumber) {
    if (!verse) {
        console.error('Invalid verse data:', verse);
        return null;
    }
    
    // Validate required fields
    if (!verse.chapter_number || !verse.Ayah_number) {
        console.error('Missing required verse data:', verse);
        return null;
    }
    
    const verseDiv = document.createElement('div');
    verseDiv.className = 'verse';
    verseDiv.id = `verse-${verse.chapter_number}-${verse.Ayah_number}`;
    verseDiv.setAttribute('data-verse-number', verse.Ayah_number);
    verseDiv.setAttribute('data-surah-number', verse.chapter_number);
    
    // Ensure content exists or provide fallback
    const arabicText = verse.content_ar || 'Arabic text not available';
    const englishText = verse.content_en || 'Translation not available';
    const urduText = verse.content_ur || 'Urdu translation not available';
    const transliterationText = verse.content_tr || 'Transliteration not available';
    const pageId = verse.pageid || 'N/A';
    
    verseDiv.innerHTML = `
        <div class="verse-header">
            <div class="verse-number">${verseNumber}</div>
            <div class="verse-info">Verse ${verse.Ayah_number} • Page ${pageId}</div>
        </div>
        <div class="arabic-text">${arabicText}</div>
        <div class="english-text">${englishText}</div>
        <div class="urdu-text hidden">
            <span class="translation-label">Urdu Translation:</span>
            ${urduText}
        </div>
        <div class="transliteration-text hidden">
            <span class="translation-label">Transliteration:</span>
            ${formatTransliteration(transliterationText)}
        </div>
    `;
    
    console.log(`Created verse element with ID: ${verseDiv.id}`);
    return verseDiv;
}

// Search functionality
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Hide warning after 3 seconds
        searchTimeout = setTimeout(() => {
            searchWarning.classList.add('hidden');
        }, 3000);
        
        if (query === '') {
            showAllSurahs();
            searchWarning.classList.add('hidden');
            hideSearchDropdown();
            return;
        }
        
        // Perform enhanced smart search
        performEnhancedSearch(query);
    });
    
    // Handle search input focus
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            showSearchDropdown();
        }
    });
    
    // Handle clicks outside search
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            hideSearchDropdown();
        }
    });
}

// Enhanced smart search function
function performEnhancedSearch(query) {
    if (!quranData) return;
    
    const normalizedQuery = normalizeSearchQuery(query);
    const results = {
        surahs: [],
        verses: [],
        exactVerse: null,
        nicknameMatch: null
    };
    
    // Check for verse nicknames first
    results.nicknameMatch = checkVerseNicknames(normalizedQuery);
    
    // Check for natural language parsing
    const naturalLanguageResult = parseNaturalLanguage(query);
    if (naturalLanguageResult) {
        results.exactVerse = naturalLanguageResult;
    }
    
    // Check for direct verse reference (e.g., "2:255")
    if (!results.exactVerse && !results.nicknameMatch) {
        const verseMatch = query.match(/^(\d+):(\d+)$/);
        if (verseMatch) {
            const surahNum = parseInt(verseMatch[1]);
            const verseNum = parseInt(verseMatch[2]);
            results.exactVerse = findExactVerse(surahNum, verseNum);
        }
    }
    
    // Search Surahs with flexible matching
    results.surahs = searchSurahs(normalizedQuery);
    
    // Search verses for keywords
    results.verses = searchVerses(normalizedQuery);
    
    // Display results in dropdown
    displaySearchDropdown(results, query);
    
    // Show/hide warning
    if (results.surahs.length === 0 && results.verses.length === 0 && !results.exactVerse && !results.nicknameMatch) {
        searchWarning.classList.remove('hidden');
    } else {
        searchWarning.classList.add('hidden');
    }
}

// Check for verse nicknames
function checkVerseNicknames(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Direct nickname match
    if (verseNicknames[normalizedQuery]) {
        const nickname = verseNicknames[normalizedQuery];
        return findExactVerse(nickname.surah, nickname.verse);
    }
    
    // Partial nickname match
    for (const [nickname, info] of Object.entries(verseNicknames)) {
        if (nickname.includes(normalizedQuery) || normalizedQuery.includes(nickname)) {
            return findExactVerse(info.surah, info.verse);
        }
    }
    
    return null;
}

// Parse natural language queries
function parseNaturalLanguage(query) {
    const normalizedQuery = query.toLowerCase();
    
    // Patterns for natural language parsing
    const patterns = [
        // "Surah Baqarah Verse 255" or "Surah Yaseen Ayah 9"
        /surah\s+([a-z\s-]+)\s+(?:verse|ayah|ayat)\s+(\d+)/i,
        // "Surah Al-Baqarah 255" or "Surah Yaseen 9"
        /surah\s+([a-z\s-]+)\s+(\d+)/i,
        // "Baqarah 255" or "Yaseen 9"
        /^([a-z\s-]+)\s+(\d+)$/i,
        // "SurahAlbaqarah255" (no spaces)
        /surah([a-z]+)(\d+)/i,
        // "Albaqarah255" (no spaces)
        /^([a-z]+)(\d+)$/i
    ];
    
    for (const pattern of patterns) {
        const match = normalizedQuery.match(pattern);
        if (match) {
            const surahName = match[1].trim();
            const verseNumber = parseInt(match[2]);
            
            // Find Surah by name
            const surah = findSurahByName(surahName);
            if (surah && verseNumber > 0) {
                return findExactVerse(surah.number, verseNumber);
            }
        }
    }
    
    return null;
}

// Find Surah by flexible name matching
function findSurahByName(name) {
    const normalizedName = normalizeSearchQuery(name);
    
    return quranData.find(surah => {
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
}

// Display search results in dropdown
function displaySearchDropdown(results, originalQuery) {
    if (!searchDropdown) return;
    
    searchDropdown.innerHTML = '';
    
    // If nickname match found, show it prominently
    if (results.nicknameMatch) {
        const nicknameDiv = createNicknameResult(results.nicknameMatch, originalQuery);
        searchDropdown.appendChild(nicknameDiv);
    }
    
    // If exact verse found, show it prominently
    if (results.exactVerse && !results.nicknameMatch) {
        const exactVerseDiv = createDropdownExactVerseResult(results.exactVerse);
        searchDropdown.appendChild(exactVerseDiv);
    }
    
    // Show matching Surahs
    if (results.surahs.length > 0) {
        const surahsHeader = document.createElement('div');
        surahsHeader.className = 'dropdown-section-header';
        surahsHeader.innerHTML = `<h4>Surahs (${results.surahs.length})</h4>`;
        searchDropdown.appendChild(surahsHeader);
        
        results.surahs.slice(0, 5).forEach(surah => { // Limit to 5 results
            const surahItem = createDropdownSurahItem(surah);
            searchDropdown.appendChild(surahItem);
        });
    }
    
    // Show matching verses
    if (results.verses.length > 0) {
        const versesHeader = document.createElement('div');
        versesHeader.className = 'dropdown-section-header';
        versesHeader.innerHTML = `<h4>Verses (${results.verses.length})</h4>`;
        searchDropdown.appendChild(versesHeader);
        
        results.verses.slice(0, 3).forEach(result => { // Limit to 3 results
            const verseItem = createDropdownVerseItem(result);
            searchDropdown.appendChild(verseItem);
        });
    }
    
    // Show no results message
    if (results.surahs.length === 0 && results.verses.length === 0 && !results.exactVerse && !results.nicknameMatch) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'dropdown-no-results';
        noResultsDiv.innerHTML = `
            <div class="no-results-content">
                <p>No results found for "${originalQuery}"</p>
                <div class="search-suggestions">
                    <p><strong>Try:</strong></p>
                    <ul>
                        <li>"Ayat ul Kursi" or "Verse of Light"</li>
                        <li>"Surah Baqarah Verse 255"</li>
                        <li>"Surah Yaseen" or "Al-Fatiha"</li>
                        <li>"2:255" for direct verse reference</li>
                    </ul>
                </div>
            </div>
        `;
        searchDropdown.appendChild(noResultsDiv);
    }
    
    showSearchDropdown();
}

// Create nickname result element
function createNicknameResult(nicknameMatch, query) {
    const div = document.createElement('div');
    div.className = 'dropdown-nickname-result';
    
    // Find the nickname that matched
    let nicknameName = '';
    for (const [nickname, info] of Object.entries(verseNicknames)) {
        if (info.surah === nicknameMatch.surah.number && info.verse === nicknameMatch.verse.Ayah_number) {
            nicknameName = info.name;
            break;
        }
    }
    
    div.innerHTML = `
        <div class="nickname-header">
            <div class="nickname-icon">⭐</div>
            <div class="nickname-info">
                <h4>${nicknameName}</h4>
                <div class="verse-reference">${nicknameMatch.surah.number}:${nicknameMatch.verse.Ayah_number}</div>
            </div>
        </div>
        <div class="nickname-content">
            <div class="arabic-text">${nicknameMatch.verse.content_ar || ''}</div>
            <div class="english-text">${truncateText(nicknameMatch.verse.content_en || '', 100)}</div>
        </div>
        <button class="view-verse-btn" onclick="handleNicknameClick(${nicknameMatch.surah.number}, ${nicknameMatch.verse.Ayah_number})">
            View Verse
        </button>
    `;
    return div;
}

// Create dropdown exact verse result
function createDropdownExactVerseResult(exactVerse) {
    const div = document.createElement('div');
    div.className = 'dropdown-exact-verse-result';
    div.innerHTML = `
        <div class="exact-verse-header">
            <h4>Exact Verse Found</h4>
            <div class="verse-reference">${exactVerse.surah.number}:${exactVerse.verse.Ayah_number}</div>
        </div>
        <div class="exact-verse-content">
            <div class="arabic-text">${exactVerse.verse.content_ar || ''}</div>
            <div class="english-text">${truncateText(exactVerse.verse.content_en || '', 100)}</div>
        </div>
        <button class="view-verse-btn" onclick="handleExactVerseClick(${exactVerse.surah.number}, ${exactVerse.verse.Ayah_number})">
            View Verse
        </button>
    `;
    return div;
}

// Create dropdown Surah item
function createDropdownSurahItem(surah) {
    const div = document.createElement('div');
    div.className = 'dropdown-surah-item';
    div.innerHTML = `
        <div class="surah-number">${surah.number}</div>
        <div class="surah-info">
            <div class="surah-name">${surah.name}</div>
            ${surah.nameArabic ? `<div class="surah-name-arabic">${surah.nameArabic}</div>` : ''}
            <div class="surah-details">${surah.verses.length} verses</div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        console.log('Dropdown Surah clicked:', surah.name, surah.number);
        selectSurah(surah);
        hideSearchDropdown();
        closeSidebarOnMobile();
    });
    
    return div;
}

// Create dropdown verse item
function createDropdownVerseItem(result) {
    const div = document.createElement('div');
    div.className = 'dropdown-verse-item';
    div.innerHTML = `
        <div class="verse-header">
            <div class="verse-number">${result.surah.number}:${result.verse.Ayah_number}</div>
            <div class="surah-name">${result.surah.name}</div>
        </div>
        <div class="verse-content">
            <div class="english-text">${highlightSearchTerms(truncateText(result.verse.content_en || '', 80), result.matchType === 'english' ? result.query : '')}</div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        console.log('Dropdown verse clicked:', result.surah.number, result.verse.Ayah_number);
        selectSurahAndScrollToVerse(result.surah.number, result.verse.Ayah_number);
        hideSearchDropdown();
    });
    
    return div;
}

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function showSearchDropdown() {
    if (searchDropdown) {
        searchDropdown.classList.remove('hidden');
    }
}

function hideSearchDropdown() {
    if (searchDropdown) {
        searchDropdown.classList.add('hidden');
    }
}

// Normalize search query for flexible matching
function normalizeSearchQuery(query) {
    return query
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
}

// Search Surahs with flexible name matching
function searchSurahs(query) {
    return quranData.filter(surah => {
        // Normalize Surah names for comparison
        const normalizedName = normalizeSearchQuery(surah.name);
        const normalizedMeaning = normalizeSearchQuery(surah.meaning);
        const normalizedArabic = surah.nameArabic ? normalizeSearchQuery(surah.nameArabic) : '';
        const number = surah.number.toString();
        
        // Remove "surah" prefix if present in query
        const cleanQuery = query.replace(/^surah\s+/i, '');
        
        return normalizedName.includes(cleanQuery) ||
               normalizedMeaning.includes(cleanQuery) ||
               normalizedArabic.includes(cleanQuery) ||
               number.includes(cleanQuery) ||
               // Handle variations like "Al Anaam" vs "Al-Anaam"
               normalizedName.replace(/\s+/g, '').includes(cleanQuery.replace(/\s+/g, '')) ||
               // Handle "Surah" prefix variations
               `surah ${normalizedName}`.includes(cleanQuery) ||
               `surah ${normalizedMeaning}`.includes(cleanQuery);
    });
}

// Search verses for keywords in English translation
function searchVerses(query) {
    const results = [];
    const maxResults = 10; // Limit results for performance
    
    for (const surah of quranData) {
        for (const verse of surah.verses) {
            if (results.length >= maxResults) break;
            
            const englishText = (verse.content_en || '').toLowerCase();
            const arabicText = (verse.content_ar || '').toLowerCase();
            
            // Check if query matches English translation
            if (englishText.includes(query)) {
                results.push({
                    surah: surah,
                    verse: verse,
                    matchType: 'english',
                    query: query,
                    relevance: calculateRelevance(englishText, query)
                });
            }
            // Check if query matches Arabic text (basic matching)
            else if (arabicText.includes(query)) {
                results.push({
                    surah: surah,
                    verse: verse,
                    matchType: 'arabic',
                    query: query,
                    relevance: calculateRelevance(arabicText, query)
                });
            }
        }
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
}

// Calculate relevance score for verse matches
function calculateRelevance(text, query) {
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
}

// Find exact verse by Surah:Verse reference
function findExactVerse(surahNum, verseNum) {
    const surah = quranData.find(s => s.number === surahNum);
    if (!surah) return null;
    
    const verse = surah.verses.find(v => v.Ayah_number === verseNum);
    if (!verse) return null;
    
    return { surah, verse };
}

// Highlight search terms in text
function highlightSearchTerms(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Handle nickname click
function handleNicknameClick(surahNumber, verseNumber) {
    selectSurahAndScrollToVerse(surahNumber, verseNumber);
    hideSearchDropdown();
}

// Handle exact verse click
function handleExactVerseClick(surahNumber, verseNumber) {
    selectSurahAndScrollToVerse(surahNumber, verseNumber);
    hideSearchDropdown();
}

// Enhanced function to select Surah and scroll to specific verse with highlighting
function selectSurahAndScrollToVerse(surahNumber, verseNumber) {
    console.log(`Attempting to select Surah ${surahNumber} and scroll to verse ${verseNumber}`);
    
    const surah = quranData.find(s => s.number === surahNumber);
    if (!surah) {
        console.error(`Surah ${surahNumber} not found`);
        return;
    }
    
    console.log(`Found Surah: ${surah.name} with ${surah.verses.length} verses`);
    
    // Select the Surah first
    selectSurah(surah);
    
    // Scroll to specific verse after content is loaded
    setTimeout(() => {
        const verseElement = document.getElementById(`verse-${surahNumber}-${verseNumber}`);
        console.log(`Looking for verse element with ID: verse-${surahNumber}-${verseNumber}`);
        
        if (verseElement) {
            console.log('Verse element found, scrolling and highlighting...');
            
            // Scroll to the verse smoothly
            verseElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            
            // Add highlight class for animation
            verseElement.classList.add('verse-highlight');
            
            // Remove highlight class after animation completes
            setTimeout(() => {
                verseElement.classList.remove('verse-highlight');
                console.log('Verse highlighting completed');
            }, 3000); // 3 seconds total animation time
        } else {
            console.warn(`Verse ${surahNumber}:${verseNumber} not found in DOM`);
            // Try alternative selector
            const altElement = document.querySelector(`[data-verse-number="${verseNumber}"][data-surah-number="${surahNumber}"]`);
            if (altElement) {
                console.log('Found verse using alternative selector');
                altElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                altElement.classList.add('verse-highlight');
                setTimeout(() => altElement.classList.remove('verse-highlight'), 3000);
            }
        }
    }, 500); // Increased delay to ensure content is fully rendered
}

// Show all Surahs (clear search)
function showAllSurahs() {
    populateSurahList();
}

// Mobile sidebar functionality
function setupMobileSidebar() {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Close sidebar on mobile after selection
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

// Scroll to top of content
function scrollToTop() {
    const contentArea = document.querySelector('.content-area');
    contentArea.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Go back to Surah selection
function goBack() {
    // Clear current Surah
    currentSurah = null;
    
    // Update header
    currentSurahTitle.textContent = 'Select a Surah to begin reading';
    
    // Clear active state in sidebar
    document.querySelectorAll('.surah-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Hide content and show placeholder
    surahContent.classList.add('hidden');
    placeholder.classList.remove('hidden');
    
    // Scroll to top
    scrollToTop();
}

// Setup back button functionality
function setupBackButton() {
    backButton.addEventListener('click', goBack);
}

// Setup all event listeners
function setupEventListeners() {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    setupSearch();
    setupBackButton();

    // Language Toggles
    const urduToggle = document.getElementById('urduToggle');
    const transliterationToggle = document.getElementById('transliterationToggle');

    const updateVerseVisibility = () => {
        const showUrdu = urduToggle.checked;
        const showTransliteration = transliterationToggle.checked;

        document.querySelectorAll('.verse').forEach(verseElement => {
            const urduEl = verseElement.querySelector('.urdu-text');
            const translitEl = verseElement.querySelector('.transliteration-text');

            if (urduEl) {
                urduEl.classList.toggle('hidden', !showUrdu);
            }
            if (translitEl) {
                translitEl.classList.toggle('hidden', !showTransliteration);
            }
        });
    };

    if (urduToggle) {
        urduToggle.addEventListener('change', updateVerseVisibility);
    }

    if (transliterationToggle) {
        transliterationToggle.addEventListener('change', updateVerseVisibility);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

function displayVerseOfTheDay(verse) {
    if (!verse) return;
    const verseContent = `"${verse.content_ar}"`;
    const verseTranslation = `"${verse.content_en}"`;
    const verseRef = `(${verse['sura name'].split('--')[0]}:${verse.Ayah_number})`;

    // Update the elements in the placeholder
    const arabicEl = document.querySelector('.verse-of-day-arabic');
    const translationEl = document.querySelector('.verse-of-day-translation');
    const refEl = document.querySelector('.verse-of-day-reference');

    if(arabicEl) arabicEl.textContent = verseContent;
    if(translationEl) translationEl.textContent = verseTranslation;
    if(refEl) refEl.textContent = verseRef;
}

// Show or hide the main loading indicator
function showLoadingIndicator(show, message = "Loading...") {
    const overlay = document.getElementById('loading-overlay');
    const msgElement = document.getElementById('loading-message');
    if (overlay) {
        if (msgElement) {
            msgElement.textContent = message;
        }
        overlay.classList.toggle('hidden', !show);
    }
}