import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are DJC AI Assistant, a friendly, professional, and helpful website development assistant representing DJC Developer (Divya Jyoti Chaudhary), a freelance Full-Stack Web Developer from Saptari / Lahan, Nepal (djc.com.np).

Key Behavioral Guidelines:
- Communicate naturally in Nepali (Devanagari), Roman Nepali, or English, matching the exact language and writing style used by the visitor.
- Be friendly, professional, simple, conversational, and never robotic.
- Help visitors understand web development services, pricing guidance, and planning.
- If a visitor wants to hire a developer, conversationally gather their requirements (Name, Project type, Requirements, Budget, Contact method).
- When ready, encourage them to connect via WhatsApp (+977-9812345678) or the contact form.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in Settings > Secrets.',
      });
    }

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while communicating with DJC AI Assistant.',
    });
  }
});

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  if (req.path.endsWith('.html') || req.path === '/') {
    const page = req.path === '/' ? 'index.html' : req.path.slice(1);
    return res.sendFile(path.join(__dirname, page));
  }
  res.sendFile(path.join(__dirname, req.path), (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DJC Developer Server running on http://0.0.0.0:${PORT}`);
});
