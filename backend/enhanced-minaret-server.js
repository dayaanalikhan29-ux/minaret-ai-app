const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.setHeader('X-Minaret-Server', 'true');
  const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
    'http://localhost:8084',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:8082',
    'http://127.0.0.1:8083',
    'http://127.0.0.1:8084',
    'http://192.168.0.105:8081'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (origin && origin.includes('localhost')) {
    // Allow any localhost origin for development
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize OpenAI
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

let hadithData = [];
try {
    hadithData = JSON.parse(fs.readFileSync('hadith-sample.json', 'utf8'));
} catch (e) {
    console.error('Could not load hadith-sample.json:', e);
}

// Load Quran data (Surah 1 and 2, Arabic and English)
let quranSurahs = [];
try {
    const surah1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/surah/surah_1.json'), 'utf8'));
    const surah2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/surah/surah_2.json'), 'utf8'));
    const en1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/translation/en/en_translation_1.json'), 'utf8'));
    const en2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/translation/en/en_translation_2.json'), 'utf8'));
    quranSurahs = [
        { arabic: surah1, english: en1 },
        { arabic: surah2, english: en2 }
    ];
} catch (e) {
    console.error('Could not load Quran data:', e);
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        openai: process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'
    });
});

// Prayer times proxy endpoint (avoids CORS in frontend)
// Usage: GET /api/prayer-times?city=Lahore, Pakistan
app.get('/api/prayer-times', (req, res) => {
  const rawCity = req.query.city || 'Lahore, Pakistan';
  const cityName = rawCity.split(',')[0].trim();

  // Use MuslimSalat on the server side so the frontend doesn't hit CORS
  const apiKey = process.env.MUSLIMSALAT_API_KEY || 'b2b0798b63dccfe530f98f1d04547720';
  if (!apiKey || apiKey === 'YOUR_MUSLIMSALAT_API_KEY_HERE') {
    return res.status(500).json({ error: 'Prayer API key not configured on server' });
  }

  const url = `https://muslimsalat.com/${encodeURIComponent(cityName)}.json?key=${apiKey}`;
  console.log('Fetching prayer times (server-side) from:', url);

  https
    .get(url, (apiRes) => {
      let body = '';
      apiRes.on('data', (chunk) => (body += chunk));
      apiRes.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.status_valid === 1 && Array.isArray(data.items) && data.items[0]) {
            const t = data.items[0];
            const timings = {
              Fajr: t.fajr,
              Sunrise: t.shurooq || t.sunrise,
              Dhuhr: t.dhuhr,
              Asr: t.asr,
              Sunset: t.maghrib,
              Maghrib: t.maghrib,
              Isha: t.isha,
              Imsak: t.imsak || t.fajr,
              Midnight: ''
            };
            return res.json({ city: rawCity, timings });
          }
          console.error('Unexpected prayer API response:', data);
          return res.status(502).json({ error: 'Invalid prayer API response', raw: data });
        } catch (e) {
          console.error('Error parsing prayer API response:', e);
          return res.status(502).json({ error: 'Failed to parse prayer API response' });
        }
      });
    })
    .on('error', (err) => {
      console.error('Error calling prayer API:', err);
      return res.status(502).json({ error: 'Failed to reach prayer API' });
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
        let answer;
        let source = 'Simulated';
        // Try OpenAI if configured
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
            try {
                // Prepare context-aware messages
                const messages = [
                        {
                            role: 'system',
                        content: `You are an Islamic AI assistant named "Minaret," inside a spiritual and educational app. You are like a helpful Muslim friend — humble, kind, and full of knowledge. You should respond in a warm and conversational tone, like a real person.\n\nYour core behavior:\n1. **Greeting**: Start with "Assalamu Alaikum! How can I help you today?" only at the beginning of a new conversation, not in every response.\n2. **Casual interactions**: Respond warmly to casual messages.\n3. **Islamic Q&A - CRITICAL RULES**: ALWAYS include exact Quranic verses and/or Hadiths when answering Islamic questions.\n4. **Tone and style**: Be friendly, humble, and within Islamic manners.\n5. **Scope**: For non-Islamic questions, only respond if you can connect it to Islamic knowledge or values.\n6. **Purpose**: Help people feel closer to Allah through authentic Islamic knowledge.\nSpeak like a helpful Muslim friend. Keep your tone soft, polite, and beautiful. Avoid sounding like a robot or customer support agent.`
                    }
                ];
                // Add up to last 5 exchanges (10 messages) from client
                for (const msg of history.slice(-10)) {
                    messages.push(msg);
                }
                // Add current user message
                messages.push({ role: 'user', content: userMessage });
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages,
                    max_tokens: 500,
                    temperature: 0.7
                });
                answer = completion.choices[0].message.content;
                source = 'OpenAI';
            } catch (openaiError) {
                console.error('OpenAI error:', openaiError);
                // Fall back to simulated response
                answer = generateIslamicResponse(userMessage, history);
                source = 'Simulated (OpenAI failed)';
            }
        } else {
            answer = generateIslamicResponse(userMessage, history);
        }

        // Return enhanced HTML response
        res.json({ answer });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper to format lists and quotes for Islamic answers
