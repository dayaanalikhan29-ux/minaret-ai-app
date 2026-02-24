console.log('Main script loaded!');

// Global variables
let allHadiths = [];
let filteredHadiths = [];
let displayedHadiths = [];
let currentCategory = null;
let currentFilters = {
  search: '',
  source: 'all',
  length: 'all',
  arabicVisible: true
};
let bookmarks = JSON.parse(localStorage.getItem('hadithBookmarks') || '[]');
let hadithsPerPage = 50;

// DOM elements
const welcomeScreen = document.getElementById('welcomeScreen');
const hadithViewer = document.getElementById('hadithViewer');
const categoriesGrid = document.getElementById('categoriesGrid');
const surpriseMeBtn = document.getElementById('surpriseMeBtn');
const selectedCategoryDisplay = document.getElementById('selectedCategoryDisplay');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const sourceFilter = document.getElementById('sourceFilter');
const lengthFilter = document.getElementById('lengthFilter');
const arabicToggle = document.getElementById('arabicToggle');
const bookmarksBtn = document.getElementById('bookmarksBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const activeFilters = document.getElementById('activeFilters');
const hadithContainer = document.getElementById('hadithContainer');
const hadithCount = document.getElementById('hadithCount');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const noResults = document.getElementById('noResults');
const themeToggle = document.getElementById('themeToggle');
const bookmarkModal = document.getElementById('bookmarkModal');
const shareModal = document.getElementById('shareModal');
const changeCategoryBtn = document.getElementById('changeCategoryBtn');
const scrollToTopBtn = document.getElementById('scrollToTop');
const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');
const closeHadithViewerBtn = document.getElementById('closeHadithViewerBtn');

// Category definitions with descriptions and icons
const categories = {
  'Prayer': {
    name: 'Prayer',
    icon: '🕌',
    description: 'Hadiths about salah, prayer times, and worship',
    keywords: ['prayer', 'salah', 'namaz', 'worship', 'adhan', 'iqama', 'rakat']
  },
  'Honesty': {
    name: 'Honesty & Truthfulness',
    icon: '🤝',
    description: 'Hadiths about honesty, truthfulness, and trustworthiness',
    keywords: ['honest', 'truth', 'trust', 'sincere', 'faithful', 'integrity']
  },
  'Jannah': {
    name: 'Paradise (Jannah)',
    icon: '🌺',
    description: 'Hadiths about the rewards of Paradise and its descriptions',
    keywords: ['paradise', 'jannah', 'heaven', 'reward', 'garden', 'eternal']
  },
  'Knowledge': {
    name: 'Knowledge & Learning',
    icon: '📚',
    description: 'Hadiths about seeking knowledge and education',
    keywords: ['knowledge', 'learn', 'study', 'education', 'wisdom', 'ilm']
  },
  'Charity': {
    name: 'Charity & Generosity',
    icon: '💰',
    description: 'Hadiths about giving charity and helping others',
    keywords: ['charity', 'sadaqah', 'zakat', 'give', 'help', 'generous']
  },
  'Family': {
    name: 'Family & Relationships',
    icon: '👨‍👩‍👧‍👦',
    description: 'Hadiths about family, marriage, and relationships',
    keywords: ['family', 'marriage', 'wife', 'husband', 'children', 'parents']
  },
  'Patience': {
    name: 'Patience & Perseverance',
    icon: '⏳',
    description: 'Hadiths about patience, endurance, and resilience',
    keywords: ['patience', 'endure', 'persevere', 'sabr', 'resilient', 'steadfast']
  },
  'Forgiveness': {
    name: 'Forgiveness & Mercy',
    icon: '🤲',
    description: 'Hadiths about forgiveness, mercy, and compassion',
    keywords: ['forgive', 'mercy', 'compassion', 'pardon', 'kindness', 'gentle']
  },
  'Dua': {
    name: 'Supplication (Dua)',
    icon: '🙏',
    description: 'Hadiths about making dua and seeking Allah\'s help',
    keywords: ['dua', 'supplication', 'pray', 'ask', 'invoke', 'seek']
  },
  'Good Character': {
    name: 'Good Character & Manners',
    icon: '✨',
    description: 'Hadiths about good character, manners, and etiquette',
    keywords: ['character', 'manners', 'etiquette', 'good', 'virtue', 'morals']
  },
  'Repentance': {
    name: 'Repentance & Seeking Forgiveness',
    icon: '🔄',
    description: 'Hadiths about repentance and seeking Allah\'s forgiveness',
    keywords: ['repent', 'forgiveness', 'tawbah', 'sin', 'mistake', 'regret']
  },
  'Brotherhood': {
    name: 'Brotherhood & Unity',
    icon: '🤝',
    description: 'Hadiths about brotherhood, unity, and community',
    keywords: ['brother', 'unity', 'community', 'together', 'united', 'solidarity']
  },
  'General': {
    name: 'General Hadiths',
    icon: '📖',
    description: 'All other hadiths that don\'t fit specific categories',
    keywords: []
  },
  'View All': {
    name: 'View All Hadiths',
    icon: '🌟',
            description: 'Browse all 7,193 hadiths without category filtering',
    keywords: []
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  updateBookmarkCount();
});

// Initialize the application
async function initializeApp() {
  try {
    console.log('Loading hadiths...');
    const response = await fetch('assets/data/minaret_hadiths.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    allHadiths = await response.json();
    console.log(`Loaded ${allHadiths.length} hadiths`);
    
    // Debug: Show first few hadiths
    console.log('First 3 hadiths:', allHadiths.slice(0, 3));
    console.log('Last 3 hadiths:', allHadiths.slice(-3));
    
    // Categorize hadiths
    categorizeHadiths();
    
    // Debug: Show category distribution
    console.log('Category distribution:');
    Object.keys(categories).forEach(category => {
      const count = allHadiths.filter(h => h.categories.includes(category)).length;
      console.log(`${category}: ${count} hadiths`);
    });
    
    // Show welcome screen with categories
    showWelcomeScreen();
    
    // Load last selected category if available
    const lastCategory = localStorage.getItem('lastSelectedCategory');
    if (lastCategory && categories[lastCategory]) {
      selectCategory(lastCategory);
    }
    
  } catch (error) {
    console.error('Error loading hadiths:', error);
    showToast('Error loading hadiths. Please refresh the page.', 'error');
  }
}

// Categorize hadiths based on keywords
function categorizeHadiths() {
  allHadiths.forEach(hadith => {
    const text = `${hadith.arabic} ${hadith.english}`.toLowerCase();
    hadith.categories = [];
    
    Object.entries(categories).forEach(([categoryKey, category]) => {
      if (category.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        hadith.categories.push(categoryKey);
      }
    });
    
    // If no categories found, add to "General"
    if (hadith.categories.length === 0) {
      hadith.categories.push('General');
    }
  });
}

// Ensure theme toggle works on both pages
function ensureThemeToggleWorks() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Remove any existing event listeners
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
    
    // Add new event listener
    newThemeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked from ensureThemeToggleWorks!');
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      const icon = newThemeToggle.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
      }
    });
  }
}

