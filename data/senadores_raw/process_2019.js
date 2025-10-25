/**
 * Script para procesar XLSX de senadores 2019
 */
const fs = require('fs');
const XLSX = require('xlsx');

// Leer el archivo Excel
const workbook = XLSX.readFile('senadores_2019_definitivo.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convertir a JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('📊 Procesando datos de Senadores 2019...\n');

// Estructura para almacenar datos
const agrupaciones = {};
let totalElectores = 0;
let totalVotantes = 0;
let votosPositivos = 0;
let votosBlanco = 0;
let votosNulos = 0;
let votosRecurridos = 0;

// Procesar cada fila (saltar header si existe)
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length < 2) continue;

  const col0 = row[0];
  const col1 = String(row[1] || '').trim();
  const col2 = row[2];

  // ELECTORES HABILES
  if (col1.includes('ELECTORES') && col1.includes('HABIL')) {
    totalElectores += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // TOTAL DE VOTANTES
  if (col1.includes('TOTAL') && col1.includes('VOTANTES')) {
    totalVotantes += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // VOTOS POSITIVOS
  if (col1.includes('POSITIVOS')) {
    votosPositivos += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // VOTOS EN BLANCO
  if (col1.includes('BLANCO')) {
    votosBlanco += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // VOTOS ANULADOS
  if (col1.includes('ANULADO') || col1.includes('NULO')) {
    votosNulos += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // VOTOS RECURRIDOS
  if (col1.includes('RECURRIDO') || col1.includes('IMPUGNADO')) {
    votosRecurridos += typeof col2 === 'number' ? col2 : parseInt(col2) || 0;
    continue;
  }

  // Agrupaciones políticas: solo si col0 es un número (lista)
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
  year: 2019,
  date: '27 de octubre 2019',
  category: 'Senadores Nacionales',
  total_electores: totalElectores,
  total_votantes: totalVotantes,
  mesas_totalizadas: 0, // No disponible en este archivo
  participacion: participacion,
  total_votos_positivos: votosPositivos,
  total_votos: totalVotantes,
  votos_nulos: votosNulos,
  votos_blanco: votosBlanco,
  votos_otros: votosRecurridos,
  agrupaciones: agrupacionesArray,
};

// Guardar resultado
const outputPath = '../../senadores_2019_oficial.json';
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));

console.log('✅ Datos de Senadores 2019 procesados:');
console.log(`   Total electores: ${totalElectores.toLocaleString()}`);
console.log(`   Total votantes: ${totalVotantes.toLocaleString()}`);
console.log(`   Participación: ${participacion}%`);
console.log(`   Agrupaciones: ${agrupacionesArray.length}`);
console.log(`\n   Top 3:`);
agrupacionesArray.slice(0, 3).forEach((ag) => {
  console.log(`   ${ag.posicion}. ${ag.nombre}: ${ag.votos.toLocaleString()} (${ag.porcentaje}%)`);
});
console.log(`\n   Guardado en: ${outputPath}`);
