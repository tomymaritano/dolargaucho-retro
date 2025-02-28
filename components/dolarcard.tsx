import React, { useState } from 'react';
import { DolarType } from '../hooks/useDolar'
import { FaShareAlt, FaCopy, FaDollarSign, FaMoneyBillWave, FaBuilding, FaExchangeAlt, FaPiggyBank } from 'react-icons/fa';

interface DolarCardProps {
    data: DolarType;
}

const dolarIcons: Record<string, React.ReactNode> = {
    'Oficial': <FaBuilding className="text-gray-900" />, 
    'Blue': <FaMoneyBillWave className="text-gray-900" />,
    'MEP': <FaExchangeAlt className="text-gray-900" />,
    'CCL': <FaPiggyBank className="text-gray-900" />,
    'Crypto': <FaDollarSign className="text-gray-900" />,
};

// Emojis para el mensaje de compartir
const dolarEmojis: Record<string, string> = {
    'Oficial': '🏦',
    'Blue': '💵',
    'MEP': '📊',
    'CCL': '🏛️',
    'Crypto': '🪙',
};

// Formatear fecha
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
                    title: `Cotización ${data.nombre} - Dólar Gaucho`,
                    text: `${dolarEmojis[data.nombre] || '💰'} ${data.nombre} hoy:\n\n🟢 Compra: $${data.compra.toFixed(2)}\n🔴 Venta: $${data.venta.toFixed(2)}\n\n📊 Consulta más en Dólar Gaucho: ${window.location.href}`,
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
                await navigator.clipboard.writeText(
                    `💰 ${data.nombre} hoy:\n\n🟢 Compra: $${data.compra.toFixed(2)}\n🔴 Venta: $${data.venta.toFixed(2)}\n\n📊 Consulta más en Dólar Gaucho: ${window.location.href}`
                );
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
        <div className="p-6 bg-gradient-to-b from-white to-gray-100 border border-gray-200 shadow-lg rounded-xl max-w-md w-full font-sans transition-all hover:shadow-xl">
            
            {/* Ícono + Título */}
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {dolarIcons[data.nombre] || <FaDollarSign className="text-gray-500" />}  
                {data.nombre}
            </h2>

            {/* Valores de Compra y Venta */}
            <div className="flex justify-between items-center mt-4 py-4 text-lg font-semibold border-b border-gray-300">
                <p className="text-green-700">Compra: <span className="font-bold">${data.compra.toFixed(2)}</span></p>
                <p className="text-red-700">Venta: <span className="font-bold">${data.venta.toFixed(2)}</span></p>
            </div>

            {/* Última actualización */}
            {data.fechaActualizacion && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                    Última actualización: {formatFecha(data.fechaActualizacion)}
                </p>
            )}

            {/* Botones */}
            <div className="flex justify-center gap-3 mt-6 w-full">
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className={`w-full py-3 text-lg font-medium text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-green-700 
                    ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaShareAlt /> Compartir
                </button>

                <button
                    onClick={handleCopy}
                    className="w-full py-3 text-lg font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-200"
                >
                    <FaCopy /> Copiar
                </button>
            </div>
        </div>
    );
};

export default DolarCard;