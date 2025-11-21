import { GoogleGenAI, Type } from "@google/genai";
import { Product, ProductInsights } from "../types";

const MODEL_ID = "gemini-2.5-flash";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Uses Gemini to interpret a natural language search query and return relevant product IDs.
 */
export const searchProductsWithAI = async (query: string, catalog: Product[]): Promise<number[]> => {
  try {
    const ai = getClient();
    
    const catalogSummary = catalog.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description
    }));

    const prompt = `
      You are an intelligent search engine for an e-commerce store.
      
      User Query: "${query}"
      
      Product Catalog:
      ${JSON.stringify(catalogSummary)}
      
      Task: 
      Identify the products from the catalog that best match the user's intent. 
      Consider synonyms (e.g., "kicks" for shoes, "timepiece" for watch).
      
      Output:
      Return a JSON object with a single property "productIds" which is an array of numbers corresponding to the matched product IDs.
      If no products match, return an empty array.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const result = JSON.parse(jsonText);
    return result.productIds || [];

  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};

/**
 * Generates dynamic insights for a specific product using Gemini.
 */
export const generateProductInsights = async (product: Product): Promise<ProductInsights | null> => {
  try {
    const ai = getClient();
    const prompt = `
      Analyze this product and provide a shopping persona summary:
      Product: ${product.name}
      Description: ${product.description}
      Category: ${product.category}
      Price: $${product.price}

      Generate:
      1. vibeTags: 3 short, punchy adjectives (1-2 words each) describing the aesthetic/vibe.
      2. sellingPoint: A persuasive one-sentence reason to buy this specific item.
      3. bestOccasion: The perfect scenario or event to use this product.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibeTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            sellingPoint: { type: Type.STRING },
            bestOccasion: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ProductInsights;

  } catch (error) {
    console.error("Insight Generation Error:", error);
    return null;
  }
};

/**
 * Chat with the AI Assistant to get recommendations, supporting text and images.
 */
export const chatWithShoppingAssistant = async (
  history: { role: string; parts: { text?: string; inlineData?: any }[] }[], 
  userMessage: string,
  imageBase64: string | null,
  catalog: Product[]
): Promise<{ text: string; productIds?: number[] }> => {
  try {
    const ai = getClient();

    // Context for the model
    const catalogContext = catalog.map(p => `ID ${p.id}: ${p.name} (${p.category}) - ${p.description}`).join('\n');

    const systemInstruction = `
      You are "Swapify", a highly intelligent and visual shopping assistant.
      
      CATALOG:
      ${catalogContext}

      YOUR CAPABILITIES:
      1. Answer questions about products.
      2. If the user sends an IMAGE: Analyze the image visually (describe style, color, type) and recommend the CLOSEST MATCHING products from the CATALOG based on their descriptions.
      3. Be concise, stylish, and helpful.

      OUTPUT FORMAT (JSON):
      {
        "reply": "Your conversational response...",
        "recommendedIds": [1, 2] // Array of Product IDs if you have specific recommendations
      }
    `;

    // Construct the current message parts
    const currentParts: any[] = [{ text: userMessage }];
    if (imageBase64) {
      // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      currentParts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for simplicity, or detect from header
          data: base64Data
        }
      });
    }

    // We perform a single generateContent call here for simplicity in this demo architecture,
    // but effectively treating it as the latest turn in a chat.
    // We inject the system instruction into the config.
    
    // For true chat history, we'd append previous turns to 'contents'. 
    // Here we just send the current turn with the system instruction for stateless simplicity 
    // combined with the catalog context.
    
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: [
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            recommendedIds: { type: Type.ARRAY, items: { type: Type.INTEGER } }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return { text: "I'm having trouble processing that right now." };

    const result = JSON.parse(jsonText);
    return {
      text: result.reply,
      productIds: result.recommendedIds
    };

  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "I'm sorry, I encountered an error processing your request." };
  }
};