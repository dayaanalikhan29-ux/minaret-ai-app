const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'What is Islam?' }],
      max_tokens: 50,
    });
    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error('OpenAI error:', err);
  }
}

test(); 