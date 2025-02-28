import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AvisoLegal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white p-8 flex flex-col items-center">
      
      {/* Contenido */}
      <div className="max-w-3xl bg-[#1A1D2E] p-8 rounded-lg shadow-lg border border-purple-500/50">
        <h1 className="text-3xl font-bold text-purple-400 text-center">📜 Aviso Legal</h1>
        
        <p className="text-gray-300 mt-4">
          <strong>ArgentinaDatos.com</strong> es un servicio exclusivamente informativo que proporciona diversos datos sobre la República Argentina.
        </p>

        <p className="text-gray-300 mt-4">
          Los colaboradores de ArgentinaDatos.com se eximen de toda responsabilidad en cuanto a la posible falta de precisión, veracidad, exactitud, integridad o vigencia de los datos proporcionados a través de nuestro sitio web y/o API. No garantizamos la precisión, veracidad, exactitud, integridad o vigencia de la información mostrada en nuestro servicio.
        </p>

        <p className="text-gray-300 mt-4">
          ArgentinaDatos.com y sus colaboradores declinan toda responsabilidad respecto al uso que los usuarios puedan dar a la información y los datos obtenidos a través de nuestro servicio. No nos hacemos responsables por eventuales daños o perjuicios que pudieran resultar del uso de los datos proporcionados por nuestro servicio.
        </p>

        <p className="text-gray-300 mt-4">
          Los usuarios reconocen que los datos proporcionados por ArgentinaDatos.com son meramente informativos y pueden no reflejar con total exactitud la realidad o estar completamente actualizados en todo momento. La información oficial debe ser consultada en las fuentes gubernamentales correspondientes.
        </p>

        <p className="text-gray-300 mt-4">
          El uso de ArgentinaDatos.com implica la aceptación de estos términos y condiciones. ArgentinaDatos.com se reserva el derecho de modificar, actualizar, suspender o interrumpir el servicio o cualquier parte de su contenido en cualquier momento sin previo aviso.
        </p>

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