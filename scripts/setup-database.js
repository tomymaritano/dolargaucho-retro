/**
 * Database Setup Script
 * Ejecuta el schema SQL automáticamente en Neon
 */

const { readFileSync } = require('fs');
const { join } = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🔧 Setting up database...\n');

  // Verificar que POSTGRES_URL existe
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL no está configurado en .env.local');
    console.error('   Agrega la connection string de Neon a .env.local');
    process.exit(1);
  }

  console.log('✅ POSTGRES_URL encontrado');
  console.log(`   Host: ${connectionString.split('@')[1]?.split('/')[0] || 'unknown'}\n`);

  // Importar el cliente SQL
  let sql;
  try {
    const { sql: pgSql } = await import('@vercel/postgres');
    sql = pgSql;
  } catch (error) {
    console.error('❌ Error: No se pudo importar @vercel/postgres');
    console.error('   Ejecuta: npm install @vercel/postgres');
    process.exit(1);
  }

  try {
    // Probar conexión
    console.log('🔌 Probando conexión...');
    await sql`SELECT 1 as test`;
    console.log('✅ Conexión exitosa\n');

    // Leer schema SQL
    console.log('📄 Leyendo schema.sql...');
    const schemaPath = join(__dirname, '..', 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');
    console.log('✅ Schema cargado\n');

    // Ejecutar schema completo de una vez
    console.log('⚙️  Ejecutando schema SQL...');
    console.log('   (Esto puede tomar unos segundos)\n');

    try {
      // Ejecutar todo el schema de una vez
      await sql.query(schemaSQL);
      console.log('✅ Schema ejecutado exitosamente\n');
    } catch (error) {
      // Si falla, puede ser porque ya existe
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Algunos elementos ya existían (esto es normal)\n');
      } else {
        console.error('⚠️  Error ejecutando schema:', error.message);
        console.log('\nIntentando ejecutar de forma manual...\n');

        // Intentar manualmente statement por statement
        const cleanedSQL = schemaSQL.replace(/--.*$/gm, '').trim();
        await sql.query(cleanedSQL);
      }
    }

    // Verificar tablas
    console.log('\n🔍 Verificando tablas...');
    const { rows } = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('\n📊 Tablas en la base de datos:');
    rows.forEach((row) => {
      console.log(`   ✅ ${row.table_name}`);
    });

    // Verificar que están todas las tablas necesarias
    const requiredTables = ['users', 'user_preferences', 'leads'];
    const existingTables = rows.map((r) => r.table_name);
    const missingTables = requiredTables.filter((t) => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('\n⚠️  Faltan tablas:');
      missingTables.forEach((table) => {
        console.log(`   ❌ ${table}`);
      });
      process.exit(1);
    }

    console.log('\n✨ ¡Database setup completado con éxito!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Reinicia el dev server: npm run dev');
    console.log('   2. Ve a: http://localhost:3000/register');
    console.log('   3. Crea una cuenta de prueba');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Error durante el setup:');
    console.error(error.message);
    console.error('\nDetalles completos:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
setupDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
