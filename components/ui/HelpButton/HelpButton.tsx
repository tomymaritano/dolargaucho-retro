'use client';

import React, { useState } from 'react';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';

export interface FAQ {
  question: string;
  answer: string;
}

interface HelpButtonProps {
  title: string;
  faqs: FAQ[];
}

export function HelpButton({ title, faqs }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 glass rounded-lg hover:bg-brand/10 transition-colors group"
        aria-label="Abrir ayuda"
        title="Preguntas frecuentes"
      >
        <FaQuestionCircle className="text-secondary group-hover:text-brand transition-colors text-xl" />
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-7xl max-h-[80vh] overflow-y-auto bg-panel border border-border/5 rounded-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-modal-title"
            >
              {/* Header */}
              <div className="sticky top-0 bg-panel border-b border-border/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 glass rounded-lg">
                    <FaQuestionCircle className="text-brand text-xl" />
                  </div>
                  <h2 id="help-modal-title" className="text-xl font-bold text-foreground">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                  aria-label="Cerrar ayuda"
                >
                  <FaTimes className="text-secondary text-xl" />
                </button>
              </div>

              {/* FAQ List */}
              <div className="p-6 space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} variant="elevated" padding="lg">
                    <h3 className="text-foreground font-semibold mb-2 flex items-start gap-2">
                      <span className="text-brand">Q:</span>
                      <span>{faq.question}</span>
                    </h3>
                    <div className="text-secondary text-sm leading-relaxed pl-6">
                      <span className="text-brand-light font-semibold">A:</span>{' '}
                      <span dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border/10 p-6 bg-background/50">
                <p className="text-xs text-secondary text-center">
                  ¿Necesitás más ayuda?{' '}
                  <a href="mailto:support@dolargaucho.com" className="text-brand hover:underline">
                    Contactanos
                  </a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
