// Prayer times data (fallback)
const prayerTimes = {
    fajr: { time: '05:03', name: 'Fajr', icon: '🌅', arabic: 'الفجر' },
    dhuhr: { time: '12:42', name: 'Dhuhr', icon: '☀️', arabic: 'الظهر' },
    asr: { time: '16:18', name: 'Asr', icon: '🌤️', arabic: 'العصر' },
    maghrib: { time: '19:02', name: 'Maghrib', icon: '🌅', arabic: 'المغرب' },
    isha: { time: '20:45', name: 'Isha', icon: '🌙', arabic: 'العشاء' }
};

// City coordinates database
const cityCoordinates = {
    'Lahore, Pakistan': { lat: 31.5204, lng: 74.3587 },
    'Istanbul, Turkey': { lat: 41.0082, lng: 28.9784 },
    'Mecca, Saudi Arabia': { lat: 21.4225, lng: 39.8262 },
    'Medina, Saudi Arabia': { lat: 24.5247, lng: 39.5692 },
    'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
    'Cairo, Egypt': { lat: 30.0444, lng: 31.2357 },
    'Karachi, Pakistan': { lat: 24.8607, lng: 67.0011 },
    'Tehran, Iran': { lat: 35.6892, lng: 51.3890 },
    'Jakarta, Indonesia': { lat: -6.2088, lng: 106.8456 },
    'Kuala Lumpur, Malaysia': { lat: 3.1390, lng: 101.6869 },
    'London, UK': { lat: 51.5074, lng: -0.1278 },
    'New York, USA': { lat: 40.7128, lng: -74.0060 },
    'Toronto, Canada': { lat: 43.6532, lng: -79.3832 },
    'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
    'Cape Town, South Africa': { lat: -33.9249, lng: 18.4241 },
    'Paris, France': { lat: 48.8566, lng: 2.3522 },
    'Berlin, Germany': { lat: 52.5200, lng: 13.4050 },
    'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
    'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
    'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
    'Brussels, Belgium': { lat: 50.8503, lng: 4.3517 },
    'Vienna, Austria': { lat: 48.2082, lng: 16.3738 },
    'Prague, Czech Republic': { lat: 50.0755, lng: 14.4378 },
    'Budapest, Hungary': { lat: 47.4979, lng: 19.0402 },
    'Warsaw, Poland': { lat: 52.2297, lng: 21.0122 },
    'Moscow, Russia': { lat: 55.7558, lng: 37.6176 },
    'Kiev, Ukraine': { lat: 50.4501, lng: 30.5234 },
    'Bucharest, Romania': { lat: 44.4268, lng: 26.1025 },
    'Sofia, Bulgaria': { lat: 42.6977, lng: 23.3219 },
    'Belgrade, Serbia': { lat: 44.7866, lng: 20.4489 },
    'Zagreb, Croatia': { lat: 45.8150, lng: 15.9819 },
    'Ljubljana, Slovenia': { lat: 46.0569, lng: 14.5058 },
    'Bratislava, Slovakia': { lat: 48.1486, lng: 17.1077 },
    'Vilnius, Lithuania': { lat: 54.6872, lng: 25.2797 },
    'Riga, Latvia': { lat: 56.9496, lng: 24.1052 },
    'Tallinn, Estonia': { lat: 59.4370, lng: 24.7536 },
    'Helsinki, Finland': { lat: 60.1699, lng: 24.9384 },
    'Stockholm, Sweden': { lat: 59.3293, lng: 18.0686 },
    'Oslo, Norway': { lat: 59.9139, lng: 10.7522 },
    'Copenhagen, Denmark': { lat: 55.6761, lng: 12.5683 },
    'Reykjavik, Iceland': { lat: 64.1466, lng: -21.9426 },
    'Dublin, Ireland': { lat: 53.3498, lng: -6.2603 },
    'Edinburgh, UK': { lat: 55.9533, lng: -3.1883 },
    'Manchester, UK': { lat: 53.4808, lng: -2.2426 },
    'Birmingham, UK': { lat: 52.4862, lng: -1.8904 },
    'Glasgow, UK': { lat: 55.8642, lng: -4.2518 },
    'Liverpool, UK': { lat: 53.4084, lng: -2.9916 },
    'Leeds, UK': { lat: 53.8008, lng: -1.5491 },
    'Sheffield, UK': { lat: 53.3811, lng: -1.4701 },
    'Bradford, UK': { lat: 53.8008, lng: -1.5491 },
    'Cardiff, UK': { lat: 51.4816, lng: -3.1791 },
    'Belfast, UK': { lat: 54.5973, lng: -5.9301 },
    'Los Angeles, USA': { lat: 34.0522, lng: -118.2437 },
    'Chicago, USA': { lat: 41.8781, lng: -87.6298 },
    'Houston, USA': { lat: 29.7604, lng: -95.3698 },
    'Phoenix, USA': { lat: 33.4484, lng: -112.0740 },
    'Philadelphia, USA': { lat: 39.9526, lng: -75.1652 },
    'San Antonio, USA': { lat: 29.4241, lng: -98.4936 },
    'San Diego, USA': { lat: 32.7157, lng: -117.1611 },
    'Dallas, USA': { lat: 32.7767, lng: -96.7970 },
    'San Jose, USA': { lat: 37.3382, lng: -121.8863 },
    'Austin, USA': { lat: 30.2672, lng: -97.7431 },
    'Jacksonville, USA': { lat: 30.3322, lng: -81.6557 },
    'Fort Worth, USA': { lat: 32.7555, lng: -97.3308 },
    'Columbus, USA': { lat: 39.9612, lng: -82.9988 },
    'Charlotte, USA': { lat: 35.2271, lng: -80.8431 },
    'San Francisco, USA': { lat: 37.7749, lng: -122.4194 },
    'Indianapolis, USA': { lat: 39.7684, lng: -86.1581 },
    'Seattle, USA': { lat: 47.6062, lng: -122.3321 },
    'Denver, USA': { lat: 39.7392, lng: -104.9903 },
    'Washington, USA': { lat: 38.9072, lng: -77.0369 },
    'Boston, USA': { lat: 42.3601, lng: -71.0589 },
    'El Paso, USA': { lat: 31.7619, lng: -106.4850 },
    'Nashville, USA': { lat: 36.1627, lng: -86.7816 },
    'Detroit, USA': { lat: 42.3314, lng: -83.0458 },
    'Oklahoma City, USA': { lat: 35.4676, lng: -97.5164 },
    'Portland, USA': { lat: 45.5152, lng: -122.6784 },
    'Las Vegas, USA': { lat: 36.1699, lng: -115.1398 },
    'Memphis, USA': { lat: 35.1495, lng: -90.0490 },
    'Louisville, USA': { lat: 38.2527, lng: -85.7585 },
    'Baltimore, USA': { lat: 39.2904, lng: -76.6122 },
    'Milwaukee, USA': { lat: 43.0389, lng: -87.9065 },
    'Albuquerque, USA': { lat: 35.0844, lng: -106.6504 },
    'Tucson, USA': { lat: 32.2226, lng: -110.9747 },
    'Fresno, USA': { lat: 36.7378, lng: -119.7871 },
    'Sacramento, USA': { lat: 38.5816, lng: -121.4944 },
    'Atlanta, USA': { lat: 33.7490, lng: -84.3880 },
    'Kansas City, USA': { lat: 39.0997, lng: -94.5786 },
    'Long Beach, USA': { lat: 33.7701, lng: -118.1937 },
    'Colorado Springs, USA': { lat: 38.8339, lng: -104.8214 },
    'Miami, USA': { lat: 25.7617, lng: -80.1918 },
    'Raleigh, USA': { lat: 35.7796, lng: -78.6382 },
    'Omaha, USA': { lat: 41.2565, lng: -95.9345 },
    'Minneapolis, USA': { lat: 44.9778, lng: -93.2650 },
    'Tulsa, USA': { lat: 36.1540, lng: -95.9928 },
    'Cleveland, USA': { lat: 41.4993, lng: -81.6944 },
    'Wichita, USA': { lat: 37.6872, lng: -97.3301 },
    'Arlington, USA': { lat: 32.7357, lng: -97.1081 },
    'New Orleans, USA': { lat: 29.9511, lng: -90.0715 },
    'Bakersfield, USA': { lat: 35.3733, lng: -119.0187 },
    'Tampa, USA': { lat: 27.9506, lng: -82.4572 },
    'Honolulu, USA': { lat: 21.3099, lng: -157.8581 },
    'Aurora, USA': { lat: 39.7294, lng: -104.8319 },
    'Anaheim, USA': { lat: 33.8366, lng: -117.9143 },
    'Santa Ana, USA': { lat: 33.7455, lng: -117.8677 },
    'Corpus Christi, USA': { lat: 27.8006, lng: -97.3964 },
    'Riverside, USA': { lat: 33.9533, lng: -117.3962 },
    'Lexington, USA': { lat: 38.0406, lng: -84.5037 },
    'Stockton, USA': { lat: 37.9577, lng: -121.2908 },
    'Henderson, USA': { lat: 36.0395, lng: -114.9817 },
    'Saint Paul, USA': { lat: 44.9537, lng: -93.0900 },
    'St. Louis, USA': { lat: 38.6270, lng: -90.1994 },
    'Cincinnati, USA': { lat: 39.1031, lng: -84.5120 },
    'Pittsburgh, USA': { lat: 40.4406, lng: -79.9959 },
    'Greensboro, USA': { lat: 36.0726, lng: -79.7920 },
    'Anchorage, USA': { lat: 61.2181, lng: -149.9003 },
    'Plano, USA': { lat: 33.0198, lng: -96.6989 },
    'Orlando, USA': { lat: 28.5383, lng: -81.3792 },
    'Irvine, USA': { lat: 33.6846, lng: -117.8265 },
    'Newark, USA': { lat: 40.7357, lng: -74.1724 },
    'Durham, USA': { lat: 35.9940, lng: -78.8986 },
    'Chula Vista, USA': { lat: 32.6401, lng: -117.0842 },
    'Toledo, USA': { lat: 41.6528, lng: -83.5379 },
    'Fort Wayne, USA': { lat: 41.0793, lng: -85.1394 },
    'St. Petersburg, USA': { lat: 27.7731, lng: -82.6400 },
    'Laredo, USA': { lat: 27.5064, lng: -99.5075 },
    'Jersey City, USA': { lat: 40.7178, lng: -74.0431 },
    'Chandler, USA': { lat: 33.3062, lng: -111.8413 },
    'Madison, USA': { lat: 43.0731, lng: -89.4012 },
    'Lubbock, USA': { lat: 33.5779, lng: -101.8552 },
    'Scottsdale, USA': { lat: 33.4942, lng: -111.9261 },
    'Reno, USA': { lat: 39.5296, lng: -119.8138 },
    'Buffalo, USA': { lat: 42.8864, lng: -78.8784 },
    'Gilbert, USA': { lat: 33.3528, lng: -111.7890 },
    'Glendale, USA': { lat: 33.5387, lng: -112.1860 },
    'North Las Vegas, USA': { lat: 36.1989, lng: -115.1175 },
    'Winston-Salem, USA': { lat: 36.0999, lng: -80.2442 },
    'Chesapeake, USA': { lat: 36.7682, lng: -76.2875 },
    'Norfolk, USA': { lat: 36.8508, lng: -76.2859 },
    'Fremont, USA': { lat: 37.5485, lng: -121.9886 },
    'Garland, USA': { lat: 32.9126, lng: -96.6389 },
    'Irving, USA': { lat: 32.8140, lng: -96.9489 },
    'Hialeah, USA': { lat: 25.8576, lng: -80.2781 },
    'Richmond, USA': { lat: 37.5407, lng: -77.4360 },
    'Boise, USA': { lat: 43.6150, lng: -116.2023 },
    'Spokane, USA': { lat: 47.6588, lng: -117.4260 },
    'Baton Rouge, USA': { lat: 30.4515, lng: -91.1871 },
    'Tacoma, USA': { lat: 47.2529, lng: -122.4443 },
    'San Bernardino, USA': { lat: 34.1083, lng: -117.2898 },
    'Grand Rapids, USA': { lat: 42.9634, lng: -85.6681 },
    'Huntsville, USA': { lat: 34.7304, lng: -86.5861 },
    'Salt Lake City, USA': { lat: 40.7608, lng: -111.8910 },
    'Yonkers, USA': { lat: 40.9312, lng: -73.8987 },
    'Amarillo, USA': { lat: 35.2220, lng: -101.8313 },
    'McKinney, USA': { lat: 33.1972, lng: -96.6397 },
    'Rochester, USA': { lat: 43.1566, lng: -77.6088 },
    'Mesa, USA': { lat: 33.4152, lng: -111.8315 },
    'Virginia Beach, USA': { lat: 36.8529, lng: -75.9780 },
    'Oakland, USA': { lat: 37.8044, lng: -122.2711 }
};

