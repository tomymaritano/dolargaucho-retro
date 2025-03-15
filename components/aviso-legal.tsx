import { FaArrowLeft, FaTimes } from "react-icons/fa";

interface AvisoLegalProps {
  onClose: () => void;
}

export default function AvisoLegal({ onClose }: AvisoLegalProps) {
  return (
    <div className="min-h-screen  bg-black bg-opacity-5 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="bg-[#22243A] p-10 rounded-2xl relative max-w-3xl w-full mx-4 shadow-2xl border border-gray-700">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-300"
        >
          <FaTimes size={22} />
        </button>

        <h1 className="text-4xl font-extrabold text-purple-400 text-center mb-6">
          📜 Aviso Legal
        </h1>

        <div className="text-gray-300 space-y-6 text-lg leading-relaxed">
          <p>
            DolarGaucho proporciona cotizaciones de divisas basadas en información obtenida de diversas fuentes financieras. Aunque nos esforzamos por mantener la información actualizada y precisa, las tasas de cambio pueden variar, y no garantizamos la exactitud o la actualidad de los datos presentados.
          </p>
          <p>
            Los usuarios deben verificar las tasas de cambio antes de realizar cualquier transacción que pueda verse afectada por cambios en dichas tasas. DolarGaucho no se responsabiliza por decisiones tomadas basadas en los datos proporcionados.
          </p>
          <p>
            Los usuarios reconocen que los datos proporcionados por ArgentinaDatos.com y DolarGaucho son meramente informativos y pueden no reflejar con total exactitud la realidad. La información oficial debe consultarse en fuentes gubernamentales correspondientes.
          </p>
          <p>
            El uso de ArgentinaDatos.com y DolarGaucho implica la aceptación de estos términos y condiciones. Nos reservamos el derecho de modificar, actualizar o suspender el servicio en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
}