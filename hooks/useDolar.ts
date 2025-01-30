// hooks/useDolar.ts
import { useState, useEffect } from 'react';

export type DolarType = {
  compra: number;
  venta: number;
  casa?: string;
  nombre: string;
  moneda?: string;
  fechaActualizacion?: string;
};

const useDolar = () => {
  const [dolar, setDolar] = useState<DolarType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares');
        const data: DolarType[] = await response.json();
        setDolar(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDolar();
  }, []);

  return { dolar, loading, error };
};

export default useDolar;