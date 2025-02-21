import type { NextApiRequest, NextApiResponse } from "next";
import emailjs from "@emailjs/nodejs"; // Versión segura para backend

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Permitir CORS para evitar errores en frontend
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Manejar pre-flight requests (CORS)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Solo permitir método POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    // Extraer datos del body
    const { name, email, profession, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        // Enviar email usando EmailJS
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            process.env.EMAILJS_TEMPLATE_ID!,
            {
                from_name: name,
                from_email: email,
                profession,
                message,
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY!,
                privateKey: process.env.EMAILJS_PRIVATE_KEY!,
            }
        );

        // Respuesta exitosa
        return res.status(200).json({ message: "¡Email enviado con éxito!", response });
    } catch (error) {
        console.error("Error enviando email:", error);
        return res.status(500).json({ error: "Error al enviar el email" });
    }
}