// Calculation method names
const calculationMethods = {
    '1': 'Karachi',
    '2': 'ISNA',
    '3': 'Muslim World League',
    '4': 'Umm al-Qura Makkah',
    '5': 'Egyptian General Authority'
};

// Geolocation Service
class GeolocationService {
    constructor() {
        this.isSupported = 'geolocation' in navigator;
        this.defaultTimezone = 'Asia/Karachi';
    }

    async getCurrentLocation() {
        if (!this.isSupported) {
            throw new Error('Geolocation is not supported by this browser');
        }

        return new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    reject(error);
                },
                options
            );
        });
    }

    async getTimezoneFromCoords(lat, lng) {
        try {
            console.log('Fetching timezone for coordinates:', lat, lng);
            
            // Use a free timezone API
            const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=demo&format=json&by=position&lat=${lat}&lng=${lng}`);
            
            if (!response.ok) {
                throw new Error(`Timezone API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Timezone API response:', data);
            
            if (data.status === 'OK' && data.zoneName) {
                console.log('Found timezone:', data.zoneName);
                return data.zoneName;
            } else {
                throw new Error('Invalid timezone API response');
            }
        } catch (error) {
            console.warn('Timezone API failed, using default:', error);
        }
        
        console.log('Using default timezone:', this.defaultTimezone);
        return this.defaultTimezone;
    }

    async getCityFromCoords(lat, lng) {
        try {
            // Use reverse geocoding to get city name
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.city && data.countryName) {
                    return `${data.city}, ${data.countryName}`;
                }
            }
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
        }
        
        return null;
    }

    async detectCurrentLocation() {
        try {
            // Get coordinates
            const coords = await this.getCurrentLocation();
            
            // Get timezone and city name in parallel
            const [timezone, cityName] = await Promise.all([
                this.getTimezoneFromCoords(coords.lat, coords.lng),
                this.getCityFromCoords(coords.lat, coords.lng)
            ]);

            return {
                coords,
                timezone,
                cityName
            };
        } catch (error) {
            throw error;
        }
    }

    async getLocationData(cityName) {
        try {
            console.log('Geocoding city:', cityName);
            
            // Use geocoding to get coordinates for the city
            const response = await fetch(`https://api.bigdatacloud.net/data/geocode-client?q=${encodeURIComponent(cityName)}&localityLanguage=en`);
            
            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Geocoding API response:', data);
            
            if (data.latitude && data.longitude) {
                // Get timezone for the coordinates
                const timezone = await this.getTimezoneFromCoords(data.latitude, data.longitude);
                
                const locationData = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timezone: timezone,
                    city: cityName
                };
                
                console.log('Successfully geocoded location:', locationData);
                return locationData;
            } else {
                throw new Error('No coordinates found in geocoding response');
            }
        } catch (error) {
            console.error('Geocoding failed for:', cityName, error);
            return null;
        }
    }
}

