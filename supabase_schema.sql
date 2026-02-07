
-- 1. Create Enums for type safety
CREATE TYPE user_role AS ENUM ('ADMIN', 'FOREMAN', 'SAFETY_OFFICER', 'SUPERVISOR', 'ENGINEER', 'MANAGER', 'EXECUTIVE');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED', 'DEACTIVATED');
CREATE TYPE log_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'FINALIZED');
CREATE TYPE hazard_level AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- 2. Create Sites table
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    progress NUMERIC DEFAULT 0,
    budget NUMERIC DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'FOREMAN',
    site_id UUID REFERENCES sites(id),
    status user_status NOT NULL DEFAULT 'INVITED',
    last_active TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Site Logs table
CREATE TABLE IF NOT EXISTS site_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift TEXT CHECK (shift IN ('Day', 'Night')),
    site_id UUID REFERENCES sites(id) NOT NULL,
    block_name TEXT,
    foreman_name TEXT,
    status log_status NOT NULL DEFAULT 'SUBMITTED',
    workers_count INTEGER DEFAULT 0,
    work_completed TEXT,
    material_usage JSONB DEFAULT '[]'::jsonb, -- Stores array of {item, quantity, unit}
    equipment_usage JSONB DEFAULT '[]'::jsonb, -- Stores array of {item, hours}
    incidents TEXT,
    photos TEXT[] DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT now(),
    engineer_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Safety Reports table
CREATE TABLE IF NOT EXISTS safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    site_id UUID REFERENCES sites(id) NOT NULL,
    hazard_level hazard_level NOT NULL DEFAULT 'Low',
    ppe_compliance BOOLEAN DEFAULT true,
    observations TEXT,
    action_required TEXT,
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Basic RLS (Row Level Security) - For demo purposes allowing public access
-- In a production app, you would restrict this to authenticated users
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON sites FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON safety_reports FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON site_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON safety_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON site_logs FOR UPDATE USING (true);
