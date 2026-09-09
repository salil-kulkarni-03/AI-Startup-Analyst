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

    // 1. Extract text (PDF parse, Audio transcribe, or raw text)
    let extractedText = '';
    let isAudio = req.file.mimetype.startsWith('audio/') || 
                    ['.mp3', '.wav', '.m4a', '.mp4', '.ogg', '.webm'].some(ext => req.file.originalname.toLowerCase().endsWith(ext));

    if (isAudio) {
      console.log('Detected audio file. Initializing Groq Whisper speech-to-text...');
      
      // Use native Node Web APIs (Blob & File) to wrap the buffer in memory
      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
      const fileObject = new File([fileBlob], req.file.originalname, { type: req.file.mimetype });

      const formData = new FormData();
      formData.append('file', fileObject);
      formData.append('model', 'whisper-large-v3');
      formData.append('response_format', 'json');

      const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        const errText = await transcriptionResponse.text();
        throw new Error(`Groq Whisper transcription failed: ${errText}`);
      }

      const transcriptionData = await transcriptionResponse.json();
      extractedText = transcriptionData.text;
      console.log('Transcription successful! Length:', extractedText.length);
    } else if (req.file.mimetype === 'application/pdf') {
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
          content: 'You are an expert AI Venture Capital Analyst. Analyze the text of the startup pitch deck or founder call transcript and return a detailed, professional assessment in strict JSON format. You must respond ONLY with the JSON object. Do not include any markdown backticks, conversational preamble, or tail notes.'
        },
        {
          role: 'user',
          content: `Analyze the following startup pitch deck text or founder call transcript. First, verify if the document content is a startup pitch deck, business proposal, business plan, investment memo, startup financials, or a transcript of a founder call/discussion. If the document is NOT related to a startup business proposal or founder call (for example, if it is a personal resume/CV, a programming file, a random article, or a personal letter), you must set "isValidDeck" to false and provide a validation message.

If it is a founder call transcript:
- Extract founder profiles, experience, education, confidence, and network scores from their speech.
- Infer their startup category, scores, summary, red flags, opportunities, and KPIs based on what was discussed in the call.

Return a JSON object matching this schema:
{
  "isValidDeck": true, (boolean, set to false if the document is NOT a startup pitch deck/business proposal/founder call transcript)
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

Pitch Deck or Transcript Content:
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

// SSE Real-Time AI Analysis Streaming Route
app.post('/api/analyze-stream', upload.single('file'), async (req, res) => {
  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (res.flushHeaders) res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    if (!req.file) {
      sendEvent({ stage: 0, error: 'No file uploaded' });
      return res.end();
    }

    sendEvent({ stage: 1, step: 'extract', progress: 15, message: `Received file: ${req.file.originalname} (${Math.round(req.file.size / 1024)} KB)` });

    // 1. Extract text (PDF parse, Audio transcribe, or raw text)
    let extractedText = '';
    let isAudio = req.file.mimetype.startsWith('audio/') || 
                    ['.mp3', '.wav', '.m4a', '.mp4', '.ogg', '.webm'].some(ext => req.file.originalname.toLowerCase().endsWith(ext));

    if (isAudio) {
      sendEvent({ stage: 1, step: 'extract', progress: 25, message: 'Audio pitch call detected. Initializing Groq Whisper large-v3 speech-to-text...' });
      
      const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
      const fileObject = new File([fileBlob], req.file.originalname, { type: req.file.mimetype });

      const formData = new FormData();
      formData.append('file', fileObject);
      formData.append('model', 'whisper-large-v3');
      formData.append('response_format', 'json');

      const transcriptionResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        const errText = await transcriptionResponse.text();
        throw new Error(`Groq Whisper transcription failed: ${errText}`);
      }

      const transcriptionData = await transcriptionResponse.json();
      extractedText = transcriptionData.text;
      sendEvent({ stage: 1, step: 'extract', progress: 45, message: `Whisper transcription completed! ${extractedText.length.toLocaleString()} characters extracted.` });
    } else if (req.file.mimetype === 'application/pdf') {
      sendEvent({ stage: 1, step: 'extract', progress: 25, message: 'Parsing PDF pitch deck document...' });
      const parser = new PDFParse({ data: req.file.buffer });
      const pdfData = await parser.getText();
      extractedText = pdfData.text;
      sendEvent({ stage: 1, step: 'extract', progress: 45, message: `PDF parsing completed! Extracted ${extractedText.length.toLocaleString()} characters.` });
    } else {
      extractedText = req.file.buffer.toString('utf-8');
      sendEvent({ stage: 1, step: 'extract', progress: 45, message: `Raw text file read (${extractedText.length.toLocaleString()} characters).` });
    }

    if (!extractedText.trim()) {
      sendEvent({ stage: 0, error: 'No readable text content found in the file.' });
      return res.end();
    }

    const maxChars = 60000;
    if (extractedText.length > maxChars) {
      extractedText = extractedText.substring(0, maxChars);
      sendEvent({ stage: 1, step: 'extract', progress: 50, message: `Truncating deck text to 60,000 characters for token efficiency.` });
    }

    sendEvent({ stage: 2, step: 'llm_init', progress: 55, message: 'Connecting to Groq Llama 3.1 8B Instant LLM engine...' });

    // 2. Query Groq API with Streaming enabled
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Venture Capital Analyst. Analyze the text of the startup pitch deck or founder call transcript and return a detailed, professional assessment in strict JSON format. You must respond ONLY with the JSON object. Do not include any markdown backticks, conversational preamble, or tail notes.'
        },
        {
          role: 'user',
          content: `Analyze the following startup pitch deck text or founder call transcript. First, verify if the document content is a startup pitch deck, business proposal, business plan, investment memo, startup financials, or a transcript of a founder call/discussion. If the document is NOT related to a startup business proposal or founder call (for example, if it is a personal resume/CV, a programming file, a random article, or a personal letter), you must set "isValidDeck" to false and provide a validation message.

If it is a founder call transcript:
- Extract founder profiles, experience, education, confidence, and network scores from their speech.
- Infer their startup category, scores, summary, red flags, opportunities, and KPIs based on what was discussed in the call.

Return a JSON object matching this schema:
{
  "isValidDeck": true,
  "validationMessage": "string",
  "name": "string",
  "category": "string",
  "scores": { "team": 85, "market": 78, "product": 82, "risk": 45 },
  "summary": "string",
  "redFlags": ["string"],
  "opportunities": ["string"],
  "kpis": { "burnRate": "string", "runway": "string", "cac": "string", "ltv": "string" },
  "founderInfo": { "name": "string", "experience": "string", "education": "string", "networkScore": 75, "sentimentScore": 80 }
}

Pitch Deck or Transcript Content:
---
${extractedText}
---`
        }
      ],
      temperature: 0.2,
      stream: true,
      response_format: { type: 'json_object' }
    });

    let fullResultText = '';
    let chunkCount = 0;

    sendEvent({ stage: 3, step: 'llm_stream', progress: 65, message: 'Receiving live AI evaluation stream...' });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullResultText += delta;
      chunkCount++;

      if (chunkCount % 5 === 0) {
        const currentProgress = Math.min(95, 65 + Math.floor(chunkCount / 3));
        sendEvent({
          stage: 3,
          step: 'llm_stream',
          progress: currentProgress,
          message: `Streaming AI analysis chunks (${fullResultText.length} characters received)...`,
          chunkLength: fullResultText.length
        });
      }
    }

    const analysisResult = JSON.parse(fullResultText);

    if (analysisResult.isValidDeck === false) {
      sendEvent({ 
        stage: 0, 
        error: analysisResult.validationMessage || 'The uploaded file does not appear to be a valid startup pitch deck or business plan.' 
      });
      return res.end();
    }

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

    sendEvent({
      stage: 4,
      step: 'complete',
      progress: 100,
      message: 'AI Evaluation & Financial Scoring completed successfully!',
      result: finalResult
    });

    res.end();

  } catch (error) {
    console.error('Error in streaming analysis:', error);
    sendEvent({ stage: 0, error: 'Failed to analyze document: ' + error.message });
    res.end();
  }
});

// Pitch Deck RAG Chatbot Route
app.post('/api/chat-deck', async (req, res) => {
  try {
    const { question, startupContext, history = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let systemContent = 'You are an expert AI Venture Capital Analyst assistant for Cereva AI. Answer user questions about startups professionally, concisely, and accurately.';

    if (startupContext && startupContext.name) {
      systemContent = `You are an expert AI Venture Capital Analyst assistant for Cereva AI.
You are helping an investor analyze the startup pitch deck for "${startupContext.name}".

Here is the exact pitch deck assessment context for ${startupContext.name}:
- Startup Name: ${startupContext.name}
- Category: ${startupContext.category || 'N/A'}
- Category Scores: Team (${startupContext.scores?.team || 'N/A'}/100), Market (${startupContext.scores?.market || 'N/A'}/100), Product (${startupContext.scores?.product || 'N/A'}/100), Risk (${startupContext.scores?.risk || 'N/A'}/100)
- Executive Summary: ${startupContext.summary || 'N/A'}
- Key Red Flags: ${startupContext.redFlags ? startupContext.redFlags.join(' | ') : 'None listed'}
- Key Growth Opportunities: ${startupContext.opportunities ? startupContext.opportunities.join(' | ') : 'None listed'}
- Financial KPIs: Monthly Burn Rate (${startupContext.kpis?.burnRate || 'N/A'}), Cash Runway (${startupContext.kpis?.runway || 'N/A'}), CAC (${startupContext.kpis?.cac || 'N/A'}), LTV (${startupContext.kpis?.ltv || 'N/A'})
- Founder Profile: Name (${startupContext.founderInfo?.name || 'N/A'}), Background (${startupContext.founderInfo?.experience || 'N/A'}), Education (${startupContext.founderInfo?.education || 'N/A'}), Network Score (${startupContext.founderInfo?.networkScore || 'N/A'}/100), Pitch Sentiment (${startupContext.founderInfo?.sentimentScore || 'N/A'}/100)

Answer the investor's question accurately based on this deck data. Be concise, professional, and clear. Format key metrics in bold.`;
    }

    const messages = [
      { role: 'system', content: systemContent },
      ...(Array.isArray(history) ? history.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })) : []),
      { role: 'user', content: question }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.3,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content || 'I could not generate an answer at this moment.';
    res.json({ reply });

  } catch (error) {
    console.error('Error in chat-deck:', error);
    res.status(500).json({ error: 'Failed to process chat query. ' + error.message });
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
