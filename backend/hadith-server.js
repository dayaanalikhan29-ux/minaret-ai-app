const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8083;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Serve static files from the minaret-hadiths directory
app.use(express.static(path.join(__dirname, 'minaret-hadiths')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'minaret-hadiths', 'index.html'));
});

// Handle all other routes by serving the index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'minaret-hadiths', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🕌 Hadith Web App Server running on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'minaret-hadiths')}`);
}); 