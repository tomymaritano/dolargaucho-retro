// components/DolarCard.tsx
import React, { useState } from 'react';
import { DolarType } from '../hooks/useDolar';
import { FaShareAlt, FaCopy } from 'react-icons/fa';

interface DolarCardProps {
    data: DolarType;
}

const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ` a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
};

const DolarCard: React.FC<DolarCardProps> = ({ data }) => {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        if (typeof window !== 'undefined' && navigator?.share) {
            if (isSharing) return;
            setIsSharing(true);
            try {
                await navigator.share({
                    title: `Cotización ${data.nombre}`,
                    text: `Compra: $${data.compra.toFixed(2)} - Venta: $${data.venta.toFixed(2)}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error al compartir:', error);
            } finally {
                setIsSharing(false);
            }
        } else {
            alert('Tu navegador no soporta la función de compartir.');
        }
    };

    const handleCopy = async () => {
        if (typeof window !== 'undefined' && navigator?.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(`Cotización ${data.nombre}\nCompra: $${data.compra.toFixed(2)}\nVenta: $${data.venta.toFixed(2)}`);
                alert('Copiado al portapapeles');
            } catch (error) {
                console.error('Error al copiar:', error);
                alert('No se pudo copiar al portapapeles.');
            }
        } else {
            alert('Tu navegador no soporta la función de copiar al portapapeles.');
        }
    };

    return (
        <div className="p-6 rounded-lg bg-gradient-to-br from-purple-900 to-pink-700 shadow-lg border border-yellow-500 text-yellow-300 w-full max-w-md transition-all hover:shadow-xl relative font-mono">
            <h2 className="text-2xl font-bold text-yellow-300 tracking-widest text-center">{data.nombre}</h2>
            <div className="flex justify-between mt-4 p-3 text-lg font-bold border-b border-yellow-500">
                <p className="text-green-300">Compra: <span className="font-extrabold">${data.compra.toFixed(2)}</span></p>
                <p className="text-red-300">Venta: <span className="font-extrabold">${data.venta.toFixed(2)}</span></p>
            </div>
            {data.fechaActualizacion && <p className="text-sm text-yellow-400 mt-3 text-center">Última actualización: {formatFecha(data.fechaActualizacion)}</p>}
            <div className="flex justify-center gap-4 mt-6 w-full">
                <button onClick={handleShare} disabled={isSharing} className={`bg-pink-600 hover:bg-pink-700 text-white w-full py-3 rounded-md flex items-center justify-center gap-2 shadow-md shadow-yellow-500 transition-all ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <FaShareAlt /> Compartir
                </button>
                <button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-md flex items-center justify-center gap-2 shadow-md shadow-yellow-500 transition-all">
                    <FaCopy /> Copiar
                </button>
            </div>
        </div>
    );
};

export default DolarCard;
