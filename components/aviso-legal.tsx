import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

interface AvisoLegalProps {
  onClose: () => void;
}

export default function AvisoLegal({ onClose }: AvisoLegalProps) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-[#1A1D2E] p-8 rounded-lg relative max-w-3xl w-full">
        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <FaTimes size={20} />
        </button>
        
        <h1 className="text-3xl font-bold text-purple-400 text-center">📜 Aviso Legal</h1>
        
        <div className="text-gray-300 mt-4 space-y-4">
          {/* Sección específica para DolarGaucho */}
          <p>
            DolarGaucho proporciona cotizaciones de divisas basadas en información obtenida de diversas fuentes financieras. Aunque nos esforzamos por mantener la información actualizada y precisa, las tasas de cambio pueden variar, y no garantizamos la exactitud o la actualidad de los datos presentados.
          </p>
          <p>
            Los usuarios deben verificar las tasas de cambio antes de realizar cualquier transacción que pueda verse afectada por cambios en las tasas de cambio. DolarGaucho no se responsabiliza por decisiones tomadas basadas en la información proporcionada en este sitio.
          </p>

          <p>
            Los usuarios reconocen que los datos proporcionados por ArgentinaDatos.com y DolarGaucho son meramente informativos y pueden no reflejar con total exactitud la realidad o estar completamente actualizados en todo momento. La información oficial debe ser consultada en las fuentes gubernamentales correspondientes.
          </p>
          <p>
            El uso de ArgentinaDatos.com y DolarGaucho implica la aceptación de estos términos y condiciones. Nos reservamos el derecho de modificar, actualizar, suspender o interrumpir el servicio o cualquier parte de su contenido en cualquier momento sin previo aviso.
          </p>
        </div>

        {/* Botón para volver */}
        <div className="mt-6 flex justify-center">
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md">
            <FaArrowLeft /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}