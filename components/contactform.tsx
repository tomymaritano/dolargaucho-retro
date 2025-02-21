import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaPaperPlane } from "react-icons/fa";

const CollaborationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "",
    message: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Por favor, completa todos los campos obligatorios.");
      setSuccess(null);
      return;
    }
    console.log("Formulario enviado:", formData);
    setSuccess("¡Gracias por tu mensaje! Te contactaré pronto.");
    setError(null);
    setFormData({ name: "", email: "", profession: "", message: "" });
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20 px-6 flex flex-col items-center">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Sección izquierda: Mensaje de colaboración */}
        <div className="text-center md:text-left md:w-1/2 space-y-6 animate-fadeIn">
          <h2 className="text-4xl font-extrabold leading-tight">
            🌟 ¡Construyamos juntos algo increíble!
          </h2>
          <p className="text-lg text-gray-200">
            Si tienes ideas innovadoras, quieres aportar al proyecto o simplemente conectar, ¡hablemos! 🚀
          </p>
          <div className="flex justify-center md:justify-start gap-6">
            <a href="https://linkedin.com/in/tomymaritano" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-all transform hover:scale-110">
              <FaLinkedin size={40} />
            </a>
            <a href="https://github.com/tomymaritano" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all transform hover:scale-110">
              <FaGithub size={40} />
            </a>
          </div>
        </div>

        {/* Sección derecha: Formulario */}
        <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg border border-gray-300 md:w-1/2 animate-slideIn">
          <h3 className="text-2xl font-bold text-center mb-4">✉️ ¡Hablemos!</h3>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Profesión / Empresa (Opcional)</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej: Desarrollador en Google"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Mensaje</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Escribe tu mensaje..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <FaPaperPlane /> Enviar Mensaje
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default CollaborationSection;