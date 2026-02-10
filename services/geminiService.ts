import { GoogleGenAI } from "@google/genai";
import { SimulationParams, Store } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeStoreDistribution = async (
  params: SimulationParams,
  stores: Store[],
  centerAddress: string
): Promise<string> => {
  try {
    const ai = initGenAI();
    
    // Construct a prompt summarizing the current map state
    const prompt = `
      Act as a Senior Retail Location Analyst.
      
      I have visualized a set of stores on a map with the following parameters:
      - Center Location: ${centerAddress}
      - Max Distance Radius: ${params.maxDistance} km
      - Total Stores Generated: ${stores.length}
      
      Category Breakdown:
      - A+ Stores (Premium/Flagship): ${params.countAPlus}
      - A Stores (Standard): ${params.countA}
      - B Stores (Outlet/Small): ${params.countB}
      
      Please provide a concise strategic analysis of this distribution network. 
      Include:
      1. A brief assessment of the density (Stores per sq km approx).
      2. Potential strengths of having ${params.countAPlus} flagship locations relative to ${params.countB} smaller ones.
      3. One actionable recommendation for logistics or marketing based on this spread.
      
      Keep the tone professional and the response under 200 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert in retail geography and supply chain logistics.",
      }
    });

    return response.text || "No analysis could be generated at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please ensure your API key is valid.";
  }
};