// Sacred Theme Manager
class SacredThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme icon
        if (this.themeToggle) {
            const themeIcon = this.themeToggle.querySelector('i');
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            this.themeToggle.setAttribute('aria-checked', (theme === 'dark').toString());
            this.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
        
        // Add smooth transition class
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
}

// Sacred Date and Time Utilities
class SacredDateTimeUtils {
    static formatSacredDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    static formatSacredTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    static timeToMinutes(timeString) {
        if (!timeString || timeString.trim() === '') {
            return 0;
        }
        
        // Handle formats like "5:36 am", "12:13 pm", or "05:36"
        const timeStr = timeString.trim().toLowerCase();
        const isPM = timeStr.includes('pm');
        const isAM = timeStr.includes('am');
        
        // Remove am/pm and extract time
        const timeOnly = timeStr.replace(/\s*(am|pm)\s*/i, '');
        const [hoursStr, minutesStr] = timeOnly.split(':');
        
        if (!hoursStr || !minutesStr) {
            return 0;
        }
        
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        
        // Convert to 24-hour format
        if (isPM && hours !== 12) {
            hours += 12;
        } else if (isAM && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    }

    static getCurrentTimeInMinutes() {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }

    static getCurrentTimeInSeconds() {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }

    static getSacredHijriDate() {
        // This is a simplified version - for accurate Hijri dates, use a library like moment-hijri
        const today = new Date();
        const hijriYear = 1446; // This should be calculated properly
        const hijriMonth = 'Dhul-Hijjah'; // This should be calculated properly
        const hijriDay = 15; // This should be calculated properly
        
        return `${hijriDay} ${hijriMonth} ${hijriYear}`;
    }

    static formatSacredCountdown(hours, minutes) {
        // Always show hours and minutes only (HH:MM)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}

// Sacred Prayer Times Manager
class SacredPrayerTimesManager {
    constructor() {
        this.hijriDateElement = document.getElementById('hijri-date');
        this.gregorianDateElement = document.getElementById('gregorian-date');
        this.nextPrayerElement = document.getElementById('next-prayer');
        this.countdownTimeElement = document.getElementById('countdown-time');
        this.prayerMats = document.querySelectorAll('.prayer-mat');
        this.alarmToggles = document.querySelectorAll('.sacred-alarm-toggle');
        this.init();
    }

    init() {
        this.updateSacredDateInfo();
        this.updateSacredNextPrayer();
        this.updateSacredPrayerMats();
        this.setupSacredAlarmToggles();
        this.setupSacredKeyboardNavigation();
        
        // Update every minute
        setInterval(() => {
            this.updateSacredNextPrayer();
            this.updateSacredPrayerMats();
        }, 60000);

        // Update countdown every second for more accurate timing
        setInterval(() => {
            this.updateSacredNextPrayer();
        }, 1000);

        // Update date every day at midnight
        this.scheduleSacredDateUpdate();
        
        // Refresh prayer times daily at midnight
        this.schedulePrayerTimesRefresh();
    }

    schedulePrayerTimesRefresh() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            prayerTimesAPI.fetchPrayerTimes();
            this.schedulePrayerTimesRefresh(); // Schedule next refresh
        }, timeUntilMidnight);
    }

    updateSacredDateInfo() {
        const today = new Date();
        const gregorianDate = SacredDateTimeUtils.formatSacredDate(today);
        const hijriDate = SacredDateTimeUtils.getSacredHijriDate();
        
        if (this.hijriDateElement) {
            this.hijriDateElement.textContent = hijriDate;
        }
        if (this.gregorianDateElement) {
            this.gregorianDateElement.textContent = gregorianDate;
        }
    }

    scheduleSacredDateUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.updateSacredDateInfo();
            this.scheduleSacredDateUpdate(); // Schedule next update
        }, timeUntilMidnight);
    }

    getSacredNextPrayer() {
        // Use API data if available, otherwise fallback to static data
        const timesToUse = prayerTimesAPI.prayerTimes && Object.keys(prayerTimesAPI.prayerTimes).length > 0 
            ? prayerTimesAPI.prayerTimes 
            : prayerTimes;
            
        const currentTime = SacredDateTimeUtils.getCurrentTimeInMinutes();
        const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        for (let prayer of prayerOrder) {
            if (timesToUse[prayer]) {
                const prayerTime = SacredDateTimeUtils.timeToMinutes(timesToUse[prayer].time);
                if (prayerTime > currentTime) {
                    return { prayer, time: timesToUse[prayer].time };
                }
            }
        }
        
        // If no prayer found, next prayer is tomorrow's Fajr
        return { prayer: 'fajr', time: timesToUse.fajr?.time || prayerTimes.fajr.time };
    }

    updateSacredNextPrayer() {
        const nextPrayer = this.getSacredNextPrayer();
        const timesToUse = prayerTimesAPI.prayerTimes && Object.keys(prayerTimesAPI.prayerTimes).length > 0 
            ? prayerTimesAPI.prayerTimes 
            : prayerTimes;
        const nextPrayerData = timesToUse[nextPrayer.prayer];
        
        if (this.nextPrayerElement && nextPrayerData) {
            this.nextPrayerElement.textContent = nextPrayerData.name;
        }
        
        const countdownText = this.calculateSacredCountdown(nextPrayer.time);
        if (this.countdownTimeElement) {
            this.countdownTimeElement.textContent = countdownText;
        }
    }

    calculateSacredCountdown(nextPrayerTime) {
        const currentTime = SacredDateTimeUtils.getCurrentTimeInMinutes();
        const prayerTime = SacredDateTimeUtils.timeToMinutes(nextPrayerTime);
        
        let timeDiff = prayerTime - currentTime;
        
        // If prayer time has passed, it's tomorrow's prayer
        if (timeDiff <= 0) {
            timeDiff += 24 * 60; // Add 24 hours
        }
        
        const hours = Math.floor(timeDiff / 60);
        const minutes = timeDiff % 60;
        
        return SacredDateTimeUtils.formatSacredCountdown(hours, minutes);
    }

    updateSacredPrayerMats() {
        const currentTime = SacredDateTimeUtils.getCurrentTimeInMinutes();
        const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        // Use API data if available, otherwise fallback to static data
        const timesToUse = prayerTimesAPI.prayerTimes && Object.keys(prayerTimesAPI.prayerTimes).length > 0 
            ? prayerTimesAPI.prayerTimes 
            : prayerTimes;
        
        for (let i = 0; i < this.prayerMats.length; i++) {
            const mat = this.prayerMats[i];
            const prayer = prayerOrder[i];
            
            if (timesToUse[prayer]) {
                const prayerTime = SacredDateTimeUtils.timeToMinutes(timesToUse[prayer].time);
                const timeElement = mat.querySelector('.prayer-sacred-time');
                
                if (timeElement) {
                    timeElement.textContent = SacredDateTimeUtils.formatSacredTime(timesToUse[prayer].time);
                }
                
                // Highlight current/next prayer
                mat.classList.remove('current-prayer', 'next-prayer');
                
                if (prayerTime > currentTime) {
                    // This is the next prayer
                    mat.classList.add('next-prayer');
                    break;
                } else if (prayerTime <= currentTime && prayerTime + 30 > currentTime) {
                    // This is the current prayer (within 30 minutes)
                    mat.classList.add('current-prayer');
                }
            }
        }
    }

    setupSacredAlarmToggles() {
        this.alarmToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSacredAlarm(toggle);
            });
            
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleSacredAlarm(toggle);
                }
            });
        });
    }

    toggleSacredAlarm(toggle) {
        const prayer = toggle.getAttribute('data-prayer');
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-checked', 'false');
            toggle.setAttribute('aria-label', `Enable ${prayer} alarm`);
        } else {
            toggle.classList.add('active');
            toggle.setAttribute('aria-checked', 'true');
            toggle.setAttribute('aria-label', `Disable ${prayer} alarm`);
        }
        
        // Save alarm state
        this.saveSacredAlarmStates();
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    saveSacredAlarmStates() {
        const alarmStates = {};
        this.alarmToggles.forEach(toggle => {
            const prayer = toggle.getAttribute('data-prayer');
            alarmStates[prayer] = toggle.classList.contains('active');
        });
        localStorage.setItem('sacredAlarmStates', JSON.stringify(alarmStates));
    }

    loadSacredAlarmStates() {
        const savedStates = localStorage.getItem('sacredAlarmStates');
        if (savedStates) {
            const alarmStates = JSON.parse(savedStates);
            this.alarmToggles.forEach(toggle => {
                const prayer = toggle.getAttribute('data-prayer');
                if (alarmStates[prayer]) {
                    toggle.classList.add('active');
                    toggle.setAttribute('aria-checked', 'true');
                    toggle.setAttribute('aria-label', `Disable ${prayer} alarm`);
                }
            });
        }
    }

    setupSacredKeyboardNavigation() {
        this.prayerMats.forEach(mat => {
            mat.setAttribute('tabindex', '0');
            mat.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleSacredMatClick(mat);
                }
            });
        });
    }

    handleSacredMatClick(mat) {
        // Add visual feedback
        mat.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mat.style.transform = '';
        }, 150);
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }
}

