import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DolarType } from '../hooks/useDolar';
import { FaShareAlt, FaCopy } from 'react-icons/fa';

// Función para formatear fecha y hora
const formatFecha = (fecha?: string) => {
  if (!fecha) return 'Fecha no disponible';

  const date = new Date(fecha);
  return `${date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })} - ${date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Usa formato 24h
  })} hs`;
};

interface DolarCardProps {
  data: DolarType;
}

const DolarCard: React.FC<DolarCardProps> = ({ data }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator?.share) {
      if (isSharing) return;
      setIsSharing(true);
      try {
        await navigator.share({
          title: `Cotización ${data.nombre}`,
          text: `${data.nombre}: Compra $${data.compra.toFixed(2)} | Venta $${data.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  const handleCopy = async () => {
    if (typeof window !== 'undefined' && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(
          `${data.nombre}: Compra $${data.compra.toFixed(2)} | Venta $${data.venta.toFixed(2)}`
        );
        alert('Copiado al portapapeles');
      } catch (error) {
        console.error('Error al copiar:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="p-5 glass-strong border border-white/5 shadow-xl rounded-xl flex flex-col hover:border-accent-emerald/20"
    >
      {/* Título */}
      <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">{data.nombre}</h2>

      {/* Valores de Compra y Venta */}
      <div className="flex justify-between items-center py-3 text-xl font-semibold">
        <div className="flex flex-col items-start">
          <span className="text-secondary text-xs uppercase tracking-wider">Compra</span>
          <span className="text-accent-emerald font-mono">${data.compra.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-secondary text-xs uppercase tracking-wider">Venta</span>
          <span className="text-accent-teal font-mono">${data.venta.toFixed(2)}</span>
        </div>
      </div>

      {/* Última actualización con hora */}
      <p className="text-xs text-secondary text-center">
        Última actualización: {formatFecha(data.fechaActualizacion)}
      </p>

      {/* Botones minimalistas */}
      <div className="flex gap-2 mt-3">
        <motion.button
          onClick={handleShare}
          disabled={isSharing}
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-2 bg-accent-emerald/10 text-accent-emerald rounded-lg hover:bg-accent-emerald/20 transition-all border border-accent-emerald/20 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <FaShareAlt />
        </motion.button>

        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-2 glass text-white rounded-lg hover:bg-white/10 transition-all border border-white/5 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <FaCopy />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DolarCard;
