import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white">
      
      {/* Ilustración */}
      <h1 className="text-9xl font-bold text-purple-500">404</h1>
      <p className="text-xl text-gray-300 mt-4">Oops! La página que buscas no existe.</p>
      
      {/* Botón para volver */}
      <Link href="/" className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md">
        <FaArrowLeft /> Volver al Inicio
      </Link>
    </div>
  );
}