// Sacred Modal Manager
class SacredModal {
    constructor() {
        this.wuduBtn = document.getElementById('wudu-btn');
        this.salahGuideBtn = document.getElementById('salah-guide-btn');
        this.wuduModal = document.getElementById('wudu-modal');
        this.salahGuideModal = document.getElementById('salah-guide-modal');
        this.wuduClose = document.getElementById('wudu-close');
        this.salahGuideClose = document.getElementById('salah-guide-close');
        this.wuduOverlay = this.wuduModal?.querySelector('.modal-sacred-overlay');
        this.salahGuideOverlay = this.salahGuideModal?.querySelector('.modal-sacred-overlay');
        
        this.isWuduOpen = false;
        this.isSalahGuideOpen = false;
        
        this.init();
    }

    init() {
        // Wudu modal
        if (this.wuduBtn) {
            this.wuduBtn.addEventListener('click', () => this.openWuduModal());
            this.wuduBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openWuduModal();
                }
            });
        }
        
        if (this.wuduClose) {
            this.wuduClose.addEventListener('click', () => this.closeWuduModal());
            this.wuduClose.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeWuduModal();
                }
            });
        }
        
        if (this.wuduOverlay) {
            this.wuduOverlay.addEventListener('click', () => this.closeWuduModal());
        }
        
        // Salah Guide modal
        if (this.salahGuideBtn) {
            this.salahGuideBtn.addEventListener('click', () => this.openSalahGuideModal());
            this.salahGuideBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openSalahGuideModal();
                }
            });
        }
        
        if (this.salahGuideClose) {
            this.salahGuideClose.addEventListener('click', () => this.closeSalahGuideModal());
            this.salahGuideClose.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeSalahGuideModal();
                }
            });
        }
        
        if (this.salahGuideOverlay) {
            this.salahGuideOverlay.addEventListener('click', () => this.closeSalahGuideModal());
        }
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isWuduOpen) {
                    this.closeWuduModal();
                } else if (this.isSalahGuideOpen) {
                    this.closeSalahGuideModal();
                }
            }
        });
        
        // Set initial modal states
        if (this.wuduModal) {
            this.wuduModal.setAttribute('aria-hidden', 'true');
        }
        if (this.salahGuideModal) {
            this.salahGuideModal.setAttribute('aria-hidden', 'true');
        }
    }

    openWuduModal() {
        this.isWuduOpen = true;
        if (this.wuduModal) {
            this.wuduModal.classList.add('active');
            this.wuduModal.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
        
        // Focus management
        if (this.wuduClose) {
            this.wuduClose.focus();
        }
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        console.log('Sacred Wudu modal opened');
    }

    closeWuduModal() {
        this.isWuduOpen = false;
        if (this.wuduModal) {
            this.wuduModal.classList.remove('active');
            this.wuduModal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
        
        // Return focus to wudu button
        if (this.wuduBtn) {
            this.wuduBtn.focus();
        }
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
        
        console.log('Sacred Wudu modal closed');
    }

    openSalahGuideModal() {
        this.isSalahGuideOpen = true;
        if (this.salahGuideModal) {
            this.salahGuideModal.classList.add('active');
            this.salahGuideModal.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
        
        // Focus management
        if (this.salahGuideClose) {
            this.salahGuideClose.focus();
        }
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        console.log('Sacred Salah Guide modal opened');
    }

    closeSalahGuideModal() {
        this.isSalahGuideOpen = false;
        if (this.salahGuideModal) {
            this.salahGuideModal.classList.remove('active');
            this.salahGuideModal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
        
        // Return focus to salah guide button
        if (this.salahGuideBtn) {
            this.salahGuideBtn.focus();
        }
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
        
        console.log('Sacred Salah Guide modal closed');
    }
}

// Prayer Times API Integration
class PrayerTimesAPI {
    constructor() {
        // Call our own backend proxy to avoid CORS issues with external APIs
        // Backend: GET http://localhost:8082/api/prayer-times?city=City, Country
        this.baseURL = 'http://localhost:8082/api/prayer-times';
        this.defaultCity = 'Lahore, Pakistan';
        this.prayerTimes = null;
        this.isLoading = false;
        this.currentLocation = this.defaultCity;
        this.calculationMethod = localStorage.getItem('calculationMethod') || '2';
        this.asrMethod = localStorage.getItem('asrMethod') || 'standard';
        this.defaultCoords = { lat: 31.5204, lng: 74.3587 }; // Lahore coordinates
        this.defaultTimezone = 'Asia/Karachi';
        this.countdownInterval = null;
        this.cachedNextPrayer = null; // Cache to prevent oscillation
        
        // Start countdown update interval once prayer times are loaded
        // This will be started in updateDOMWithPrayerTimes()
    }

    async fetchPrayerTimes(city = this.defaultCity) {
        try {
            this.isLoading = true;
            this.updateLoadingState(true);
            
            const encodedCity = encodeURIComponent(city || this.defaultCity);
            const url = `${this.baseURL}?city=${encodedCity}`;
            
            console.log('Fetching prayer times from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const text = await response.text();
                console.error('Backend returned error:', response.status, text);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Failed to parse JSON response:', text.substring(0, 200));
                throw new Error('Backend returned invalid JSON. Is the server running on port 8082?');
            }
            
            // Backend proxy response shape:
            // { city: 'Lahore, Pakistan', timings: { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, ... } }
            if (data && data.timings) {
                this.prayerTimes = this.parsePrayerTimes(data.timings);
                this.currentLocation = city;
                this.updateDOMWithPrayerTimes();
                this.updateLocationDisplay();
                console.log('Prayer times fetched successfully (via backend):', this.prayerTimes);
                return true;
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            this.useFallbackTimes();
            return false;
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
        }
    }

    async fetchPrayerTimesByCoords(coords, timezone = this.defaultTimezone) {
        try {
            this.isLoading = true;
            this.updateLoadingState(true);
            
            // Use the city from currentLocation or default, since MuslimSalat uses city names
            const cityToUse = this.currentLocation || this.defaultCity;
            const success = await this.fetchPrayerTimes(cityToUse);
            return success !== false; // Return true if fetchPrayerTimes succeeded
        } catch (error) {
            console.error('Error fetching prayer times by coordinates:', error);
            this.useFallbackTimes();
            return false;
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
        }
    }

    getCityCoordinates(city) {
        // Return coordinates from our database if available
        return cityCoordinates[city] || null;
    }

    getCityTimezone(city) {
        // Return timezone from our database if available
        const cityTimezones = {
            'Lahore, Pakistan': 'Asia/Karachi',
            'Istanbul, Turkey': 'Europe/Istanbul',
            'Mecca, Saudi Arabia': 'Asia/Riyadh',
            'Medina, Saudi Arabia': 'Asia/Riyadh',
            'Dubai, UAE': 'Asia/Dubai',
            'Cairo, Egypt': 'Africa/Cairo',
            'Karachi, Pakistan': 'Asia/Karachi',
            'Tehran, Iran': 'Asia/Tehran',
            'Jakarta, Indonesia': 'Asia/Jakarta',
            'Kuala Lumpur, Malaysia': 'Asia/Kuala_Lumpur',
            'London, UK': 'Europe/London',
            'New York, USA': 'America/New_York',
            'Toronto, Canada': 'America/Toronto',
            'Sydney, Australia': 'Australia/Sydney',
            'Cape Town, South Africa': 'Africa/Johannesburg',
            'Paris, France': 'Europe/Paris',
            'Berlin, Germany': 'Europe/Berlin',
            'Rome, Italy': 'Europe/Rome',
            'Madrid, Spain': 'Europe/Madrid',
            'Amsterdam, Netherlands': 'Europe/Amsterdam',
            'Brussels, Belgium': 'Europe/Brussels',
            'Vienna, Austria': 'Europe/Vienna',
            'Prague, Czech Republic': 'Europe/Prague',
            'Budapest, Hungary': 'Europe/Budapest',
            'Warsaw, Poland': 'Europe/Warsaw',
            'Moscow, Russia': 'Europe/Moscow',
            'Kiev, Ukraine': 'Europe/Kiev',
            'Bucharest, Romania': 'Europe/Bucharest',
            'Sofia, Bulgaria': 'Europe/Sofia',
            'Belgrade, Serbia': 'Europe/Belgrade',
            'Zagreb, Croatia': 'Europe/Zagreb',
            'Ljubljana, Slovenia': 'Europe/Ljubljana',
            'Bratislava, Slovakia': 'Europe/Bratislava',
            'Vilnius, Lithuania': 'Europe/Vilnius',
            'Riga, Latvia': 'Europe/Riga',
            'Tallinn, Estonia': 'Europe/Tallinn',
            'Helsinki, Finland': 'Europe/Helsinki',
            'Stockholm, Sweden': 'Europe/Stockholm',
            'Oslo, Norway': 'Europe/Oslo',
            'Copenhagen, Denmark': 'Europe/Copenhagen',
            'Reykjavik, Iceland': 'Atlantic/Reykjavik',
            'Dublin, Ireland': 'Europe/Dublin',
            'Edinburgh, UK': 'Europe/London',
            'Manchester, UK': 'Europe/London',
            'Birmingham, UK': 'Europe/London',
            'Glasgow, UK': 'Europe/London',
            'Liverpool, UK': 'Europe/London',
            'Leeds, UK': 'Europe/London',
            'Sheffield, UK': 'Europe/London',
            'Bradford, UK': 'Europe/London',
            'Cardiff, UK': 'Europe/London',
            'Belfast, UK': 'Europe/London',
            'Los Angeles, USA': 'America/Los_Angeles',
            'Chicago, USA': 'America/Chicago',
            'Houston, USA': 'America/Chicago',
            'Phoenix, USA': 'America/Phoenix',
            'Philadelphia, USA': 'America/New_York',
            'San Antonio, USA': 'America/Chicago',
            'San Diego, USA': 'America/Los_Angeles',
            'Dallas, USA': 'America/Chicago',
            'San Jose, USA': 'America/Los_Angeles',
            'Austin, USA': 'America/Chicago',
            'Jacksonville, USA': 'America/New_York',
            'Fort Worth, USA': 'America/Chicago',
            'Columbus, USA': 'America/New_York',
            'Charlotte, USA': 'America/New_York',
            'San Francisco, USA': 'America/Los_Angeles',
            'Indianapolis, USA': 'America/New_York',
            'Seattle, USA': 'America/Los_Angeles',
            'Denver, USA': 'America/Denver',
            'Washington, USA': 'America/New_York',
            'Boston, USA': 'America/New_York',
            'El Paso, USA': 'America/Denver',
            'Nashville, USA': 'America/Chicago',
            'Detroit, USA': 'America/New_York',
            'Oklahoma City, USA': 'America/Chicago',
            'Portland, USA': 'America/Los_Angeles',
            'Las Vegas, USA': 'America/Los_Angeles',
            'Memphis, USA': 'America/Chicago',
            'Louisville, USA': 'America/New_York',
            'Baltimore, USA': 'America/New_York',
            'Milwaukee, USA': 'America/Chicago',
            'Albuquerque, USA': 'America/Denver',
            'Tucson, USA': 'America/Phoenix',
            'Fresno, USA': 'America/Los_Angeles',
            'Sacramento, USA': 'America/Los_Angeles',
            'Atlanta, USA': 'America/New_York',
            'Kansas City, USA': 'America/Chicago',
            'Long Beach, USA': 'America/Los_Angeles',
            'Colorado Springs, USA': 'America/Denver',
            'Miami, USA': 'America/New_York',
            'Raleigh, USA': 'America/New_York',
            'Omaha, USA': 'America/Chicago',
            'Minneapolis, USA': 'America/Chicago',
            'Tulsa, USA': 'America/Chicago',
            'Cleveland, USA': 'America/New_York',
            'Wichita, USA': 'America/Chicago',
            'Arlington, USA': 'America/Chicago',
            'New Orleans, USA': 'America/Chicago',
            'Bakersfield, USA': 'America/Los_Angeles',
            'Tampa, USA': 'America/New_York',
            'Honolulu, USA': 'Pacific/Honolulu',
            'Aurora, USA': 'America/Denver',
            'Anaheim, USA': 'America/Los_Angeles',
            'Santa Ana, USA': 'America/Los_Angeles',
            'Corpus Christi, USA': 'America/Chicago',
            'Riverside, USA': 'America/Los_Angeles',
            'Lexington, USA': 'America/New_York',
            'Stockton, USA': 'America/Los_Angeles',
            'Henderson, USA': 'America/Los_Angeles',
            'Saint Paul, USA': 'America/Chicago',
            'St. Louis, USA': 'America/Chicago',
            'Cincinnati, USA': 'America/New_York',
            'Pittsburgh, USA': 'America/New_York',
            'Greensboro, USA': 'America/New_York',
            'Anchorage, USA': 'America/Anchorage',
            'Plano, USA': 'America/Chicago',
            'Orlando, USA': 'America/New_York',
            'Irvine, USA': 'America/Los_Angeles',
            'Newark, USA': 'America/New_York',
            'Durham, USA': 'America/New_York',
            'Chula Vista, USA': 'America/Los_Angeles',
            'Toledo, USA': 'America/New_York',
            'Fort Wayne, USA': 'America/New_York',
            'St. Petersburg, USA': 'America/New_York',
            'Laredo, USA': 'America/Chicago',
            'Jersey City, USA': 'America/New_York',
            'Chandler, USA': 'America/Phoenix',
            'Madison, USA': 'America/Chicago',
            'Lubbock, USA': 'America/Chicago',
            'Scottsdale, USA': 'America/Phoenix',
            'Reno, USA': 'America/Los_Angeles',
            'Buffalo, USA': 'America/New_York',
            'Gilbert, USA': 'America/Phoenix',
            'Glendale, USA': 'America/Phoenix',
            'North Las Vegas, USA': 'America/Los_Angeles',
            'Winston-Salem, USA': 'America/New_York',
            'Chesapeake, USA': 'America/New_York',
            'Norfolk, USA': 'America/New_York',
            'Fremont, USA': 'America/Los_Angeles',
            'Garland, USA': 'America/Chicago',
            'Irving, USA': 'America/Chicago',
            'Hialeah, USA': 'America/New_York',
            'Richmond, USA': 'America/New_York',
            'Boise, USA': 'America/Boise',
            'Spokane, USA': 'America/Los_Angeles',
            'Baton Rouge, USA': 'America/Chicago',
            'Tacoma, USA': 'America/Los_Angeles',
            'San Bernardino, USA': 'America/Los_Angeles',
            'Grand Rapids, USA': 'America/New_York',
            'Huntsville, USA': 'America/Chicago',
            'Salt Lake City, USA': 'America/Denver',
            'Yonkers, USA': 'America/New_York',
            'Amarillo, USA': 'America/Chicago',
            'McKinney, USA': 'America/Chicago',
            'Rochester, USA': 'America/New_York',
            'Mesa, USA': 'America/Phoenix',
            'Virginia Beach, USA': 'America/New_York',
            'Oakland, USA': 'America/Los_Angeles'
        };
        
        return cityTimezones[city] || this.defaultTimezone;
    }

    updateLocationDisplay() {
        const currentLocationElement = document.getElementById('current-location');
        if (currentLocationElement) {
            const methodName = calculationMethods[this.calculationMethod] || 'ISNA';
            const asrText = this.asrMethod === 'hanafi' ? ' (Hanafi Asr)' : '';
            currentLocationElement.textContent = `📍 ${this.currentLocation} (Method: ${methodName})${asrText}`;
        }
    }

    parsePrayerTimes(timings) {
        return {
            fajr: { 
                time: timings.Fajr, 
                name: 'Fajr', 
                icon: '🌅',
                arabic: 'الفجر'
            },
            dhuhr: { 
                time: timings.Dhuhr, 
                name: 'Dhuhr', 
                icon: '☀️',
                arabic: 'الظهر'
            },
            asr: { 
                time: timings.Asr, 
                name: 'Asr', 
                icon: '🌤️',
                arabic: 'العصر'
            },
            maghrib: { 
                time: timings.Maghrib, 
                name: 'Maghrib', 
                icon: '🌅',
                arabic: 'المغرب'
            },
            isha: { 
                time: timings.Isha, 
                name: 'Isha', 
                icon: '🌙',
                arabic: 'العشاء'
            }
        };
    }

    updateDOMWithPrayerTimes() {
        // Update prayer mat times
        const prayerMats = document.querySelectorAll('.prayer-mat');
        prayerMats.forEach(mat => {
            const prayerType = mat.getAttribute('data-prayer');
            if (this.prayerTimes[prayerType]) {
                const prayerData = this.prayerTimes[prayerType];
                const timeElement = mat.querySelector('.prayer-sacred-time');
                const arabicElement = mat.querySelector('.prayer-sacred-arabic');
                
                if (timeElement) {
                    timeElement.textContent = SacredDateTimeUtils.formatSacredTime(prayerData.time);
                }
                if (arabicElement) {
                    arabicElement.textContent = prayerData.arabic;
                }
            }
        });

        // Update next prayer and countdown
        this.updateNextPrayer();
        
        // Start countdown update interval (update every second)
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => {
            if (this.prayerTimes && Object.keys(this.prayerTimes).length > 0) {
                this.updateNextPrayer();
            }
        }, 1000);
    }

    updateHijriDate(hijriDate) {
        const hijriElement = document.getElementById('hijri-date');
        if (hijriElement && hijriDate) {
            const { day, month, year } = hijriDate;
            hijriElement.textContent = `${day} ${month.en} ${year}`;
        }
    }

    updateNextPrayer() {
        // Use a single time reference for consistency
        const now = new Date();
        const nextPrayer = this.getNextPrayer(now);
        const nextPrayerElement = document.getElementById('next-prayer');
        const countdownElement = document.getElementById('countdown-time');
        
        // Cache the current next prayer to prevent rapid switching
        if (!this.cachedNextPrayer || 
            this.cachedNextPrayer.prayer !== nextPrayer.prayer ||
            this.cachedNextPrayer.time !== nextPrayer.time) {
            this.cachedNextPrayer = { ...nextPrayer };
        }
        
        // Use cached prayer for display to prevent flickering
        const displayPrayer = this.cachedNextPrayer;
        
        if (nextPrayerElement && displayPrayer.prayer) {
            nextPrayerElement.textContent = this.prayerTimes[displayPrayer.prayer].name;
        }
        
        if (countdownElement) {
            countdownElement.textContent = this.calculateCountdown(displayPrayer.time, now, displayPrayer.isTomorrow);
        }

        // Update current prayer highlighting
        this.updatePrayerMatHighlighting(displayPrayer.prayer);
    }

    getNextPrayer(now = null) {
        // Use provided time or current time for consistency
        if (!now) {
            now = new Date();
        }
        // Use seconds precision to match calculateCountdown
        const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const prayerOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        for (let prayer of prayerOrder) {
            if (this.prayerTimes[prayer]) {
                const prayerTimeMinutes = SacredDateTimeUtils.timeToMinutes(this.prayerTimes[prayer].time);
                const prayerTimeSeconds = prayerTimeMinutes * 60;
                
                // Check if prayer time is in the future (with 2 second buffer to prevent oscillation)
                // This ensures we don't switch prayers too early
                if (prayerTimeSeconds > currentSeconds + 2) {
                    return { prayer, time: this.prayerTimes[prayer].time };
                }
            }
        }
        
        // If no prayer found, next prayer is tomorrow's Fajr
        // Only switch if we're definitely past the last prayer (with buffer)
        const lastPrayer = prayerOrder[prayerOrder.length - 1];
        if (this.prayerTimes[lastPrayer]) {
            const lastPrayerTimeMinutes = SacredDateTimeUtils.timeToMinutes(this.prayerTimes[lastPrayer].time);
            const lastPrayerTimeSeconds = lastPrayerTimeMinutes * 60;
            // Only switch to tomorrow if we're at least 2 seconds past the last prayer
            if (currentSeconds >= lastPrayerTimeSeconds + 2) {
                return { prayer: 'fajr', time: this.prayerTimes.fajr?.time || '05:00', isTomorrow: true };
            }
            // Otherwise, still show the last prayer (even if it's passed, until we're sure)
            return { prayer: lastPrayer, time: this.prayerTimes[lastPrayer].time };
        }
        
        return { prayer: 'fajr', time: this.prayerTimes.fajr?.time || '05:00', isTomorrow: true };
    }

    calculateCountdown(nextPrayerTime, now = null, isTomorrow = false) {
        // Minutes-based countdown (no seconds) to avoid flicker
        if (!now) {
            now = new Date();
        }
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const prayerTimeMinutes = SacredDateTimeUtils.timeToMinutes(nextPrayerTime);
        let timeDiffMinutes = prayerTimeMinutes - currentMinutes;

        // If prayer time has passed or it's marked as tomorrow, add 24 hours
        if (timeDiffMinutes <= 0 || isTomorrow) {
            timeDiffMinutes += 24 * 60;
        }

        const hours = Math.floor(timeDiffMinutes / 60);
        const minutes = timeDiffMinutes % 60;

        return SacredDateTimeUtils.formatSacredCountdown(hours, minutes);
    }

    updatePrayerMatHighlighting(currentPrayer) {
        const prayerMats = document.querySelectorAll('.prayer-mat');
        prayerMats.forEach(mat => {
            mat.classList.remove('current-prayer');
            const prayerType = mat.getAttribute('data-prayer');
            if (prayerType === currentPrayer) {
                mat.classList.add('current-prayer');
            }
        });
    }

    updateLoadingState(isLoading) {
        const prayerMats = document.querySelectorAll('.prayer-mat');
        prayerMats.forEach(mat => {
            const timeElement = mat.querySelector('.prayer-sacred-time');
            if (timeElement) {
                if (isLoading) {
                    timeElement.textContent = 'Loading...';
                    timeElement.style.opacity = '0.6';
                } else {
                    timeElement.style.opacity = '1';
                }
            }
        });
    }

    useFallbackTimes() {
        // Fallback to static times if API fails
        this.prayerTimes = {
            fajr: { time: '05:03', name: 'Fajr', icon: '🌅', arabic: 'الفجر' },
            dhuhr: { time: '12:42', name: 'Dhuhr', icon: '☀️', arabic: 'الظهر' },
            asr: { time: '16:18', name: 'Asr', icon: '🌤️', arabic: 'العصر' },
            maghrib: { time: '19:02', name: 'Maghrib', icon: '🌅', arabic: 'المغرب' },
            isha: { time: '20:45', name: 'Isha', icon: '🌙', arabic: 'العشاء' }
        };
        this.updateDOMWithPrayerTimes();
    }
}

// Global prayer times API instance
const prayerTimesAPI = new PrayerTimesAPI();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing Sacred Minaret...');
    
    // Initialize all sacred managers
    const sacredThemeManager = new SacredThemeManager();
    console.log('Theme manager initialized');
    
    const sacredPrayerTimesManager = new SacredPrayerTimesManager();
    console.log('Prayer times manager initialized');
    
    const sacredModal = new SacredModal();
    console.log('Modal manager initialized');
    
    const locationPicker = new LocationPicker();
    console.log('Location picker initialized');
    
    // Fetch real prayer times from API with saved settings
    console.log('Fetching prayer times from Aladhan API...');
    await prayerTimesAPI.fetchPrayerTimesByCoords(
        prayerTimesAPI.defaultCoords, 
        prayerTimesAPI.defaultTimezone
    );
    
    // Load saved alarm states
    sacredPrayerTimesManager.loadSacredAlarmStates();
    console.log('Alarm states loaded');
    
    // Add click handlers to prayer mats
    const prayerMats = document.querySelectorAll('.prayer-mat');
    console.log(`Found ${prayerMats.length} prayer mats`);
    
    prayerMats.forEach(mat => {
        mat.addEventListener('click', () => {
            sacredPrayerTimesManager.handleSacredMatClick(mat);
        });
    });
    
    // Add sacred animations
    document.body.classList.add('sacred-loaded');
    
    console.log('Sacred Minaret Prayer Space initialized successfully! 🕌');
    
    // Test button functionality
    const themeToggle = document.getElementById('theme-toggle');
    const wuduBtn = document.getElementById('wudu-btn');
    const salahGuideBtn = document.getElementById('salah-guide-btn');
    
    console.log('Button elements found:', {
        themeToggle: !!themeToggle,
        wuduBtn: !!wuduBtn,
        salahGuideBtn: !!salahGuideBtn
    });
});

// Add sacred hover effects and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add sacred ripple effect to prayer mats
    document.querySelectorAll('.prayer-mat').forEach(mat => {
        mat.addEventListener('mousedown', function(e) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'sacredRipple 0.8s linear';
            ripple.style.left = e.clientX - this.offsetLeft + 'px';
            ripple.style.top = e.clientY - this.offsetTop + 'px';
            ripple.style.width = ripple.style.height = '20px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add sacred step-by-step animation to wudu steps
    const wuduSteps = document.querySelectorAll('.wudu-sacred-step');
    wuduSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.6s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, 150 * (index + 1));
    });
});

