
import { GoogleGenAI } from "@google/genai";
import { SiteLog } from "../types";

export const generateSiteInsight = async (logs: SiteLog[]) => {
  // Check if API key exists to avoid crash during preview if not configured
  if (!process.env.API_KEY) {
    return "AI Insights require a valid Google API Key. Please configure your environment variables.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const summary = logs.map(l => `- ${l.date}: ${l.workCompleted} (Status: ${l.status})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following site logs and provide a 2-sentence executive summary highlighting any productivity trends or potential risks: \n\n${summary}`,
      config: {
        systemInstruction: "You are a senior construction analyst providing concise project summaries.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate AI insights at this time. Manual review recommended.";
  }
};
