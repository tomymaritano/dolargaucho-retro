'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { FaEnvelope, FaSpinner, FaCheck } from 'react-icons/fa';
import { isValidEmail } from '@/lib/auth/helpers';

interface LeadCaptureFormProps {
  source?: 'homepage' | 'newsletter' | 'cta' | 'other';
  variant?: 'inline' | 'card';
  title?: string;
  description?: string;
  redirectOnSuccess?: boolean;
}

export const LeadCaptureForm = React.memo(function LeadCaptureForm({
  source = 'homepage',
  variant = 'card',
  title = 'Suscríbete al Newsletter',
  description = 'Recibe actualizaciones diarias sobre el dólar y la economía argentina',
  redirectOnSuccess = false,
}: LeadCaptureFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          source,
          subscribed_to_newsletter: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Error al suscribirse');
        return;
      }

      setSuccess(true);
      setEmail('');
      setName('');

      // Optional: Redirect to auth page
      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      }
    } catch {
      setError('Error al enviar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>}
          {description && <p className="text-secondary">{description}</p>}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-brand/10 border border-brand/30 rounded-lg">
          <div className="flex items-center gap-3">
            <FaCheck className="text-brand text-xl flex-shrink-0" />
            <div>
              <p className="text-brand font-semibold">¡Suscripción exitosa!</p>
              <p className="text-sm text-secondary mt-1">
                Recibirás nuestras actualizaciones en tu email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (optional) */}
          <div>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre (opcional)"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="pl-10"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Suscribiendo...
              </>
            ) : (
              'Suscribirse gratis'
            )}
          </Button>

          <p className="text-xs text-secondary text-center">
            Al suscribirte aceptas recibir emails con actualizaciones.
            <br />
            Puedes cancelar en cualquier momento.
          </p>
        </form>
      )}
    </>
  );

  if (variant === 'inline') {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <Card variant="elevated" padding="lg">
      {content}
    </Card>
  );
});
