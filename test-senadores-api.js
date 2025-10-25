/**
 * Test script para verificar datos de senadores
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/elecciones/historical',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const elections = JSON.parse(data);
      console.log('\n=== DATOS DE LA API ===\n');
      console.log(`Total elecciones: ${elections.length}\n`);

      const senadores = elections.filter((e) => e.category === 'Senadores Nacionales');
      const diputados = elections.filter((e) => e.category === 'Diputados Nacionales');

      console.log(`Diputados: ${diputados.length}`);
      console.log(`Senadores: ${senadores.length}\n`);

      console.log('=== SENADORES ===');
      senadores.forEach((s) => {
        console.log(`${s.year} - ${s.category} - ${s.agrupaciones.length} agrupaciones`);
        console.log(`  Top 3:`);
        s.agrupaciones.slice(0, 3).forEach((a, i) => {
          console.log(`    ${i + 1}. ${a.nombre}: ${a.porcentaje}%`);
        });
        console.log('');
      });

      console.log('\n=== TEST FILTRO ===');
      const categoryMap = {
        diputados: 'Diputados Nacionales',
        senadores: 'Senadores Nacionales',
      };

      const category = 'senadores';
      const categoryName = categoryMap[category];
      const filtered = elections.filter((e) => e.category === categoryName);
      console.log(`Categoría: ${category}`);
      console.log(`Nombre a filtrar: ${categoryName}`);
      console.log(`Resultados filtrados: ${filtered.length}`);
      console.log('');

      if (filtered.length === 0) {
        console.log('❌ ERROR: El filtro no devuelve resultados!');
        console.log('\nCategorías únicas en los datos:');
        const uniqueCategories = [...new Set(elections.map((e) => e.category))];
        uniqueCategories.forEach((cat) => {
          console.log(`  "${cat}"`);
        });
      } else {
        console.log('✅ El filtro funciona correctamente');
      }
    } catch (error) {
      console.error('Error parseando JSON:', error.message);
      console.log('Response:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.log('\n⚠️  Asegúrate de que el servidor esté corriendo en http://localhost:3000');
});

req.end();
