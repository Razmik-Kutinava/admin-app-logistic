-- ================================================
-- Logistic Admin Panel - Cleanup Data
-- ================================================
-- Execute this script to clear all data from tables
-- Use this before re-running seed script

-- Delete all data in correct order (respecting foreign keys)
DELETE FROM alerts;
DELETE FROM issues;
DELETE FROM gps_tracks;
DELETE FROM stops;
DELETE FROM routes;
DELETE FROM drivers;
DELETE FROM vehicles;
DELETE FROM clients;
DELETE FROM hubs;
DELETE FROM regions;

-- Cleanup complete!

