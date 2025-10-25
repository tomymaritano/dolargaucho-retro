/**
 * Script para procesar XLSX de senadores 2021 (múltiples provincias)
 */
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

console.log('📊 Procesando datos de Senadores 2021...\n');

// Directorio con los archivos de cada provincia
const dir = 'senadores_2021_generales';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.xlsx'));

console.log(`Archivos encontrados: ${files.length}`);
files.forEach((f) => console.log(`  - ${f}`));
console.log('');

// Estructura para almacenar datos agregados
const agrupaciones = {};
let totalElectores = 0;
let totalVotantes = 0;
let votosPositivos = 0;
let votosBlanco = 0;
let votosNulos = 0;
let votosRecurridos = 0;

// Procesar cada archivo de provincia
for (const file of files) {
  const filePath = path.join(dir, file);
  const provincia = file.split(' - ')[0];

  console.log(`Procesando: ${provincia}...`);

  // Leer el archivo Excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convertir a JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Procesar cada fila
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 2) continue;

    const col0 = String(row[0] || '').trim();
    const col1 = String(row[1] || '').trim();
    const col2 = row[2];

    // Total Inscriptos (electores)
    if (col0.includes('Total Inscriptos')) {
      totalElectores += typeof col1 === 'number' ? col1 : parseInt(col1) || 0;
      continue;
    }

    // TOTALES (votantes)
    if (col1.includes('TOTALES')) {
      totalVotantes += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
      continue;
    }

    // Votos en blanco
    if (col1.includes('BLANCO')) {
      votosBlanco += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
      continue;
    }

    // Votos nulos
    if (col1.includes('NULOS')) {
      votosNulos += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
      continue;
    }

    // Votos recurridos o impugnados
    if (col1.includes('RECURRIDO') || col1.includes('IMPUGNADO')) {
      votosRecurridos += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
      continue;
    }

    // Agrupaciones políticas (tienen número de lista en col0 y nombre en col1)
    const numeroLista = parseInt(col0);
    if (numeroLista && !isNaN(numeroLista) && col1.length > 2 && typeof col2 === 'number') {
      const nombre = col1;
      const votos = col2;

      if (!agrupaciones[nombre]) {
        agrupaciones[nombre] = 0;
      }
      agrupaciones[nombre] += votos;
    }
  }
}

// Si no encontramos votosPositivos, calcularlo de las agrupaciones
if (votosPositivos === 0) {
  votosPositivos = Object.values(agrupaciones).reduce((sum, v) => sum + v, 0);
}

// Si no encontramos totalVotantes, calcularlo
if (totalVotantes === 0) {
  totalVotantes = votosPositivos + votosBlanco + votosNulos + votosRecurridos;
}

// Convertir a array y ordenar por votos
const agrupacionesArray = Object.entries(agrupaciones)
  .map(([nombre, votos]) => ({
    nombre,
    votos,
    porcentaje: parseFloat(((votos / votosPositivos) * 100).toFixed(2)),
  }))
  .sort((a, b) => b.votos - a.votos)
  .map((ag, index) => ({ ...ag, posicion: index + 1 }));

// Calcular participación
const participacion =
  totalElectores > 0 ? parseFloat(((totalVotantes / totalElectores) * 100).toFixed(2)) : 0;

// Objeto final
const resultado = {
  year: 2021,
  date: '14 de noviembre 2021',
  category: 'Senadores Nacionales',
  total_electores: totalElectores,
  total_votantes: totalVotantes,
  mesas_totalizadas: 0, // No disponible en estos archivos
  participacion: participacion,
  total_votos_positivos: votosPositivos,
  total_votos: totalVotantes,
  votos_nulos: votosNulos,
  votos_blanco: votosBlanco,
  votos_otros: votosRecurridos,
  agrupaciones: agrupacionesArray,
};

// Guardar resultado
const outputPath = '../../senadores_2021_oficial.json';
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));

console.log('\n✅ Datos de Senadores 2021 procesados:');
console.log(`   Total electores: ${totalElectores.toLocaleString()}`);
console.log(`   Total votantes: ${totalVotantes.toLocaleString()}`);
console.log(`   Participación: ${participacion}%`);
console.log(`   Agrupaciones: ${agrupacionesArray.length}`);
console.log(`\n   Top 5:`);
agrupacionesArray.slice(0, 5).forEach((ag) => {
  console.log(`   ${ag.posicion}. ${ag.nombre}: ${ag.votos.toLocaleString()} (${ag.porcentaje}%)`);
});
console.log(`\n   Guardado en: ${outputPath}`);
