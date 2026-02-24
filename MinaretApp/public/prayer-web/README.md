# Minaret - Prayer Times

A beautiful, mobile-friendly prayer times page for the Minaret Islamic web app.

## Features

✅ **Vanilla HTML, CSS, and JavaScript** - No frameworks or heavy packages  
✅ **Mobile-friendly design** - Responsive layout that works on all devices  
✅ **Light/Dark mode toggle** - Beautiful theme switching with smooth transitions  
✅ **Teal + Beige theme** - Calm and beautiful color scheme  
✅ **All 5 prayer times** - Fajr, Dhuhr, Asr, Maghrib, and Isha clearly displayed  
✅ **Current prayer highlighting** - Automatically highlights the current prayer time  
✅ **Next prayer countdown** - Shows time remaining until the next prayer  
✅ **Current date display** - Shows today's date in a readable format  
✅ **Smooth animations** - Beautiful fade-in effects and hover interactions  

## File Structure

```
/prayer
  ├── index.html      # Main HTML structure
  ├── style.css       # Beautiful styling with theme support
  ├── script.js       # Interactive functionality
  └── README.md       # This file
```

## Usage

1. Open `index.html` in any modern web browser
2. The page will automatically:
   - Display current date
   - Show all prayer times
   - Highlight the current prayer
   - Calculate and display the next prayer countdown
3. Click the sun/moon icon to toggle between light and dark themes
4. Click on any prayer card for future interactions

## Current Data

The app currently uses dummy prayer times for Mecca, Saudi Arabia:
- **Fajr**: 05:03 AM
- **Sunrise**: 06:15 AM  
- **Dhuhr**: 12:42 PM
- **Asr**: 04:18 PM
- **Maghrib**: 07:25 PM
- **Isha**: 08:45 PM

## Future Enhancements

- Connect to real prayer times API (Aladhan, etc.)
- Add location detection and selection
- Include prayer notifications
- Add Qibla direction
- Include Islamic calendar dates
- Add prayer time calculation methods selection

## Browser Support

Works in all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- ES6+ JavaScript features
- Local Storage API

## Development

This is a static project that can be served from any web server or opened directly in a browser. No build process or dependencies required. 