// Show welcome screen with categories
function showWelcomeScreen() {
  welcomeScreen.style.display = 'flex';
  hadithViewer.style.display = 'none';
  
  // Ensure theme toggle works
  ensureThemeToggleWorks();
  
  // Clear any existing categories
  categoriesGrid.innerHTML = '';
  
  // Create category cards in specific order
  const categoryOrder = ['View All', 'Prayer', 'Honesty', 'Jannah', 'Knowledge', 'Charity', 'Family', 'Patience', 'Forgiveness', 'Dua', 'Good Character', 'Repentance', 'Brotherhood', 'General'];
  
  categoryOrder.forEach(categoryKey => {
    if (categories[categoryKey]) {
      let count;
      if (categoryKey === 'View All') {
        count = allHadiths.length; // Show total count for View All
      } else {
        count = allHadiths.filter(h => h.categories.includes(categoryKey)).length;
      }
      const card = createCategoryCard(categoryKey, categories[categoryKey], count);
      categoriesGrid.appendChild(card);
    }
  });
}

// Create a category card
function createCategoryCard(categoryKey, category, count) {
  const card = document.createElement('div');
  card.className = 'category-card';
  card.innerHTML = `
    <div class="category-count">${count}</div>
    <h3>${category.icon} ${category.name}</h3>
    <p>${category.description}</p>
  `;
  
  card.addEventListener('click', () => selectCategory(categoryKey));
  return card;
}

