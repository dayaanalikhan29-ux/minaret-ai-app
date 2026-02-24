const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 8081;

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
                <style>
                    body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                        max-width: 800px; 
                        margin: 50px auto; 
                        padding: 20px; 
                        background: #fdf6ec;
                    }
                    .container {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .message { 
                        margin: 20px 0; 
                        padding: 20px; 
                        border-radius: 10px; 
                        border-left: 4px solid;
                    }
                    .user { 
                        background: #ffffff; 
                        border-left-color: #bfa14a; 
                        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    }
                    .bot { 
                        background: #f3e6c5; 
                        border-left-color: #bfa14a; 
                        box-shadow: 0 2px 12px rgba(191, 161, 74, 0.15);
                    }
                    .back-btn { 
                        display: inline-block; 
                        margin-top: 20px; 
                        padding: 12px 24px; 
                        background: #bfa14a; 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                    }
                    .back-btn:hover {
                        background: #8b7355;
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 30px;
                        font-family: 'Playfair Display', serif;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🕌 Minaret AI Response</h1>
                    
                    <div class="message user">
                        <strong>You:</strong><br>
                        ${userMessage}
                    </div>
                    
                    <div class="message bot">
                        <strong>Minaret AI:</strong><br>
                        ${answer}
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
            <title>Minaret AI - Islamic Guidance</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: #fdf6ec;
                    min-height: 100vh;
                    color: #2c2c2c;
                    display: flex;
                    flex-direction: column;
                }

                .header {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(15px);
                    color: #bfa14a;
                    text-align: center;
                    padding: 1.5rem 0;
                    box-shadow: 0 4px 25px rgba(191, 161, 74, 0.12);
                    border-bottom: 1px solid rgba(191, 161, 74, 0.15);
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                }

                .header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #bfa14a 0%, #8b7355 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.5px;
                    text-shadow: 0 2px 4px rgba(191, 161, 74, 0.1);
                }

                .header p {
                    font-size: 1.1rem;
                    color: #7c6f57;
                    font-weight: 500;
                    opacity: 0.9;
                }

                .container {
                    max-width: 800px;
                    margin: 120px auto 20px;
                    padding: 0 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .chat-container {
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(191, 161, 74, 0.08);
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(191, 161, 74, 0.1);
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .chat-header {
                    background: linear-gradient(135deg, #e6c97a 0%, #bfa14a 100%);
                    color: #fff;
                    padding: 1.5rem;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(191, 161, 74, 0.2);
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem 1.5rem 1rem 1.5rem;
                    background: rgba(255, 255, 255, 0.5);
                    min-height: 400px;
                    max-height: 60vh;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: rgba(191, 161, 74, 0.05);
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(191, 161, 74, 0.2);
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(191, 161, 74, 0.3);
                }

                .message {
                    margin-bottom: 1rem;
                    padding: 1rem 1.3rem;
                    border-radius: 20px;
                    max-width: 85%;
                    word-wrap: break-word;
                    animation: fadeInUp 0.4s ease-out;
                    line-height: 1.7;
                }

                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(15px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                .user-message {
                    background: #ffffff;
                    margin-left: auto;
                    border-bottom-right-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    color: #2c2c2c;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .bot-message {
                    background: #f3e6c5;
                    margin-right: auto;
                    border-bottom-left-radius: 8px;
                    box-shadow: 0 2px 12px rgba(191, 161, 74, 0.15);
                    color: #4a3f2c;
                    border: 1px solid rgba(191, 161, 74, 0.1);
                }

                .message-content {
                    font-size: 1rem;
                    line-height: 1.7;
                    font-family: 'Inter', sans-serif;
                }

                .arabic-text {
                    font-family: 'Amiri', 'Noto Naskh Arabic', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #8b7355;
                    display: block;
                    margin-bottom: 0.5rem;
                    text-align: right;
                    direction: rtl;
                }

                .message-time {
                    font-size: 0.8rem;
                    color: #7c6f57;
                    margin-top: 0.5rem;
                    text-align: right;
                    opacity: 0.8;
                }

                .chat-input {
                    padding: 1.5rem;
                    background: rgba(255, 251, 231, 0.95);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(191, 161, 74, 0.15);
                    box-shadow: 0 -4px 20px rgba(191, 161, 74, 0.08);
                }

                .input-group {
                    display: flex;
                    gap: 0.8rem;
                    align-items: center;
                }

                .message-input {
                    flex: 1;
                    padding: 1rem 1.3rem;
                    border: 2px solid #e6c97a;
                    border-radius: 26px;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s ease;
                    background: #fff;
                    color: #333;
                    box-shadow: 0 2px 8px rgba(191, 161, 74, 0.1);
                    font-family: 'Inter', sans-serif;
                }

                .message-input:focus {
                    border-color: #bfa14a;
                    box-shadow: 0 4px 16px rgba(191, 161, 74, 0.15);
                    transform: translateY(-1px);
                }

                .message-input::placeholder {
                    color: #999;
                    font-style: italic;
                }

                .send-btn {
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #e6c97a 0%, #bfa14a 100%);
                    color: #fff;
                    border: none;
                    border-radius: 26px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 100px;
                    box-shadow: 0 4px 12px rgba(191, 161, 74, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                }

                .send-btn:hover {
                    background: linear-gradient(135deg, #bfa14a 0%, #e6c97a 100%);
                    box-shadow: 0 6px 20px rgba(191, 161, 74, 0.3);
                    transform: translateY(-2px);
                }

                .send-btn:active {
                    transform: translateY(0);
                }

                .send-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading {
                    display: none;
                    text-align: center;
                    padding: 1.5rem;
                    color: #bfa14a;
                }

                .loading.show {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(191, 161, 74, 0.2);
                    border-top: 3px solid #bfa14a;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .welcome-message {
                    text-align: center;
                    color: #7c6f57;
                    font-style: italic;
                    margin: 2rem 0;
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(191, 161, 74, 0.08) 0%, rgba(191, 161, 74, 0.05) 100%);
                    border-radius: 20px;
                    border: 1px solid rgba(191, 161, 74, 0.15);
                    box-shadow: 0 4px 20px rgba(191, 161, 74, 0.08);
                    backdrop-filter: blur(5px);
                }

                .welcome-message .arabic-greeting {
                    font-family: 'Amiri', 'Noto Naskh Arabic', serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #8b7355;
                    display: block;
                    margin-bottom: 0.8rem;
                    text-align: center;
                    direction: rtl;
                    text-shadow: 0 1px 2px rgba(139, 115, 85, 0.1);
                }

                .welcome-message .english-greeting {
                    font-style: italic;
                    color: #7c6f57;
                    font-size: 1rem;
                    margin-bottom: 0.8rem;
                    font-weight: 500;
                }

                .footer {
                    text-align: center;
                    padding: 1.5rem;
                    color: #7c6f57;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                }

                @media (max-width: 768px) {
                    .header h1 {
                        font-size: 2.2rem;
                    }
                    
                    .container {
                        margin: 100px auto 10px;
                        padding: 0 10px;
                    }
                    
                    .chat-messages {
                        min-height: 300px;
                        padding: 1.5rem 1rem 1rem 1rem;
                    }
                    
                    .message {
                        max-width: 90%;
                        padding: 0.9rem 1.1rem;
                        font-size: 0.95rem;
                    }
                    
                    .chat-input {
                        padding: 1rem;
                    }
                    
                    .message-input {
                        font-size: 0.95rem;
                        padding: 0.9rem 1.1rem;
                        border-radius: 24px;
                    }
                    
                    .send-btn {
                        font-size: 0.95rem;
                        padding: 0.9rem 1.2rem;
                        border-radius: 24px;
                    }
                    
                    .arabic-text {
                        font-size: 1rem;
                    }
                }
            </style>
        </head>
        <body>
            <header class="header">
                <h1>Minaret</h1>
                <p>Your Islamic AI Assistant</p>
            </header>

            <div class="container">
                <div class="chat-container">
                    <div class="chat-header">
                        💬 Islamic Chat
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="welcome-message">
                            <span class="arabic-greeting">السلام عليكم ورحمة الله وبركاته</span>
                            <span class="english-greeting">Peace be upon you and God's mercy and blessings.</span>
                            <br><br>
                            I'm here to help you learn about Islam and provide guidance. Ask me anything about Islamic teachings, practices, or any questions you may have.
                        </div>
                    </div>
                    
                    <div class="loading" id="loading">
                        <div class="spinner"></div>
                        Minaret AI is thinking...
                    </div>
                    
                    <div class="chat-input">
                        <form id="chatForm" method="POST" action="/ask">
                            <div class="input-group">
                                <input 
                                    type="text" 
                                    name="question" 
                                    id="messageInput" 
                                    class="message-input" 
                                    placeholder="Ask about Islam, prayer, Quran, or anything..."
                                    required
                                    autocomplete="off"
                                    aria-label="Type your question"
                                >
                                <button type="submit" class="send-btn" id="sendBtn" aria-label="Send message">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🕌 Minaret AI - Providing Islamic knowledge with wisdom and respect</p>
                </div>
            </div>

            <script>
                const chatForm = document.getElementById('chatForm');
                const messageInput = document.getElementById('messageInput');
                const sendBtn = document.getElementById('sendBtn');
                const loading = document.getElementById('loading');
                const chatMessages = document.getElementById('chatMessages');

                let isProcessing = false;

                function addMessage(content, sender) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + sender + '-message';
                    
                    const time = new Date().toLocaleTimeString();
                    
                    // Handle Arabic text formatting
                    let formattedContent = content;
                    if (sender === 'bot' && content.includes('السلام')) {
                        const parts = content.split('\n');
                        if (parts.length > 1) {
                            formattedContent = parts.map((part, index) => {
                                if (part.trim().match(/[\u0600-\u06FF]/)) {
                                    return '<span class="arabic-text">' + part.trim() + '</span>';
                                } else if (part.trim() && index > 0) {
                                    return '<span class="english-greeting">' + part.trim() + '</span>';
                                } else {
                                    return part.trim();
                                }
                            }).filter(part => part).join('<br>');
                        }
                    }
                    
                    messageDiv.innerHTML = 
                        '<div class="message-content">' + formattedContent + '</div>' +
                        '<div class="message-time">' + time + '</div>';
                    
                    chatMessages.appendChild(messageDiv);
                    
                    // Smooth scroll to bottom
                    setTimeout(() => {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 100);
                }

                function setInputState(disabled) {
                    messageInput.disabled = disabled;
                    sendBtn.disabled = disabled;
                    isProcessing = disabled;
                    
                    if (disabled) {
                        messageInput.style.opacity = '0.6';
                        sendBtn.style.opacity = '0.6';
                    } else {
                        messageInput.style.opacity = '1';
                        sendBtn.style.opacity = '1';
                        messageInput.focus();
                    }
                }

                chatForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const message = messageInput.value.trim();
                    if (!message || isProcessing) return;
                    
                    // Add user message to chat
                    addMessage(message, 'user');
                    
                    // Show loading
                    loading.classList.add('show');
                    setInputState(true);
                    
                    // Submit form
                    const formData = new FormData();
                    formData.append('question', message);
                    
                    fetch('/ask', {
                        method: 'POST',
                        body: new URLSearchParams(formData),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Create a temporary div to parse the HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        
                        // Extract the bot message - look for the bot message content
                        const botMessageDiv = tempDiv.querySelector('.bot');
                        if (botMessageDiv) {
                            // Get all text content except the "Minaret AI:" label and source
                            const botText = botMessageDiv.textContent.replace('Minaret AI:', '').replace(/Source:.*$/, '').trim();
                            addMessage(botText, 'bot');
                        } else {
                            // Fallback if we can't parse the response
                            addMessage('I received your message but had trouble processing the response. Please try again.', 'bot');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                    })
                    .finally(() => {
                        loading.classList.remove('show');
                        setInputState(false);
                    });
                });

                // Handle Enter key
                messageInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (!isProcessing) {
                            chatForm.dispatchEvent(new Event('submit'));
                        }
                    }
                });

                // Auto-resize input on focus
                messageInput.addEventListener('focus', function() {
                    this.style.transform = 'scale(1.02)';
                });

                messageInput.addEventListener('blur', function() {
                    this.style.transform = 'scale(1)';
                });

                // Add some helpful keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                    // Ctrl/Cmd + Enter to send
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        if (!isProcessing) {
                            chatForm.dispatchEvent(new Event('submit'));
                        }
                    }
                    
                    // Escape to clear input
                    if (e.key === 'Escape') {
                        messageInput.value = '';
                        messageInput.blur();
                    }
                });

                // Focus on input when page loads and add entrance animation
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        messageInput.focus();
                        
                        // Add a subtle entrance animation to the chat container
                        const chatContainer = document.querySelector('.chat-container');
                        chatContainer.style.opacity = '0';
                        chatContainer.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            chatContainer.style.transition = 'all 0.6s ease-out';
                            chatContainer.style.opacity = '1';
                            chatContainer.style.transform = 'translateY(0)';
                        }, 100);
                    }, 300);
                });
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
    console.log('🕌 Minaret AI Redesigned server running on port ' + PORT);
    console.log('🌐 URL: http://localhost:' + PORT);
    console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
    console.log('🤖 OpenAI configured: ' + (process.env.OPENAI_API_KEY ? 'Yes' : 'No'));
}); 