function formatIslamicList(items, type = 'ol') {
    if (!Array.isArray(items) || items.length === 0) return '';
    const tag = type === 'ul' ? 'ul' : 'ol';
    return `<${tag} style="margin:1em 0 1em 1.5em;padding:0 0 0 1em;">` +
        items.map(i => `<li style="margin-bottom:0.5em;">${i}</li>`).join('') + `</${tag}>`;
}

function getBrotherOrSister(history) {
    // Try to infer gender from history, else default to 'my friend'
    // (You can expand this logic if you want)
    return 'my friend';
}

function formatIslamicQuoteBlock(label, arabic, english) {
    return '<div style="margin:1.2em 0 1.2em 0;padding:0.8em 1em;background:#f6e7c1;border-radius:14px;font-family:\'Playfair Display\',serif;font-size:1.05em;line-height:1.7;">' +
        '<strong>' + label + '</strong><br>' +
        '<span style="display:block;margin:0.7em 0 0.3em 0;font-family:Amiri,serif;font-size:1.13em;">' + arabic + '</span>' +
        '<span style="display:block;">' + english + '</span>' +
    '</div>';
}

function generateIslamicResponse(question, history) {
    const lowerQuestion = question.toLowerCase();
    let greeting = '';
    if (!history || history.length === 0) {
        greeting = '🤲 <strong>Assalamu Alaikum!</strong> I\'m Minaret AI — here to help you with Islamic knowledge and guidance, Insha\'Allah.<br><br>';
    }
    // Five Pillars
    if (lowerQuestion.includes('five pillars')) {
        return greeting +
            '<strong>The Five Pillars of Islam</strong><br>' +
            'Of course! Here are the pillars every Muslim should know, Insha\'Allah:<br>' +
            formatIslamicList([
                '<strong>Shahada (Faith):</strong> Declaring there is no god but Allah and Muhammad is His Messenger. 🕌',
                '<strong>Salah (Prayer):</strong> Performing five daily prayers. 📿',
                '<strong>Zakat (Charity):</strong> Giving to those in need. 🤲',
                '<strong>Sawm (Fasting):</strong> Fasting during Ramadan. 🌙',
                '<strong>Hajj (Pilgrimage):</strong> Pilgrimage to Mecca if able. 🕋'
            ]) +
            'May Allah make it easy for you!<br><br>' +
            formatIslamicQuoteBlock(
                'Quran – Surah Al-Baqarah (2:2)',
                'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ هُدًى لِّلْمُتَّقِينَ',
                '“This is the Book about which there is no doubt, a guidance for those conscious of Allah.”'
            );
    }
    // Articles of Faith
    if (lowerQuestion.includes('pillars of iman') || lowerQuestion.includes('articles of faith')) {
        return greeting +
            '<strong>The Six Articles of Faith (Iman)</strong><br>' +
            'Here are the core beliefs of a Muslim, Insha\'Allah:<br>' +
            formatIslamicList([
                '<strong>Belief in Allah</strong> (God)',
                '<strong>Belief in Angels</strong>',
                '<strong>Belief in the Books</strong> (Quran, Torah, Gospel, etc.)',
                '<strong>Belief in the Prophets</strong>',
                '<strong>Belief in the Day of Judgment</strong>',
                '<strong>Belief in Divine Decree</strong> (Qadar)'
            ], 'ol') +
            'May Allah strengthen our faith!<br>';
    }
    // Wudu
    if (lowerQuestion.includes('wudu') || lowerQuestion.includes('ablution')) {
        return greeting +
            '<strong>How to Perform Wudu (Ablution)</strong><br>' +
            'Here are the steps, Insha\'Allah:<br>' +
            formatIslamicList([
                'Make intention (niyyah) for purification.',
                'Wash hands up to the wrists three times.',
                'Rinse mouth and nose three times.',
                'Wash face three times.',
                'Wash arms up to elbows three times.',
                'Wipe head (masah) and ears once.',
                'Wash feet up to ankles three times.'
            ], 'ol') +
            'After completing, say:<br><em>"Ashhadu an la ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan abduhu wa rasuluhu."</em> 🤲<br>';
    }
    // Greetings
    if (lowerQuestion.includes('assalamu alaikum') || lowerQuestion.includes('salaam')) {
        return 'Wa Alaikum Assalam wa rahmatullah, ' + getBrotherOrSister(history) + '! May Allah bless you.<br>';
    }
    if (lowerQuestion.includes('hi') || lowerQuestion.includes('hello')) {
        return 'Wa Alaikum Assalam! How can I help you, ' + getBrotherOrSister(history) + '?';
    }
    if (lowerQuestion.includes('thank') || lowerQuestion.includes('thanks')) {
        return 'You\'re most welcome, ' + getBrotherOrSister(history) + '! May Allah reward you.';
    }
    if (lowerQuestion.includes('how are you')) {
        return 'Alhamdulillah, I\'m well. JazakAllah for asking! How are you, ' + getBrotherOrSister(history) + '?';
    }
    // --- Quranic search ---
    let found = null;
    let foundSurah = null;
    let foundVerseNum = null;
    let foundSurahName = null;
    let bestPartial = null;
    let bestPartialSurah = null;
    let bestPartialVerseNum = null;
    let bestPartialSurahName = null;
    let bestPartialScore = 0;
    for (const surah of quranSurahs) {
        const arabicVerses = surah.arabic.verse;
        const englishVerses = surah.english.verse;
        const surahName = surah.arabic.name;
        for (const [verseKey, arabicText] of Object.entries(arabicVerses)) {
            const verseNum = verseKey.replace('verse_', '');
            const englishText = englishVerses[verseKey];
            const words = lowerQuestion.split(/\s+/);
            if (words.every(word => arabicText.includes(word) || (englishText && englishText.toLowerCase().includes(word)))) {
                found = { arabic: arabicText, english: englishText };
                foundSurah = surahName;
                foundVerseNum = verseNum;
                foundSurahName = surah.arabic.name;
                break;
            }
            let score = 0;
            for (const word of words) {
                if (arabicText.includes(word) || (englishText && englishText.toLowerCase().includes(word))) {
                    score++;
                }
            }
            if (score > bestPartialScore) {
                bestPartialScore = score;
                bestPartial = { arabic: arabicText, english: englishText };
                bestPartialSurah = surahName;
                bestPartialVerseNum = verseNum;
                bestPartialSurahName = surah.arabic.name;
            }
        }
        if (found) break;
    }
    if (found) {
        return greeting +
            formatIslamicQuoteBlock(
                'Quran – Surah ' + foundSurahName + ' (' + foundVerseNum + ')',
                found.arabic,
                found.english
            );
    }
    if (bestPartial && bestPartialScore > 0) {
        return greeting +
            formatIslamicQuoteBlock(
                'Quran (closest) – Surah ' + bestPartialSurahName + ' (' + bestPartialVerseNum + ')',
                bestPartial.arabic,
                bestPartial.english
            ) +
            '<br><em>This is the closest Quranic guidance I found. For detailed rulings, please consult a knowledgeable Islamic scholar.</em>';
    }
    // If not found in Quran, fallback
    return greeting + '<span>Sorry, I couldn\'t find a direct answer in the Quran or Hadith. For deeper understanding, consider asking a knowledgeable Islamic scholar. 🤲</span>';
}

