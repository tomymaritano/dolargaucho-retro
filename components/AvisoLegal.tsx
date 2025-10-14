import { FaTimes } from 'react-icons/fa';

interface AvisoLegalProps {
  onClose: () => void;
}

export default function AvisoLegal({ onClose }: AvisoLegalProps) {
  return (
    <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="glass-strong p-10 rounded-2xl relative max-w-3xl w-full mx-4 shadow-2xl border border-white/10">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-white transition duration-300"
        >
          <FaTimes size={22} />
        </button>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-6">
          Aviso <span className="gradient-text">Legal</span>
        </h1>

        <div className="text-secondary space-y-4 text-base leading-relaxed">
          <p>
            DolarGaucho proporciona cotizaciones de divisas basadas en información obtenida de
            diversas fuentes financieras. Aunque nos esforzamos por mantener la información
            actualizada y precisa, las tasas de cambio pueden variar, y no garantizamos la exactitud
            o la actualidad de los datos presentados.
          </p>
          <p>
            Los usuarios deben verificar las tasas de cambio antes de realizar cualquier transacción
            que pueda verse afectada por cambios en dichas tasas. DolarGaucho no se responsabiliza
            por decisiones tomadas basadas en los datos proporcionados.
          </p>
          <p>
            Los usuarios reconocen que los datos proporcionados por ArgentinaDatos.com y DolarGaucho
            son meramente informativos y pueden no reflejar con total exactitud la realidad. La
            información oficial debe consultarse en fuentes gubernamentales correspondientes.
          </p>
          <p>
            El uso de ArgentinaDatos.com y DolarGaucho implica la aceptación de estos términos y
            condiciones. Nos reservamos el derecho de modificar, actualizar o suspender el servicio
            en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
}
