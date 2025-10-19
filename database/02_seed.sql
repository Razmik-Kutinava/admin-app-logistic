-- ================================================
-- Logistic Admin Panel - Seed Data (Mock)
-- ================================================
-- Execute this script AFTER migration.sql
-- This will populate the database with test data

-- ===== 1. REGIONS =====

INSERT INTO regions (code, name_ru, timezone) VALUES
('AM', 'Армения', 'Asia/Yerevan'),
('US', 'США', 'America/New_York'),
('CN', 'Китай', 'Asia/Shanghai')
ON CONFLICT (code) DO NOTHING;

-- ===== 2. HUBS =====

INSERT INTO hubs (region_id, name, address, lat, lon) VALUES
((SELECT id FROM regions WHERE code = 'AM'), 'Ереван Центральный', 'ул. Абовяна 10, Ереван', 40.1776, 44.5126),
((SELECT id FROM regions WHERE code = 'US'), 'New York Hub', '123 Main St, New York, NY', 40.7128, -74.0060),
((SELECT id FROM regions WHERE code = 'CN'), 'Shanghai Hub', 'Nanjing Rd, Shanghai', 31.2304, 121.4737);

-- ===== 3. VEHICLES =====

INSERT INTO vehicles (plate_number, model, year, hub_id, last_maintenance_km) VALUES
('11АА111', 'Mercedes Sprinter', 2020, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 45000),
('22ББ222', 'Ford Transit', 2019, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 52000),
('33ВВ333', 'Peugeot Boxer', 2021, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 28000),
('44ГГ444', 'Mercedes Sprinter', 2020, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 38000),
('55ДД555', 'Iveco Daily', 2018, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 68000),
('66ЕЕ666', 'Ford Transit', 2021, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 15000),
('77ЖЖ777', 'Mercedes Sprinter', 2019, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 55000),
('88ЗЗ888', 'Peugeot Boxer', 2020, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 42000),
('99ИИ999', 'Iveco Daily', 2021, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 22000),
('00КК000', 'Ford Transit', 2020, (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 35000);

-- ===== 4. DRIVERS =====

INSERT INTO drivers (first_name, last_name, phone, hub_id, status) VALUES
('Арам', 'Петросян', '+374-91-123456', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'ONLINE'),
('Гарик', 'Саркисян', '+374-91-234567', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'DRIVING'),
('Ваге', 'Аветисян', '+374-91-345678', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'IDLE'),
('Давид', 'Мартиросян', '+374-91-456789', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'ONLINE'),
('Сурен', 'Григорян', '+374-91-567890', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'OFFLINE'),
('Тигран', 'Акопян', '+374-91-678901', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'DRIVING'),
('Армен', 'Овсепян', '+374-91-789012', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'ONLINE'),
('Левон', 'Варданян', '+374-91-890123', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'IDLE'),
('Карен', 'Мкртчян', '+374-91-901234', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'DRIVING'),
('Арсен', 'Асатрян', '+374-91-012345', (SELECT id FROM hubs WHERE name = 'Ереван Центральный'), 'ONLINE');

-- ===== 5. CLIENTS =====

INSERT INTO clients (name, region_id) VALUES
('Zara Armenia', (SELECT id FROM regions WHERE code = 'AM')),
('Yerevan Mall', (SELECT id FROM regions WHERE code = 'AM')),
('Dalma Garden', (SELECT id FROM regions WHERE code = 'AM')),
('Carrefour Armenia', (SELECT id FROM regions WHERE code = 'AM')),
('Rossia Mall', (SELECT id FROM regions WHERE code = 'AM')),
('Mega Mall', (SELECT id FROM regions WHERE code = 'AM')),
('Tashir Street', (SELECT id FROM regions WHERE code = 'AM')),
('Northern Avenue', (SELECT id FROM regions WHERE code = 'AM'));

-- ===== 6. ROUTES FOR TODAY =====

DO $$
DECLARE
  today DATE := CURRENT_DATE;
  route1_id UUID;
  route2_id UUID;
  route3_id UUID;
  route4_id UUID;
BEGIN
  -- Route 1: Арам Петросян (ONLINE)
  INSERT INTO routes (driver_id, vehicle_id, date, status, total_stops, completed_stops, total_km, started_at)
  VALUES (
    (SELECT id FROM drivers WHERE first_name = 'Арам'),
    (SELECT id FROM vehicles WHERE plate_number = '11АА111'),
    today,
    'IN_PROGRESS',
    15,
    8,
    45.5,
    today + TIME '08:00:00'
  )
  RETURNING id INTO route1_id;
  
  -- Route 2: Гарик Саркисян (DRIVING)
  INSERT INTO routes (driver_id, vehicle_id, date, status, total_stops, completed_stops, total_km, started_at)
  VALUES (
    (SELECT id FROM drivers WHERE first_name = 'Гарик'),
    (SELECT id FROM vehicles WHERE plate_number = '22ББ222'),
    today,
    'IN_PROGRESS',
    12,
    10,
    38.2,
    today + TIME '07:30:00'
  )
  RETURNING id INTO route2_id;
  
  -- Route 3: Тигран Акопян (DRIVING)
  INSERT INTO routes (driver_id, vehicle_id, date, status, total_stops, completed_stops, total_km, started_at)
  VALUES (
    (SELECT id FROM drivers WHERE first_name = 'Тигран'),
    (SELECT id FROM vehicles WHERE plate_number = '77ЖЖ777'),
    today,
    'IN_PROGRESS',
    18,
    5,
    28.7,
    today + TIME '09:00:00'
  )
  RETURNING id INTO route3_id;
  
  -- Route 4: Карен Мкртчян (DRIVING)
  INSERT INTO routes (driver_id, vehicle_id, date, status, total_stops, completed_stops, total_km, started_at)
  VALUES (
    (SELECT id FROM drivers WHERE first_name = 'Карен'),
    (SELECT id FROM vehicles WHERE plate_number = '88ЗЗ888'),
    today,
    'IN_PROGRESS',
    20,
    15,
    52.3,
    today + TIME '07:00:00'
  )
  RETURNING id INTO route4_id;
  
  -- Add stops for route 1 (sample stops)
  INSERT INTO stops (route_id, client_id, seq, address, lat, lon, planned_ts, status, completed_at, idle_minutes)
  VALUES
  (route1_id, (SELECT id FROM clients WHERE name = 'Zara Armenia'), 1, 'ул. Туманяна 23, Ереван', 40.1810, 44.5144, today + TIME '09:00:00', 'DELIVERED', today + TIME '09:15:00', 5),
  (route1_id, (SELECT id FROM clients WHERE name = 'Yerevan Mall'), 2, 'ул. Арами 51, Ереван', 40.1725, 44.5220, today + TIME '09:30:00', 'DELIVERED', today + TIME '09:50:00', 8),
  (route1_id, (SELECT id FROM clients WHERE name = 'Dalma Garden'), 3, 'пр. Тбилисян 67, Ереван', 40.1800, 44.5000, today + TIME '10:00:00', 'DELIVERED', today + TIME '10:20:00', 12),
  (route1_id, (SELECT id FROM clients WHERE name = 'Carrefour Armenia'), 4, 'ул. Рафаэля 23, Ереван', 40.1750, 44.5180, today + TIME '10:30:00', 'IN_PROGRESS', NULL, 0),
  (route1_id, (SELECT id FROM clients WHERE name = 'Rossia Mall'), 5, 'ул. Саят-Новы 1, Ереван', 40.1780, 44.5160, today + TIME '11:00:00', 'PLANNED', NULL, 0);
  
  -- Add some GPS tracks for active drivers
  INSERT INTO gps_tracks (driver_id, vehicle_id, ts, lat, lon, speed)
  VALUES
  ((SELECT id FROM drivers WHERE first_name = 'Арам'), (SELECT id FROM vehicles WHERE plate_number = '11АА111'), NOW() - INTERVAL '1 minute', 40.1750, 44.5180, 35.5),
  ((SELECT id FROM drivers WHERE first_name = 'Гарик'), (SELECT id FROM vehicles WHERE plate_number = '22ББ222'), NOW() - INTERVAL '2 minutes', 40.1820, 44.5100, 42.0),
  ((SELECT id FROM drivers WHERE first_name = 'Тигран'), (SELECT id FROM vehicles WHERE plate_number = '77ЖЖ777'), NOW() - INTERVAL '30 seconds', 40.1695, 44.5250, 28.5),
  ((SELECT id FROM drivers WHERE first_name = 'Карен'), (SELECT id FROM vehicles WHERE plate_number = '88ЗЗ888'), NOW() - INTERVAL '1 minute', 40.1880, 44.5050, 38.0);
  
  -- Add some issues
  INSERT INTO issues (stop_id, driver_id, issue_type, description, lat, lon, ts)
  VALUES
  ((SELECT id FROM stops WHERE route_id = route1_id AND seq = 3), (SELECT id FROM drivers WHERE first_name = 'Арам'), 'PARKING_ISSUE', 'Нет места для парковки', 40.1800, 44.5000, today + TIME '10:05:00'),
  ((SELECT id FROM stops WHERE route_id = route2_id AND seq = 1), (SELECT id FROM drivers WHERE first_name = 'Гарик'), 'TRAFFIC', 'Пробка на Тигранян Мец', 40.1830, 44.5090, today + TIME '08:30:00');
  
  -- Add some alerts
  INSERT INTO alerts (alert_type, severity, driver_id, message)
  VALUES
  ('LONG_IDLE', 'WARNING', (SELECT id FROM drivers WHERE first_name = 'Ваге'), 'Водитель Ваге Аветисян в простое более 65 минут'),
  ('TOO_MANY_ISSUES', 'INFO', (SELECT id FROM drivers WHERE first_name = 'Арам'), 'У водителя Арам Петросян 3 проблемы за последний час');
  
END $$;

-- Seed complete!

