import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

const GREETING = {
  id: 'greeting',
  text: "Assalamu Alaikum! I'm Minaret AI — here to help you with Islamic knowledge and guidance, In Sha Allah.",
  sender: 'ai',
  timestamp: '',
};

export default function AskAIScreen() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const scrollViewRef = useRef();
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const lightStyles = {
    backgroundColor: '#fdfaf3',
    card: '#f6e7c1',
    text: '#2e2e2e',
    accent: '#bfa14a',
    border: '#e5dabd',
    // Add more as needed
  };

  const darkStyles = {
    backgroundColor: '#181818',
    card: '#232323',
    text: '#fff',
    accent: '#d4af37',
    border: '#333',
    // Add more as needed
  };

  // Always ensure greeting is present at the top
  const ensureGreeting = (msgs) => {
    if (!msgs.length || msgs[0].id !== GREETING.id) {
      return [GREETING, ...msgs.filter(m => m.id !== GREETING.id)];
    }
    return msgs;
  };

  const addMessage = (text, sender, timestamp) => {
    setMessages(prev => {
      const newMsgs = [...prev, { id: Date.now(), text, sender, timestamp }];
      return ensureGreeting(newMsgs);
    });
  };

  const sendMessage = async (text) => {
    if (isLoading) return;
    const now = new Date();
    addMessage(text, 'user', now.toLocaleTimeString());
    const newHistory = [...conversationHistory, { role: 'user', content: text }];
    if (newHistory.length > 10) newHistory.shift();
    setConversationHistory(newHistory);
    setQuestion('');
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8082/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `question=${encodeURIComponent(text)}&history=${encodeURIComponent(JSON.stringify(newHistory))}`
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Network error: ${response.status} ${response.statusText}\n${errorText}`);
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      let aiReply = data.answer
        .replace(/<[^>]*>/g, '')
        .replace(/Source:.*$/i, '')
        .replace(/OpenAI/gi, '')
        .trim();
      if (!aiReply) {
        aiReply = 'I apologize, but I couldn\'t process your question properly. Please try again.';
      }
      addMessage(aiReply, 'ai', new Date().toLocaleTimeString());
      const updatedHistory = [...newHistory, { role: 'assistant', content: aiReply }];
      if (updatedHistory.length > 10) updatedHistory.shift();
      setConversationHistory(updatedHistory);
    } catch (error) {
      setError(error.message || 'Sorry, I encountered an error. Please try again.');
      addMessage('Sorry, I encountered an error. Please try again.', 'ai', new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    await sendMessage(trimmedQuestion);
  };

  // Load messages from AsyncStorage on mount and always ensure greeting
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      try {
        const saved = await AsyncStorage.getItem('minaret_ai_messages');
        if (isMounted) {
          if (saved) {
            const parsed = JSON.parse(saved);
            setMessages(ensureGreeting(parsed));
          } else {
            setMessages([GREETING]);
          }
        }
      } catch (e) {
        if (isMounted) setMessages([GREETING]);
      }
    };
    loadMessages();
    return () => { isMounted = false; };
  }, []);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem('minaret_ai_messages', JSON.stringify(messages)).catch(() => {});
    }
  }, [messages]);

  // Clear chat but always keep greeting
  const clearChat = async () => {
    await AsyncStorage.removeItem('minaret_ai_messages');
    setMessages([GREETING]);
    setConversationHistory([]);
    await AsyncStorage.setItem('minaret_ai_messages', JSON.stringify([GREETING]));
  };

  // Always scroll to bottom on new message
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? darkStyles.backgroundColor : lightStyles.backgroundColor }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: isDark ? darkStyles.card : lightStyles.card }]}>
        <Text style={[styles.mainTitle, { color: isDark ? darkStyles.accent : lightStyles.accent }]}>Minaret AI</Text>
        <Text style={[styles.subtitle, { color: isDark ? darkStyles.text : lightStyles.text }]}>Your Islamic Guidance Assistant</Text>
      </View>
      {/* Divider Bar */}
      <View style={[styles.goldDividerBar, { backgroundColor: isDark ? darkStyles.accent : lightStyles.accent }]}>
        <Text style={[styles.dividerText, { color: isDark ? darkStyles.backgroundColor : lightStyles.backgroundColor }]}>Islamic Wisdom & Guidance</Text>
      </View>
      {/* Error Message */}
      {error && (
        <View style={{ padding: 10, backgroundColor: isDark ? '#4a2323' : '#ffeaea', borderRadius: 8, margin: 10 }}>
          <Text style={{ color: '#b00020', fontWeight: 'bold', textAlign: 'center' }}>{error}</Text>
        </View>
      )}
      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={[styles.chatArea, { backgroundColor: isDark ? darkStyles.backgroundColor : lightStyles.backgroundColor }]}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message, idx) => (
          <View
            key={message.id}
            style={[
              styles.bubble,
              message.sender === 'user' ? [styles.userBubble, { backgroundColor: isDark ? darkStyles.card : lightStyles.card }] : [styles.aiBubble, { backgroundColor: isDark ? darkStyles.card : lightStyles.card }],
              idx === 0 ? { borderColor: isDark ? darkStyles.accent : '#bfa14a', borderWidth: 2 } : {},
            ]}
          >
            <Text style={[styles.messageText, { color: isDark ? darkStyles.text : lightStyles.text }]}>{message.text}</Text>
            {message.timestamp ? <Text style={[styles.timestamp, { color: isDark ? darkStyles.accent : lightStyles.accent }]}>{message.timestamp}</Text> : null}
          </View>
        ))}
        {isLoading && (
          <View style={[styles.bubble, styles.aiBubble, { backgroundColor: isDark ? darkStyles.card : lightStyles.card }]}>
            <ActivityIndicator color={isDark ? darkStyles.accent : '#bfa14a'} size="small" />
            <Text style={[styles.loadingText, { color: isDark ? darkStyles.text : lightStyles.text }]}>Minaret AI is thinking...</Text>
          </View>
        )}
      </ScrollView>
      {/* Floating Clear Chat Button */}
      <TouchableOpacity onPress={clearChat} style={[styles.fab, { backgroundColor: isDark ? darkStyles.accent : lightStyles.accent }]}>
        <Ionicons name="trash" size={24} color={isDark ? darkStyles.backgroundColor : '#fff'} />
      </TouchableOpacity>
      {/* Input Bar with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={[styles.inputBar, { backgroundColor: isDark ? darkStyles.card : lightStyles.card, borderColor: isDark ? darkStyles.border : lightStyles.border }]}>
          <TextInput
            style={[styles.inputField, { color: isDark ? darkStyles.text : lightStyles.text, backgroundColor: isDark ? darkStyles.card : lightStyles.card }]}
            placeholder="Type your question..."
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            value={question}
            onChangeText={setQuestion}
            multiline
            maxLength={500}
            editable={!isLoading}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled, { backgroundColor: isDark ? darkStyles.accent : lightStyles.accent }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={isDark ? darkStyles.backgroundColor : '#fff'} size="small" />
            ) : (
              <Text style={[styles.sendBtnText, { color: isDark ? darkStyles.backgroundColor : '#fff' }]}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf3',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#fdfaf3',
    paddingTop: 60,
    paddingBottom: 8,
    alignItems: 'center',
    shadowColor: '#c9b17c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#bfa14a',
    letterSpacing: 1.2,
    marginBottom: 2,
    textShadowColor: '#f6e7c1',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a68d36',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  goldDividerBar: {
    width: '100%',
    backgroundColor: '#fdfaf3',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c9b17c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  dividerText: {
    color: '#bfa14a',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.7,
    opacity: 0.95,
  },
  chatArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 12,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    shadowColor: '#c9b17c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
    marginBottom: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#dcdcdc',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f6e7c1',
    borderWidth: 1.5,
    borderColor: '#e5dabd',
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2e2e2e',
  },
  timestamp: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  loadingText: {
    fontSize: 14,
    color: '#bfa14a',
    marginTop: 8,
    fontStyle: 'italic',
  },
  keyboardAvoidingContainer: {
    backgroundColor: '#fff',
    shadowColor: '#c9b17c',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  inputBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  inputField: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#dcdcdc',
    borderRadius: 18,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fcf8ee',
    color: '#2e2e2e',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: '#c9b17c',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#c9b17c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  sendBtnText: {
    color: '#2e2e2e',
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 80, // above the input bar
    backgroundColor: '#bfa14a',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#c9b17c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
}); 