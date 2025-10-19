import { onMount, onCleanup, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DriverWithStats } from '../../types/driver';
import styles from './MapView.module.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  drivers: DriverWithStats[];
  center?: [number, number];
  zoom?: number;
  showTracks?: boolean;
  showClusters?: boolean;
}

function MapView(props: MapViewProps): JSX.Element {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map | undefined;
  let markers: L.Marker[] = [];

  onMount(() => {
    if (!mapContainer) return;

    // Инициализация карты
    map = L.map(mapContainer).setView(
      props.center || [40.1776, 44.5126], // Ереван по умолчанию
      props.zoom || 10
    );

    // Добавляем OpenStreetMap (БЕСПЛАТНО)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Добавляем маркеры водителей
    addDriverMarkers();
  });

  createEffect(() => {
    if (map) {
      addDriverMarkers();
    }
  });

  const addDriverMarkers = () => {
    if (!map) return;

    // Очищаем старые маркеры
    markers.forEach(marker => map?.removeLayer(marker));
    markers = [];

    props.drivers.forEach(driver => {
      // Получаем координаты водителя (пока используем случайные координаты в Ереване)
      const coords = getDriverCoordinates(driver);
      
      if (coords) {
        const marker = L.marker(coords, {
          icon: getDriverIcon(driver.status)
        }).addTo(map);

        // Добавляем popup с информацией о водителе
        marker.bindPopup(`
          <div class="${styles.driverPopup}">
            <h4>${driver.firstName} ${driver.lastName}</h4>
            <p><strong>Статус:</strong> ${getStatusText(driver.status)}</p>
            <p><strong>Адресов:</strong> ${driver.todayStats.deliveredStops}/${driver.todayStats.totalStops}</p>
            <p><strong>Км:</strong> ${driver.todayStats.distanceKm.toFixed(1)}</p>
            <p><strong>Телефон:</strong> ${driver.phone}</p>
            <div class="${styles.popupActions}">
              <button onclick="callDriver('${driver.phone}')" class="${styles.popupBtn}">📞 Позвонить</button>
              <button onclick="messageDriver('${driver.id}')" class="${styles.popupBtn}">💬 Написать</button>
            </div>
          </div>
        `);

        markers.push(marker);
      }
    });

    // Если есть маркеры, подгоняем карту под них
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const getDriverCoordinates = (driver: DriverWithStats): [number, number] | null => {
    // Пока используем случайные координаты в Ереване
    // В реальном приложении здесь будет запрос к GPS трекам
    const baseLat = 40.1776;
    const baseLon = 44.5126;
    
    // Генерируем координаты на основе ID водителя для стабильности
    const lat = baseLat + (Math.sin(driver.id.charCodeAt(0)) * 0.01);
    const lon = baseLon + (Math.cos(driver.id.charCodeAt(0)) * 0.01);
    
    return [lat, lon];
  };

  const getDriverIcon = (status: string) => {
    const colors = {
      ONLINE: '#34C759',
      DRIVING: '#007AFF', 
      IDLE: '#FF9500',
      OFFLINE: '#8E8E93'
    };

    return L.divIcon({
      className: styles.driverMarker,
      html: `<div class="${styles.markerIcon}" style="background-color: ${colors[status as keyof typeof colors] || '#8E8E93'}">🚗</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ONLINE: 'Онлайн',
      DRIVING: 'В пути',
      IDLE: 'Простой',
      OFFLINE: 'Офлайн'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  onCleanup(() => {
    if (map) {
      map.remove();
    }
  });

  return <div ref={mapContainer} class={styles.mapContainer} />;
}

export default MapView;
