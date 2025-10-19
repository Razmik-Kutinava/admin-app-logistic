-- ================================================
-- Cleanup Script - Remove Old Policies
-- ================================================
-- Execute this ONLY IF you already ran the migration
-- and got the "policy already exists" error
-- This will remove old policies with duplicate names

-- Remove old policies (with duplicate names)
DROP POLICY IF EXISTS "Enable read for authenticated users" ON regions;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON hubs;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON routes;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON stops;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON gps_tracks;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON events;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON issues;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON alerts;

-- Now you can safely run 01_migration.sql again!

