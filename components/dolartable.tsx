import React, { useState, useEffect } from "react";
import { DolarType } from "../hooks/useDolar";
import { FaSort, FaSearch, FaShareAlt, FaCopy } from "react-icons/fa";
import { motion } from "framer-motion";

interface DolarTableProps {
  data: DolarType[];
}

// 🔹 Función para formatear fecha y hora en formato completo
const formatFecha = (fecha?: string) => {
  if (!fecha) return "Fecha no disponible";
  const date = new Date(fecha);
  return `${date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })} - 
          ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} hs`;
};

const DolarTable: React.FC<DolarTableProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<"nombre" | "compra" | "venta" | "fechaActualizacion">("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 🔹 Detectar si está en Mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Filtrar y ordenar datos
  const sortedData = [...data]
    .filter((tipo) => tipo.nombre.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortColumn] ?? 0;
      const bValue = b[sortColumn] ?? 0;
      return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

  // 📌 Alternar ordenamiento
  const toggleSort = (column: "nombre" | "compra" | "venta" | "fechaActualizacion") => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 📌 Copiar datos al portapapeles
  const handleCopy = async (tipo: DolarType) => {
    try {
      await navigator.clipboard.writeText(
        `💰 ${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`
      );
      alert("Copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  // 📌 Compartir datos
  const handleShare = async (tipo: DolarType) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cotización ${tipo.nombre}`,
          text: `💰 ${tipo.nombre}: Compra $${tipo.compra.toFixed(2)} | Venta $${tipo.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    }
  };

  return (
    <div className="backdrop-blur-lg p-4">
      {/* 🔍 Barra de búsqueda */}
      <div className="flex items-center gap-2 mb-4 bg-gray-800 px-4 py-2 rounded-lg">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar tipo de dólar..."
          className="bg-transparent text-white outline-none w-full placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🟢 **Modo Tabla en Desktop** */}
      {!isMobile ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-left">
            <thead>
              <tr className="border-b border-gray-600 bg-gray-800">
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("nombre")}>
                  Tipo <FaSort className="inline-block ml-1" />
                </th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("compra")}>
                  Compra <FaSort className="inline-block ml-1" />
                </th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("venta")}>
                  Venta <FaSort className="inline-block ml-1" />
                </th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort("fechaActualizacion")}>
                  Última Actualización <FaSort className="inline-block ml-1" />
                </th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((tipo) => (
                <motion.tr key={tipo.nombre} className="border-b border-gray-700 hover:bg-white/20 transition-all">
                  <td className="py-4 px-4">{tipo.nombre}</td>
                  <td className="py-4 px-4 text-right text-green-400">${tipo.compra.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-red-400">${tipo.venta.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-gray-400 text-xs">{formatFecha(tipo.fechaActualizacion)}</td>
                  <td className="py-4 px-4 flex justify-center gap-3">
                    <motion.button onClick={() => handleCopy(tipo)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                      <FaCopy className="text-white" />
                    </motion.button>
                    <motion.button onClick={() => handleShare(tipo)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                      <FaShareAlt className="text-white" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // 🟢 **Modo Tarjetas en Mobile**
        <div className="flex flex-col gap-3">
          {sortedData.map((tipo) => (
            <motion.div
              key={tipo.nombre}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md flex flex-col gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{tipo.nombre}</h3>
              </div>
              <div className="flex justify-between">
                <p className="text-green-400 font-bold">Compra: ${tipo.compra.toFixed(2)}</p>
                <p className="text-red-400 font-bold">Venta: ${tipo.venta.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-400">Última actualización: {formatFecha(tipo.fechaActualizacion)}</p>
              <div className="flex justify-between gap-2 mt-2">
                <motion.button onClick={() => handleCopy(tipo)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                  <FaCopy />
                </motion.button>
                <motion.button onClick={() => handleShare(tipo)} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                  <FaShareAlt />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DolarTable;