// Select a category and show hadiths
function selectCategory(categoryKey) {
  currentCategory = categoryKey;
  localStorage.setItem('lastSelectedCategory', categoryKey);
  
  // Update UI
  selectedCategoryDisplay.textContent = categories[categoryKey].name;
  
  // Switch to hadith viewer
  welcomeScreen.style.display = 'none';
  hadithViewer.style.display = 'block';
  
  // Ensure theme toggle works
  ensureThemeToggleWorks();
  
  // Reset filters
  resetFilters();
  
  // Load hadiths for this category
  loadCategoryHadiths();
}

// Load hadiths for the selected category
function loadCategoryHadiths() {
  // Filter hadiths by category (except for View All)
  if (currentCategory === 'View All') {
    filteredHadiths = [...allHadiths]; // Copy all hadiths
  } else {
    filteredHadiths = allHadiths.filter(hadith => 
      hadith.categories.includes(currentCategory)
    );
  }
  
  // Apply current filters
  applyFilters();
  
  // Display first batch
  displayedHadiths = [];
  displayHadiths();
  
  // Update stats
  updateStats();
}

// Reset all filters
function resetFilters() {
  currentFilters = {
    search: '',
    source: 'all',
    length: 'all',
    arabicVisible: true
  };
  
  searchInput.value = '';
  sourceFilter.value = 'all';
  arabicToggle.classList.add('active');
  arabicToggle.dataset.state = 'show';
  
  // Clear active filter badges
  activeFilters.innerHTML = '';
}

// Apply current filters
function applyFilters() {
  let filtered;
  
  console.log(`Applying filters: category=${currentCategory}, search="${currentFilters.search}", source=${currentFilters.source}, length=${currentFilters.length}`);
  console.log(`Total hadiths before filtering: ${allHadiths.length}`);
  
  // Start with category filter (except for View All)
  if (currentCategory === 'View All') {
    filtered = [...allHadiths];
    console.log(`View All selected: ${filtered.length} hadiths`);
  } else {
    filtered = allHadiths.filter(hadith => 
      hadith.categories.includes(currentCategory)
    );
    console.log(`Category "${currentCategory}" selected: ${filtered.length} hadiths`);
  }
  
  // Search filter
  if (currentFilters.search) {
    const searchTerm = currentFilters.search.toLowerCase();
    const beforeSearch = filtered.length;
    filtered = filtered.filter(hadith =>
      hadith.arabic.toLowerCase().includes(searchTerm) ||
      hadith.english.toLowerCase().includes(searchTerm) ||
      hadith.reference.toLowerCase().includes(searchTerm)
    );
    console.log(`Search filter "${searchTerm}": ${beforeSearch} -> ${filtered.length} hadiths`);
  }
  
  // Source filter
  if (currentFilters.source !== 'all') {
    const beforeSource = filtered.length;
    filtered = filtered.filter(hadith =>
      hadith.source.toLowerCase().includes(currentFilters.source)
    );
    console.log(`Source filter "${currentFilters.source}": ${beforeSource} -> ${filtered.length} hadiths`);
  }
  
  // Length filter
  if (currentFilters.length !== 'all') {
    const beforeLength = filtered.length;
    filtered = filtered.filter(hadith => {
      const length = hadith.english.length;
      if (currentFilters.length === 'short') return length < 200;
      if (currentFilters.length === 'medium') return length >= 200 && length < 500;
      if (currentFilters.length === 'long') return length >= 500;
      return true;
    });
    console.log(`Length filter "${currentFilters.length}": ${beforeLength} -> ${filtered.length} hadiths`);
  }
  
  filteredHadiths = filtered;
  displayedHadiths = [];
  console.log(`Final filtered hadiths: ${filteredHadiths.length}`);
  
  displayHadiths();
  updateStats();
  updateActiveFilters();
}

