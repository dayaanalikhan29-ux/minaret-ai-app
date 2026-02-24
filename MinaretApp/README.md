# Minaret App - Islamic AI Assistant

A React Native mobile app that combines 5 Islamic web applications into one unified mobile experience.

## 🚀 Features

- **Main Home Screen** - Beautiful Islamic design with floating AI button
- **AI Chat Interface** - Islamic guidance and Q&A powered by AI
- **Navigation System** - 5 tabs for different Islamic features
- **Responsive Design** - Works on all mobile devices
- **Real-time Chat** - Interactive AI conversations

## 📱 App Structure

1. **Home** - Main landing page with "Ask AI" button
2. **Quran** - Quran reading and study (coming soon)
3. **Hadith** - Hadith collection and search (coming soon)
4. **Ask AI** - AI-powered Islamic guidance chat
5. **Prayer** - Prayer times and qibla (coming soon)
6. **Classes** - Islamic learning classes (coming soon)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- Expo Go app on your phone

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run server
   ```
   This will start the AI server on `http://localhost:8080`

3. **Start the React Native app:**
   ```bash
   npm start
   ```
   This will start the Expo development server

4. **Test on your phone:**
   - Download "Expo Go" from App Store/Google Play
   - Scan the QR code that appears in your terminal
   - Your app will load on your phone!

## 🔧 Configuration

### AI Server
The AI server is configured to run on port 8080. You can modify the port in `server.js` if needed.

### API Endpoints
- `POST /ask` - Main chat endpoint
- `GET /api/health` - Health check endpoint

## 🎨 Design Features

- **Islamic Color Scheme:**
  - Primary Green: `#2E7D32`
  - Beige: `#f5f2ea`
  - Gold Accent: `#c3a545`
  - Dark Text: `#181818`

- **Animations:**
  - Floating "Ask AI" button
  - Message fade-in effects
  - Smooth navigation transitions

## 📁 Project Structure

```
MinaretApp/
├── App.js                 # Main app with navigation
├── server.js              # Backend AI server
├── screens/
│   └── AskAIScreen.js     # AI chat interface
├── package.json
└── README.md
```

## 🔄 Development Workflow

1. **Make changes** to your code
2. **Save the file** - changes will automatically reload
3. **Test on your phone** - the app updates in real-time

## 🚀 Next Steps

To add your remaining 4 web pages:

1. Create new screen files in the `screens/` folder
2. Convert HTML/CSS/JS to React Native components
3. Update the navigation in `App.js`
4. Test and iterate

## 🐛 Troubleshooting

### Common Issues

1. **Server not starting:**
   - Make sure port 8080 is not in use
   - Check if all dependencies are installed

2. **App not connecting to server:**
   - Ensure both server and app are running
   - Check that your phone and computer are on the same network

3. **QR code not working:**
   - Make sure Expo Go is installed
   - Try refreshing the terminal

## 📞 Support

If you encounter any issues, check:
1. All dependencies are installed
2. Both server and app are running
3. Your phone and computer are on the same network

## 🎯 Future Enhancements

- [ ] Add remaining 4 web pages as screens
- [ ] Implement dark/light mode
- [ ] Add offline functionality
- [ ] Integrate with your full OpenAI backend
- [ ] Add push notifications
- [ ] Implement user authentication

---

**Built with ❤️ for the Islamic community** 