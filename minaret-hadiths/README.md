# Minaret Hadiths

A beautiful, modern web application for browsing and searching authentic Islamic hadiths (traditions of the Prophet Muhammad ﷺ).

## Features

- **Search Functionality**: Search through hadiths by title, text, or narrator
- **Advanced Filtering**: Filter by category and narrator
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Pagination**: Navigate through large collections of hadiths
- **Modal View**: Click on any hadith to view it in full detail
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## Project Structure

```
minaret-hadiths/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── assets/
    └── data/
        └── minaret_hadiths.json  # Hadiths data (expandable)
```

## Getting Started

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start exploring** the hadiths!

No server setup required - this is a pure HTML/CSS/JavaScript application that runs entirely in the browser.

## Usage

### Searching Hadiths
- Use the search bar to find hadiths by keywords
- Search works across titles, text content, and narrator names
- Press Enter or click the Search button

### Filtering
- Use the category dropdown to filter by hadith categories
- Use the narrator dropdown to filter by specific narrators
- Filters can be combined with search terms

### Navigation
- Use the Previous/Next buttons to navigate through pages
- Each page shows 10 hadiths by default
- Click on any hadith card to view the full text in a modal

### Modal View
- Click any hadith to open it in a detailed modal view
- Press Escape or click the X to close the modal
- Modal shows complete hadith text, narrator, category, and source

## Data Structure

The application uses a JSON structure for hadith data:

```json
{
  "hadiths": [
    {
      "id": 1,
      "title": "Hadith Title",
      "narrator": "Narrator Name",
      "text": "Full hadith text...",
      "category": "Category Name",
      "source": "Source Book",
      "bookNumber": 1,
      "hadithNumber": 1
    }
  ],
  "metadata": {
    "totalHadiths": 10,
    "categories": ["Category1", "Category2"],
    "narrators": ["Narrator1", "Narrator2"],
    "sources": ["Source1", "Source2"],
    "lastUpdated": "2024-01-01",
    "version": "1.0.0"
  }
}
```

## Adding More Hadiths

To add more hadiths to the collection:

1. **Edit** `assets/data/minaret_hadiths.json`
2. **Add** new hadith objects to the `hadiths` array
3. **Update** the metadata section with new categories, narrators, etc.
4. **Refresh** the page to see the new hadiths

## Customization

### Styling
- Modify `style.css` to change colors, fonts, and layout
- The app uses CSS custom properties for easy theming
- Responsive breakpoints are clearly marked

### Functionality
- Edit `script.js` to modify search behavior, pagination, or add new features
- The code is well-commented and modular for easy modification

### Data Loading
- Currently uses sample data embedded in JavaScript
- To use the JSON file, uncomment the `loadHadithsFromFile()` function in `script.js`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Feel free to contribute to this project by:
- Adding more authentic hadiths
- Improving the UI/UX
- Adding new features
- Fixing bugs
- Improving accessibility

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Hadiths are sourced from authentic collections (Sahih Bukhari, Sahih Muslim, etc.)
- UI design inspired by modern web applications
- Built with vanilla HTML, CSS, and JavaScript for maximum compatibility

---

**Note**: This application is designed for educational and spiritual purposes. Always refer to authentic sources and scholars for religious guidance. 