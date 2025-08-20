

import { GoogleGenAI, Type } from "@google/genai";
import { Product, Category } from '../types';

// Per instructions, assume API_KEY is set in the environment.
// The non-null assertion `!` tells TypeScript we know it will be available at runtime.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface StyleRecommendation {
  stylistMessage: string;
  recommendedProducts: {
    productId: string;
    reason: string;
  }[];
}

const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    stylistMessage: {
      type: Type.STRING,
      description: "A friendly and stylish message to the user explaining the outfit choice.",
    },
    recommendedProducts: {
      type: Type.ARRAY,
      description: "A list of recommended products to create the look.",
      items: {
        type: Type.OBJECT,
        properties: {
          productId: {
            type: Type.STRING,
            description: "The string ID of the recommended product from the provided list.",
          },
          reason: {
            type: Type.STRING,
            description: "A brief reason why this specific product was chosen for the outfit.",
          },
        },
        required: ["productId", "reason"],
      },
    },
  },
  required: ["stylistMessage", "recommendedProducts"],
};


export const getStyleRecommendation = async (userPrompt: string, products: Product[], categories: Category[]): Promise<StyleRecommendation> => {
  const simplifiedProducts = products.map(p => {
    const categoryName = categories.find(c => c.id === p.categoryId)?.name || 'Unknown';
    return {
      id: p.id,
      name: p.name,
      category: categoryName,
      description: p.description,
      culturalInspiration: p.culturalInspiration,
    }
  });

  const systemInstruction = `You are 'Zola', the expert AI fashion stylist for Afriblend, an e-commerce store specializing in modern African fashion. Your personality is chic, encouraging, and knowledgeable about African textiles and styles.
    Your task is to help a customer find the perfect outfit based on their request.
    1. Analyze the user's prompt (e.g., "I'm going to a summer wedding," "I need a smart casual look for work").
    2. Review the provided list of available Afriblend products.
    3. Select 1-3 products that create a cohesive, stylish outfit that fits the user's request.
    4. Write a personalized, encouraging message explaining your choices and how to style them.
    5. ONLY recommend products from the provided list by using their exact 'productId'. Do not invent products.
    6. Respond ONLY with the JSON format defined in the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User request: "${userPrompt}"\n\nAvailable Products: ${JSON.stringify(simplifiedProducts, null, 2)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StyleRecommendation;

  } catch (error) {
    console.error("Error fetching style recommendation:", error);
    throw new Error("Sorry, I'm having a little trouble coming up with ideas right now. Please try again in a moment.");
  }
};


export const generateImages = async (
  prompt: string,
  numberOfImages: number,
  aspectRatio: string
): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error('No images were generated. This might be due to a safety policy violation.');
    }

    const imageUrls = response.generatedImages.map(
      (img) => `data:image/jpeg;base64,${img.image.imageBytes}`
    );
    return imageUrls;
  } catch (error) {
    console.error('Error generating images:', error);
    if (error instanceof Error) {
        if (error.message.includes('SAFETY')) {
            throw new Error('The prompt was blocked due to safety policies. Please modify your prompt and try again.');
        }
    }
    throw new Error("Sorry, an error occurred while generating images. Please try again later.");
  }
};