/**
 * Script para procesar CSV de senadores 2017
 */
const fs = require('fs');

const csvContent = fs.readFileSync('generales-2017definitivosndistrito (1).csv', 'utf-8');
const lines = csvContent.split('\n').filter((line) => line.trim());

// Skip header
const dataLines = lines.slice(1);

// Estructura para almacenar datos
const agrupaciones = {};
let totalElectores = 0;
let totalVotantes = 0;
let votosPositivos = 0;
let votosBlanco = 0;
let votosNulos = 0;
let votosRecurridos = 0;

// Procesar cada línea
for (const line of dataLines) {
  const parts = line.split(';');
  if (parts.length < 3) continue;

  const distrito = parts[0].trim();
  const concepto = parts[1].trim();
  const votos = parseInt(parts[2].trim().replace(/\./g, '').replace(/\s/g, '')) || 0;

  if (concepto === 'ELECTORES HABILES') {
    totalElectores += votos;
  } else if (concepto === 'TOTAL DE  VOTANTES' || concepto === 'TOTAL DE VOTANTES') {
    totalVotantes += votos;
  } else if (concepto === 'VOTOS POSITIVOS') {
    votosPositivos += votos;
  } else if (concepto === 'VOTOS EN BLANCO') {
    votosBlanco += votos;
  } else if (concepto === 'VOTOS ANULADOS') {
    votosNulos += votos;
  } else if (concepto === 'VOTOS RECURRIDOS E IMPUGNADOS') {
    votosRecurridos += votos;
  } else if (
    !concepto.includes('ELECTORES') &&
    !concepto.includes('VOTOS') &&
    !concepto.includes('TOTAL')
  ) {
    // Es una agrupación política
    if (!agrupaciones[concepto]) {
      agrupaciones[concepto] = 0;
    }
    agrupaciones[concepto] += votos;
  }
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
const participacion = parseFloat(((totalVotantes / totalElectores) * 100).toFixed(2));

// Objeto final
const resultado = {
  year: 2017,
  date: '22 de octubre 2017',
  category: 'Senadores Nacionales',
  total_electores: totalElectores,
  total_votantes: totalVotantes,
  mesas_totalizadas: 0, // No disponible en este CSV
  participacion: participacion,
  total_votos_positivos: votosPositivos,
  total_votos: totalVotantes,
  votos_nulos: votosNulos,
  votos_blanco: votosBlanco,
  votos_otros: votosRecurridos,
  agrupaciones: agrupacionesArray,
};

// Guardar resultado
const outputPath = '../../senadores_2017_oficial.json';
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));

console.log('✅ Datos de Senadores 2017 procesados:');
console.log(`   Total electores: ${totalElectores.toLocaleString()}`);
console.log(`   Total votantes: ${totalVotantes.toLocaleString()}`);
console.log(`   Participación: ${participacion}%`);
console.log(`   Agrupaciones: ${agrupacionesArray.length}`);
console.log(`\n   Top 3:`);
agrupacionesArray.slice(0, 3).forEach((ag) => {
  console.log(`   ${ag.posicion}. ${ag.nombre}: ${ag.votos.toLocaleString()} (${ag.porcentaje}%)`);
});
console.log(`\n   Guardado en: ${outputPath}`);
