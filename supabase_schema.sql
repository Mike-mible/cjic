-- BUILDSTREAM PRO: FULL DATABASE SETUP SCRIPT
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
CREATE TYPE user_role AS ENUM ('ADMIN', 'FOREMAN', 'SAFETY_OFFICER', 'SUPERVISOR', 'ENGINEER', 'MANAGER', 'EXECUTIVE');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED', 'DEACTIVATED');
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
    phone TEXT,
    role user_role NOT NULL DEFAULT 'FOREMAN',
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    status user_status NOT NULL DEFAULT 'INVITED',
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

-- 7. SEED INITIAL DATA
INSERT INTO sites (id, name, location, progress, budget, spent) VALUES
('11111111-1111-1111-1111-111111111111', 'Skyline Towers', 'Downtown Metro', 65, 5000000, 3200000),
('22222222-2222-2222-2222-222222222222', 'Riverfront Plaza', 'East Bank', 32, 12000000, 4500000),
('33333333-3333-3333-3333-333333333333', 'Green Valley Villas', 'Suburban Hills', 88, 2500000, 2100000);

INSERT INTO users (name, email, role, site_id, status, last_active) VALUES
('James Miller', 'james.m@buildstream.com', 'ADMIN', '11111111-1111-1111-1111-111111111111', 'ACTIVE', '2 mins ago'),
('Michael Chen', 'm.chen@buildstream.com', 'FOREMAN', '11111111-1111-1111-1111-111111111111', 'ACTIVE', '1 hour ago'),
('Sarah Thompson', 's.thompson@buildstream.com', 'SAFETY_OFFICER', '22222222-2222-2222-2222-222222222222', 'ACTIVE', '3 hours ago');

-- 8. ENABLE RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;

-- 9. POLICIES (Simplified for Demo, usually check auth.uid())
CREATE POLICY "Public Read Access" ON sites FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_logs FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON safety_reports FOR SELECT USING (true);

CREATE POLICY "Public Insert Access" ON site_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Access" ON safety_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON site_logs FOR UPDATE USING (true);
CREATE POLICY "Public Update Access" ON users FOR UPDATE USING (true);