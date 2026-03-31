import { GoogleGenerativeAI } from "@google/generative-ai";

const globalForAI = globalThis as unknown as {
  genAI: GoogleGenerativeAI | undefined;
};

function getGenAI(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }
  return (
    globalForAI.genAI ??
    new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  );
}

export function getFlashModel() {
  const genAI = getGenAI();
  if (process.env.NODE_ENV !== "production") globalForAI.genAI = genAI;
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function generateProductContent(params: {
  nameEn: string;
  nameFr: string;
  category: string;
  specs: Array<{ key: string; value: string }>;
}) {
  const model = getFlashModel();
  const specsText = params.specs.map((s) => `${s.key}: ${s.value}`).join(", ");

  const prompt = `You are a luxury watch brand copywriter for Ziziwatches. Generate compelling product content for this watch in French, English, and Arabic.

Watch: ${params.nameFr} / ${params.nameEn}
Category: ${params.category}
Specifications: ${specsText}

Return ONLY a valid JSON object with these exact keys:
{
  "descriptionFr": "...",
  "descriptionEn": "...",
  "descriptionAr": "...",
  "seoTitleFr": "...",
  "seoTitleEn": "...",
  "seoTitleAr": "...",
  "seoDescriptionFr": "...",
  "seoDescriptionEn": "...",
  "seoDescriptionAr": "...",
  "socialCaptionFr": "...",
  "socialCaptionEn": "...",
  "socialCaptionAr": "..."
}

Requirements:
- Descriptions: 2-3 sentences, luxury tone, evocative language
- SEO titles: under 60 chars, include brand name "Ziziwatches"
- SEO descriptions: under 155 chars
- Social captions: 1 sentence with 3 relevant hashtags
- Arabic text must be proper RTL Arabic`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI returned invalid JSON");
  return JSON.parse(jsonMatch[0]);
}

export async function generateRecommendations(params: {
  currentProduct: { name: string; category: string; tags: string[] };
  availableProducts: Array<{ id: string; name: string; category: string; price: number }>;
}) {
  const model = getFlashModel();

  const prompt = `You are a luxury watch advisor for Ziziwatches. A customer is viewing "${params.currentProduct.name}" (${params.currentProduct.category}).

Available products to recommend:
${params.availableProducts.map((p) => `- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ${p.price} DZD`).join("\n")}

Return ONLY a valid JSON object:
{"recommendedIds": ["id1", "id2", "id3"]}

Pick 3 products that complement or are similar to what they're viewing. Exclude the current product.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { recommendedIds: [] };
  return JSON.parse(jsonMatch[0]);
}

export async function getChatResponse(params: {
  message: string;
  locale: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  productContext?: string;
}): Promise<string> {
  const model = getFlashModel();

  const systemPrompt = `You are Zizi, the luxury watch advisor for Ziziwatches — an Algerian luxury watch brand.

Your personality: Elegant, knowledgeable, warm, helpful. You embody the luxury brand experience.

Language: Respond in ${params.locale === "ar" ? "Arabic" : params.locale === "en" ? "English" : "French"} unless the customer writes in a different language.

You help customers with:
- Watch recommendations and questions
- Order tracking and delivery information
- Product specifications and comparisons
- Care and maintenance advice
- General brand and store information

Payment method: Cash on delivery only. Delivery across Algeria.

${params.productContext ? `Current product context: ${params.productContext}` : ""}

Keep responses concise (2-4 sentences max). If asked about topics unrelated to watches or the store, politely redirect.`;

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Compris! Je suis Zizi, votre conseiller Ziziwatches. Comment puis-je vous aider?" }] },
      ...params.history.map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: h.content }],
      })),
    ],
  });

  const result = await chat.sendMessage(params.message);
  return result.response.text();
}
