-- ============================================================================
-- Dólar Gaucho - Database Schema
-- Custom Authentication System with PostgreSQL
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  nickname VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on nickname for fast lookups and uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname_unique ON users(nickname) WHERE nickname IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- ============================================================================
-- USER PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(10) DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  currency VARCHAR(3) DEFAULT 'ARS',
  notifications_enabled BOOLEAN DEFAULT true,
  favorite_dolares TEXT[] DEFAULT '{"blue", "oficial"}',
  favorite_currencies TEXT[] DEFAULT '{"USD", "EUR"}',
  favorite_cryptos TEXT[] DEFAULT '{}',
  favorite_charts TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on token for fast lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp on users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at timestamp on user_preferences table
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user preferences when a new user is created
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_preferences();

-- ============================================================================
-- SEED DATA (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Uncomment to create a test user (password: "test1234")
-- INSERT INTO users (email, password_hash, name)
-- VALUES (
--   'test@dolargaucho.com',
--   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYDq1Y5gZru',
--   'Test User'
-- )
-- ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- MIGRATION: Add favorite_cryptos and favorite_charts (v1.2.0)
-- ============================================================================

-- Run this migration if you have existing user_preferences table without these columns:
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS favorite_cryptos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS favorite_charts TEXT[] DEFAULT '{}';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these after schema creation to verify:
-- SELECT * FROM users;
-- SELECT * FROM user_preferences;
-- SELECT * FROM leads;

-- Check table structure:
-- \d users
-- \d user_preferences
-- \d leads
