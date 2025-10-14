import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensaje vacío' });
  }

  logger.info('Recibiendo solicitud en /api/chat', { api: 'chat', messageLength: message.length });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 100,
    });

    const aiMessage =
      response.choices?.[0]?.message?.content?.trim() || 'No tengo una respuesta en este momento.';

    logger.info('Respuesta de OpenAI recibida', { api: 'chat', responseLength: aiMessage.length });
    res.status(200).json({ response: aiMessage });
  } catch (error: unknown) {
    logger.error('Error con OpenAI', error, { api: 'chat' });

    // Manejo seguro del error
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido' });
    }
  }
}
