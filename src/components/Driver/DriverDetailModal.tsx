import { createSignal, onMount, onCleanup } from 'solid-js';
import type { JSX } from 'solid-js';
import { Modal, Badge, Chart, Button } from '../UI';
import type { DriverWithStats } from '../../types/driver';
import styles from './DriverDetailModal.module.css';

interface DriverDetailModalProps {
  driver: DriverWithStats | null;
  isOpen: boolean;
  onClose: () => void;
}

function DriverDetailModal(props: DriverDetailModalProps): JSX.Element {
  // Debug props (commented out for production)
  // console.log('🔍 DriverDetailModal render check:', {
  //   hasDriver: !!props.driver,
  //   isOpen: props.isOpen,
  //   shouldRender: !!(props.driver && props.isOpen),
  //   driverName: props.driver?.first_name
  // });

  const [activeTab, setActiveTab] = createSignal<'overview' | 'stats' | 'routes'>('overview');

  // Закрытие по Escape
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.isOpen) {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  if (!props.driver || !props.isOpen) return <></>;

  const driver = props.driver;
  
  // Защита от undefined данных
  const safeStats = driver.todayStats || {
    deliveredStops: 0,
    totalStops: 0,
    idleTimeMinutes: 0,
    distanceKm: 0,
    fuelLiters: null,
    issuesCount: 0
  };

  const handleCall = () => {
    window.open(`tel:${driver.phone}`, '_self');
  };

  const handleMessage = () => {
    // TODO: Интеграция с мессенджером
    alert(`Отправка сообщения водителю ${driver.first_name} ${driver.last_name}`);
  };

  const handleShowOnMap = () => {
    // TODO: Показать водителя на карте
    alert(`Показать ${driver.first_name} на карте`);
  };

  return (
    <Modal open={props.isOpen} onClose={props.onClose} size="large">
      <div class={styles.modalContent}>
        {/* Close Button */}
        <button
          class={styles.closeButton}
          onClick={props.onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>
        
        {/* Header */}
        <div class={styles.header}>
          <div class={styles.driverInfo}>
            <div class={styles.avatar}>
              {driver.first_name?.charAt(0) || '?'}{driver.last_name?.charAt(0) || '?'}
            </div>
            <div class={styles.driverDetails}>
              <h2 class={styles.driverName}>
                {driver.first_name || 'Неизвестно'} {driver.last_name || 'Неизвестно'}
              </h2>
              <div class={styles.driverMeta}>
                <span class={styles.phone}>📞 {driver.phone}</span>
                <span class={styles.region}>🌍 {driver.region || 'Неизвестно'}</span>
                <span class={styles.hub}>🏢 {driver.hub_id || 'Неизвестно'}</span>
              </div>
              <div class={styles.statusRow}>
                <Badge status={driver.status} size="medium" />
                <span class={styles.lastSeen}>
                  Последний раз онлайн: {driver.lastSeen ? new Date(driver.lastSeen).toLocaleTimeString('ru-RU') : 'Неизвестно'}
                </span>
              </div>
            </div>
          </div>
          <div class={styles.actions}>
            <Button onClick={handleCall} variant="primary" size="small">
              📞 Позвонить
            </Button>
            <Button onClick={handleMessage} variant="ghost" size="small">
              💬 Написать
            </Button>
            <Button onClick={handleShowOnMap} variant="ghost" size="small">
              🗺️ На карте
            </Button>
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
            class={`${styles.tab} ${activeTab() === 'stats' ? styles.active : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📈 Статистика
          </button>
          <button 
            class={`${styles.tab} ${activeTab() === 'routes' ? styles.active : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            🗺️ Маршруты
          </button>
        </div>

        {/* Content */}
        <div class={styles.content}>
          {activeTab() === 'overview' && (
            <div class={styles.overviewTab}>
              <div class={styles.kpiGrid}>
                <div class={styles.kpiCard}>
                  <div class={styles.kpiIcon}>📦</div>
                  <div class={styles.kpiValue}>{safeStats.deliveredStops}</div>
                  <div class={styles.kpiLabel}>Доставлено</div>
                  <div class={styles.kpiSubtext}>из {safeStats.totalStops}</div>
                </div>
                <div class={styles.kpiCard}>
                  <div class={styles.kpiIcon}>⏱️</div>
                  <div class={styles.kpiValue}>{safeStats.idleTimeMinutes}</div>
                  <div class={styles.kpiLabel}>Простой (мин)</div>
                  <div class={styles.kpiSubtext}>
                    {safeStats.idleTimeMinutes > 60 ? '⚠️ Высокий' : '✅ Норма'}
                  </div>
                </div>
                <div class={styles.kpiCard}>
                  <div class={styles.kpiIcon}>🛣️</div>
                  <div class={styles.kpiValue}>{safeStats.distanceKm.toFixed(1)}</div>
                  <div class={styles.kpiLabel}>Пробег (км)</div>
                  <div class={styles.kpiSubtext}>Сегодня</div>
                </div>
                <div class={styles.kpiCard}>
                  <div class={styles.kpiIcon}>⚠️</div>
                  <div class={styles.kpiValue}>{safeStats.issuesCount}</div>
                  <div class={styles.kpiLabel}>Проблемы</div>
                  <div class={styles.kpiSubtext}>
                    {safeStats.issuesCount === 0 ? '✅ Нет' : '🔴 Есть'}
                  </div>
                </div>
              </div>

              <div class={styles.activityChart}>
                <h3>📊 Активность по часам</h3>
                <Chart 
                  type="line"
                  data={[2, 3, 5, 8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60]}
                  height={200}
                  color="#007AFF"
                  options={{
                    xAxis: {
                      data: Array.from({length: 24}, (_, i) => `${i}:00`)
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab() === 'stats' && (
            <div class={styles.statsTab}>
              <div class={styles.statsGrid}>
                <div class={styles.statCard}>
                  <h4>📊 За неделю</h4>
                  <div class={styles.statItem}>
                    <span>Всего адресов:</span>
                    <span>87</span>
                  </div>
                  <div class={styles.statItem}>
                    <span>Средний простой:</span>
                    <span>42 мин</span>
                  </div>
                  <div class={styles.statItem}>
                    <span>Общий пробег:</span>
                    <span>456 км</span>
                  </div>
                  <div class={styles.statItem}>
                    <span>Рейтинг:</span>
                    <span>⭐ 4.2/5</span>
                  </div>
                </div>

                <div class={styles.statCard}>
                  <h4>📈 Сравнение с командой</h4>
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
                </div>
              </div>

              <div class={styles.chartsGrid}>
                <div class={styles.chartCard}>
                  <h4>🛣️ Пробег по дням</h4>
                  <Chart 
                    type="bar"
                    data={[45, 52, 38, 67, 58, 43, 61]}
                    height={150}
                    color="#34C759"
                    options={{
                      xAxis: {
                        data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                      }
                    }}
                  />
                </div>
                <div class={styles.chartCard}>
                  <h4>⏱️ Простой по дням</h4>
                  <Chart 
                    type="line"
                    data={[35, 42, 28, 55, 38, 33, 45]}
                    height={150}
                    color="#FF9500"
                    options={{
                      xAxis: {
                        data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab() === 'routes' && (
            <div class={styles.routesTab}>
              <div class={styles.routesList}>
                <h3>Маршруты за сегодня</h3>
                <div class={styles.routeItem}>
                  <div class={styles.routeInfo}>
                    <div class={styles.routeName}>Маршрут #001</div>
                    <div class={styles.routeDetails}>
                      <span>🕐 08:00 - 12:30</span>
                      <span>📍 8/10 адресов</span>
                      <span>🛣️ 23.4 км</span>
                    </div>
                  </div>
                  <div class={styles.routeStatus}>
                    <Badge status="DELIVERED" size="small" />
                  </div>
                </div>
                <div class={styles.routeItem}>
                  <div class={styles.routeInfo}>
                    <div class={styles.routeName}>Маршрут #002</div>
                    <div class={styles.routeDetails}>
                      <span>🕐 13:00 - 17:45</span>
                      <span>📍 4/7 адресов</span>
                      <span>🛣️ 18.7 км</span>
                    </div>
                  </div>
                  <div class={styles.routeStatus}>
                    <Badge status="IN_PROGRESS" size="small" />
                  </div>
                </div>
              </div>

              <div class={styles.mapPreview}>
                <h3>Текущее местоположение</h3>
                <div class={styles.mapPlaceholder}>
                  🗺️ Карта с маршрутом водителя
                  <br />
                  <small>GPS: 40.1776, 44.5126</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DriverDetailModal;
