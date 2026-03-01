import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import {
    extractTenderText,
    analyzeTenderRequirements,
    streamTenderAnalysis,
    draftProposalSection,
    getDocumentEmbeddings
} from './services/mistralService';

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

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
    console.log(`Mistral AI backend ready.`);
}).on('error', (err: any) => {
    console.error('Server failed to start:', err);
});
