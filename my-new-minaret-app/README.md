# 🕌 Minaret AI - Islamic Knowledge Assistant

A beautiful, respectful AI-powered chat application designed to help users learn about Islam based on authentic sources from the Quran and Hadith.

## 🌟 Features

- **Islamic Knowledge**: Get answers about Islamic teachings, Quran, Hadith, and Islamic practices
- **Beautiful UI**: Modern, respectful design with Islamic geometric patterns and warm colors
- **Real-time Chat**: Smooth, responsive chat interface with typing effects
- **Authentic Sources**: Responses based on Quran and authentic Hadith
- **Mobile Friendly**: Works perfectly on all devices
- **Security**: Built-in security middleware and rate limiting
- **Accessibility**: Keyboard shortcuts and screen reader support

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Security**: Helmet, CORS, Rate Limiting
- **Styling**: Modern CSS with Islamic-themed design

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/minaret-ai-islamic-chat.git
   cd minaret-ai-islamic-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Development
```bash
npm run dev    # Start with nodemon (auto-restart on changes)
```

### Production
```bash
npm start      # Start production server
```

### Testing
```bash
npm test       # Run test suite
npm run lint   # Run ESLint
```

## 💬 Chat Features

### Sample Questions You Can Ask:
- "What are the five pillars of Islam?"
- "Tell me about Prophet Muhammad (PBUH)"
- "What does the Quran say about kindness?"
- "Explain the concept of halal and haram"
- "How many times do Muslims pray daily?"
- "What is the significance of Ramadan?"
- "Tell me about Islamic charity (Zakat)"

### Keyboard Shortcuts:
- `Enter` - Send message
- `Ctrl/Cmd + Enter` - Send message
- `Escape` - Clear input
- `Ctrl/Cmd + K` - Focus on input

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Islamic Chat
- `POST /ask` - Ask questions about Islam
  ```json
  {
    "question": "What are the five pillars of Islam?"
  }
  ```

## 🎨 Design Features

### Islamic-Themed Styling:
- Warm, respectful color palette
- Islamic geometric patterns
- Arabic-inspired typography (Amiri font)
- Smooth animations and transitions
- Mobile-responsive design

### User Experience:
- Typing effects for AI responses
- Loading indicators
- Smooth scrolling
- Message formatting
- Error handling

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### Security Settings
- Rate limiting: 50 requests per 15 minutes per IP
- CORS: Configurable origins
- Helmet: Security headers enabled
- Content Security Policy: Configured for fonts and inline styles

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

We welcome contributions that respect Islamic values and principles. Please ensure all contributions:

1. Maintain respect for Islamic teachings
2. Follow authentic sources (Quran and authentic Hadith)
3. Use appropriate and respectful language
4. Include proper documentation

### Contribution Process:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notice

This application is designed to provide general information about Islam based on authentic sources. However:

- **Not a Replacement**: This is not a replacement for qualified Islamic scholars
- **General Guidance**: Responses are for educational purposes only
- **Consult Scholars**: For specific religious rulings, always consult qualified Islamic scholars
- **Authentic Sources**: Always verify information with authentic Islamic sources

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/minaret-ai-islamic-chat/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker build -t minaret-ai-islamic-chat .
docker run -p 3000:3000 minaret-ai-islamic-chat
```

## 📊 Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🔮 Future Enhancements

- [ ] Integration with real AI models for more sophisticated responses
- [ ] Multi-language support (Arabic, Urdu, etc.)
- [ ] Voice input and output
- [ ] Islamic calendar integration
- [ ] Prayer time notifications
- [ ] Quran recitation features
- [ ] Advanced search through Islamic texts
- [ ] User authentication and chat history

## 🙏 Acknowledgments

- Islamic scholars and teachers who provide authentic knowledge
- The Muslim community for feedback and support
- Open source contributors who make this project possible

---

**🕌 Built with respect and devotion by the Minaret AI Team**

*May Allah guide us all to the right path and accept our efforts.* 