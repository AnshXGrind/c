-- Database Schema Initialization for AI Resume Intelligence System
-- Run this once to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analyses table to store resume analysis results
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Input data
    resume_text TEXT,
    job_description TEXT,
    
    -- Analysis results
    score INTEGER CHECK (score >= 0 AND score <= 100),
    sub_scores JSONB,
    
    -- Skills analysis
    present_skills JSONB,
    missing_skills JSONB,
    skill_match_percentage FLOAT,
    
    -- Roadmap
    learning_roadmap JSONB,
    
    -- Metadata
    user_id VARCHAR(255),
    analysis_duration_ms INTEGER
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_score ON analyses(score);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE
    ON analyses FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create users table for future authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Optional: Activity logs for tracking
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    action VARCHAR(255),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Enable Row Level Security (RLS) for future multi-tenant support
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on auth implementation)
-- For now, allow all operations (you can restrict this later)
CREATE POLICY "Enable all operations for analyses" ON analyses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for users" ON users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for activity_logs" ON activity_logs
    FOR ALL USING (true) WITH CHECK (true);
