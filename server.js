const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const { Groq } = require('groq-sdk');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check for GROQ API KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.warn('WARNING: GROQ_API_KEY is not defined in the environment. AI analysis will fail.');
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Multer memory storage configuration (keeps files in RAM, uses < 1MB per upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// AI analysis route
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Received file: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Parse PDF text
    let extractedText = '';
    if (req.file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: req.file.buffer });
      const pdfData = await parser.getText();
      extractedText = pdfData.text;
    } else {
      // Fallback for text files or simple buffers
      extractedText = req.file.buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No readable text content found in the file.' });
    }

    // Truncate text if it is excessively long to prevent huge token consumption
    // 60,000 characters is roughly 12,000-15,000 tokens which fits easily inside Groq context
    const maxChars = 60000;
    if (extractedText.length > maxChars) {
      console.log(`Truncating text from ${extractedText.length} to ${maxChars} characters.`);
      extractedText = extractedText.substring(0, maxChars);
    }

    console.log('Sending text to Groq API for analysis...');

    // 2. Query Groq API with Llama 3.1
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Venture Capital Analyst. Analyze the text of the startup pitch deck and return a detailed, professional assessment in strict JSON format. You must respond ONLY with the JSON object. Do not include any markdown backticks, conversational preamble, or tail notes.'
        },
        {
          role: 'user',
          content: `Analyze the following startup pitch deck text. First, verify if the document content is a startup pitch deck, business proposal, business plan, investment memo, or startup financials. If the document is NOT related to a startup business proposal (for example, if it is a personal resume/CV, a programming file, a random article, or a personal letter), you must set "isValidDeck" to false and provide a validation message.

Return a JSON object matching this schema:
{
  "isValidDeck": true, (boolean, set to false if the document is NOT a startup pitch deck/business proposal)
  "validationMessage": "string (empty if isValidDeck is true. If false, write a polite explanation of why the document was rejected, e.g., 'The uploaded file appears to be a personal resume/CV rather than a startup pitch deck. Please upload a valid pitch deck.')",
  "name": "string (name of the startup)",
  "category": "string (one of: SaaS, Fintech, Healthcare, E-commerce, AI/ML, Web3, Other)",
  "scores": {
    "team": 85, (number 0-100)
    "market": 78, (number 0-100)
    "product": 82, (number 0-100)
    "risk": 45 (number 0-100, where 100 is extremely risky)
  },
  "summary": "string (2-3 sentence overall assessment summary)",
  "redFlags": ["string (key risk 1)", "string (key risk 2)"],
  "opportunities": ["string (opportunity 1)", "string (opportunity 2)"],
  "kpis": {
    "burnRate": "string (monthly burn rate, e.g., $150K/month - infer logically from text or estimate)",
    "runway": "string (cash runway, e.g., 18 months - infer logically or estimate)",
    "cac": "string (CAC, e.g., $320 - infer logically or estimate)",
    "ltv": "string (LTV, e.g., $10,500 - infer logically or estimate)"
  },
  "founderInfo": {
    "name": "string (name of founders)",
    "experience": "string (founders experience)",
    "education": "string (founders education)",
    "networkScore": 75, (number 0-100)
    "sentimentScore": 80 (number 0-100)
  }
}

Pitch Deck Content:
---
${extractedText}
---`
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0].message.content;
    const analysisResult = JSON.parse(resultText);

    // Validate if it is a startup document
    if (analysisResult.isValidDeck === false) {
      console.log('Document validation failed:', analysisResult.validationMessage);
      return res.status(400).json({ 
        error: analysisResult.validationMessage || 'The uploaded file does not appear to be a valid startup pitch deck or business plan.' 
      });
    }

    // Add extra metadata for the frontend
    const finalResult = {
      id: Date.now().toString(),
      name: analysisResult.name || req.file.originalname.replace(/\.[^/.]+$/, ''),
      size: req.file.size,
      uploadDate: new Date().toLocaleDateString(),
      status: 'completed',
      category: analysisResult.category || 'SaaS',
      scores: analysisResult.scores || { team: 70, market: 70, product: 70, risk: 50 },
      summary: analysisResult.summary || 'Analysis complete.',
      redFlags: analysisResult.redFlags || [],
      opportunities: analysisResult.opportunities || [],
      kpis: analysisResult.kpis || { burnRate: 'N/A', runway: 'N/A', cac: 'N/A', ltv: 'N/A' },
      founderInfo: analysisResult.founderInfo || { name: 'N/A', experience: 'N/A', education: 'N/A', networkScore: 50, sentimentScore: 50 }
    };

    console.log('Analysis completed successfully!');
    res.json(finalResult);

  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ error: 'Failed to analyze document. ' + error.message });
  }
});

// Serve static React files in production
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve index.html for SPA client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