// Serve the enhanced main page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Minaret AI</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
            <style>
                *, *::before, *::after { box-sizing: border-box; }
                :root {
                    --cream: #fdfaf3;
                    --sand-gold: #f6e7c1;
                    --user-bubble: #fff;
                    --user-border: #dcdcdc;
                    --send-btn: #c9b17c;
                    --text: #2e2e2e;
                    --serif: 'Playfair Display', Georgia, serif;
                    --sans: 'Inter', Arial, sans-serif;
                    }
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    }
                body {
                    min-height: 100vh;
                    background: var(--cream);
                    font-family: var(--sans);
                    color: var(--text);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: relative;
                }
                /* Subtle geometric Islamic pattern background */
                body::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0.07;
                    background: url('data:image/svg+xml;utf8,<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.18"><path d="M60 0L65.45 18.09H84.85L69.7 29.27L75.15 47.36L60 36.18L44.85 47.36L50.3 29.27L35.15 18.09H54.55L60 0Z" fill="%23c9b17c"/></g></svg>');
                    background-size: 120px 120px;
                    background-repeat: repeat;
                }
                .top-bar {
                    width: 100vw;
                    background: var(--cream);
                    box-shadow: 0 2px 16px rgba(201, 177, 124, 0.06);
                    padding: 2.1rem 0 0.2rem 0;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                }
                .main-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #bfa14a;
                    letter-spacing: 1.2px;
                    margin-bottom: 0.2rem;
                    line-height: 1.1;
                }
                .subtitle {
                    font-size: 0.92rem;
                    color: #a68d36;
                    font-weight: 400;
                    margin-top: 0.1rem;
                    margin-bottom: 0.2rem;
                    letter-spacing: 0.1px;
                }
                .gold-divider-bar {
                    width: 100vw;
                    background: var(--cream);
                    height: 2.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(201, 177, 124, 0.04);
                    z-index: 2;
                }
                .divider-text {
                    color: #bfa14a;
                    font-family: var(--serif);
                    font-size: 1.13rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    opacity: 0.85;
                }
                .chat-area {
                    flex: 1 1 auto;
                    overflow-y: auto;
                    padding: 2.1rem 0.5rem 2.1rem 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                    background: transparent;
                    min-height: 0;
                    z-index: 1;
                }
                .bubble {
                    max-width: 48vw;
                    padding: 0.7rem 1rem;
                    border-radius: 18px;
                    font-size: 0.98rem;
                    line-height: 1.6;
                    box-shadow: 0 4px 24px rgba(201, 177, 124, 0.10);
                    word-break: break-word;
                    position: relative;
                    margin-bottom: 0.1rem;
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bubble.user {
                    align-self: flex-end;
                    background: var(--user-bubble);
                    color: var(--text);
                    border: 1.5px solid var(--user-border);
                    border-bottom-right-radius: 8px;
                    border-top-right-radius: 22px;
                    border-top-left-radius: 22px;
                    border-bottom-left-radius: 22px;
                    font-family: var(--sans);
                    box-shadow: 0 2px 12px rgba(201, 177, 124, 0.08);
                }
                .bubble.ai {
                    align-self: flex-start;
                    background: var(--sand-gold);
                    color: var(--text);
                    font-family: var(--serif);
                    border: 1.5px solid #e5dabd;
                    border-bottom-left-radius: 8px;
                    border-top-right-radius: 22px;
                    border-top-left-radius: 22px;
                    border-bottom-right-radius: 22px;
                    box-shadow: 0 4px 24px rgba(201, 177, 124, 0.13);
                }
                .timestamp {
                    font-size: 0.85rem;
                    color: #b0b0b0;
                    margin-top: 0.7rem;
                    align-self: flex-end;
                    font-family: var(--sans);
                }
                .input-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100vw;
                    max-width: 100vw;
                    margin: 0;
                    background: var(--user-bubble);
                    box-shadow: 0 -2px 16px rgba(201, 177, 124, 0.08);
                    padding: 0.5rem 0.2rem 0.5rem 0.2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 10;
                    box-sizing: border-box;
                }
                .input-field {
                    flex: 1 1 auto;
                    min-width: 0;
                    border: 1.5px solid var(--user-border);
                    outline: none;
                    font-size: 1rem;
                    background: #fcf8ee;
                    font-family: var(--sans);
                    color: var(--text);
                    padding: 0.6rem 0.2rem;
                    border-radius: 18px;
                    box-shadow: 0 2px 8px rgba(201, 177, 124, 0.07) inset;
                    margin-right: 0.3rem;
                    transition: border 0.2s;
                }
                .input-field:focus {
                    border: 1.5px solid #c9b17c;
                }
                .send-btn {
                    background: var(--send-btn);
                    color: var(--text);
                    border: none;
                    border-radius: 50px;
                    padding: 0.6rem 1.1rem;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(201, 177, 124, 0.13), 0 2px 8px rgba(201, 177, 124, 0.13) inset;
                    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s;
                    white-space: nowrap;
                }
                .send-btn:hover {
                    background: #bfa14a;
                    color: #fff;
                }
                @media (max-width: 700px) {
                    .bubble { font-size: 0.93rem; padding: 0.5rem 0.5rem; max-width: 80vw; border-radius: 14px; }
                    .input-bar {
                        width: 100vw;
                        max-width: 100vw;
                        left: 0;
                        right: 0;
                        margin: 0;
                        padding: 0.3rem 0.1rem 0.3rem 0.1rem;
                    }
                    .input-field {
                        font-size: 0.93rem;
                        padding: 0.4rem 0.1rem;
                        border-radius: 14px;
                    }
                    .send-btn {
                        padding: 0.4rem 0.8rem;
                        font-size: 0.93rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="top-bar">
                <div class="main-title">Minaret AI</div>
                <div class="subtitle">Your Islamic Guidance Assistant</div>
            </div>
            <div class="gold-divider-bar">
                <span class="divider-text">Islamic Wisdom & Guidance</span>
            </div>
            <div class="chat-area" id="chatbox">
                <!-- Messages will be injected here -->
            </div>
            <form class="input-bar" id="chatForm" autocomplete="off">
                <input type="text" class="input-field" id="userInput" placeholder="Type your question..." required autocomplete="off">
                <button type="submit" class="send-btn" id="sendBtn">Send</button>
            </form>
            <script>
                // --- Chat logic ---
                const chatbox = document.getElementById('chatbox');
                const chatForm = document.getElementById('chatForm');
                const userInput = document.getElementById('userInput');
                const sendBtn = document.getElementById('sendBtn');
                let conversationHistory = [];
                let greeted = false;
                let isProcessing = false;
                function addMessage(text, sender, timestamp) {
                    const bubble = document.createElement('div');
                    bubble.className = 'bubble ' + (sender === 'user' ? 'user' : 'ai');
                    bubble.innerHTML = text;
                    const timeDiv = document.createElement('div');
                    timeDiv.className = 'timestamp';
                    timeDiv.textContent = timestamp;
                    bubble.appendChild(timeDiv);
                    chatbox.appendChild(bubble);
                    chatbox.scrollTop = chatbox.scrollHeight;
                }
                function setInputState(disabled) {
                    userInput.disabled = disabled;
                    sendBtn.disabled = disabled;
                    isProcessing = disabled;
                    if (disabled) {
                        userInput.style.opacity = '0.6';
                        sendBtn.style.opacity = '0.6';
                    } else {
                        userInput.style.opacity = '1';
                        sendBtn.style.opacity = '1';
                        userInput.focus();
                    }
                }
                async function sendMessage(text) {
                    if (isProcessing) return;
                    const now = new Date();
                    addMessage(text, 'user', now.toLocaleTimeString());
                    conversationHistory.push({ role: 'user', content: text });
                    if (conversationHistory.length > 10) conversationHistory.shift();
                    userInput.value = '';
                    setInputState(true);
                    try {
                        const response = await fetch('/ask', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: 'question=' + encodeURIComponent(text) + '&history=' + encodeURIComponent(JSON.stringify(conversationHistory))
                        });
                        if (!response.ok) throw new Error('Network error');
                        const json = await response.json();
                        const answer = json.answer;
                        const now = new Date();
                        addMessage(answer, 'ai', now.toLocaleTimeString());
                        conversationHistory.push({ role: 'assistant', content: answer });
                        if (conversationHistory.length > 10) conversationHistory.shift();
                    } catch (err) {
                        addMessage('Sorry, I encountered an error. Please try again.', 'ai', new Date().toLocaleTimeString());
                    } finally {
                        setInputState(false);
                    }
                }
                chatForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const text = userInput.value.trim();
                    if (!text || isProcessing) return;
                    await sendMessage(text);
                });
                userInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isProcessing) {
                            chatForm.dispatchEvent(new Event('submit'));
                        }
                    }
                });
                document.addEventListener('DOMContentLoaded', function() {
                    // Greet on load
                    if (!greeted) {
                        addMessage("Assalamu Alaikum! I'm Minaret AI — here to help you with Islamic knowledge and guidance, In Sha Allah.", 'ai', new Date().toLocaleTimeString());
                        greeted = true;
                    }
                    setTimeout(() => { userInput.focus(); }, 300);
                });
            </script>
        </body>
        </html>
    `);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Start server
app.listen(PORT, () => {
    console.log('🕌 Enhanced Minaret AI server running on port ' + PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
    console.log('🤖 OpenAI configured: ' + (process.env.OPENAI_API_KEY ? 'Yes' : 'No'));
}); 