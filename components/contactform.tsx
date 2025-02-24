import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const CollaborationSection: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profession: "",
        message: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formSent, setFormSent] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError("Por favor, completa todos los campos obligatorios.");
            setSuccess(null);
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
                setSuccess("¡Gracias por tu mensaje! Te contactaré pronto.");
                setError(null);
                setFormData({ name: "", email: "", profession: "", message: "" });
                setFormSent(true);
            } else {
                throw new Error("Error al enviar el mensaje");
            }
        } catch (err) {
            console.error("Error enviando email:", err);
            setError("Error al enviar el mensaje. Intenta de nuevo.");
        }
    };

    return (
        <section className="relative w-full bg-gradient-to-b from-[#0a0f1a] to-[#141e30] text-white py-20 px-6 flex flex-col items-center">
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-10 w-10 h-10 bg-cyan-400 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500 rounded-full opacity-40 animate-bounce"></div>
                <div className="absolute top-20 right-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-30 animate-spin-slow"></div>
            </div>

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Sección izquierda */}
                <div className="text-center md:text-left md:w-1/2 space-y-6">
                    <h2 className="text-4xl font-extrabold neon-text leading-tight">🌟 ¡Colabora con Nosotros!</h2>
                    <p className="text-lg text-gray-200">Si tienes ideas innovadoras, quieres aportar al proyecto o simplemente conectar, ¡hablemos! 🚀</p>
                    <div className="flex justify-center md:justify-start gap-6">
                        <a href="https://linkedin.com/in/tomymaritano" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-white transition-all transform hover:scale-110">
                            <FaLinkedin size={40} />
                        </a>
                        <a href="https://github.com/tomymaritano" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all transform hover:scale-110">
                            <FaGithub size={40} />
                        </a>
                    </div>
                </div>

                {/* Formulario con Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg shadow-lg md:w-1/2 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl dark:bg-black/30">

                    {formSent ? (
                        <div className="text-center animate-fade-in animate-zoom-in transition-all duration-500 ease-out flex flex-col items-center">
                            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                            <h3 className="text-2xl font-bold text-white">¡Mensaje enviado!</h3>
                            <p className="text-lg text-gray-400 mt-2">{success}</p>
                            <button
                                onClick={() => setFormSent(false)}
                                className="mt-6 bg-blue-600 text-white py-2 px-6 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-center mb-4">✉️ ¡Envíanos un mensaje!</h3>
                            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Tu nombre"
                                    required
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="tu@email.com"
                                    required
                                />

                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Profesión o empresa (opcional)"
                                />

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Escribe tu mensaje..."
                                    required
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 animate-pulse"
                                >
                                    <FaPaperPlane /> Enviar Mensaje
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CollaborationSection;