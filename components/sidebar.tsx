import Link from "next/link";
import { FaHome, FaChartLine, FaTags, FaNewspaper } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 bg-[#181B2B] min-h-screen p-6 border-r border-gray-700">
      <h2 className="text-xl font-bold text-white">📢 Dólar Gaucho</h2>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <Link href="/" className="flex items-center gap-3 text-gray-300 hover:text-teal-300">
              <FaHome /> Inicio
            </Link>
          </li>
          <li>
            <Link href="/blog" className="flex items-center gap-3 text-gray-300 hover:text-teal-300">
              <FaNewspaper /> Noticias
            </Link>
          </li>
          <li>
            <Link href="/cotizaciones" className="flex items-center gap-3 text-gray-300 hover:text-teal-300">
              <FaChartLine /> Cotizaciones
            </Link>
          </li>
          <li>
            <Link href="/categorias" className="flex items-center gap-3 text-gray-300 hover:text-teal-300">
              <FaTags /> Categorías
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;