
require('dotenv').config();

const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env file');
  process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Configure Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Gemini chatbot API
app.post('/chat', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'Please enter a prompt.'
      });
    }

    // Use the model name reported by your API error
    const model = ai.getGenerativeModel({
      model: 'gemini-3.8-flash'
    });

    const result = await model.generateContent(prompt.trim());
    const response = result.response.text();

    res.json({ response });

  } catch (err) {
    console.error('Gemini API error:', err);

    res.status(500).json({
      error: err.message || 'Gemini API request failed.'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
