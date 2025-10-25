/**
 * MermaidDiagram Component
 *
 * Renders Mermaid diagrams using a code block with syntax highlighting.
 * The diagram is displayed as code that can be copied and rendered externally.
 */

import React from 'react';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';

interface MermaidDiagramProps {
  title: string;
  description?: string;
  code: string;
  height?: string;
}

export function MermaidDiagram({
  title,
  description,
  code,
  height = '400px',
}: MermaidDiagramProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-panel border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {description && <p className="text-sm text-secondary mt-1">{description}</p>}
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-ghost gap-2"
          title="Copiar código Mermaid"
        >
          {copied ? (
            <>
              <FaCheckCircle className="text-success" />
              <span className="text-success">Copiado!</span>
            </>
          ) : (
            <>
              <FaCopy />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Diagram Display */}
      <div className="p-6 bg-background/50">
        <div
          className="bg-background border border-border rounded-lg p-4 overflow-auto font-mono text-xs"
          style={{ height, maxHeight: '600px' }}
        >
          <pre className="text-secondary whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-secondary">
          <span className="badge badge-sm bg-brand/10 text-brand border-brand/20">Mermaid</span>
          <span>
            Copia el código y pégalo en{' '}
            <a
              href="https://mermaid.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              mermaid.live
            </a>{' '}
            para visualizar
          </span>
        </div>
      </div>
    </div>
  );
}
