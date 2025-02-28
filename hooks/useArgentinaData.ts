import { useState, useEffect } from 'react';

const BASE_URL = "https://api.argentinadatos.com/v1/";

export type ArgentinaDataType = {
  feriados: any[] | null;
  eventosPresidenciales: any[] | null;
  inflacion: any | null;
  inflacionInteranual: any | null;
  uva: any | null;
  riesgoPais: any | null;
  riesgoPaisUltimo: any | null;
  tasasPlazoFijo: any | null;
  tasasDepositos30Dias: any | null;
  rendimientos: any | null;
  rendimientosBuenbit: any | null;
  senadores: any[] | null;
  actasSenado: any[] | null;
  actasSenado2025: any[] | null;
  fciMercadoDinero: any | null;
  fciRentaVariable: any | null;
  fciRentaFija: any | null;
  fciRentaMixta: any | null;
  fciOtros: any | null;
  diputados: any[] | null;
  actasDiputados: any[] | null;
  actasDiputados2025: any[] | null;
  estado: any | null;
};

const useArgentinaData = () => {
  const [data, setData] = useState<ArgentinaDataType>({
    feriados: null,
    eventosPresidenciales: null,
    inflacion: null,
    inflacionInteranual: null,
    uva: null,
    riesgoPais: null,
    riesgoPaisUltimo: null,
    tasasPlazoFijo: null,
    tasasDepositos30Dias: null,
    rendimientos: null,
    rendimientosBuenbit: null,
    senadores: null,
    actasSenado: null,
    actasSenado2025: null,
    fciMercadoDinero: null,
    fciRentaVariable: null,
    fciRentaFija: null,
    fciRentaMixta: null,
    fciOtros: null,
    diputados: null,
    actasDiputados: null,
    actasDiputados2025: null,
    estado: null,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoints = {
          feriados: "feriados/2025",
          eventosPresidenciales: "eventos/presidenciales",
          inflacion: "finanzas/indices/inflacion",
          inflacionInteranual: "finanzas/indices/inflacionInteranual",
          uva: "finanzas/indices/uva",
          riesgoPais: "finanzas/indices/riesgo-pais",
          riesgoPaisUltimo: "finanzas/indices/riesgo-pais/ultimo",
          tasasPlazoFijo: "finanzas/tasas/plazoFijo",
          tasasDepositos30Dias: "finanzas/tasas/depositos30Dias",
          rendimientos: "finanzas/rendimientos",
          rendimientosBuenbit: "finanzas/rendimientos/buenbit",
          senadores: "senado/senadores",
          actasSenado: "senado/actas",
          actasSenado2025: "senado/actas/2025",
          fciMercadoDinero: "finanzas/fci/mercadoDinero/ultimo",
          fciRentaVariable: "finanzas/fci/rentaVariable/ultimo",
          fciRentaFija: "finanzas/fci/rentaFija/ultimo",
          fciRentaMixta: "finanzas/fci/rentaMixta/ultimo",
          fciOtros: "finanzas/fci/otros/ultimo",
          diputados: "diputados/diputados",
          actasDiputados: "diputados/actas",
          actasDiputados2025: "diputados/actas/2025",
          estado: "estado",
        };

        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, endpoint]) => {
            try {
              const response = await fetch(`${BASE_URL}${endpoint}`);
              if (!response.ok) throw new Error(`Error en ${endpoint}`);
              const json = await response.json();
              return [key, json];
            } catch (err) {
              console.error(`❌ Error en API (${endpoint}):`, err);
              return [key, null]; // Retorna `null` si hay error en esa request
            }
          })
        );

        // Convertimos la lista de arrays en un objeto { clave: valor }
        const formattedData = Object.fromEntries(results) as ArgentinaDataType;
        setData(formattedData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useArgentinaData;