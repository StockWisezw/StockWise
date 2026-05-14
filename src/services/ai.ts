import { GoogleGenAI } from '@google/genai';

let autoAiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!autoAiClient) {
    autoAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return autoAiClient;
};

// AI Insights for Inventory
export const generateInventoryInsights = async (inventoryData: any) => {
  try {
    const ai = getGeminiClient();
    const prompt = `You are an expert AI business analyst for retail and wholesale businesses in Zimbabwe.
Given the following inventory data, provide 3 to 5 actionable insights on stock levels, fast-moving items, and reorder alerts. Keep it concise.

Inventory Data: ${JSON.stringify(inventoryData)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || 'No insights generated.';
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return 'Unable to generate AI insights at the moment. Please check your API key.';
  }
};
