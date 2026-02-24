const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

let isProcessing = false;

// Temporary chat memory (in-memory array)
const chatMemory = [];
let greeted = false;

function addMessage(text, sender) {
  // Remove any technical/AI tags
  text = text.replace(/Source:.*$/i, '').replace(/OpenAI/gi, '').trim();
  // Only greet once at the start
  if (sender === 'ai' && text.includes('السلام') && greeted) {
    // Remove repeated greetings (remove 'السلام ...' at the start of the string)
    text = text.replace(/السلام[^\n<]*(<br>|\n)?/g, '').trim();
  }
  if (sender === 'ai' && text.includes('السلام') && !greeted) {
    greeted = true;
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + (sender === 'user' ? 'user-bubble' : 'ai-bubble');
  
  const span = document.createElement('span');
  span.className = 'bubble-text';
  
  // Handle Arabic text formatting
  if (sender === 'ai' && text.includes('السلام')) {
    // Format Arabic greetings properly
    const parts = text.split('\n');
    if (parts.length > 1) {
      span.innerHTML = parts.map((part, index) => {
        if (part.trim().match(/[\u0600-\u06FF]/)) {
          return `<span class="arabic-greeting">${part.trim()}</span>`;
        } else if (part.trim() && index > 0) {
          return `<span class="english-greeting">${part.trim()}</span>`;
        } else {
          return part.trim();
        }
      }).filter(part => part).join('<br>');
    } else {
      span.textContent = text;
    }
  } else {
    span.textContent = text;
  }
  
  bubble.appendChild(span);
  chatbox.appendChild(bubble);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  }, 100);
}

function showTyping(show) {
  if (show) {
    typingIndicator.style.display = 'flex';
    typingIndicator.style.opacity = '0';
    setTimeout(() => {
      typingIndicator.style.opacity = '1';
    }, 50);
  } else {
    typingIndicator.style.opacity = '0';
    setTimeout(() => {
      typingIndicator.style.display = 'none';
    }, 300);
  }
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
  
  addMessage(text, 'user');
  userInput.value = '';
  showTyping(true);
  setInputState(true);
  
  // Add user message to memory
  chatMemory.push({ role: 'user', content: text });
  // Prepare last 5 exchanges (10 messages)
  const historyToSend = chatMemory.slice(-10);
  
  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'question=' + encodeURIComponent(text) + '&history=' + encodeURIComponent(JSON.stringify(historyToSend))
    });
    
    showTyping(false);
    setInputState(false);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse the AI reply from the returned HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let aiText = '';
    
    // Try multiple selectors to find AI response
    const selectors = [
      '.bot .bubble-text',
      '.ai-bubble .bubble-text', 
      '.bubble.ai-bubble .bubble-text',
      '.bot',
      '.ai-bubble',
      '.bubble.ai-bubble'
    ];
    
    for (const selector of selectors) {
      const element = tempDiv.querySelector(selector);
      if (element) {
        aiText = element.textContent.replace(/Source:.*/, '').trim();
        break;
      }
    }
    
    // Fallback: try to find any bubble-text
    if (!aiText) {
      const span = tempDiv.querySelector('.bubble-text');
      aiText = span ? span.textContent.trim() : '';
    }
    
    if (!aiText) {
      throw new Error('Could not parse AI response');
    }
    
    addMessage(aiText, 'ai');
    
    // Add AI message to memory
    chatMemory.push({ role: 'assistant', content: aiText });
    
  } catch (err) {
    console.error('Error sending message:', err);
    showTyping(false);
    setInputState(false);
    
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (err.message.includes('Could not parse')) {
      errorMessage = 'Sorry, there was an issue processing the response. Please try again.';
    }
    
    addMessage(errorMessage, 'ai');
  }
}

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text || isProcessing) return;
  
  await sendMessage(text);
});

// Handle Enter key
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!isProcessing) {
      chatForm.dispatchEvent(new Event('submit'));
    }
  }
});

// Auto-resize input on focus
userInput.addEventListener('focus', function() {
  this.style.transform = 'scale(1.02)';
});

userInput.addEventListener('blur', function() {
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
    userInput.value = '';
    userInput.blur();
  }
});

// Focus input on load and add some initial animation
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    userInput.focus();
    
    // Add a subtle entrance animation to the chatbox
    const chatbox = document.querySelector('.chatbox');
    chatbox.style.opacity = '0';
    chatbox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      chatbox.style.transition = 'all 0.6s ease-out';
      chatbox.style.opacity = '1';
      chatbox.style.transform = 'translateY(0)';
    }, 100);
  }, 300);
});

// Add loading state to send button
sendBtn.addEventListener('click', function() {
  if (isProcessing) {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  }
}); 