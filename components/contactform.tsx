import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const CollaborationSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profession: "",
        message: "",
    });
    const [formSent, setFormSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError("Completa los campos obligatorios.");
            return;
        }
        try {
            const response = await emailjs.send(
                "service_vfck9eu",
                "template_84nl6q9",
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    profession: formData.profession,
                    message: formData.message,
                },
                "J98onDRn2prYfiLZy"
            );
            if (response.status === 200) {
                setSuccess("Mensaje enviado correctamente.");
                setFormSent(true);
            } else {
                throw new Error("Error al enviar.");
            }
        } catch {
            setError("Hubo un problema, intenta de nuevo.");
        }
    };

    return (
        <section className="w-full bg-black text-white py-24 px-6 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12"
            >
                {/* Info y Redes */}
                <div className="md:w-1/2 space-y-6 text-center md:text-left">
                    <h2 className="text-5xl font-extrabold tracking-tight">Conectemos.</h2>
                    <p className="text-lg text-gray-400">Ideas, proyectos y colaboraciones. 🚀</p>
                    <div className="flex gap-6 justify-center md:justify-start">
                        <a href="https://linkedin.com/in/tomymaritano" target="_blank" className="text-gray-400 hover:text-white transition">
                            <FaLinkedin size={36} />
                        </a>
                        <a href="https://github.com/tomymaritano" target="_blank" className="text-gray-400 hover:text-white transition">
                            <FaGithub size={36} />
                        </a>
                    </div>
                </div>

                {/* Formulario */}
                <div className="bg-black border border-gray-700 p-8 rounded-xl md:w-1/2 w-full shadow-lg">
                    {formSent ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center flex flex-col items-center"
                        >
                            <FaCheckCircle className="text-green-400 text-5xl mb-4" />
                            <h3 className="text-2xl font-bold">¡Mensaje Enviado!</h3>
                            <p className="text-lg text-gray-400 mt-2">{success}</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profesión (opcional)" className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Escribe tu mensaje..." className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />

                            {/* BOTÓN MEJORADO */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-black py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-cyan-400 transition-all"
                            >
                                <FaPaperPlane /> Enviar Mensaje
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default CollaborationSection;