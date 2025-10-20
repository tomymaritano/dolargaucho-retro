require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('📦 Reading schema.sql...');
    const schema = fs.readFileSync('./schema.sql', 'utf-8');

    console.log('🚀 Running migration...');
    await pool.query(schema);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Verifying tables...');

    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tables created:');
    tables.forEach((t) => console.log('  -', t.table_name));
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
