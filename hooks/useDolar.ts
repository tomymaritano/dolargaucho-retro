// hooks/useDolar.ts
import { useState, useEffect } from "react";

export type DolarType = {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion?: string; // 🛠 Ahora es opcional para evitar errores
}; 

const useDolar = () => {
  const [dolar, setDolar] = useState<DolarType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch("https://dolarapi.com/v1/dolares");
        const data = await response.json();
        
        console.log("📢 Respuesta de API DolarAPI:", data);

        // Verificamos si la API devuelve un array y filtramos el dólar oficial
        if (Array.isArray(data)) {
          setDolar(data);
        } else {
          throw new Error("Formato inesperado de respuesta de API.");
        }
      } catch (err) {
        setError(`Error al obtener datos: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDolar();
  }, []);

  return { dolar, loading, error };
};

export default useDolar;