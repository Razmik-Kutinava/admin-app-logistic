# 🔧 Исправление ошибки "policy already exists"

## ❌ Проблема

Вы видите ошибку:
```
policy "Enable read for authenticated users" for table "regions" already exists
```

## ✅ Решение (2 способа)

### Вариант 1: Быстрое исправление (РЕКОМЕНДУЕТСЯ)

1. Откройте **Supabase SQL Editor**
2. Скопируйте и выполните содержимое файла `00_cleanup_policies.sql`
3. Затем выполните `01_migration.sql` заново
4. Затем выполните `02_seed.sql`

### Вариант 2: Полная переустановка

1. Откройте **Supabase SQL Editor**
2. Удалите все таблицы:

```sql
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS gps_tracks CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS hubs CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
```

3. Выполните `01_migration.sql`
4. Выполните `02_seed.sql`

---

## 📝 Что было исправлено

✅ Уникальные имена для каждой политики (было: одинаковые имена)  
✅ Добавлен `DROP POLICY IF EXISTS` для идемпотентности  
✅ Теперь миграцию можно запускать несколько раз без ошибок  

---

## 🎯 После исправления

1. Создайте пользователя в **Supabase Authentication**:
   - Email: `admin@logistic.am`
   - Password: `Admin123!`

2. Войдите в приложение: http://localhost:5173

3. Наслаждайтесь работающей админкой! 🚀


