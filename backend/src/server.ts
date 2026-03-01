import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    extractTenderText,
    analyzeTenderRequirements,
    streamTenderAnalysis,
    draftProposalSection,
    getDocumentEmbeddings
} from './services/mistralService';
import { transcribeAudio } from './services/voxtralService';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mistral AI Backend is running' });
});

// 1) Document reading: mistral-ocr-latest
app.post('/api/tender/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Processing file: ${req.file.originalname}`);
        const extractedText = await extractTenderText(req.file.path);

        res.json({ success: true, text: extractedText });
    } catch (error: any) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: error.message || 'Failed to process document' });
    }
});

// 2) Reasoning: mistral-large-2512
app.post('/api/tender/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Tender text is required' });
        }

        const analysis = await analyzeTenderRequirements(text);
        res.json({ success: true, analysis });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Analysis failed' });
    }
});

// 2b) Reasoning Stream: mistral-large-2512 SSE
app.post('/api/tender/analyze/stream', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Tender text is required' });
        }

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        await streamTenderAnalysis(text, res);
    } catch (error: any) {
        console.error('Error in streaming endpoint:', error);
        res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming failed' })}\n\n`);
        res.end();
    }
});

// 3) Drafting: mistral-large-2512
app.post('/api/proposal/draft', async (req, res) => {
    try {
        const { prompt, context } = req.body;
        if (!prompt || !context) {
            return res.status(400).json({ error: 'Prompt and context are required' });
        }

        const draft = await draftProposalSection(prompt, context);
        res.json({ success: true, draft });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Drafting failed' });
    }
});

// 4) Embeddings: mistral-embed
app.post('/api/knowledge/embed', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required for embeddings' });
        }

        const embeddings = await getDocumentEmbeddings(text);
        res.json({ success: true, embeddings });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Embedding failed' });
    }
});

// Supporting document upload (stores with original name)

const supportingUpload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            const dir = 'uploads/documents/';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (_req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});

app.post('/api/documents/upload', supportingUpload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        console.log(`[Documents] Uploaded: ${req.file.originalname} → ${req.file.filename}`);
        res.json({
            success: true,
            file: {
                originalName: req.file.originalname,
                storedName: req.file.filename,
                size: req.file.size,
                path: req.file.path
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

app.delete('/api/documents/remove', (req, res) => {
    try {
        const { storedName } = req.body;
        if (!storedName) {
            return res.status(400).json({ error: 'storedName is required' });
        }
        const filePath = path.join('uploads/documents/', storedName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`[Documents] Removed: ${storedName}`);
        }
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Remove failed' });
    }
});

// Voxtral — Audio transcription
const audioUpload = multer({ dest: 'uploads/audio/' });

app.post('/api/voxtral/transcribe', audioUpload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }
        console.log(`[Voxtral] Processing audio: ${req.file.originalname}`);
        const result = await transcribeAudio(req.file.path);
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error('[Voxtral] Transcription failed:', error);
        res.status(500).json({ error: error.message || 'Transcription failed' });
    }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
    console.log(`Mistral AI backend ready.`);
}).on('error', (err: any) => {
    console.error('Server failed to start:', err);
});
