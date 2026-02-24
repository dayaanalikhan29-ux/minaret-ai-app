const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Minaret AI Server is running'
  });
});

// Main chat endpoint
app.post('/ask', async (req, res) => {
  try {
    const userMessage = req.body.question;
    let history = [];
    
    if (req.body.history) {
      try {
        history = JSON.parse(req.body.history);
      } catch (e) {
        history = [];
      }
    }
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Generate Islamic response
    const answer = generateIslamicResponse(userMessage, history);

    // Return JSON response for the app
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate Islamic responses
function generateIslamicResponse(question, history) {
  const lowerQuestion = question.toLowerCase();
  let greeting = '';
  
  if (!history || history.length === 0) {
    greeting = '🤲 Assalamu Alaikum! I\'m Minaret AI — here to help you with Islamic knowledge and guidance, Insha\'Allah.\n\n';
  }

  // Five Pillars
  if (lowerQuestion.includes('five pillars')) {
    return greeting + 
      'The Five Pillars of Islam\n' +
      'Of course! Here are the pillars every Muslim should know, Insha\'Allah:\n\n' +
      '1. Shahada (Faith): Declaring there is no god but Allah and Muhammad is His Messenger. 🕌\n' +
      '2. Salah (Prayer): Performing five daily prayers. 📿\n' +
      '3. Zakat (Charity): Giving to those in need. 🤲\n' +
      '4. Sawm (Fasting): Fasting during Ramadan. 🌙\n' +
      '5. Hajj (Pilgrimage): Pilgrimage to Mecca if able. 🕋\n\n' +
      'May Allah make it easy for you!\n\n' +
      'Quran – Surah Al-Baqarah (2:2)\n' +
      'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ هُدًى لِّلْمُتَّقِينَ\n' +
      '"This is the Book about which there is no doubt, a guidance for those conscious of Allah."';
  }

  // Articles of Faith
  if (lowerQuestion.includes('pillars of iman') || lowerQuestion.includes('articles of faith')) {
    return greeting + 
      'The Six Articles of Faith (Iman)\n' +
      'Here are the core beliefs of a Muslim, Insha\'Allah:\n\n' +
      '1. Belief in Allah (God)\n' +
      '2. Belief in Angels\n' +
      '3. Belief in the Books (Quran, Torah, Gospel, etc.)\n' +
      '4. Belief in the Prophets\n' +
      '5. Belief in the Day of Judgment\n' +
      '6. Belief in Divine Decree (Qadar)\n\n' +
      'May Allah strengthen our faith!';
  }

  // Wudu
  if (lowerQuestion.includes('wudu') || lowerQuestion.includes('ablution')) {
    return greeting + 
      'How to Perform Wudu (Ablution)\n' +
      'Here are the steps, Insha\'Allah:\n\n' +
      '1. Make intention (niyyah) for purification.\n' +
      '2. Wash hands up to the wrists three times.\n' +
      '3. Rinse mouth and nose three times.\n' +
      '4. Wash face three times.\n' +
      '5. Wash arms up to elbows three times.\n' +
      '6. Wipe head (masah) and ears once.\n' +
      '7. Wash feet up to ankles three times.\n\n' +
      'After completing, say:\n' +
      '"Ashhadu an la ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan abduhu wa rasuluhu." 🤲';
  }

  // Greetings
  if (lowerQuestion.includes('assalamu alaikum') || lowerQuestion.includes('salaam')) {
    return 'Wa Alaikum Assalam wa rahmatullah, my friend! May Allah bless you.';
  }
  
  if (lowerQuestion.includes('hi') || lowerQuestion.includes('hello')) {
    return 'Wa Alaikum Assalam! How can I help you, my friend?';
  }
  
  if (lowerQuestion.includes('thank') || lowerQuestion.includes('thanks')) {
    return 'You\'re most welcome, my friend! May Allah reward you.';
  }
  
  if (lowerQuestion.includes('how are you')) {
    return 'Alhamdulillah, I\'m well. JazakAllah for asking! How are you, my friend?';
  }

  // Default response
  return greeting + 
    'Thank you for your question. I\'m here to help you with Islamic knowledge and guidance. ' +
    'For specific questions about Islamic rulings, please consult with a knowledgeable Islamic scholar. 🤲';
}

// Start server
app.listen(PORT, () => {
  console.log('🕌 Minaret AI server running on port ' + PORT);
  console.log('🌐 URL: http://localhost:' + PORT);
  console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
}); 