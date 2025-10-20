import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { DriverWithStats } from '../../types/driver';
import MapControls from './MapControls';
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
  showRoutes?: boolean;
  onDriverClick?: (driver: DriverWithStats) => void;
}

function MapView(props: MapViewProps): JSX.Element {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map | undefined;
  let markers: L.Marker[] = [];
  let markerClusterGroup: any;
  let routeLayers: L.LayerGroup | undefined;

  // Состояние контролов карты
  const [showClusters, setShowClusters] = createSignal(props.showClusters !== false);
  const [showRoutes, setShowRoutes] = createSignal(props.showRoutes || false);
  const [showMarkers, setShowMarkers] = createSignal(true);

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

    // Инициализируем кластерную группу
    markerClusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });

    // Инициализируем группу для маршрутов
    routeLayers = L.layerGroup();

    // Добавляем маркеры водителей
    addDriverMarkers();
  });

  createEffect(() => {
    if (map) {
      addDriverMarkers();
    }
  });

  const addDriverMarkers = () => {
    if (!map || !markerClusterGroup) return;

    // Очищаем старые маркеры и кластеры
    markerClusterGroup.clearLayers();
    markers = [];

    // Очищаем маршруты если они отключены
    if (routeLayers && !props.showRoutes) {
      routeLayers.clearLayers();
    }

    props.drivers.forEach(driver => {
      // Получаем координаты водителя
      const coords = getDriverCoordinates(driver);
      
      if (coords) {
        const marker = L.marker(coords, {
          icon: getDriverIcon(driver.status)
        });

        // Добавляем popup с информацией о водителе
        marker.bindPopup(`
          <div class="${styles.driverPopup}">
            <h4>${driver.first_name} ${driver.last_name}</h4>
            <p><strong>Статус:</strong> ${getStatusText(driver.status)}</p>
            <p><strong>Адресов:</strong> ${driver.todayStats?.deliveredStops || 0}/${driver.todayStats?.totalStops || 0}</p>
            <p><strong>Км:</strong> ${(driver.todayStats?.distanceKm || 0).toFixed(1)}</p>
            <p><strong>Телефон:</strong> ${driver.phone}</p>
            <div class="${styles.popupActions}">
              <button onclick="callDriver('${driver.phone}')" class="${styles.popupBtn}">📞 Позвонить</button>
              <button onclick="messageDriver('${driver.id}')" class="${styles.popupBtn}">💬 Написать</button>
              ${props.onDriverClick ? `<button onclick="showDriverDetails('${driver.id}')" class="${styles.popupBtn}">👁️ Подробнее</button>` : ''}
            </div>
          </div>
        `);

        // Добавляем обработчик клика
        if (props.onDriverClick) {
          marker.on('click', () => {
            props.onDriverClick?.(driver);
          });
        }

        // Добавляем маркер в кластер или напрямую на карту
        if (showClusters()) {
          markerClusterGroup.addLayer(marker);
        } else if (map) {
          marker.addTo(map);
        }

        markers.push(marker);

        // Добавляем маршрут если включен
        if (showRoutes() && routeLayers) {
          addDriverRoute(driver, coords);
        }
      }
    });

    // Добавляем кластерную группу на карту если включена кластеризация
    if (showClusters() && !map.hasLayer(markerClusterGroup)) {
      map.addLayer(markerClusterGroup);
    }

    // Добавляем маршруты на карту если включены
    if (showRoutes() && routeLayers && !map.hasLayer(routeLayers)) {
      map.addLayer(routeLayers);
    }

    // Если есть маркеры, подгоняем карту под них
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const getDriverCoordinates = (driver: DriverWithStats): [number, number] | null => {
    // Используем GPS координаты если есть, иначе генерируем
    if (driver.last_gps?.lat && driver.last_gps?.lon) {
      return [driver.last_gps.lat, driver.last_gps.lon];
    }
    
    // Fallback: генерируем координаты на основе ID водителя для стабильности
    const baseLat = 40.1776;
    const baseLon = 44.5126;
    const lat = baseLat + (Math.sin(driver.id.charCodeAt(0)) * 0.01);
    const lon = baseLon + (Math.cos(driver.id.charCodeAt(0)) * 0.01);
    
    return [lat, lon];
  };

  const addDriverRoute = (driver: DriverWithStats, currentCoords: [number, number]) => {
    if (!routeLayers) return;

    // Генерируем маршрут (в реальном приложении это будет история GPS)
    const routePoints = generateRoutePoints(currentCoords, driver);
    
    if (routePoints.length > 1) {
      // Создаем полилинию маршрута
      const routePolyline = L.polyline(routePoints, {
        color: getRouteColor(driver.status),
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
      });

      // Добавляем стрелки направления
      const arrowMarkers = routePoints.map((point, index) => {
        if (index === 0) return null; // Пропускаем первую точку
        
        const prevPoint = routePoints[index - 1];
        const angle = Math.atan2(point[0] - prevPoint[0], point[1] - prevPoint[1]) * 180 / Math.PI;
        
        return L.marker(point, {
          icon: L.divIcon({
            className: styles.routeArrow,
            html: `<div style="transform: rotate(${angle}deg); color: ${getRouteColor(driver.status)}">→</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        });
      }).filter(Boolean);

      // Добавляем маршрут и стрелки на карту
      if (routeLayers) {
        routeLayers.addLayer(routePolyline);
        arrowMarkers.forEach(arrow => arrow && routeLayers!.addLayer(arrow));
      }
    }
  };

  const generateRoutePoints = (currentCoords: [number, number], driver: DriverWithStats): [number, number][] => {
    // Генерируем маршрут на основе статуса водителя
    const points: [number, number][] = [currentCoords];
    
    if (driver.status === 'DRIVING') {
      // Для едущих водителей создаем более сложный маршрут
      const numPoints = 5 + Math.floor(Math.random() * 5);
      let [lat, lon] = currentCoords;
      
      for (let i = 0; i < numPoints; i++) {
        lat += (Math.random() - 0.5) * 0.005;
        lon += (Math.random() - 0.5) * 0.005;
        points.push([lat, lon]);
      }
    } else if (driver.status === 'IDLE') {
      // Для простаивающих водителей создаем короткий маршрут
      const [lat, lon] = currentCoords;
      points.push([lat + 0.001, lon + 0.001]);
    }
    
    return points;
  };

  const getRouteColor = (status: string): string => {
    const colors = {
      ONLINE: '#34C759',
      DRIVING: '#007AFF', 
      IDLE: '#FF9500',
      OFFLINE: '#8E8E93'
    };
    return colors[status as keyof typeof colors] || '#8E8E93';
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

  // Функции управления картой
  const handleToggleClusters = () => {
    setShowClusters(!showClusters());
    if (map && markerClusterGroup) {
      if (showClusters()) {
        map.removeLayer(markerClusterGroup);
      } else {
        map.addLayer(markerClusterGroup);
      }
    }
  };

  const handleToggleRoutes = () => {
    setShowRoutes(!showRoutes());
    if (map && routeLayers) {
      if (showRoutes()) {
        map.removeLayer(routeLayers);
      } else {
        map.addLayer(routeLayers);
        addDriverMarkers(); // Перерисовываем маршруты
      }
    }
  };

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers());
    if (map && markerClusterGroup) {
      if (showMarkers()) {
        map.removeLayer(markerClusterGroup);
      } else {
        map.addLayer(markerClusterGroup);
      }
    }
  };

  const handleCenterMap = () => {
    if (map && markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  onCleanup(() => {
    if (map) {
      // Очищаем все слои
      if (markerClusterGroup) {
        map.removeLayer(markerClusterGroup);
      }
      if (routeLayers) {
        map.removeLayer(routeLayers);
      }
      map.remove();
    }
  });

  return (
    <div class={styles.mapWrapper}>
      <div ref={mapContainer} class={styles.mapContainer} />
      <MapControls
        showClusters={showClusters()}
        showRoutes={showRoutes()}
        showMarkers={showMarkers()}
        onToggleClusters={handleToggleClusters}
        onToggleRoutes={handleToggleRoutes}
        onToggleMarkers={handleToggleMarkers}
        onCenterMap={handleCenterMap}
      />
    </div>
  );
}

export default MapView;
