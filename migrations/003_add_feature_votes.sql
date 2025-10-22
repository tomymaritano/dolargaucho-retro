-- Migration: Add Feature Votes System
-- Created: 2025-01-21
-- Description: Enables users to vote for roadmap features

-- Create feature_votes table
CREATE TABLE IF NOT EXISTS feature_votes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key to users table
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  -- Prevent duplicate votes (one vote per user per feature)
  CONSTRAINT unique_user_feature_vote
    UNIQUE (user_id, feature_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_id ON feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user_id ON feature_votes(user_id);

-- Add comment for documentation
COMMENT ON TABLE feature_votes IS 'Stores user votes for roadmap features';
COMMENT ON COLUMN feature_votes.user_id IS 'References users.id';
COMMENT ON COLUMN feature_votes.feature_id IS 'Feature ID from roadmap constants';