// Add sacred animations and additional styles to CSS
const sacredStyle = document.createElement('style');
sacredStyle.textContent = `
    @keyframes sacredRipple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .theme-transitioning * {
        transition: none !important;
    }
    
    .sacred-loaded .sacred-header {
        animation-play-state: running;
    }
    
    /* Sacred modal entrance animation */
    .sacred-modal.active .modal-sacred-content {
        animation: sacredModalEntrance 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes sacredModalEntrance {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(30px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    /* Sacred step entrance animation */
    .wudu-sacred-step {
        animation: sacredStepEntrance 0.6s ease forwards;
        animation-delay: calc(var(--step-index, 0) * 0.15s);
    }
    
    @keyframes sacredStepEntrance {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Sacred background pattern animation */
    .sacred-pattern {
        animation: sacredPatternFloat 20s ease-in-out infinite;
    }
    
    @keyframes sacredPatternFloat {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-10px) rotate(1deg);
        }
    }
`;
document.head.appendChild(sacredStyle);

// Location Picker Manager
class LocationPicker {
    constructor() {
        this.locationInput = document.getElementById('location-input');
        this.applyButton = document.getElementById('apply-location-btn');
        this.searchButton = document.getElementById('location-search-btn');
        this.detectButton = document.getElementById('detect-location-btn');
        this.locationStatus = document.getElementById('location-status');
        this.currentLocation = document.getElementById('current-location');
        this.geoDetectedCity = document.getElementById('geo-detected-city');
        
        this.prayerTimesAPI = new PrayerTimesAPI();
        this.geolocationService = new GeolocationService();
        
        this.initializeEventListeners();
        this.loadSavedLocation();
    }
    
