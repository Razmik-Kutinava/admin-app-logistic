import { onMount, createSignal, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { Card, Badge, Chart, Button, Table } from '../components/UI';
import { MapView } from '../components/Map';
import { driversStore } from '../stores';
import type { DriverWithStats } from '../types/driver';
import styles from './DriverPage.module.css';

function DriverPage(): JSX.Element {
  const params = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = createSignal<DriverWithStats | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal<'overview' | 'analytics' | 'routes' | 'history'>('overview');
  const [timeRange, setTimeRange] = createSignal<'today' | 'week' | 'month'>('today');

  onMount(() => {
    loadDriverData();
  });

  createEffect(() => {
    if (driversStore.drivers().length > 0) {
      loadDriverData();
    }
  });

  const loadDriverData = () => {
    const driverId = params.id;
    if (!driverId) {
      navigate('/dashboard');
      return;
    }

    const foundDriver = driversStore.getDriverById(driverId);
    if (foundDriver) {
      setDriver(foundDriver);
    } else {
      // Если водитель не найден, перенаправляем на дашборд
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleCall = () => {
    if (driver()) {
      window.open(`tel:${driver()!.phone}`, '_self');
    }
  };

  const handleMessage = () => {
    if (driver()) {
      alert(`Отправка сообщения водителю ${driver()!.first_name} ${driver()!.last_name}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading()) {
    return (
      <div class={styles.container}>
        <div class={styles.loading}>
          <div class={styles.spinner}></div>
          <p>Загрузка данных водителя...</p>
        </div>
      </div>
    );
  }

  if (!driver()) {
    return (
      <div class={styles.container}>
        <div class={styles.error}>
          <h2>Водитель не найден</h2>
          <p>Проверьте правильность ссылки</p>
          <Button onClick={handleBackToDashboard} variant="primary">
            ← Вернуться к дашборду
          </Button>
        </div>
      </div>
    );
  }

  const currentDriver = driver()!;
  
  // Защита от undefined данных
  const safeStats = currentDriver.todayStats || {
    deliveredStops: 0,
    totalStops: 0,
    idleTimeMinutes: 0,
    distanceKm: 0,
    fuelLiters: null,
    issuesCount: 0
  };

  return (
    <div class={styles.container}>
      {/* Header */}
      <div class={styles.header}>
        <div class={styles.headerContent}>
          <Button onClick={handleBackToDashboard} variant="ghost" size="small">
            ← Назад к дашборду
          </Button>
          <div class={styles.driverHeader}>
            <div class={styles.avatar}>
              {currentDriver.first_name.charAt(0)}{currentDriver.last_name.charAt(0)}
            </div>
            <div class={styles.driverInfo}>
              <h1 class={styles.driverName}>
                {currentDriver.first_name} {currentDriver.last_name}
              </h1>
              <div class={styles.driverMeta}>
                <span class={styles.phone}>📞 {currentDriver.phone}</span>
                <span class={styles.region}>🌍 {currentDriver.region}</span>
                <span class={styles.hub}>🏢 {currentDriver.hub_id}</span>
              </div>
              <div class={styles.statusRow}>
                <Badge status={currentDriver.status} size="large" />
                <span class={styles.lastSeen}>
                  Последний раз онлайн: {currentDriver.lastSeen ? new Date(currentDriver.lastSeen).toLocaleTimeString('ru-RU') : 'Неизвестно'}
                </span>
              </div>
            </div>
          </div>
          <div class={styles.headerActions}>
            <Button onClick={handleCall} variant="primary">
              📞 Позвонить
            </Button>
            <Button onClick={handleMessage} variant="ghost">
              💬 Написать
            </Button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div class={styles.timeRangeSelector}>
        <div class={styles.timeRangeButtons}>
          <button 
            class={`${styles.timeRangeBtn} ${timeRange() === 'today' ? styles.active : ''}`}
            onClick={() => setTimeRange('today')}
          >
            📅 Сегодня
          </button>
          <button 
            class={`${styles.timeRangeBtn} ${timeRange() === 'week' ? styles.active : ''}`}
            onClick={() => setTimeRange('week')}
          >
            📊 Неделя
          </button>
          <button 
            class={`${styles.timeRangeBtn} ${timeRange() === 'month' ? styles.active : ''}`}
            onClick={() => setTimeRange('month')}
          >
            📈 Месяц
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div class={styles.tabs}>
        <button 
          class={`${styles.tab} ${activeTab() === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Обзор
        </button>
        <button 
          class={`${styles.tab} ${activeTab() === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Аналитика
        </button>
        <button 
          class={`${styles.tab} ${activeTab() === 'routes' ? styles.active : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          🗺️ Маршруты
        </button>
        <button 
          class={`${styles.tab} ${activeTab() === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 История
        </button>
      </div>

      {/* Content */}
      <div class={styles.content}>
        {activeTab() === 'overview' && (
          <div class={styles.overviewTab}>
            <div class={styles.kpiGrid}>
              <Card title="📦 Доставки" padding="large">
                <div class={styles.kpiValue}>{safeStats.deliveredStops}</div>
                <div class={styles.kpiLabel}>из {safeStats.totalStops} адресов</div>
                <div class={styles.kpiProgress}>
                  <div 
                    class={styles.progressBar}
                    style={{ width: `${safeStats.totalStops > 0 ? (safeStats.deliveredStops / safeStats.totalStops) * 100 : 0}%` }}
                  ></div>
                </div>
              </Card>

              <Card title="⏱️ Простой" padding="large">
                <div class={styles.kpiValue}>{safeStats.idleTimeMinutes}</div>
                <div class={styles.kpiLabel}>минут</div>
                <div class={styles.kpiStatus}>
                  {safeStats.idleTimeMinutes > 60 ? '⚠️ Высокий' : '✅ Норма'}
                </div>
              </Card>

              <Card title="🛣️ Пробег" padding="large">
                <div class={styles.kpiValue}>{safeStats.distanceKm.toFixed(1)}</div>
                <div class={styles.kpiLabel}>километров</div>
                <div class={styles.kpiSubtext}>Сегодня</div>
              </Card>

              <Card title="⚠️ Проблемы" padding="large">
                <div class={styles.kpiValue}>{safeStats.issuesCount}</div>
                <div class={styles.kpiLabel}>инцидентов</div>
                <div class={styles.kpiStatus}>
                  {safeStats.issuesCount === 0 ? '✅ Нет' : '🔴 Есть'}
                </div>
              </Card>
            </div>

            <div class={styles.chartsGrid}>
              <Card title="📈 Активность по часам" padding="large">
                <Chart 
                  type="line"
                  data={[2, 3, 5, 8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60]}
                  height={250}
                  color="#007AFF"
                  options={{
                    xAxis: {
                      data: Array.from({length: 24}, (_, i) => `${i}:00`)
                    }
                  }}
                />
              </Card>

              <Card title="📊 Статусы доставок" padding="large">
                <Chart 
                  type="pie"
                  data={[
                    { name: 'Доставлено', value: safeStats.deliveredStops, color: '#34C759' },
                    { name: 'В пути', value: safeStats.totalStops - safeStats.deliveredStops, color: '#007AFF' },
                    { name: 'Проблемы', value: safeStats.issuesCount, color: '#FF3B30' }
                  ]}
                  height={250}
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab() === 'analytics' && (
          <div class={styles.analyticsTab}>
            <div class={styles.analyticsGrid}>
              <Card title="📊 Сравнение с командой" padding="large">
                <div class={styles.comparisonList}>
                  <div class={styles.comparisonItem}>
                    <span>Адресов в день:</span>
                    <span class={styles.better}>+12%</span>
                  </div>
                  <div class={styles.comparisonItem}>
                    <span>Простой:</span>
                    <span class={styles.worse}>+8%</span>
                  </div>
                  <div class={styles.comparisonItem}>
                    <span>Пробег:</span>
                    <span class={styles.neutral}>-2%</span>
                  </div>
                  <div class={styles.comparisonItem}>
                    <span>Проблемы:</span>
                    <span class={styles.better}>-15%</span>
                  </div>
                  <div class={styles.comparisonItem}>
                    <span>Рейтинг:</span>
                    <span class={styles.rating}>⭐ 4.2/5</span>
                  </div>
                </div>
              </Card>

              <Card title="📈 Тренды за неделю" padding="large">
                <Chart 
                  type="bar"
                  data={[45, 52, 38, 67, 58, 43, 61]}
                  height={200}
                  color="#34C759"
                  options={{
                    xAxis: {
                      data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                    }
                  }}
                />
              </Card>
            </div>

            <div class={styles.detailedCharts}>
              <Card title="🛣️ Пробег по дням" padding="large">
                <Chart 
                  type="area"
                  data={[45, 52, 38, 67, 58, 43, 61, 55, 48, 72, 65, 58, 69]}
                  height={200}
                  color="#FF9500"
                />
              </Card>

              <Card title="⏱️ Простой по дням" padding="large">
                <Chart 
                  type="line"
                  data={[35, 42, 28, 55, 38, 33, 45, 40, 35, 48, 42, 38, 44]}
                  height={200}
                  color="#FF3B30"
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab() === 'routes' && (
          <div class={styles.routesTab}>
            <div class={styles.mapSection}>
              <Card title="🗺️ Текущий маршрут" padding="large">
                <MapView 
                  drivers={[currentDriver]}
                  showTracks={true}
                  showClusters={false}
                />
              </Card>
            </div>

            <div class={styles.routesList}>
              <Card title="📋 Маршруты за период" padding="large">
                <Table
                  columns={[
                    { key: 'route', header: 'Маршрут', width: '20%' },
                    { key: 'time', header: 'Время', width: '20%' },
                    { key: 'addresses', header: 'Адреса', width: '15%' },
                    { key: 'distance', header: 'Км', width: '10%' },
                    { key: 'status', header: 'Статус', width: '15%' },
                    { key: 'actions', header: 'Действия', width: '20%' }
                  ]}
                  data={[
                    {
                      route: 'Маршрут #001',
                      time: '08:00 - 12:30',
                      addresses: '8/10',
                      distance: '23.4',
                      status: () => <Badge status="DELIVERED" size="small" />,
                      actions: () => (
                        <div class={styles.routeActions}>
                          <button class={styles.actionBtn} title="Детали">👁️</button>
                          <button class={styles.actionBtn} title="На карте">🗺️</button>
                        </div>
                      )
                    },
                    {
                      route: 'Маршрут #002',
                      time: '13:00 - 17:45',
                      addresses: '4/7',
                      distance: '18.7',
                      status: () => <Badge status="IN_PROGRESS" size="small" />,
                      actions: () => (
                        <div class={styles.routeActions}>
                          <button class={styles.actionBtn} title="Детали">👁️</button>
                          <button class={styles.actionBtn} title="На карте">🗺️</button>
                        </div>
                      )
                    }
                  ]}
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab() === 'history' && (
          <div class={styles.historyTab}>
            <Card title="📋 История событий" padding="large">
              <div class={styles.eventsList}>
                <div class={styles.eventItem}>
                  <div class={styles.eventTime}>14:30</div>
                  <div class={styles.eventIcon}>✅</div>
                  <div class={styles.eventContent}>
                    <div class={styles.eventTitle}>Доставка завершена</div>
                    <div class={styles.eventDetails}>Адрес: ул. Абовяна, 15</div>
                  </div>
                </div>
                <div class={styles.eventItem}>
                  <div class={styles.eventTime}>14:15</div>
                  <div class={styles.eventIcon}>🚗</div>
                  <div class={styles.eventContent}>
                    <div class={styles.eventTitle}>Выезд к следующему адресу</div>
                    <div class={styles.eventDetails}>Расстояние: 2.3 км</div>
                  </div>
                </div>
                <div class={styles.eventItem}>
                  <div class={styles.eventTime}>13:45</div>
                  <div class={styles.eventIcon}>⚠️</div>
                  <div class={styles.eventContent}>
                    <div class={styles.eventTitle}>Проблема с доставкой</div>
                    <div class={styles.eventDetails}>Клиент не отвечает на звонки</div>
                  </div>
                </div>
                <div class={styles.eventItem}>
                  <div class={styles.eventTime}>13:30</div>
                  <div class={styles.eventIcon}>📞</div>
                  <div class={styles.eventContent}>
                    <div class={styles.eventTitle}>Звонок клиенту</div>
                    <div class={styles.eventDetails}>Попытка связаться с получателем</div>
                  </div>
                </div>
                <div class={styles.eventItem}>
                  <div class={styles.eventTime}>13:20</div>
                  <div class={styles.eventIcon}>📍</div>
                  <div class={styles.eventContent}>
                    <div class={styles.eventTitle}>Прибытие на адрес</div>
                    <div class={styles.eventDetails}>ул. Туманяна, 42</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverPage;
