// ai.js
import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

// ✅ Called lazily — env vars are loaded by now
const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    return new GoogleGenAI({ apiKey });
};

// Timeout Wrapper
const withTimeout = async (promise, ms = 30000) => {
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error("AI_REQUEST_TIMEOUT"));
        }, ms);
    });

    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
};

// Parse JSON safely
const safeJsonParse = (text) => {
    try {
        // Try direct parse first
        return JSON.parse(text);
    } catch {
        try {
            // If it fails, extract from markdown or preamble
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
        } catch {
            return null;
        }
        return null;
    }
};

// Score Resume Match
export const scoreMatch = async (resumeText, jobDescription) => {
    const ai = getClient(); // ✅ instantiated here, not at module load

    try {
        const prompt = `
You are a recruitment expert.

Respond ONLY with valid JSON.

Required format:
{
  "score": number,
  "strengths": ["item1"],
  "gaps": ["item1"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

        const response = await withTimeout(
            ai.models.generateContent({
                model: MODEL,
                contents: prompt,
            })
        );

        const parsed = safeJsonParse(response.text);

        if (!parsed) return { score: 0, strengths: [], gaps: [] };

        return {
            score: typeof parsed.score === "number" ? parsed.score : 0,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
        };
    } catch (error) {
        if (error.message === "AI_REQUEST_TIMEOUT") throw error;
        return { score: 0, strengths: [], gaps: [] };
    }
};

// Generate Cover Letter
export const generateCoverLetter = async (
    resumeText,
    jobDescription,
    role,
    company,
    tone = "formal"
) => {
    const ai = getClient(); // ✅ instantiated here, not at module load

    const prompt = `
You are an expert career coach who writes compelling human cover letters.

Write a cover letter for the role of ${role} at ${company}.

Tone: ${tone}

Rules:
- Start with "Dear Hiring Manager,"
- No subject line
- No email headers
- Tailor every sentence carefully
- Keep it professional and realistic

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await withTimeout(
        ai.models.generateContent({
            model: MODEL,
            contents: prompt,
        })
    );

    return response.text;
};