    initializeEventListeners() {
        // Apply button - only fetch prayer times when clicked
        this.applyButton.addEventListener('click', () => {
            this.applyLocation();
        });
        
        // Search button - for backward compatibility
        this.searchButton.addEventListener('click', () => {
            this.applyLocation();
        });
        
        // Enter key on input - apply location
        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyLocation();
            }
        });
        
        // Detect location button
        this.detectButton.addEventListener('click', () => {
            this.detectLocation();
        });
        
        // Calculation method change - automatically apply
        const calculationMethodSelect = document.getElementById('calculation-method');
        if (calculationMethodSelect) {
            calculationMethodSelect.addEventListener('change', () => {
                this.applyCurrentSettings();
            });
        }
        
        // Asr method toggle - automatically apply
        const asrMethodToggle = document.getElementById('asr-hanafi');
        if (asrMethodToggle) {
            asrMethodToggle.addEventListener('change', () => {
                this.applyCurrentSettings();
            });
        }
    }
    
    async applyCurrentSettings() {
        const currentLocation = this.locationInput.value.trim();
        
        if (!currentLocation) {
            return; // No location set, nothing to apply
        }
        
        this.showStatus('Updating prayer times with new settings...', 'loading');
        
        try {
            // Get current location data
            let locationData = null;
            const builtInCoords = cityCoordinates[currentLocation];
            
            if (builtInCoords) {
                // Use built-in coordinates
                const timezone = this.prayerTimesAPI.getCityTimezone(currentLocation);
                locationData = {
                    latitude: builtInCoords.lat,
                    longitude: builtInCoords.lng,
                    timezone: timezone,
                    city: currentLocation
                };
            } else {
                // Try to get from saved location
                const savedLocation = localStorage.getItem('savedLocation');
                if (savedLocation) {
                    try {
                        const savedData = JSON.parse(savedLocation);
                        if (savedData.city === currentLocation) {
                            locationData = savedData;
                        }
                    } catch (error) {
                        console.error('Error parsing saved location:', error);
                    }
                }
            }
            
            if (locationData) {
                // Fetch prayer times with new settings
                const success = await this.prayerTimesAPI.fetchPrayerTimesByCoords(
                    { lat: locationData.latitude, lng: locationData.longitude },
                    locationData.timezone
                );
                
                if (success) {
                    this.showStatus('Prayer times updated with new settings', 'success');
                } else {
                    throw new Error('Failed to update prayer times');
                }
            } else {
                throw new Error('No location data available');
            }
        } catch (error) {
            console.error('Error applying current settings:', error);
            this.showStatus('Failed to update prayer times with new settings', 'error');
        }
    }
    
    async applyLocation() {
        const location = this.locationInput.value.trim();
        
        if (!location) {
            this.showStatus('Please enter a city and country', 'error');
            return;
        }
        
        this.showStatus('Fetching prayer times...', 'loading');
        this.applyButton.disabled = true;
        
        try {
            // First, try to get coordinates from our built-in database
            let locationData = null;
            const builtInCoords = cityCoordinates[location];
            
            if (builtInCoords) {
                // Use built-in coordinates
                const timezone = this.prayerTimesAPI.getCityTimezone(location);
                locationData = {
                    latitude: builtInCoords.lat,
                    longitude: builtInCoords.lng,
                    timezone: timezone,
                    city: location
                };
                console.log('Using built-in coordinates for:', location, locationData);
            } else {
                // Try geocoding service
                console.log('Geocoding location:', location);
                locationData = await this.geolocationService.getLocationData(location);
                
                if (!locationData) {
                    throw new Error(`Location "${location}" not found. Please try a different city or check the spelling.`);
                }
                console.log('Geocoded location data:', locationData);
            }
            
            // Fetch prayer times with coordinates and timezone
            const success = await this.prayerTimesAPI.fetchPrayerTimesByCoords(
                { lat: locationData.latitude, lng: locationData.longitude },
                locationData.timezone
            );
            
            if (success) {
                // Update current location display
                this.updateCurrentLocationDisplay(location);
                
                // Save location
                this.saveLocation(location, locationData);
                
                this.showStatus(`Prayer times updated for ${location}`, 'success');
            } else {
                throw new Error('Failed to fetch prayer times from API');
            }
        } catch (error) {
            console.error('Error applying location:', error);
            this.showStatus(error.message || 'Failed to fetch prayer times. Please try again.', 'error');
        } finally {
            this.applyButton.disabled = false;
        }
    }
    
    async detectLocation() {
        this.showStatus('Detecting your location...', 'loading');
        this.detectButton.disabled = true;
        
        try {
            const locationData = await this.geolocationService.detectCurrentLocation();
            
            if (locationData && locationData.coords) {
                // Update input with detected location
                this.locationInput.value = locationData.cityName || 'Detected Location';
                
                // Fetch prayer times
                const success = await this.prayerTimesAPI.fetchPrayerTimesByCoords(
                    locationData.coords,
                    locationData.timezone
                );
                
                if (success) {
                    // Update current location display
                    this.updateCurrentLocationDisplay(locationData.cityName || 'Detected Location');
                    
                    // Save location
                    this.saveLocation(locationData.cityName || 'Detected Location', {
                        latitude: locationData.coords.lat,
                        longitude: locationData.coords.lng,
                        timezone: locationData.timezone
                    });
                    
                    // Show detected city
                    this.showDetectedCity(locationData.cityName || 'Detected Location');
                    
                    this.showStatus(`Location detected: ${locationData.cityName || 'Detected Location'}`, 'success');
                } else {
                    throw new Error('Failed to fetch prayer times');
                }
            } else {
                throw new Error('Location detection failed');
            }
        } catch (error) {
            console.error('Error detecting location:', error);
            this.showStatus('Location detection failed. Please enter location manually.', 'error');
        } finally {
            this.detectButton.disabled = false;
        }
    }
    
    updatePrayerTimesDisplay(prayerTimes) {
        // Update prayer times in the prayer manager
        if (window.sacredPrayerTimesManager) {
            window.sacredPrayerTimesManager.updatePrayerTimes(prayerTimes);
        }
    }
    
    saveLocation(location, locationData) {
        const locationInfo = {
            city: location,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timezone: locationData.timezone,
            timestamp: Date.now()
        };
        
        localStorage.setItem('savedLocation', JSON.stringify(locationInfo));
    }
    
    loadSavedLocation() {
        const savedLocation = localStorage.getItem('savedLocation');
        
        if (savedLocation) {
            try {
                const locationInfo = JSON.parse(savedLocation);
                this.locationInput.value = locationInfo.city;
                this.updateCurrentLocationDisplay(locationInfo.city);
            } catch (error) {
                console.error('Error loading saved location:', error);
            }
        }
    }
    
    updateCurrentLocationDisplay(location) {
        if (this.currentLocation) {
            this.currentLocation.textContent = location;
        }
    }
    
    showDetectedCity(city) {
        if (this.geoDetectedCity) {
            this.geoDetectedCity.textContent = city;
            this.geoDetectedCity.classList.add('show');
        }
    }
    
    showStatus(message, type) {
        if (this.locationStatus) {
            this.locationStatus.textContent = message;
            this.locationStatus.className = `location-status ${type}`;
            
            // Clear status after 5 seconds for success/error
            if (type !== 'loading') {
                setTimeout(() => {
                    this.locationStatus.textContent = '';
                    this.locationStatus.className = 'location-status';
                }, 5000);
            }
        }
    }
} 