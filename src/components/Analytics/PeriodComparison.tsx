import { createSignal, createMemo } from 'solid-js';
import type { JSX } from 'solid-js';
import { Card } from '../UI';
import styles from './PeriodComparison.module.css';

function PeriodComparison(): JSX.Element {
  const [viewMode, setViewMode] = createSignal<'daily' | 'weekly'>('weekly');

  // Заглушка данных для сравнения периодов
  const getStubData = () => {
    if (viewMode() === 'daily') {
      return {
        today: {
          drivers_online: 8,
          completed_addresses: 45,
          avg_idle_minutes: 35,
          total_km: 120
        },
        yesterday: {
          drivers_online: 7,
          completed_addresses: 42,
          avg_idle_minutes: 38,
          total_km: 115
        }
      };
    } else {
      return {
        thisWeek: {
          drivers_online: 8,
          completed_addresses: 315,
          avg_idle_minutes: 32,
          total_km: 840
        },
        lastWeek: {
          drivers_online: 7,
          completed_addresses: 298,
          avg_idle_minutes: 36,
          total_km: 795
        }
      };
    }
  };

  const calculateChange = (today: number, yesterday: number) => {
    if (yesterday === 0) return today > 0 ? 100 : 0;
    return ((today - yesterday) / yesterday) * 100;
  };

  const getChangeClass = (change: number) => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return styles.neutral;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➡️';
  };

  const data = createMemo(() => {
    const result = getStubData();
    console.log('🔄 PeriodComparison data updated:', {
      viewMode: viewMode(),
      hasToday: !!result.today,
      hasThisWeek: !!result.thisWeek
    });
    return result;
  });

  // Safe data access with fallbacks
  const safeData = () => {
    const d = data();
    if (!d) return {
      today: { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      yesterday: { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      thisWeek: { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      lastWeek: { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 }
    };
    return {
      today: d.today || { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      yesterday: d.yesterday || { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      thisWeek: d.thisWeek || { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 },
      lastWeek: d.lastWeek || { drivers_online: 0, completed_addresses: 0, avg_idle_minutes: 0, total_km: 0 }
    };
  };

  return (
    <Card title="📊 Сравнение периодов" padding="large">
      <div class={styles.viewModeToggle}>
        <button 
          class={`${styles.toggleBtn} ${viewMode() === 'daily' ? styles.active : ''}`}
          onClick={() => setViewMode('daily')}
        >
          📅 День
        </button>
        <button 
          class={`${styles.toggleBtn} ${viewMode() === 'weekly' ? styles.active : ''}`}
          onClick={() => setViewMode('weekly')}
        >
          📊 Неделя
        </button>
      </div>
      
      <div class={styles.comparisonGrid}>
        <div class={styles.comparisonItem}>
          <h4>Водителей онлайн</h4>
          <div class={styles.comparisonValues}>
            <div class={styles.todayValue}>
              {viewMode() === 'daily' ? safeData().today.drivers_online : safeData().thisWeek.drivers_online}
            </div>
            <div class={styles.yesterdayValue}>
              {viewMode() === 'daily' ? safeData().yesterday.drivers_online : safeData().lastWeek.drivers_online}
            </div>
            <div class={`${styles.changeValue} ${getChangeClass(calculateChange(
              viewMode() === 'daily' ? safeData().today.drivers_online : safeData().thisWeek.drivers_online,
              viewMode() === 'daily' ? safeData().yesterday.drivers_online : safeData().lastWeek.drivers_online
            ))}`}>
              {getChangeIcon(calculateChange(
                viewMode() === 'daily' ? safeData().today.drivers_online : safeData().thisWeek.drivers_online,
                viewMode() === 'daily' ? safeData().yesterday.drivers_online : safeData().lastWeek.drivers_online
              ))} {Math.abs(calculateChange(
                viewMode() === 'daily' ? safeData().today.drivers_online : safeData().thisWeek.drivers_online,
                viewMode() === 'daily' ? safeData().yesterday.drivers_online : safeData().lastWeek.drivers_online
              )).toFixed(1)}%
            </div>
          </div>
        </div>

        <div class={styles.comparisonItem}>
          <h4>Закрыто адресов</h4>
          <div class={styles.comparisonValues}>
            <div class={styles.todayValue}>
              {viewMode() === 'daily' ? safeData().today.completed_addresses : safeData().thisWeek.completed_addresses}
            </div>
            <div class={styles.yesterdayValue}>
              {viewMode() === 'daily' ? safeData().yesterday.completed_addresses : safeData().lastWeek.completed_addresses}
            </div>
            <div class={`${styles.changeValue} ${getChangeClass(calculateChange(
              viewMode() === 'daily' ? safeData().today.completed_addresses : safeData().thisWeek.completed_addresses,
              viewMode() === 'daily' ? safeData().yesterday.completed_addresses : safeData().lastWeek.completed_addresses
            ))}`}>
              {getChangeIcon(calculateChange(
                viewMode() === 'daily' ? safeData().today.completed_addresses : safeData().thisWeek.completed_addresses,
                viewMode() === 'daily' ? safeData().yesterday.completed_addresses : safeData().lastWeek.completed_addresses
              ))} {Math.abs(calculateChange(
                viewMode() === 'daily' ? safeData().today.completed_addresses : safeData().thisWeek.completed_addresses,
                viewMode() === 'daily' ? safeData().yesterday.completed_addresses : safeData().lastWeek.completed_addresses
              )).toFixed(1)}%
            </div>
          </div>
        </div>

        <div class={styles.comparisonItem}>
          <h4>Средний простой</h4>
          <div class={styles.comparisonValues}>
            <div class={styles.todayValue}>
              {viewMode() === 'daily' ? safeData().today.avg_idle_minutes : safeData().thisWeek.avg_idle_minutes} мин
            </div>
            <div class={styles.yesterdayValue}>
              {viewMode() === 'daily' ? safeData().yesterday.avg_idle_minutes : safeData().lastWeek.avg_idle_minutes} мин
            </div>
            <div class={`${styles.changeValue} ${getChangeClass(calculateChange(
              viewMode() === 'daily' ? safeData().today.avg_idle_minutes : safeData().thisWeek.avg_idle_minutes,
              viewMode() === 'daily' ? safeData().yesterday.avg_idle_minutes : safeData().lastWeek.avg_idle_minutes
            ))}`}>
              {getChangeIcon(calculateChange(
                viewMode() === 'daily' ? safeData().today.avg_idle_minutes : safeData().thisWeek.avg_idle_minutes,
                viewMode() === 'daily' ? safeData().yesterday.avg_idle_minutes : safeData().lastWeek.avg_idle_minutes
              ))} {Math.abs(calculateChange(
                viewMode() === 'daily' ? safeData().today.avg_idle_minutes : safeData().thisWeek.avg_idle_minutes,
                viewMode() === 'daily' ? safeData().yesterday.avg_idle_minutes : safeData().lastWeek.avg_idle_minutes
              )).toFixed(1)}%
            </div>
          </div>
        </div>

        <div class={styles.comparisonItem}>
          <h4>Всего км</h4>
          <div class={styles.comparisonValues}>
            <div class={styles.todayValue}>
              {viewMode() === 'daily' ? safeData().today.total_km : safeData().thisWeek.total_km} км
            </div>
            <div class={styles.yesterdayValue}>
              {viewMode() === 'daily' ? safeData().yesterday.total_km : safeData().lastWeek.total_km} км
            </div>
            <div class={`${styles.changeValue} ${getChangeClass(calculateChange(
              viewMode() === 'daily' ? safeData().today.total_km : safeData().thisWeek.total_km,
              viewMode() === 'daily' ? safeData().yesterday.total_km : safeData().lastWeek.total_km
            ))}`}>
              {getChangeIcon(calculateChange(
                viewMode() === 'daily' ? safeData().today.total_km : safeData().thisWeek.total_km,
                viewMode() === 'daily' ? safeData().yesterday.total_km : safeData().lastWeek.total_km
              ))} {Math.abs(calculateChange(
                viewMode() === 'daily' ? safeData().today.total_km : safeData().thisWeek.total_km,
                viewMode() === 'daily' ? safeData().yesterday.total_km : safeData().lastWeek.total_km
              )).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}


export default PeriodComparison;
