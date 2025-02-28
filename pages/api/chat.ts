import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Mensaje vacío" });
  }

  console.log("📡 Recibiendo solicitud en /api/chat con mensaje:", message);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 100,
    });

    const aiMessage =
      response.choices?.[0]?.message?.content?.trim() ||
      "No tengo una respuesta en este momento.";

    console.log("✅ Respuesta de OpenAI:", aiMessage);
    res.status(200).json({ response: aiMessage });
  } catch (error: any) {
    console.error("❌ Error con OpenAI:", error);
    res.status(500).json({ error: error.message || "Error desconocido" });
  }
}