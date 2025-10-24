/**
 * Script para importar datos electorales oficiales a PostgreSQL
 *
 * Fuente: Datos procesados de CSVs oficiales de DINE
 * (Dirección Nacional Electoral - Ministerio del Interior)
 *
 * Uso: npx ts-node scripts/import-elections-data.ts
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

interface AgrupacionData {
  nombre: string;
  votos: number;
  porcentaje: number;
}

interface ElectionData {
  year: number;
  date: string;
  category: string;
  total_electores: number;
  total_votantes: number;
  mesas_totalizadas: number;
  participacion: number;
  total_votos_positivos: number;
  total_votos: number;
  votos_nulos: number;
  votos_blanco: number;
  votos_otros: number;
  agrupaciones: AgrupacionData[];
}

async function importElectionData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🗳️  Importando datos electorales oficiales de DINE...\n');

    // Leer todos los archivos JSON
    const dataDir = path.join(__dirname, '../data');
    const years = [2011, 2013, 2015, 2017, 2019, 2021, 2023];
    const categories = ['diputados', 'senadores'];

    let totalImported = 0;

    for (const category of categories) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📊 Procesando: ${category.toUpperCase()}`);
      console.log('='.repeat(70));

      for (const year of years) {
        const filePath = path.join(dataDir, `${category}_${year}_oficial.json`);

        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  Archivo no encontrado: ${category}_${year}_oficial.json`);
          continue;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data: ElectionData = JSON.parse(fileContent);

        // Skip si no hay agrupaciones (archivo vacío)
        if (!data.agrupaciones || data.agrupaciones.length === 0) {
          console.log(`⚠️  ${year}: Sin datos de agrupaciones, omitiendo...`);
          continue;
        }

        console.log(`📊 Procesando ${year}...`);

        // Insertar elección
        const electionResult = await client.query(
          `
        INSERT INTO elecciones_legislativas (
          year, date, category,
          total_electores, total_votantes, mesas_totalizadas,
          participacion, total_votos_positivos, total_votos,
          votos_nulos, votos_blanco, votos_otros
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (year, category) DO UPDATE SET
          date = EXCLUDED.date,
          total_electores = EXCLUDED.total_electores,
          total_votantes = EXCLUDED.total_votantes,
          mesas_totalizadas = EXCLUDED.mesas_totalizadas,
          participacion = EXCLUDED.participacion,
          total_votos_positivos = EXCLUDED.total_votos_positivos,
          total_votos = EXCLUDED.total_votos,
          votos_nulos = EXCLUDED.votos_nulos,
          votos_blanco = EXCLUDED.votos_blanco,
          votos_otros = EXCLUDED.votos_otros,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
        `,
          [
            data.year,
            data.date,
            data.category, // Usar la categoría del archivo
            data.total_electores,
            data.total_votantes,
            data.mesas_totalizadas,
            data.participacion,
            data.total_votos_positivos,
            data.total_votos,
            data.votos_nulos,
            data.votos_blanco,
            data.votos_otros,
          ]
        );

        const eleccionId = electionResult.rows[0].id;

        // Eliminar resultados anteriores de esta elección
        await client.query('DELETE FROM resultados_agrupacion WHERE eleccion_id = $1', [
          eleccionId,
        ]);

        // Insertar resultados por agrupación
        for (let i = 0; i < data.agrupaciones.length; i++) {
          const agrupacion = data.agrupaciones[i];

          await client.query(
            `
          INSERT INTO resultados_agrupacion (
            eleccion_id, nombre, votos, porcentaje, posicion
          ) VALUES ($1, $2, $3, $4, $5)
          `,
            [
              eleccionId,
              agrupacion.nombre,
              agrupacion.votos,
              agrupacion.porcentaje,
              i + 1, // Posición en el ranking
            ]
          );
        }

        console.log(`   ✅ ${year}: ${data.agrupaciones.length} agrupaciones importadas`);
        console.log(
          `      Electores: ${data.total_electores.toLocaleString()} | Participación: ${data.participacion}%`
        );
        console.log(
          `      Top 3: ${data.agrupaciones
            .slice(0, 3)
            .map((a) => a.nombre)
            .join(', ')}\n`
        );

        totalImported++;
      }
    }

    await client.query('COMMIT');

    console.log('\n' + '━'.repeat(70));
    console.log(`✅ Importación completada exitosamente`);
    console.log(`   Total de elecciones importadas: ${totalImported}`);
    console.log(`   Categorías: Diputados Nacionales, Senadores Nacionales`);
    console.log(`   Período: 2011-2023`);
    console.log(`   Fuente: DINE (Dirección Nacional Electoral)`);
    console.log('━'.repeat(70));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante la importación:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar
importElectionData()
  .then(() => {
    console.log('\n🎉 Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
