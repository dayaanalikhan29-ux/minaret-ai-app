const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ask', async (req, res) => {
  try {
    const userMessage = req.body.question;
    if (!userMessage) return res.status(400).json({ error: 'Missing question' });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 100,
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'OpenAI error', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/ask">
      <input name="question" placeholder="Ask something..." required>
      <button type="submit">Send</button>
    </form>
  `);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Minimal OpenAI Express server running on http://localhost:${PORT}`);
}); 