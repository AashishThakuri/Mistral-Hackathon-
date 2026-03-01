import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
    console.warn("WARNING: MISTRAL_API_KEY is not set in the environment variables.");
}

const client = new Mistral({ apiKey });

/**
 * 1) Document reading
 * Uses: mistral-ocr-latest
 * What it does: reads uploaded tender PDFs, extracts text, preserves structure
 */
export async function extractTenderText(filePath: string) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'document.pdf';

        // 1. Upload the file to Mistral specifically for OCR purpose
        console.log(`[Mistral OCR] Uploading ${fileName} to Mistral...`);
        const uploadedFile = await client.files.upload({
            file: {
                fileName: fileName,
                content: fileContent,
            },
            purpose: "ocr",
        });
        console.log(`[Mistral OCR] Upload success. File ID: ${uploadedFile.id}. Sending to OCR model...`);

        // 2. Process the uploaded file with the OCR model with a 60 second timeout
        const ocrPromise = client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
                type: "file",
                fileId: uploadedFile.id,
            },
            includeImageBase64: false,
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Mistral OCR API timeout after 60 seconds. The service might be experiencing high load.")), 60000)
        );

        const response = await Promise.race([ocrPromise, timeoutPromise]) as any;
        console.log(`[Mistral OCR] OCR Processing complete. Extracting text...`);

        // 3. Extract the markdown text from all pages
        const pages = response.pages || [];
        const fullMarkdown = pages.map((p: any) => p.markdown).join('\n\n');

        console.log(`[Mistral OCR] Extracted ${pages.length} pages of text.`);
        return fullMarkdown;
    } catch (error) {
        console.error("Error extracting text with mistral-ocr-latest:", error);
        throw error;
    }
}


/**
 * 2) Reasoning
 * Uses: mistral-large-2512
 * What it does: understands content, identifies mandatory requirements, finds risks
 */
export async function analyzeTenderRequirements(tenderText: string) {
    try {
        console.log(`[Mistral Reasoning] Analyzing ${tenderText.length} characters of text with mistral-large-2512...`);
        const response = await client.chat.complete({
            model: 'mistral-large-2512',
            responseFormat: { type: "json_object" },
            messages: [
                {
                    role: 'system',
                    content: `You are an expert tender analyst. Analyze the provided tender document text.
You MUST respond with a strictly valid JSON object matching this schema exactly:
{
  "mandatory_requirements": [{"requirement": "description", "criticality": "high/medium/low"}],
  "required_documents": ["List of expected forms or certifications"],
  "risks_flagged": ["List of disqualification traps or harsh conditions"],
  "evaluation_criteria": [{"criterion": "name", "weight": "percentage or description"}],
  "evidence_snippets": ["4-5 exact, literal short quotes from the document proving the above"]
}
Do not include any extra markdown formatting or conversational text.`
                },
                {
                    role: 'user',
                    content: tenderText
                }
            ],
            temperature: 0.1,
        });

        const content = response.choices?.[0]?.message?.content || "{}";
        console.log(`[Mistral Reasoning] Success! Generated JSON analysis.`);
        return JSON.parse(content as string);
    } catch (error) {
        console.error("Error analyzing tender with mistral-large-2512:", error);
        throw error;
    }
}

export async function streamTenderAnalysis(tenderText: string, res: any) {
    try {
        console.log(`[Mistral Reasoning] Streaming analysis for ${tenderText.length} characters...`);

        // Use regular chat stream without JSON enforcement to get the natural thought process
        const stream = await client.chat.stream({
            model: 'mistral-large-2512',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert strict tender analyst evaluating a live document.
First, output a detailed, streaming "thought process" as you analyze the document. Explain what clauses you are finding, what they mean, and any risks or missing criteria you spot. Format this as a clean, readable professional analysis report using plain text paragraphs.
DO NOT use any markdown formatting symbols (no **, no ##, no *, no -). Write purely in plain text sentences so it does not look like a README file.
IMPORTANT: You MUST end your response with a strictly valid JSON block containing your final findings. This JSON block MUST be wrapped in \`\`\`json and \`\`\` tags and match this EXACT schema:
{
  "tender_metadata": {"title": "Full name", "issuing_authority": "Agency", "deadline": "Date if found", "category": "Industry"},
  "executive_summary": {"brief_explanation": "What this tender is about", "bid_readiness_score": 85, "overall_readiness_statement": "1-2 sentence readiness summary"},
  "top_blockers": [{"blocker": "Critical missing item or trap", "type": "Missing Document / Risk"}],
  "next_actions": ["Upload X", "Confirm Y"],
  "mandatory_requirements": [{"requirement": "description", "criticality": "high/medium/low", "source_clause": "Section X", "status": "pending"}],
  "required_documents": [{"document_name": "Form Name", "mandatory": true, "present": false}],
  "risks_flagged": ["Hidden traps or harsh conditions"],
  "evaluation_criteria": [{"criterion": "name", "weight": "percentage"}]
}
Your entire response ending with the JSON block will be streamed live.`
                },
                {
                    role: 'user',
                    content: tenderText
                }
            ],
            temperature: 0.2,
        });

        for await (const chunk of stream) {
            const content = chunk.data.choices[0].delta.content;
            if (content) {
                // Send standard SSE format
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
        console.log(`[Mistral Reasoning] Streaming completed successfully.`);
    } catch (error) {
        console.error("Error streaming analysis:", error);
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
        res.end();
    }
}

/**
 * 3) Drafting
 * Uses: mistral-large-2512
 * What it does: drafts proposal sections, rewrites answers formally
 */
export async function draftProposalSection(prompt: string, contextText: string) {
    try {
        const response = await client.chat.complete({
            model: 'mistral-large-2512',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert proposal writer. Draft highly formal, persuasive, and compliant proposal sections based on the extracted tender requirements and context.'
                },
                {
                    role: 'user',
                    content: `Context:\n${contextText}\n\nTask:\n${prompt}`
                }
            ],
            temperature: 0.7, // Higher temperature for drafting creativity
        });

        return response.choices?.[0]?.message?.content || "";
    } catch (error) {
        console.error("Error drafting proposal with mistral-large-2512:", error);
        throw error;
    }
}

/**
 * 4) Embeddings
 * Uses: mistral-embed
 * What it does: semantic search over documents, powers Knowledge Vault
 */
export async function getDocumentEmbeddings(textInput: string | string[]) {
    try {
        const response = await client.embeddings.create({
            model: 'mistral-embed',
            inputs: Array.isArray(textInput) ? textInput : [textInput],
        });

        return response.data;
    } catch (error) {
        console.error("Error generating embeddings with mistral-embed:", error);
        throw error;
    }
}
