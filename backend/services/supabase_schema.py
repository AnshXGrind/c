"""
Supabase Database Schema Setup
Run this script to create necessary tables in your Supabase project
"""

SQL_SCHEMA = """
-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    resume_text TEXT,
    job_description TEXT,
    score FLOAT,
    sub_scores JSONB,
    skills JSONB,
    missing_skills JSONB,
    roadmap JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_id queries
CREATE INDEX idx_analyses_user_id ON analyses(user_id);

-- Create users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email
CREATE INDEX idx_users_email ON users(email);

-- Create activity log table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user activity queries
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own analyses
CREATE POLICY "Users can view own analyses"
    ON analyses
    FOR SELECT
    USING (user_id = current_user_id());

-- RLS Policy: Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
    ON analyses
    FOR INSERT
    WITH CHECK (user_id = current_user_id());
"""

if __name__ == "__main__":
    import os
    from supabase import create_client
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        print("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set!")
        print("Get these from: https://app.supabase.com")
        exit(1)
    
    client = create_client(url, key)
    
    try:
        # Execute schema
        result = client.rpc("execute_sql", {"sql": SQL_SCHEMA}).execute()
        print("✅ Database schema created successfully!")
        print("\nSchema includes:")
        print("  - analyses: Store resume analyses")
        print("  - users: User accounts (for future auth)")
        print("  - activity_logs: User activity tracking")
    except Exception as e:
        print(f"❌ Error creating schema: {e}")
        exit(1)
