import { onMount, onCleanup, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { Modal, Badge, Button } from '../UI';
import type { DriverWithStats } from '../../types/driver';
import styles from './DriverMapModal.module.css';

interface DriverMapModalProps {
  driver: DriverWithStats | null;
  isOpen: boolean;
  onClose: () => void;
}

function DriverMapModal(props: DriverMapModalProps): JSX.Element {
  const [mapContainer, setMapContainer] = createSignal<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = createSignal<any>(null);
  const [markerInstance, setMarkerInstance] = createSignal<any>(null);

  // Закрытие по Escape
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    // Инициализируем карту после монтирования
    if (props.isOpen && props.driver) {
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    // Очищаем карту при закрытии
    if (mapInstance()) {
      mapInstance().remove();
      setMapInstance(null);
    }
    if (markerInstance()) {
      setMarkerInstance(null);
    }
  });

  // Инициализация карты
  const initializeMap = async () => {
    if (!props.driver || !mapContainer() || !props.isOpen) {
      console.log('🚫 Карта не инициализируется:', { 
        driver: !!props.driver, 
        container: !!mapContainer(), 
        isOpen: props.isOpen 
      });
      return;
    }

    try {
      console.log('🗺️ Начинаем инициализацию карты для водителя:', props.driver.first_name);
      
      // Динамический импорт Leaflet
      const L = await import('leaflet');
      
      // Импорт стилей Leaflet
      await import('leaflet/dist/leaflet.css');

      // Координаты водителя с fallback
      const driverCoords = props.driver.last_gps || {
        lat: 40.1776, // Центр Еревана
        lon: 44.5126,
        ts: new Date().toISOString()
      };

      console.log('📍 Координаты водителя:', driverCoords);

      // Создаем карту
      console.log('🗺️ Создаем карту с координатами:', [driverCoords.lat, driverCoords.lon]);
      const map = L.map(mapContainer()!).setView([driverCoords.lat, driverCoords.lon], 15);
      setMapInstance(map);
      console.log('✅ Карта создана успешно');

      // Добавляем слой OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      console.log('🗺️ Слой карты добавлен');

      // Создаем кастомную иконку для водителя
      const driverIcon = L.divIcon({
        className: styles.driverMarker,
        html: `
          <div class="${styles.markerContent}">
            <div class="${styles.markerAvatar}">
              ${props.driver.first_name?.charAt(0) || '?'}${props.driver.last_name?.charAt(0) || '?'}
            </div>
            <div class="${styles.markerStatus} ${getStatusClass(props.driver.status)}"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      // Добавляем маркер водителя
      console.log('📍 Добавляем маркер водителя');
      const marker = L.marker([driverCoords.lat, driverCoords.lon], { icon: driverIcon })
        .addTo(map)
        .bindPopup(`
          <div class="${styles.driverPopup}">
            <h4>${props.driver.first_name} ${props.driver.last_name}</h4>
            <p><strong>Статус:</strong> ${getStatusText(props.driver.status)}</p>
            <p><strong>Телефон:</strong> ${props.driver.phone}</p>
            <p><strong>Район:</strong> ${props.driver.district?.name_ru || 'Неизвестно'}</p>
            <p><strong>Адресов сегодня:</strong> ${props.driver.todayStats?.deliveredStops || 0}/${props.driver.todayStats?.totalStops || 0}</p>
            <p><strong>Пробег:</strong> ${(props.driver.todayStats?.distanceKm || 0).toFixed(1)} км</p>
            <p><strong>Последнее обновление:</strong> ${new Date(driverCoords.ts).toLocaleTimeString('ru-RU')}</p>
            <div class="${styles.popupActions}">
              <button onclick="callDriver('${props.driver.phone}')" class="${styles.popupBtn}">📞 Позвонить</button>
              <button onclick="messageDriver('${props.driver.id}')" class="${styles.popupBtn}">💬 Написать</button>
            </div>
          </div>
        `);

      setMarkerInstance(marker);
      console.log('✅ Маркер водителя добавлен успешно');

      // Добавляем глобальные функции для попапа
      (window as any).callDriver = (phone: string) => {
        window.open(`tel:${phone}`, '_self');
      };

      (window as any).messageDriver = (driverId: string) => {
        alert(`Отправка сообщения водителю ${driverId}`);
      };

      // Центрируем карту на водителе
      map.setView([driverCoords.lat, driverCoords.lon], 15);
      console.log('🎯 Карта отцентрирована на водителе');
      console.log('✅ Инициализация карты завершена успешно');

    } catch (error) {
      console.error('❌ Ошибка инициализации карты:', error);
      console.error('Детали ошибки:', {
        driver: props.driver?.first_name,
        coords: props.driver?.last_gps,
        container: !!mapContainer(),
        isOpen: props.isOpen
      });
    }
  };

  // Получение класса статуса для маркера
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'ONLINE':
        return styles.statusOnline;
      case 'DRIVING':
        return styles.statusDriving;
      case 'IDLE':
        return styles.statusIdle;
      case 'OFFLINE':
        return styles.statusOffline;
      default:
        return styles.statusUnknown;
    }
  };

  // Получение текста статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'ONLINE':
        return 'Онлайн';
      case 'DRIVING':
        return 'В пути';
      case 'IDLE':
        return 'Простой';
      case 'OFFLINE':
        return 'Офлайн';
      default:
        return 'Неизвестно';
    }
  };

  // Обработчик изменения размера модального окна
  const handleMapResize = () => {
    if (mapInstance()) {
      setTimeout(() => {
        mapInstance().invalidateSize();
      }, 100);
    }
  };

  // Карта инициализируется в onMount

  if (!props.driver || !props.isOpen) {
    return <></>;
  }

  const driver = props.driver;

  return (
    <Modal open={props.isOpen} onClose={props.onClose} size="large">
      <div class={styles.modalContent}>
        {/* Header */}
        <div class={styles.header}>
          <div class={styles.driverInfo}>
            <div class={styles.driverAvatar}>
              {driver.first_name?.charAt(0) || '?'}{driver.last_name?.charAt(0) || '?'}
            </div>
            <div class={styles.driverDetails}>
              <h2 class={styles.driverName}>
                {driver.first_name} {driver.last_name}
              </h2>
              <div class={styles.driverMeta}>
                <Badge status={driver.status} size="medium" />
                <span class={styles.phone}>📞 {driver.phone}</span>
                <span class={styles.district}>🌍 {driver.district?.name_ru || 'Неизвестно'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div class={styles.mapContainer}>
          <div 
            ref={setMapContainer}
            class={styles.map}
            onLoad={handleMapResize}
          />
          
          {/* Map Controls */}
          <div class={styles.mapControls}>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => {
                if (mapInstance() && markerInstance()) {
                  const coords = markerInstance().getLatLng();
                  mapInstance().setView(coords, 15);
                }
              }}
            >
              🎯 Центрировать
            </Button>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => {
                if (mapInstance()) {
                  mapInstance().zoomIn();
                }
              }}
            >
              🔍+ Увеличить
            </Button>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => {
                if (mapInstance()) {
                  mapInstance().zoomOut();
                }
              }}
            >
              🔍- Уменьшить
            </Button>
          </div>
        </div>

        {/* Driver Stats */}
        <div class={styles.driverStats}>
          <div class={styles.statItem}>
            <span class={styles.statLabel}>Адресов сегодня:</span>
            <span class={styles.statValue}>
              {driver.todayStats?.deliveredStops || 0}/{driver.todayStats?.totalStops || 0}
            </span>
          </div>
          <div class={styles.statItem}>
            <span class={styles.statLabel}>Пробег:</span>
            <span class={styles.statValue}>
              {(driver.todayStats?.distanceKm || 0).toFixed(1)} км
            </span>
          </div>
          <div class={styles.statItem}>
            <span class={styles.statLabel}>Простой:</span>
            <span class={styles.statValue}>
              {Math.floor((driver.todayStats?.idleTimeMinutes || 0) / 60)}ч {((driver.todayStats?.idleTimeMinutes || 0) % 60)}м
            </span>
          </div>
          <div class={styles.statItem}>
            <span class={styles.statLabel}>Проблемы:</span>
            <span class={styles.statValue}>
              {driver.todayStats?.issuesCount || 0}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div class={styles.actions}>
          <Button 
            variant="primary" 
            onClick={() => window.open(`tel:${driver.phone}`, '_self')}
          >
            📞 Позвонить водителю
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => alert(`Отправка сообщения водителю ${driver.id}`)}
          >
            💬 Написать сообщение
          </Button>
          <Button variant="ghost" onClick={props.onClose}>
            ❌ Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DriverMapModal;
