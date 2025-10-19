import type { JSX } from 'solid-js';
import { DriverStatus } from '../../types/driver';
import { StopStatus, RouteStatus } from '../../types/route';
import { AlertSeverity } from '../../types/alert';
import styles from './Badge.module.css';

interface BadgeProps {
  status: DriverStatus | StopStatus | RouteStatus | AlertSeverity | string;
  label?: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
}

function Badge(props: BadgeProps): JSX.Element {
  const getStatusConfig = () => {
    const status = props.status;
    
    // Driver statuses
    if (status === DriverStatus.ONLINE) {
      return { icon: '🟢', color: 'green', label: props.label || 'Онлайн' };
    }
    if (status === DriverStatus.DRIVING) {
      return { icon: '🔵', color: 'blue', label: props.label || 'В пути' };
    }
    if (status === DriverStatus.IDLE) {
      return { icon: '🟡', color: 'orange', label: props.label || 'Простой' };
    }
    if (status === DriverStatus.OFFLINE) {
      return { icon: '⚫', color: 'gray', label: props.label || 'Офлайн' };
    }
    
    // Stop/Route statuses
    if (status === StopStatus.PLANNED || status === RouteStatus.PLANNED) {
      return { icon: '⏳', color: 'gray', label: props.label || 'Запланировано' };
    }
    if (status === StopStatus.IN_PROGRESS || status === RouteStatus.IN_PROGRESS) {
      return { icon: '🔵', color: 'blue', label: props.label || 'В процессе' };
    }
    if (status === StopStatus.DELIVERED || status === RouteStatus.COMPLETED) {
      return { icon: '✅', color: 'green', label: props.label || 'Выполнено' };
    }
    if (status === StopStatus.CANCELLED || status === RouteStatus.CANCELLED) {
      return { icon: '❌', color: 'gray', label: props.label || 'Отменено' };
    }
    if (status === StopStatus.ISSUE) {
      return { icon: '⚠️', color: 'red', label: props.label || 'Проблема' };
    }
    
    // Alert severities
    if (status === AlertSeverity.INFO) {
      return { icon: 'ℹ️', color: 'blue', label: props.label || 'Информация' };
    }
    if (status === AlertSeverity.WARNING) {
      return { icon: '⚠️', color: 'orange', label: props.label || 'Предупреждение' };
    }
    if (status === AlertSeverity.CRITICAL) {
      return { icon: '🔴', color: 'red', label: props.label || 'Критично' };
    }
    
    // Default
    return { icon: '●', color: 'gray', label: props.label || status };
  };

  const config = getStatusConfig();
  
  const sizeClass = () => {
    switch (props.size || 'medium') {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  return (
    <span class={`${styles.badge} ${styles[config.color]} ${sizeClass()}`}>
      {(props.showIcon !== false) && <span class={styles.icon}>{config.icon}</span>}
      <span class={styles.label}>{config.label}</span>
    </span>
  );
}

export default Badge;