// Display hadiths
function displayHadiths() {
  const startIndex = displayedHadiths.length;
  const endIndex = Math.min(startIndex + hadithsPerPage, filteredHadiths.length);
  const hadithsToShow = filteredHadiths.slice(startIndex, endIndex);
  
  console.log(`Displaying hadiths: startIndex=${startIndex}, endIndex=${endIndex}, hadithsPerPage=${hadithsPerPage}, filteredHadiths.length=${filteredHadiths.length}, hadithsToShow.length=${hadithsToShow.length}`);
  
  // Clear container if this is the first batch (startIndex === 0)
  if (startIndex === 0) {
    hadithContainer.innerHTML = '';
    console.log('Cleared hadith container for fresh start');
  }
  
  hadithsToShow.forEach(hadith => {
    const card = createHadithCard(hadith);
    hadithContainer.appendChild(card);
    displayedHadiths.push(hadith);
  });
  
  // Show/hide load more button
  if (endIndex < filteredHadiths.length) {
    loadMoreContainer.style.display = 'block';
    console.log(`Load more button shown. ${filteredHadiths.length - endIndex} more hadiths available`);
  } else {
    loadMoreContainer.style.display = 'none';
    console.log('Load more button hidden - all hadiths displayed');
  }
  
  // Show/hide no results
  if (filteredHadiths.length === 0) {
    noResults.style.display = 'block';
    hadithContainer.innerHTML = '';
  } else {
    noResults.style.display = 'none';
  }
  
  updateStats();
}

// Create a hadith card
function createHadithCard(hadith) {
  const card = document.createElement('div');
  card.className = 'hadith-card';
  
  // Create a unique identifier since hadith.id is undefined
  const uniqueId = `${hadith.reference}-${hadith.source}`;
  card.dataset.hadithId = uniqueId;
  
  const isBookmarked = bookmarks.includes(uniqueId);
  const arabicClass = currentFilters.arabicVisible ? '' : 'hidden';
  
  card.innerHTML = `
    <div class="hadith-header">
      <h3 class="hadith-reference">${hadith.reference}</h3>
      <div class="hadith-actions">
        <button class="card-action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="Bookmark">
          <i class="fas fa-heart"></i>
        </button>
        <button class="card-action-btn copy-btn" title="Copy">
          <i class="fas fa-copy"></i>
        </button>
        <button class="card-action-btn share-btn" title="Share">
          <i class="fas fa-share"></i>
        </button>
      </div>
    </div>
    
    <div class="hadith-categories">
      ${hadith.categories.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
    </div>
    
    <div class="hadith-content ${hadith.english.length > 300 ? 'collapsed' : ''}">
      <div class="hadith-arabic ${arabicClass}">
        <h4>Arabic Text</h4>
        <div class="arabic-text">${hadith.arabic}</div>
      </div>
      
      <div class="hadith-english">
        <h4>English Translation</h4>
        ${hadith.english.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>
      
      ${hadith.english.length > 300 ? '<button class="read-more-toggle">Read More</button>' : ''}
    </div>
    
    <div class="hadith-footer">
      <span class="hadith-source">${hadith.source}</span>
      <span class="hadith-grade">${hadith.grade}</span>
    </div>
  `;
  
  // Add event listeners
  const bookmarkBtn = card.querySelector('.bookmark-btn');
  const copyBtn = card.querySelector('.copy-btn');
  const shareBtn = card.querySelector('.share-btn');
  const readMoreBtn = card.querySelector('.read-more-toggle');
  
  bookmarkBtn.addEventListener('click', () => toggleBookmark(uniqueId, bookmarkBtn));
  copyBtn.addEventListener('click', () => copyHadith(hadith));
  shareBtn.addEventListener('click', () => shareHadith(hadith));
  
  if (readMoreBtn) {
    readMoreBtn.addEventListener('click', () => toggleReadMore(card, readMoreBtn));
  }
  
  return card;
}

// Toggle bookmark
function toggleBookmark(hadithId, button) {
  const index = bookmarks.indexOf(hadithId);
  if (index > -1) {
    bookmarks.splice(index, 1);
    button.classList.remove('bookmarked');
  } else {
    bookmarks.push(hadithId);
    button.classList.add('bookmarked');
  }
  
  localStorage.setItem('hadithBookmarks', JSON.stringify(bookmarks));
  updateBookmarkCount();
  showToast('Bookmark updated', 'success');
}

