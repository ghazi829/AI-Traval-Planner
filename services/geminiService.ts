
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(destination: string): string {
    return `
You are an expert AI Travel Planner. Your tone should be friendly and helpful.
Generate a complete and detailed travel plan for the destination: "${destination}".

Your response MUST follow this exact structure, using Markdown for formatting. 
Do not add any introductory or concluding sentences outside of this structure.
Make information easy to use inside a travel website or mobile app by using well-formatted bullet points.

# Travel Plan for ${destination}

## 1. Overview
- Short introduction of the destination.
- Best time to visit.
- Local weather conditions.

## 2. Top Attractions
- List of 8–12 best places to visit.
- Each with a 1–2 line description.

## 3. 3-Day Travel Plan
### Day 1
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 2
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 3
- **Morning:** 
- **Afternoon:** 
- **Evening:** 

## 4. 7-Day Travel Plan
Provide a full detailed plan for 7 days with activities, timing suggestions, and local food recommendations for each day.
### Day 1: Arrival and Exploration
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 2: Cultural Immersion
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 3: Adventure and Scenery
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 4: Day Trip
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 5: Relaxation and Local Life
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 6: Shopping and Cuisine
- **Morning:** 
- **Afternoon:** 
- **Evening:** 
### Day 7: Departure
- **Morning:** 

## 5. Budget Estimation
- **Flight estimate (international):**
- **Hotel per night:** (Provide ranges for budget, standard, luxury)
- **Food per day:** (Provide ranges)
- **Transportation costs:**
- **Total budget:** (Provide ranges for budget, mid-range, luxury)

## 6. Packing List
- **Clothing:**
- **Electronics:**
- **Travel essentials:**
- **Medicine:**
- **Documents:**

## 7. Local Food Recommendations
- Top traditional dishes to try.
- Must-try restaurants.

## 8. Safety & Tips
- Safety tips for tourists.
- Cultural tips.
- Transportation advice.
- Scams to avoid.
`;
}

export const generateTravelPlan = async (destination: string): Promise<{ plan: string, groundingChunks: GroundingChunk[] }> => {
    const prompt = buildPrompt(destination);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const plan = response.text;
    if (!plan) {
      throw new Error("Received an empty response from the AI.");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { plan, groundingChunks };
};
