const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/ask', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Static file serving
app.use(express.static('.'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        service: 'Minaret AI Islamic Chat (No OpenAI)',
        openai_configured: false
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Islamic AI Chat endpoint (simulated only)
app.post('/ask', async (req, res) => {
    try {
        const userMessage = req.body.question;

        // Validate input
        if (!userMessage || typeof userMessage !== 'string') {
            return res.status(400).json({
                error: 'Question is required and must be a string'
            });
        }

        if (userMessage.length > 1000) {
            return res.status(400).json({
                error: 'Question is too long. Please keep it under 1000 characters.'
            });
        }

        // Use only simulated responses
        const answer = await generateIslamicResponse(userMessage);
        
        // Check if this is a form submission (render page) or API call (return JSON)
        const contentType = req.headers['content-type'] || '';
        const isFormSubmission = contentType.includes('application/x-www-form-urlencoded');
        
        if (isFormSubmission) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Minaret AI - Response</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                        .message { margin: 20px 0; padding: 15px; border-radius: 10px; }
                        .user { background: #e3f2fd; border-left: 4px solid #2196f3; }
                        .bot { background: #f3e5f5; border-left: 4px solid #9c27b0; }
                        .back-btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>Minaret AI - Islamic Chat</h1>
                    
                    <div class="message user">
                        <strong>You:</strong> ${userMessage}
                    </div>
                    
                    <div class="message bot">
                        <strong>AI:</strong> ${answer}
                    </div>
                    
                    <a href="/" class="back-btn">← Back to Chat</a>
                </body>
                </html>
            `);
        } else {
            res.json({ 
                answer,
                timestamp: new Date().toISOString(),
                question: userMessage,
                source: 'Simulated (No OpenAI)'
            });
        }
        
    } catch (error) {
        console.error('Error processing question:', error);
        
        const fallbackAnswer = "I apologize, but I encountered an error while processing your question. Please try again.";
        
        const contentType = req.headers['content-type'] || '';
        const isFormSubmission = contentType.includes('application/x-www-form-urlencoded');
        
        if (isFormSubmission) {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Minaret AI - Response</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                        .message { margin: 20px 0; padding: 15px; border-radius: 10px; }
                        .user { background: #e3f2fd; border-left: 4px solid #2196f3; }
                        .bot { background: #f3e5f5; border-left: 4px solid #9c27b0; }
                        .back-btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>Minaret AI - Islamic Chat</h1>
                    
                    <div class="message user">
                        <strong>You:</strong> ${req.body.question || 'Unknown'}
                    </div>
                    
                    <div class="message bot">
                        <strong>AI:</strong> ${fallbackAnswer}
                    </div>
                    
                    <a href="/" class="back-btn">← Back to Chat</a>
                </body>
                </html>
            `);
        } else {
            res.json({ 
                answer: fallbackAnswer,
                timestamp: new Date().toISOString(),
                question: req.body.question || 'Unknown',
                source: 'Error Fallback'
            });
        }
    }
});

// Generate Islamic response (simulated)
async function generateIslamicResponse(question) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerQuestion = question.toLowerCase();
    
    // Common Islamic topics and responses
    const responses = {
        'salaam': 'Assalamu alaikum! May peace be upon you. How can I help you learn about Islam today?',
        'salam': 'Assalamu alaikum! May peace be upon you. How can I help you learn about Islam today?',
        'pillars': 'The Five Pillars of Islam are: 1) Shahada (Declaration of Faith), 2) Salah (Prayer), 3) Zakat (Charity), 4) Sawm (Fasting during Ramadan), and 5) Hajj (Pilgrimage to Mecca).',
        'prayer': 'Salah (prayer) is one of the Five Pillars of Islam. Muslims pray five times daily: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).',
        'quran': 'The Quran is the holy book of Islam, revealed to Prophet Muhammad (PBUH) over 23 years. It contains guidance for all aspects of life.',
        'hadith': 'Hadith are the recorded sayings and actions of Prophet Muhammad (PBUH). They provide guidance on how to implement Quranic teachings in daily life.',
        'prophet': 'Prophet Muhammad (PBUH) is the final messenger of Allah, sent to guide humanity. He was known for his excellent character, mercy, and wisdom.',
        'ramadan': 'Ramadan is the ninth month of the Islamic calendar, during which Muslims fast from dawn to sunset. It is a time for spiritual reflection.',
        'halal': 'Halal refers to what is permissible in Islam, while haram refers to what is forbidden. This applies to food, business practices, and daily activities.',
        'charity': 'Zakat (charity) is one of the Five Pillars of Islam. Muslims are required to give 2.5% of their wealth annually to help the poor and needy.',
        'peace': 'Islam means "peace" and "submission to Allah." The religion emphasizes peace, tolerance, and respect for all people.',
        'kindness': 'The Quran and Hadith emphasize kindness to all creation. Prophet Muhammad (PBUH) said, "Kindness is a mark of faith, and whoever is not kind has no faith."',
        'forgiveness': 'Islam teaches the importance of forgiveness. Allah is described as "The Most Forgiving" and Muslims are encouraged to forgive others.',
        'family': 'Family is highly valued in Islam. Parents are to be treated with respect and kindness. The Prophet (PBUH) said, "Paradise lies at the feet of your mother."',
        'education': 'Education is highly valued in Islam. The first word revealed in the Quran was "Read." Prophet Muhammad (PBUH) encouraged seeking knowledge.'
    };
    
    // Check for specific keywords
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerQuestion.includes(keyword)) {
            return response;
        }
    }
    
    // Default response for general questions
    return `Thank you for your question about "${question}". In Islam, we are encouraged to seek knowledge and understanding. I recommend consulting with a qualified Islamic scholar for specific guidance. May Allah guide us all to the right path.`;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🕌 Minaret AI Islamic Chat server (No OpenAI) running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 OpenAI configured: No`);
});

module.exports = app; 