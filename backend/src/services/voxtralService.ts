import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export interface VoxtralTranscript {
    text: string;
    segments: Array<{
        speaker: string;
        text: string;
        start: number;
        end: number;
    }>;
    decisions: string[];
    actionItems: string[];
    changedAssumptions: string[];
    unresolvedQuestions: string[];
}

/**
 * Transcribe audio using Voxtral Mini (voxtral-mini-latest)
 * Supports: speaker diarization, timestamps, 13 languages
 */
export async function transcribeAudio(filePath: string): Promise<VoxtralTranscript> {
    console.log(`[Voxtral] Transcribing audio file: ${filePath}`);

    const fileContent = fs.readFileSync(filePath);
    const fileName = filePath.split(/[/\\]/).pop() || 'audio.wav';

    // Call Mistral Voxtral transcription API
    const response = await client.audio.transcriptions.complete({
        model: 'voxtral-mini-latest',
        file: {
            fileName,
            content: fileContent,
        },
        diarize: true,
        timestampGranularities: ['segment'],
    });

    const rawText = response.text || '';
    const segments = (response.segments || []).map((seg: any) => ({
        speaker: seg.speaker || 'Speaker',
        text: seg.text || '',
        start: seg.start || 0,
        end: seg.end || 0,
    }));

    // Extract insights from transcript using Mistral reasoning
    const insights = await extractInsightsFromTranscript(rawText);

    return {
        text: rawText,
        segments,
        decisions: insights.decisions,
        actionItems: insights.actionItems,
        changedAssumptions: insights.changedAssumptions,
        unresolvedQuestions: insights.unresolvedQuestions,
    };
}

/**
 * Use Mistral to extract procurement-relevant insights from transcript
 */
async function extractInsightsFromTranscript(transcript: string): Promise<{
    decisions: string[];
    actionItems: string[];
    changedAssumptions: string[];
    unresolvedQuestions: string[];
}> {
    if (!transcript || transcript.trim().length < 20) {
        return { decisions: [], actionItems: [], changedAssumptions: [], unresolvedQuestions: [] };
    }

    try {
        const result = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [
                {
                    role: 'user',
                    content: `You are analyzing a transcript from a pre-bid meeting, clarification call, or internal team discussion about a procurement/tender opportunity.

Extract the following from this transcript. Return ONLY valid JSON, no other text.

{
  "decisions": ["list of confirmed decisions made during the discussion"],
  "actionItems": ["list of action items assigned or agreed upon"],
  "changedAssumptions": ["any assumptions about the tender that were changed or corrected during the discussion"],
  "unresolvedQuestions": ["questions that remain open/unanswered"]
}

If a category has no items, use an empty array.

TRANSCRIPT:
${transcript.slice(0, 8000)}`,
                },
            ],
            responseFormat: { type: 'json_object' },
        });

        const content = typeof result.choices?.[0]?.message?.content === 'string'
            ? result.choices[0].message.content
            : '';
        const parsed = JSON.parse(content);
        return {
            decisions: parsed.decisions || [],
            actionItems: parsed.actionItems || [],
            changedAssumptions: parsed.changedAssumptions || [],
            unresolvedQuestions: parsed.unresolvedQuestions || [],
        };
    } catch (error) {
        console.error('[Voxtral] Failed to extract insights:', error);
        return { decisions: [], actionItems: [], changedAssumptions: [], unresolvedQuestions: [] };
    }
}