// Copy hadith
function copyHadith(hadith) {
  const text = `${hadith.reference}\n\n${hadith.arabic}\n\n${hadith.english}\n\nSource: ${hadith.source}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Hadith copied to clipboard', 'success');
  });
}

// Share hadith
function shareHadith(hadith) {
  const shareHadithDiv = document.getElementById('shareHadith');
  shareHadithDiv.innerHTML = `
    <div class="hadith-card">
      <h3>${hadith.reference}</h3>
      <div class="arabic-text">${hadith.arabic}</div>
      <div class="hadith-english">${hadith.english}</div>
      <div class="hadith-footer">
        <span>Source: ${hadith.source}</span>
      </div>
    </div>
  `;
  
  shareModal.style.display = 'flex';
}

// Toggle read more
function toggleReadMore(card, button) {
  const content = card.querySelector('.hadith-content');
  if (content.classList.contains('collapsed')) {
    content.classList.remove('collapsed');
    button.textContent = 'Read Less';
  } else {
    content.classList.add('collapsed');
    button.textContent = 'Read More';
  }
}

// Update stats
function updateStats() {
  hadithCount.textContent = `Showing ${displayedHadiths.length} of ${filteredHadiths.length} hadiths`;
}

// Update bookmark count
function updateBookmarkCount() {
  // bookmarkCount element was removed from HTML, so we don't need to update it
  // The bookmarks array is still maintained for functionality
}

// Update active filters display
function updateActiveFilters() {
  activeFilters.innerHTML = '';
  
  if (currentFilters.search) {
    addFilterBadge('Search', currentFilters.search, 'search');
  }
  if (currentFilters.source !== 'all') {
    addFilterBadge('Source', currentFilters.source, 'source');
  }
  if (currentFilters.length !== 'all') {
    addFilterBadge('Length', currentFilters.length, 'length');
  }
}

// Add filter badge
function addFilterBadge(label, value, type) {
  const badge = document.createElement('div');
  badge.className = 'filter-badge';
  badge.innerHTML = `
    ${label}: ${value}
    <span class="remove" data-type="${type}">&times;</span>
  `;
  
  badge.querySelector('.remove').addEventListener('click', () => removeFilter(type));
  activeFilters.appendChild(badge);
}

// Remove filter
function removeFilter(type) {
  switch (type) {
    case 'search':
      currentFilters.search = '';
      searchInput.value = '';
      break;
    case 'source':
      currentFilters.source = 'all';
      sourceFilter.value = 'all';
      break;
  }
  applyFilters();
}

// Load more hadiths
function loadMoreHadiths() {
  displayHadiths();
}

// Surprise me functionality
function surpriseMe() {
  // Select a random hadith from the full dataset
  const randomIndex = Math.floor(Math.random() * allHadiths.length);
  const randomHadith = allHadiths[randomIndex];
  
  console.log('Surprise me selected hadith:', randomHadith.reference, 'at index:', randomIndex, 'out of', allHadiths.length, 'total hadiths');
  
  // Switch to hadith viewer and show View All to ensure the hadith is visible
  selectCategory('View All');
  
  // Wait for the hadiths to load, then create and display the random hadith
  setTimeout(() => {
    // Clear any existing highlights
    document.querySelectorAll('.hadith-card').forEach(card => {
      card.style.animation = '';
      card.style.border = '';
      card.style.boxShadow = '';
    });
    
    // Create a special card for the random hadith and insert it at the top
    const hadithContainer = document.getElementById('hadithContainer');
    const randomHadithCard = createHadithCard(randomHadith);
    
    // Add special styling to make it stand out
    randomHadithCard.style.animation = 'surprisePulse 2s ease-in-out';
    randomHadithCard.style.border = '2px solid var(--accent-gold)';
    randomHadithCard.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    randomHadithCard.style.marginBottom = '2rem';
    
    // Insert the random hadith at the top of the container
    if (hadithContainer.firstChild) {
      hadithContainer.insertBefore(randomHadithCard, hadithContainer.firstChild);
    } else {
      hadithContainer.appendChild(randomHadithCard);
    }
    
    // Scroll to the random hadith card
    randomHadithCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove the highlight after animation
    setTimeout(() => {
      randomHadithCard.style.animation = '';
      randomHadithCard.style.border = '';
      randomHadithCard.style.boxShadow = '';
      randomHadithCard.style.marginBottom = '';
    }, 2000);
    
    // Show a toast notification
    showToast(`Surprise! Here's a random hadith: ${randomHadith.reference}`, 'success');
    
    console.log('Random hadith card created and displayed at the top');
    
  }, 2000); // Increased timeout to ensure hadiths are loaded
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Navigation
  changeCategoryBtn.addEventListener('click', showWelcomeScreen);
  surpriseMeBtn.addEventListener('click', surpriseMe);
  
  // Close welcome button
  if (closeWelcomeBtn) {
    closeWelcomeBtn.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      hadithViewer.style.display = 'block';
    });
  }
  
  // Close hadith viewer button
  if (closeHadithViewerBtn) {
    closeHadithViewerBtn.addEventListener('click', () => {
      hadithViewer.style.display = 'none';
      welcomeScreen.style.display = 'block';
      // Clear current category and filters
      currentCategory = null;
      currentFilters = {
        search: '',
        source: 'all',
        length: 'all',
        arabicVisible: true
      };
      // Clear displayed hadiths
      displayedHadiths = [];
      // Reset UI
      if (searchInput) searchInput.value = '';
      if (sourceFilter) sourceFilter.value = 'all';
      if (lengthFilter) lengthFilter.value = 'all';
      if (arabicToggle) arabicToggle.checked = true;
    });
  }
  
  // Search and filters
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    applyFilters();
  });
  
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentFilters.search = '';
    applyFilters();
  });
  
  sourceFilter.addEventListener('change', (e) => {
    currentFilters.source = e.target.value;
    applyFilters();
  });
  
  arabicToggle.addEventListener('click', () => {
    currentFilters.arabicVisible = !currentFilters.arabicVisible;
    arabicToggle.classList.toggle('active');
    arabicToggle.dataset.state = currentFilters.arabicVisible ? 'show' : 'hide';
    
    // Update all Arabic text visibility
    const arabicDivs = document.querySelectorAll('.hadith-arabic');
    arabicDivs.forEach(div => {
      div.classList.toggle('hidden', !currentFilters.arabicVisible);
    });
  });
  
  loadMoreBtn.addEventListener('click', loadMoreHadiths);
  
  // Theme toggle - ensure it works on both pages
  console.log('Theme toggle element:', themeToggle);
  if (themeToggle) {
    console.log('Adding theme toggle event listener...');
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked!');
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      console.log('Switching theme from', currentTheme, 'to', newTheme);
      
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
      }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  } else {
    console.error('Theme toggle element not found!');
  }
  
  // Modals
  bookmarksBtn.addEventListener('click', showBookmarksModal);
  
  // Close modals
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      bookmarkModal.style.display = 'none';
      shareModal.style.display = 'none';
    });
  });
  
  // Copy and share functionality
  document.getElementById('copyLink').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard', 'success');
  });
  
  document.getElementById('copyText').addEventListener('click', () => {
    const hadithText = document.getElementById('shareHadith').textContent;
    navigator.clipboard.writeText(hadithText);
    showToast('Hadith text copied to clipboard', 'success');
  });
  
  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Show/hide scroll to top button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) { // Show after scrolling down about 2-3 hadiths
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });
}

// Show bookmarks modal
function showBookmarksModal() {
  const bookmarkList = document.getElementById('bookmarkList');
  bookmarkList.innerHTML = '';
  
  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = '<p>No bookmarked hadiths yet.</p>';
  } else {
    bookmarks.forEach(hadithId => {
      // Find hadith by the unique identifier format
      const hadith = allHadiths.find(h => `${h.reference}-${h.source}` === hadithId);
      
      if (hadith) {
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-item';
        bookmarkItem.innerHTML = `
          <h4>${hadith.reference}</h4>
          <p>${hadith.english.substring(0, 100)}...</p>
        `;
        
        bookmarkList.appendChild(bookmarkItem);
      }
    });
  }
  
  bookmarkModal.style.display = 'flex';
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add CSS animation for surprise me
const style = document.createElement('style');
style.textContent = `
  @keyframes surprisePulse {
    0% { 
      transform: scale(1); 
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    }
    50% { 
      transform: scale(1.02); 
      box-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
    }
    100% { 
      transform: scale(1); 
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    }
  }
`;
document.head.appendChild(style); 