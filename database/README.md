# Database Setup Instructions

## Шаги для настройки базы данных в Supabase

### 1. Откройте Supabase SQL Editor

1. Перейдите в свой проект Supabase: https://supabase.com/dashboard
2. Выберите проект `logistic-admin`
3. В левом меню нажмите на **SQL Editor**

### 2. Выполните миграцию (создание таблиц)

1. Откройте файл `01_migration.sql` в этой папке
2. Скопируйте весь содержимое файла
3. Вставьте в SQL Editor в Supabase
4. Нажмите кнопку **Run** (или Ctrl+Enter)
5. Дождитесь сообщения "Success. No rows returned"

### 3. Загрузите тестовые данные

1. Откройте файл `02_seed.sql` в этой папке
2. Скопируйте весь содержимое файла
3. Вставьте в SQL Editor в Supabase (очистите предыдущий запрос)
4. Нажмите кнопку **Run**
5. Дождитесь успешного выполнения

### 4. Проверьте создание таблиц

В левом меню Supabase перейдите в **Table Editor** и убедитесь, что созданы следующие таблицы:

✅ regions (3 записи: AM, US, CN)  
✅ hubs (3 записи)  
✅ clients (8 записей)  
✅ vehicles (10 записей)  
✅ drivers (10 записей)  
✅ routes (4 записи на сегодня)  
✅ stops (>5 записей)  
✅ gps_tracks (4 записи)  
✅ events (пусто пока)  
✅ issues (2 записи)  
✅ alerts (2 записи)  

### 5. Включите Realtime (если не включено автоматически)

1. Перейдите в **Database → Replication**
2. Убедитесь, что для следующих таблиц включен Realtime:
   - drivers
   - routes
   - stops
   - gps_tracks
   - alerts

### 6. Создайте тестового пользователя (для входа в приложение)

Выполните в SQL Editor:

```sql
-- Создать тестового пользователя через Supabase Auth UI
-- Или используйте эту команду для создания через SQL:
```

Либо перейдите в **Authentication → Users → Add User** и создайте:
- Email: `admin@logistic.am`
- Password: `Admin123!`

## Troubleshooting

### Ошибка "policy already exists"

Если вы видите ошибку типа:
```
policy "Enable read for authenticated users" for table "regions" already exists
```

**Решение:**
1. Выполните скрипт `database/00_cleanup_policies.sql` в SQL Editor
2. Затем снова выполните `01_migration.sql`

**Причина:** Вы ранее запустили старую версию миграции с дублирующимися именами политик.

### Ошибка "relation already exists"

Если таблицы уже существуют, сначала удалите их:

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

Затем снова выполните `01_migration.sql` и `02_seed.sql`.

### Ошибка с RLS (Row Level Security)

Если возникают проблемы с доступом, временно отключите RLS для таблиц в разработке:

```sql
ALTER TABLE regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE hubs DISABLE ROW LEVEL SECURITY;
-- и т.д. для других таблиц
```

**Важно:** В production режиме RLS должен быть включен!

## Что дальше?

После успешного выполнения миграции и seed данных:

1. Вернитесь в корень проекта
2. Запустите dev сервер: `npm run dev`
3. Откройте браузер: http://localhost:5173
4. Войдите с созданным тестовым пользователем

Приложение должно загрузить данные из Supabase и отобразить их на dashboard.

