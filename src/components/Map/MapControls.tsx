import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import styles from './MapControls.module.css';

interface MapControlsProps {
  showClusters: boolean;
  showRoutes: boolean;
  showMarkers: boolean;
  onToggleClusters: () => void;
  onToggleRoutes: () => void;
  onToggleMarkers: () => void;
  onCenterMap: () => void;
}

function MapControls(props: MapControlsProps): JSX.Element {
  const [isExpanded, setIsExpanded] = createSignal(false);

  return (
    <div class={styles.mapControls}>
      {/* Main toggle button */}
      <button
        class={`${styles.mapControlBtn} ${styles.mainBtn}`}
        onClick={() => setIsExpanded(!isExpanded())}
        title="Настройки карты"
      >
        ⚙️
      </button>

      {/* Expanded controls */}
      {isExpanded() && (
        <div class={styles.controlsPanel}>
          <button
            class={`${styles.mapControlBtn} ${props.showClusters ? styles.active : ''}`}
            onClick={props.onToggleClusters}
            title="Группировка водителей"
          >
            🔗
          </button>

          <button
            class={`${styles.mapControlBtn} ${props.showRoutes ? styles.active : ''}`}
            onClick={props.onToggleRoutes}
            title="Показать маршруты"
          >
            🛤️
          </button>

          <button
            class={`${styles.mapControlBtn} ${props.showMarkers ? styles.active : ''}`}
            onClick={props.onToggleMarkers}
            title="Показать водителей"
          >
            👥
          </button>

          <button
            class={styles.mapControlBtn}
            onClick={props.onCenterMap}
            title="Центрировать карту"
          >
            🎯
          </button>
        </div>
      )}
    </div>
  );
}

export default MapControls;

