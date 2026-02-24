const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize OpenAI
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        openai: process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'
    });
});

// Main chat endpoint
app.post('/ask', async (req, res) => {
    try {
        const userMessage = req.body.question;
        
        if (!userMessage) {
            return res.status(400).json({ error: 'Question is required' });
        }

        let answer;
        let source = 'Simulated';

        // Try OpenAI if configured
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
            try {
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Minaret — an AI built to answer Islamic questions with references from the Quran and Sahih Hadiths. You speak with warmth and humility, like a helpful friend. Only mention references when needed, and don\'t write \'Source: OpenAI\'. If someone says hi or thanks, respond kindly and friendly. Do not include emojis or repeat \'Minaret:\' in replies.'
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                });
                
                answer = completion.choices[0].message.content;
                source = 'OpenAI';
            } catch (openaiError) {
                console.error('OpenAI error:', openaiError);
                // Fall back to simulated response
                answer = generateIslamicResponse(userMessage);
                source = 'Simulated (OpenAI failed)';
            }
        } else {
            answer = generateIslamicResponse(userMessage);
        }

        // Return simple HTML response
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Minaret AI - Response</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                        max-width: 900px; 
                        margin: 50px auto; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #fdf6ec 0%, #f8f0e0 50%, #f4e8d0 100%);
                        min-height: 100vh;
                        color: #2c2c2c;
                    }

                    body::before {
                        content: '';
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: 
                            radial-gradient(circle at 20% 80%, rgba(191, 161, 74, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(139, 115, 85, 0.02) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(191, 161, 74, 0.02) 0%, transparent 50%);
                        pointer-events: none;
                        z-index: -1;
                    }

                    .container {
                        background: rgba(255, 255, 255, 0.95);
                        padding: 3rem;
                        border-radius: 28px;
                        box-shadow: 
                            0 20px 60px rgba(191, 161, 74, 0.12),
                            0 8px 32px rgba(0, 0, 0, 0.08);
                        backdrop-filter: blur(15px);
                        border: 1px solid rgba(191, 161, 74, 0.15);
                        position: relative;
                    }

                    .container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: linear-gradient(90deg, #e6c97a 0%, #bfa14a 50%, #8b7355 100%);
                        border-radius: 28px 28px 0 0;
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 2.5rem;
                    }

                    .header h1 {
                        font-family: 'Playfair Display', serif;
                        font-size: 2.5rem;
                        font-weight: 900;
                        background: linear-gradient(135deg, #bfa14a 0%, #8b7355 50%, #bfa14a 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 0.5rem;
                        letter-spacing: 1px;
                        text-shadow: 0 4px 8px rgba(191, 161, 74, 0.1);
                    }

                    .message { 
                        margin: 1.5rem 0; 
                        padding: 1.5rem 1.8rem;
                        border-radius: 24px; 
                        border-left: 4px solid;
                        position: relative;
                        transition: all 0.3s ease;
                        animation: fadeInUp 0.5s ease-out;
                    }

                    .message:hover {
                        transform: translateY(-2px);
                    }

                    @keyframes fadeInUp {
                        from { 
                            opacity: 0; 
                            transform: translateY(20px); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translateY(0); 
                        }
                    }

                    .user { 
                        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                        border-left-color: #2196f3; 
                        box-shadow: 
                            0 8px 24px rgba(0, 0, 0, 0.08),
                            0 2px 8px rgba(0, 0, 0, 0.04);
                        border: 1px solid rgba(0, 0, 0, 0.06);
                    }

                    .bot { 
                        background: linear-gradient(135deg, #f3e6c5 0%, #e8d5b0 100%);
                        border-left-color: #9c27b0; 
                        box-shadow: 
                            0 8px 24px rgba(191, 161, 74, 0.15),
                            0 2px 8px rgba(191, 161, 74, 0.08);
                        border: 1px solid rgba(191, 161, 74, 0.15);
                    }

                    .message strong {
                        font-weight: 600;
                        color: #8b7355;
                        font-size: 1.1rem;
                        display: block;
                        margin-bottom: 0.8rem;
                    }

                    .message-content {
                        font-size: 1.05rem;
                        line-height: 1.8;
                        color: #2c2c2c;
                    }

                    .source {
                        font-size: 0.85rem;
                        color: #7c6f57;
                        margin-top: 1rem;
                        font-style: italic;
                        opacity: 0.7;
                        font-weight: 500;
                    }

                    .back-btn { 
                        display: inline-block; 
                        margin-top: 2rem; 
                        padding: 1rem 2rem; 
                        background: linear-gradient(135deg, #e6c97a 0%, #bfa14a 50%, #8b7355 100%);
                        color: white; 
                        text-decoration: none; 
                        border-radius: 30px; 
                        font-weight: 600;
                        font-size: 1.05rem;
                        transition: all 0.3s ease;
                        box-shadow: 
                            0 8px 24px rgba(191, 161, 74, 0.25),
                            0 2px 8px rgba(191, 161, 74, 0.15);
                        position: relative;
                        overflow: hidden;
                    }

                    .back-btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                        transition: left 0.5s ease;
                    }

                    .back-btn:hover::before {
                        left: 100%;
                    }

                    .back-btn:hover {
                        background: linear-gradient(135deg, #bfa14a 0%, #e6c97a 50%, #bfa14a 100%);
                        box-shadow: 
                            0 12px 32px rgba(191, 161, 74, 0.35),
                            0 4px 12px rgba(191, 161, 74, 0.2);
                        transform: translateY(-3px);
                    }

                    .back-btn:active {
                        transform: translateY(-1px);
                    }

                    @media (max-width: 768px) {
                        body {
                            padding: 15px;
                        }
                        
                        .container {
                            padding: 2rem;
                            border-radius: 20px;
                        }
                        
                        .header h1 {
                            font-size: 2rem;
                        }
                        
                        .message {
                            padding: 1.2rem 1.5rem;
                        }
                        
                        .back-btn {
                            padding: 0.9rem 1.5rem;
                            font-size: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🕌 Minaret AI Response</h1>
                    </div>
                    
                    <div class="message user">
                        <strong>You:</strong>
                        <div class="message-content">${userMessage}</div>
                    </div>
                    
                    <div class="message bot">
                        <strong>Minaret AI:</strong>
                        <div class="message-content">${answer}</div>
                    </div>
                    
                    <a href="/" class="back-btn">← Back to Chat</a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🕌 Minaret AI - Islamic Guidance</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #fdf6ec 0%, #f8f0e0 50%, #f4e8d0 100%);
                    min-height: 100vh;
                    color: #2c2c2c;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow-x: hidden;
                }

                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(191, 161, 74, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(139, 115, 85, 0.02) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(191, 161, 74, 0.02) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: -1;
                }

                .header {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    color: #bfa14a;
                    text-align: center;
                    padding: 2rem 0;
                    box-shadow: 0 8px 32px rgba(191, 161, 74, 0.15);
                    border-bottom: 2px solid rgba(191, 161, 74, 0.1);
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.2rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #bfa14a 0%, #8b7355 50%, #bfa14a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.8rem;
                    letter-spacing: 1px;
                    text-shadow: 0 4px 8px rgba(191, 161, 74, 0.1);
                    position: relative;
                }

                .header h1::after {
                    content: '🕌';
                    position: absolute;
                    top: -10px;
                    right: -40px;
                    font-size: 2rem;
                    opacity: 0.8;
                }

                .header p {
                    font-size: 1.2rem;
                    color: #7c6f57;
                    font-weight: 600;
                    opacity: 0.9;
                    letter-spacing: 0.5px;
                }

                .container {
                    max-width: 900px;
                    margin: 140px auto 20px;
                    padding: 0 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .chat-container {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 28px;
                    box-shadow: 
                        0 20px 60px rgba(191, 161, 74, 0.12),
                        0 8px 32px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(191, 161, 74, 0.15);
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .chat-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #e6c97a 0%, #bfa14a 50%, #8b7355 100%);
                    z-index: 1;
                }

                .chat-header {
                    background: linear-gradient(135deg, #e6c97a 0%, #bfa14a 50%, #8b7355 100%);
                    color: #fff;
                    padding: 2rem;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    box-shadow: 0 4px 16px rgba(191, 161, 74, 0.25);
                    position: relative;
                    overflow: hidden;
                }

                .chat-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2.5rem 2rem 1.5rem 2rem;
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 246, 236, 0.6) 100%);
                    min-height: 450px;
                    max-height: 65vh;
                    position: relative;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 8px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: rgba(191, 161, 74, 0.05);
                    border-radius: 4px;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, rgba(191, 161, 74, 0.3) 0%, rgba(139, 115, 85, 0.3) 100%);
                    border-radius: 4px;
                    border: 1px solid rgba(191, 161, 74, 0.1);
                }

                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(191, 161, 74, 0.4) 0%, rgba(139, 115, 85, 0.4) 100%);
                }

                .message {
                    margin-bottom: 1.5rem;
                    padding: 1.5rem 1.8rem;
                    border-radius: 24px;
                    max-width: 82%;
                    word-wrap: break-word;
                    animation: fadeInUp 0.5s ease-out;
                    line-height: 1.8;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .message:hover {
                    transform: translateY(-2px);
                }

                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                .message.bot {
                    background: linear-gradient(135deg, #f3e6c5 0%, #e8d5b0 100%);
                    color: #2c2c2c;
                    margin-right: auto;
                    box-shadow: 
                        0 8px 24px rgba(191, 161, 74, 0.15),
                        0 2px 8px rgba(191, 161, 74, 0.08);
                    border: 1px solid rgba(191, 161, 74, 0.15);
                    position: relative;
                }

                .message.bot::before {
                    content: '';
                    position: absolute;
                    left: -8px;
                    top: 20px;
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 8px solid #e8d5b0;
                }

                .message.user {
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                    color: #2c2c2c;
                    margin-left: auto;
                    box-shadow: 
                        0 8px 24px rgba(0, 0, 0, 0.08),
                        0 2px 8px rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    position: relative;
                }

                .message.user::after {
                    content: '';
                    position: absolute;
                    right: -8px;
                    top: 20px;
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-left: 8px solid #f8f9fa;
                }

                .welcome-message {
                    text-align: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(191, 161, 74, 0.1) 0%, rgba(139, 115, 85, 0.1) 100%);
                    border-radius: 20px;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(191, 161, 74, 0.2);
                }

                .welcome-message h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #8b7355;
                    margin-bottom: 1rem;
                }

                .welcome-message .arabic {
                    font-family: 'Amiri', serif;
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #bfa14a;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 4px rgba(191, 161, 74, 0.2);
                }

                .welcome-message p {
                    font-size: 1.1rem;
                    color: #7c6f57;
                    line-height: 1.6;
                }

                .input-container {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 2rem;
                    border-top: 1px solid rgba(191, 161, 74, 0.15);
                    backdrop-filter: blur(15px);
                }

                .input-form {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .message-input {
                    flex: 1;
                    padding: 1.2rem 1.5rem;
                    border: 2px solid rgba(191, 161, 74, 0.2);
                    border-radius: 50px;
                    font-size: 1rem;
                    font-family: 'Inter', sans-serif;
                    background: rgba(255, 255, 255, 0.9);
                    color: #2c2c2c;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .message-input:focus {
                    border-color: #bfa14a;
                    box-shadow: 0 0 0 3px rgba(191, 161, 74, 0.1);
                    background: rgba(255, 255, 255, 1);
                }

                .message-input::placeholder {
                    color: #9ca3af;
                    font-style: italic;
                }

                .send-button {
                    background: linear-gradient(135deg, #bfa14a 0%, #8b7355 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 2rem;
                    border-radius: 50px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(191, 161, 74, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .send-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(191, 161, 74, 0.4);
                }

                .send-button:active {
                    transform: translateY(0);
                }

                .send-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .send-button:hover::before {
                    left: 100%;
                }

                .loading {
                    display: none;
                    text-align: center;
                    padding: 1rem;
                    color: #7c6f57;
                    font-style: italic;
                }

                .loading.show {
                    display: block;
                    animation: fadeIn 0.3s ease-in;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #bfa14a;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }

                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typing {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    .header h1 {
                        font-size: 2.5rem;
                    }
                    
                    .header h1::after {
                        right: -30px;
                        font-size: 1.5rem;
                    }
                    
                    .container {
                        margin: 120px auto 20px;
                        padding: 0 15px;
                    }
                    
                    .chat-header {
                        padding: 1.5rem;
                        font-size: 1.3rem;
                    }
                    
                    .chat-messages {
                        padding: 2rem 1.5rem 1rem 1.5rem;
                        min-height: 350px;
                    }
                    
                    .message {
                        max-width: 90%;
                        padding: 1.2rem 1.5rem;
                    }
                    
                    .input-container {
                        padding: 1.5rem;
                    }
                    
                    .input-form {
                        gap: 0.8rem;
                    }
                    
                    .message-input {
                        padding: 1rem 1.2rem;
                    }
                    
                    .send-button {
                        padding: 1rem 1.5rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Minaret AI</h1>
                <p>Your Islamic Guidance Assistant</p>
            </div>
            
            <div class="container">
                <div class="chat-container">
                    <div class="chat-header">
                        Islamic Wisdom & Guidance
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="welcome-message">
                            <div class="arabic">السلام عليكم ورحمة الله وبركاته</div>
                            <h3>Welcome to Minaret AI</h3>
                            <p>Ask me anything about Islam, Islamic practices, Quran, Hadith, or seek spiritual guidance. I'm here to help with wisdom and knowledge from authentic Islamic sources.</p>
                        </div>
                    </div>
                    
                    <div class="input-container">
                        <form class="input-form" id="chatForm">
                            <input type="text" class="message-input" id="messageInput" placeholder="Ask your question..." required>
                            <button type="submit" class="send-button">Send</button>
                        </form>
                        <div class="loading" id="loading">
                            <div class="typing-indicator">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            Minaret is thinking...
                        </div>
                    </div>
                </div>
            </div>

            <script>
                const chatForm = document.getElementById('chatForm');
                const messageInput = document.getElementById('messageInput');
                const chatMessages = document.getElementById('chatMessages');
                const loading = document.getElementById('loading');

                chatForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const message = messageInput.value.trim();
                    if (!message) return;
                    
                    // Add user message
                    addMessage(message, 'user');
                    messageInput.value = '';
                    
                    // Show loading
                    loading.classList.add('show');
                    
                    try {
                        const response = await fetch('/ask', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `question=${encodeURIComponent(message)}`
                        });
                        
                        if (response.ok) {
                            const html = await response.text();
                            
                            // Create a temporary div to parse the HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html;
                            
                            // Extract the bot message content
                            const botMessageDiv = tempDiv.querySelector('.message.bot');
                            if (botMessageDiv) {
                                const messageContent = botMessageDiv.querySelector('.message-content');
                                const messageTime = botMessageDiv.querySelector('.message-time');
                                
                                if (messageContent) {
                                    addMessage(messageContent.innerHTML, 'bot', messageTime ? messageTime.textContent : '');
                                }
                            }
                        } else {
                            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                    } finally {
                        loading.classList.remove('show');
                    }
                });

                function addMessage(content, sender, time = '') {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${sender}`;
                    
                    const formattedContent = content.replace(/\\n/g, '<br>');
                    
                    messageDiv.innerHTML = 
                        '<div class="message-content">' + formattedContent + '</div>' +
                        '<div class="message-time">' + time + '</div>';
                    
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                // Focus on input when page loads
                messageInput.focus();
            </script>
        </body>
        </html>
    `);
});

// Islamic response generator (fallback)
function generateIslamicResponse(question) {
    const responses = [
        "In Islam, we believe in the oneness of Allah (Tawhid) and the importance of following the teachings of the Quran and the Prophet Muhammad (peace be upon him).",
        "The Five Pillars of Islam are: Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).",
        "Islam teaches us to be kind, just, and compassionate towards all people, regardless of their background or beliefs.",
        "The Quran is the holy book of Islam, revealed to Prophet Muhammad (peace be upon him) over 23 years.",
        "Islamic ethics emphasize honesty, integrity, respect for parents, and care for the community.",
        "In Islam, we are taught to seek knowledge and understanding throughout our lives.",
        "The Prophet Muhammad (peace be upon him) is considered the final messenger of Allah and an example for all Muslims.",
        "Islamic prayer (Salah) is performed five times daily and helps maintain spiritual connection with Allah.",
        "Charity (Zakat) is an important obligation in Islam, helping to support those in need.",
        "Islam promotes peace, justice, and harmony among all people."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Start server
app.listen(PORT, () => {
    console.log('🕌 Minaret AI server running on port ' + PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
    console.log('🤖 OpenAI configured: ' + (process.env.OPENAI_API_KEY ? 'Yes' : 'No'));
}); 