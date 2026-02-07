-- BUILDSTREAM PRO: AUTH & ONBOARDING SCHEMA
-- Paste this into your Supabase SQL Editor and run it.

-- 1. CLEANUP
DROP TABLE IF EXISTS safety_reports CASCADE;
DROP TABLE IF EXISTS site_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TYPE IF EXISTS hazard_level CASCADE;
DROP TYPE IF EXISTS log_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 2. CREATE CUSTOM ENUMS
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'FOREMAN', 'SAFETY_OFFICER', 'SUPERVISOR', 'ENGINEER', 'MANAGER', 'EXECUTIVE');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'PENDING', 'REJECTED', 'SUSPENDED', 'DEACTIVATED');
CREATE TYPE log_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'FINALIZED');
CREATE TYPE hazard_level AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- 3. SITES TABLE
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    progress NUMERIC DEFAULT 0,
    budget NUMERIC DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Simulated for demo
    phone TEXT,
    role user_role NOT NULL DEFAULT 'FOREMAN',
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    status user_status NOT NULL DEFAULT 'PENDING',
    last_active TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SITE LOGS TABLE
CREATE TABLE site_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift TEXT CHECK (shift IN ('Day', 'Night')),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    block_name TEXT,
    foreman_name TEXT,
    status log_status NOT NULL DEFAULT 'SUBMITTED',
    workers_count INTEGER DEFAULT 0,
    work_completed TEXT,
    material_usage JSONB DEFAULT '[]'::jsonb, 
    equipment_usage JSONB DEFAULT '[]'::jsonb,
    incidents TEXT,
    photos TEXT[] DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT now(),
    engineer_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SAFETY REPORTS TABLE
CREATE TABLE safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    hazard_level hazard_level NOT NULL DEFAULT 'Low',
    ppe_compliance BOOLEAN DEFAULT true,
    observations TEXT,
    action_required TEXT,
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. INITIAL SEED (One default site for signup assignment)
INSERT INTO sites (name, location, progress, budget, spent) VALUES
('Default Construction Site', 'Regional Office', 0, 1000000, 0);

-- 8. ENABLE RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;

-- 9. POLICIES
CREATE POLICY "Public Read Access" ON sites FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_logs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON safety_reports FOR SELECT USING (true);

CREATE POLICY "Public Insert Access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Access" ON sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON users FOR UPDATE USING (true);
CREATE POLICY "Public Update Access" ON site_logs FOR UPDATE USING (true);