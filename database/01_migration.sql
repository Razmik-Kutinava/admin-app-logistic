-- ================================================
-- Logistic Admin Panel - Database Migration
-- ================================================
-- Execute this script in Supabase SQL Editor
-- Make sure to enable Row Level Security (RLS) after creation

-- ===== 1. REFERENCE TABLES =====

-- Regions (AM/US/CN)
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) NOT NULL UNIQUE,
  name_ru VARCHAR(100) NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hubs (distribution centers)
CREATE TABLE IF NOT EXISTS hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  lat DECIMAL(10,8),
  lon DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  model VARCHAR(100),
  year INTEGER,
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  last_maintenance_km INTEGER DEFAULT 0,
  last_maintenance_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'DRIVING', 'IDLE', 'OFFLINE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. OPERATIONAL TABLES =====

-- Routes
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  total_stops INTEGER DEFAULT 0,
  completed_stops INTEGER DEFAULT 0,
  total_km DECIMAL(10,2) DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stops (delivery points)
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  seq INTEGER NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10,8),
  lon DECIMAL(11,8),
  planned_ts TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED', 'ISSUE')),
  arrived_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  idle_minutes INTEGER DEFAULT 0,
  epod_photo_url TEXT,
  epod_signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GPS Telemetry
CREATE TABLE IF NOT EXISTS gps_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  ts TIMESTAMPTZ NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lon DECIMAL(11,8) NOT NULL,
  speed DECIMAL(6,2),
  fuel_level DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Log
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES stops(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('START_DAY', 'END_DAY', 'START_STOP', 'END_STOP', 'ISSUE_CREATED', 'GPS_LOST', 'GPS_RESTORED', 'EPOD_UPLOADED')),
  ts TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issues (Problems)
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID REFERENCES stops(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('NO_SHOW', 'BAD_ADDRESS', 'TRAFFIC', 'ACCESS_DENIED', 'PARKING_ISSUE', 'CLIENT_DELAY', 'OTHER')),
  description TEXT,
  lat DECIMAL(10,8),
  lon DECIMAL(11,8),
  photo_url TEXT,
  ts TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('LONG_IDLE', 'TOO_MANY_ISSUES', 'MAINTENANCE_DUE', 'GPS_LOST', 'ROUTE_DELAYED')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 3. INDEXES =====

-- GPS tracks - for fast querying by driver and time
CREATE INDEX IF NOT EXISTS idx_gps_tracks_driver_ts ON gps_tracks(driver_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_gps_tracks_ts ON gps_tracks(ts DESC);
CREATE INDEX IF NOT EXISTS idx_gps_tracks_vehicle ON gps_tracks(vehicle_id, ts DESC);

-- Events - for timeline queries
CREATE INDEX IF NOT EXISTS idx_events_driver ON events(driver_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_route ON events(route_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts DESC);

-- Routes - for filtering
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(date DESC);
CREATE INDEX IF NOT EXISTS idx_routes_driver ON routes(driver_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status, date DESC);

-- Stops - for route queries
CREATE INDEX IF NOT EXISTS idx_stops_route ON stops(route_id, seq);
CREATE INDEX IF NOT EXISTS idx_stops_status ON stops(status, planned_ts);

-- Issues - for filtering
CREATE INDEX IF NOT EXISTS idx_issues_driver ON issues(driver_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(issue_type, ts DESC);
CREATE INDEX IF NOT EXISTS idx_issues_ts ON issues(ts DESC);

-- Alerts - for dashboard queries
CREATE INDEX IF NOT EXISTS idx_alerts_unack ON alerts(acknowledged, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_driver ON alerts(driver_id, acknowledged);

-- ===== 4. ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all tables
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (full access for now)
-- In production, you should create more granular policies

-- Drop existing policies if they exist (idempotent migration)
DROP POLICY IF EXISTS "regions_read_authenticated" ON regions;
DROP POLICY IF EXISTS "hubs_read_authenticated" ON hubs;
DROP POLICY IF EXISTS "clients_read_authenticated" ON clients;
DROP POLICY IF EXISTS "vehicles_read_authenticated" ON vehicles;
DROP POLICY IF EXISTS "drivers_all_authenticated" ON drivers;
DROP POLICY IF EXISTS "routes_all_authenticated" ON routes;
DROP POLICY IF EXISTS "stops_all_authenticated" ON stops;
DROP POLICY IF EXISTS "gps_tracks_all_authenticated" ON gps_tracks;
DROP POLICY IF EXISTS "events_all_authenticated" ON events;
DROP POLICY IF EXISTS "issues_all_authenticated" ON issues;
DROP POLICY IF EXISTS "alerts_all_authenticated" ON alerts;

-- Create policies with unique names per table
CREATE POLICY "regions_read_authenticated" ON regions FOR SELECT TO authenticated USING (true);
CREATE POLICY "hubs_read_authenticated" ON hubs FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_read_authenticated" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "vehicles_read_authenticated" ON vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "drivers_all_authenticated" ON drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "routes_all_authenticated" ON routes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "stops_all_authenticated" ON stops FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "gps_tracks_all_authenticated" ON gps_tracks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "events_all_authenticated" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "issues_all_authenticated" ON issues FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "alerts_all_authenticated" ON alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===== 5. ENABLE REALTIME =====

-- Enable Realtime for tables that need live updates
-- Note: If tables are already in publication, this will be skipped
DO $$
BEGIN
  -- Add tables to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'drivers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'routes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE routes;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'stops'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE stops;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'gps_tracks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE gps_tracks;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'alerts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
  END IF;
END $$;

