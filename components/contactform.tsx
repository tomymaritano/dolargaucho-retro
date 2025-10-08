import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import Toast from './toast';
import { useToast } from '@/hooks/useToast';

const CollaborationSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    message: '',
  });

  const [formSent, setFormSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showToast('Por favor, completa todos los campos obligatorios', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast('Por favor, ingresa un email válido', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await emailjs.send(
        'service_vfck9eu',
        'template_84nl6q9',
        {
          from_name: formData.name,
          from_email: formData.email,
          profession: formData.profession,
          message: formData.message,
        },
        'J98onDRn2prYfiLZy'
      );

      if (response.status === 200) {
        showToast('¡Mensaje enviado exitosamente! Te contactaremos pronto', 'success');
        setFormData({ name: '', email: '', profession: '', message: '' });
        setFormSent(true);
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Error enviando email:', err);
      showToast('Error al enviar el mensaje. Intenta de nuevo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <section
        id="contacto"
        className="relative w-full bg-dark text-white py-24 px-6 overflow-hidden border-t border-accent-emerald/10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Colabora con <span className="gradient-text">Dólar Gaucho</span>
            </h2>
            <p className="text-base text-secondary max-w-xl mx-auto">
              ¿Tienes ideas o quieres contribuir? Conectemos
            </p>
          </div>

          <div className="glass-strong p-8 rounded-2xl border border-accent-emerald/10 max-w-2xl mx-auto">
            {formSent ? (
              <div className="text-center space-y-4 py-8">
                <FaCheckCircle className="text-accent-emerald text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold">Mensaje Enviado</h3>
                <p className="text-secondary">Te contactaremos pronto</p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-6 glass px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-all border border-accent-emerald/20 hover:border-accent-emerald/40"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 glass bg-dark-light/50 border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-sm"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 glass bg-dark-light/50 border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-sm"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">
                    Profesión / Empresa
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full p-3 glass bg-dark-light/50 border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-sm"
                    placeholder="Ej: Desarrollador"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 glass bg-dark-light/50 border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none resize-none transition-all text-sm"
                    placeholder="Escribe tu mensaje..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-accent-emerald hover:bg-accent-teal text-dark py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CollaborationSection;
