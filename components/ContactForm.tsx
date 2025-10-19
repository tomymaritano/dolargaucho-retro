import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import Toast from './Toast';
import { useToast } from '@/hooks/useToast';
import { logger } from '@/lib/utils/logger';

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
      logger.error('Error enviando email', err, {
        component: 'CollaborationSection',
        email: formData.email,
      });
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
        className="relative w-full bg-background text-foreground py-20 px-6 overflow-hidden border-t border-border"
      >
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              ¿Tienes alguna <span className="gradient-text">consulta</span>?
            </h2>
            <p className="text-sm text-secondary max-w-7xl mx-auto">
              Envíanos un mensaje y te responderemos lo antes posible
            </p>
          </div>

          <div className="glass-strong p-6 md:p-8 rounded-2xl border border-border">
            {formSent ? (
              <div className="text-center space-y-4 py-8">
                <FaCheckCircle className="text-brand text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-foreground">Mensaje Enviado</h3>
                <p className="text-secondary">Te contactaremos pronto</p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-6 glass px-6 py-2 rounded-lg text-sm font-medium hover:bg-brand/10 transition-all border border-border hover:border-brand/40 text-foreground"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-sm text-foreground placeholder-secondary"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-sm text-foreground placeholder-secondary"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none resize-none transition-all text-sm text-foreground placeholder-secondary"
                    placeholder="Escribe tu consulta o sugerencia..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-brand hover:bg-brand-light text-background-dark py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin" />
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
