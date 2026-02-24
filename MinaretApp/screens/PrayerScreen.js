import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

let WebView;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}

export default function PrayerScreen() {
  const { theme } = useTheme();

  if (Platform.OS === 'web') {
    // Use iframe for web
    return (
      <View style={styles.container}>
        <iframe
          src={`/prayer-web/index.html?theme=${theme}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Prayer Web"
        />
      </View>
    );
  }

  // Use WebView for iOS/Android
  if (WebView) {
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={
            Platform.OS === 'android'
              ? { uri: 'file:///android_asset/prayer-web/index.html' }
              : require('./prayer-web/index.html')
          }
          style={{ flex: 1 }}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onMessage={(event) => {
            try {
              const message = JSON.parse(event.nativeEvent.data);
              if (message.type === 'theme') {
                // This part is for the mobile app to update the theme
                // For the embedded webview, the theme is set via src query parameter
                // If you need to update the theme in the embedded webview,
                // you would send a message back to the webview.
                // For now, we'll just log the theme change.
                console.log('Received theme change:', message.theme);
              }
            } catch (e) {
              console.error('Error parsing message from WebView:', e);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
        Unable to display Prayer Screen. WebView not available.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
