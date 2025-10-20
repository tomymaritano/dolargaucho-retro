require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function addPasswordResetTable() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('📦 Adding password_reset_tokens table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ Table created successfully!');

    console.log('📦 Creating indexes...');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token
      ON password_reset_tokens(token);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
      ON password_reset_tokens(expires_at);
    `);

    console.log('✅ Indexes created successfully!');
    console.log('');
    console.log('Verifying table...');

    const { rows } = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'password_reset_tokens'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Table structure:');
    rows.forEach((c) => console.log(`  - ${c.column_name}: ${c.data_type}`));
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addPasswordResetTable();
