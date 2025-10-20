import { createSignal, onMount, onCleanup } from 'solid-js';
import { Modal, Badge, Button } from '../UI';
import type { AlertWithDetails, AlertType, AlertSeverity } from '../../types/alert';
import styles from './AlertDetailModal.module.css';

interface AlertDetailModalProps {
  alert: AlertWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
}

function AlertDetailModal(props: AlertDetailModalProps): JSX.Element {
  const [isAcknowledging, setIsAcknowledging] = createSignal(false);

  // Закрытие по Escape
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  if (!props.alert || !props.isOpen) {
    return <></>;
  }

  const alert = props.alert;

  // Получение иконки по типу алерта
  const getAlertIcon = (type: AlertType): string => {
    switch (type) {
      case 'LONG_IDLE':
        return '⏰';
      case 'TOO_MANY_ISSUES':
        return '⚠️';
      case 'MAINTENANCE_DUE':
        return '🔧';
      case 'GPS_LOST':
        return '📡';
      case 'ROUTE_DELAYED':
        return '🚗';
      default:
        return '🔔';
    }
  };

  // Получение описания по типу алерта
  const getAlertDescription = (type: AlertType): string => {
    switch (type) {
      case 'LONG_IDLE':
        return 'Водитель находится в простое дольше установленного времени. Рекомендуется связаться с водителем для выяснения причин.';
      case 'TOO_MANY_ISSUES':
        return 'У водителя накопилось много проблем за короткий период. Необходимо провести анализ и принять меры.';
      case 'MAINTENANCE_DUE':
        return 'Транспортное средство требует технического обслуживания. Запланируйте ТО в ближайшее время.';
      case 'GPS_LOST':
        return 'Потеряна связь с GPS-трекером. Проверьте состояние устройства и связь с водителем.';
      case 'ROUTE_DELAYED':
        return 'Маршрут выполняется с задержкой. Возможны проблемы с дорожной ситуацией или водителем.';
      default:
        return 'Общее уведомление, требующее внимания.';
    }
  };

  // Получение рекомендаций по типу алерта
  const getAlertRecommendations = (type: AlertType): string[] => {
    switch (type) {
      case 'LONG_IDLE':
        return [
          'Связаться с водителем по телефону',
          'Проверить состояние транспортного средства',
          'Уточнить причины простоя',
          'При необходимости переназначить маршрут'
        ];
      case 'TOO_MANY_ISSUES':
        return [
          'Проанализировать причины проблем',
          'Связаться с водителем для обсуждения',
          'Рассмотреть дополнительное обучение',
          'Проверить состояние транспорта'
        ];
      case 'MAINTENANCE_DUE':
        return [
          'Записать транспорт на ТО',
          'Уведомить водителя о планах',
          'Спланировать замену транспорта',
          'Обновить график обслуживания'
        ];
      case 'GPS_LOST':
        return [
          'Проверить связь с водителем',
          'Убедиться в исправности трекера',
          'Проверить заряд устройства',
          'При необходимости заменить трекер'
        ];
      case 'ROUTE_DELAYED':
        return [
          'Связаться с водителем',
          'Проверить дорожную ситуацию',
          'Рассмотреть альтернативные маршруты',
          'Уведомить клиентов о задержке'
        ];
      default:
        return [
          'Проанализировать ситуацию',
          'Принять необходимые меры',
          'Документировать решение'
        ];
    }
  };

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    try {
      await props.onAcknowledge(alert.id);
      props.onClose();
    } catch (error) {
      console.error('Ошибка при закрытии алерта:', error);
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleCallDriver = () => {
    if (alert.driver?.phone) {
      window.open(`tel:${alert.driver.phone}`, '_self');
    }
  };

  const handleShowOnMap = () => {
    // TODO: Показать водителя на карте
    alert('Показать водителя на карте');
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal open={props.isOpen} onClose={props.onClose} size="large">
      <div class={styles.modalContent}>
        {/* Header */}
        <div class={styles.header}>
          <div class={styles.alertInfo}>
            <div class={styles.alertIcon}>
              {getAlertIcon(alert.alert_type)}
            </div>
            <div class={styles.alertDetails}>
              <h2 class={styles.alertTitle}>
                {alert.message}
              </h2>
              <div class={styles.alertMeta}>
                <Badge 
                  status={alert.severity === 'CRITICAL' ? 'error' : 
                         alert.severity === 'WARNING' ? 'warning' : 'info'} 
                  size="medium" 
                />
                <span class={styles.time}>
                  📅 {formatTime(alert.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div class={styles.content}>
          {/* Driver Information */}
          {alert.driver && (
            <div class={styles.driverSection}>
              <h3>👤 Информация о водителе</h3>
              <div class={styles.driverInfo}>
                <div class={styles.driverCard}>
                  <div class={styles.driverAvatar}>
                    {alert.driver.first_name?.charAt(0) || '?'}{alert.driver.last_name?.charAt(0) || '?'}
                  </div>
                  <div class={styles.driverDetails}>
                    <h4>{alert.driver.first_name} {alert.driver.last_name}</h4>
                    <p>📞 {alert.driver.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alert Description */}
          <div class={styles.descriptionSection}>
            <h3>📝 Описание проблемы</h3>
            <p class={styles.description}>
              {getAlertDescription(alert.alert_type)}
            </p>
          </div>

          {/* Recommendations */}
          <div class={styles.recommendationsSection}>
            <h3>💡 Рекомендации</h3>
            <ul class={styles.recommendations}>
              {getAlertRecommendations(alert.alert_type).map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          {/* GPS Location */}
          {alert.last_gps && (
            <div class={styles.locationSection}>
              <h3>📍 Последнее местоположение</h3>
              <div class={styles.locationInfo}>
                <p>Широта: {alert.last_gps.lat.toFixed(6)}</p>
                <p>Долгота: {alert.last_gps.lon.toFixed(6)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div class={styles.actions}>
          <div class={styles.primaryActions}>
            <Button 
              variant="primary" 
              onClick={handleAcknowledge}
              disabled={isAcknowledging()}
              loading={isAcknowledging()}
            >
              {isAcknowledging() ? 'Закрываем...' : '✅ Закрыть алерт'}
            </Button>
          </div>
          
          <div class={styles.secondaryActions}>
            {alert.driver?.phone && (
              <Button variant="secondary" onClick={handleCallDriver}>
                📞 Позвонить
              </Button>
            )}
            <Button variant="secondary" onClick={handleShowOnMap}>
              🗺️ Показать на карте
            </Button>
            <Button variant="outline" onClick={props.onClose}>
              ❌ Отмена
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AlertDetailModal;

