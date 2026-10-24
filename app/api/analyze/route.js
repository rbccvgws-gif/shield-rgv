import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { message, claimLocation } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    const phoneMatch = message.match(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    const searchTarget = urlMatch ? urlMatch[0] : phoneMatch ? phoneMatch[0] : message.split(' ').slice(0, 8).join(' ');

    const serpQuery = `${searchTarget} scam fraud alert Brownsville Texas`;
    let serpEvidence = [];
    let localMapsVerification = "No specific physical location queried.";

    if (process.env.SERPAPI_API_KEY) {
      const searchUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(serpQuery)}&api_key=${process.env.SERPAPI_API_KEY}&num=4`;
      const serpRes = await fetch(searchUrl);
      const serpData = await serpRes.json();

      if (serpData.organic_results) {
        serpEvidence = serpData.organic_results.slice(0, 3).map((item) => ({
          title: item.title,
          snippet: item.snippet,
          link: item.link,
        }));
      }

      if (claimLocation) {
        const mapsUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(claimLocation + ' Brownsville TX')}&api_key=${process.env.SERPAPI_API_KEY}`;
        const mapsRes = await fetch(mapsUrl);
        const mapsData = await mapsRes.json();

        if (mapsData.local_results && mapsData.local_results.length > 0) {
          const topPlace = mapsData.local_results[0];
          localMapsVerification = `Verified Official Entity on Google Maps: "${topPlace.title}" at ${topPlace.address}, Phone: ${topPlace.phone || 'N/A'}`;
        } else {
          localMapsVerification = `WARNING: No legitimate business matching "${claimLocation}" was found in Brownsville, TX on Google Maps via SerpApi.`;
        }
      }
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
You are Escudo RGV, a highly accurate, bilingual cybersecurity assistant for Brownsville, Texas.
CRITICAL INSTRUCTION: Do NOT assume the message is a scam. Many messages are completely normal, safe, or just wrong numbers. 

MESSAGE: "${message}"
CLAIMED ENTITY: "${claimLocation || 'None'}"
SERPAPI WEB EVIDENCE: ${JSON.stringify(serpEvidence)}
SERPAPI MAPS VERIFICATION: ${localMapsVerification}

Return ONLY a valid JSON object matching this exact structure:
{
  "risk_score": 15, 
  "verdict_en": "Safe / Wrong Number" | "Suspicious" | "High Risk Scam",
  "verdict_es": "Seguro / Número Equivocado" | "Sospechoso" | "Alto Riesgo de Estafa",
  "psychological_tactics": ["None"] (or list tactics like "Urgency" if it is a scam),
  "explanation_en": "Clear, plain-language explanation of why this is safe, a wrong number, or a scam.",
  "explanation_es": "Explicación clara en español de por qué es seguro, número equivocado o estafa.",
  "suggested_reply_en": "If it is a wrong number or safe message requiring a response, write a polite reply here (e.g., 'Sorry, wrong number'). If it's a scam, advise 'DO NOT REPLY'.",
  "suggested_reply_es": "Si es un número equivocado, escribe una respuesta educada (ej. 'Disculpe, número equivocado'). Si es estafa, escribe 'NO RESPONDER'.",
  "family_group_chat_card": "ONLY write a family warning message here if risk_score is over 50. If it is a safe message or wrong number, leave this exact field as an empty string: \"\"."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return NextResponse.json({
      serpQuery,
      serpEvidence,
      localMapsVerification,
      analysis: JSON.parse(response.text),
    });
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}