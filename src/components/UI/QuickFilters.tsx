import type { JSX } from 'solid-js';
import styles from './QuickFilters.module.css';

interface QuickFilter {
  key: string;
  label: string;
  icon: string;
  count: number;
  active: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  onFilterClick: (key: string) => void;
  onClearAll: () => void;
}

function QuickFilters(props: QuickFiltersProps): JSX.Element {
  return (
    <div class={styles.quickFilters}>
      <div class={styles.filterChips}>
        {props.filters.map(filter => (
          <button
            class={`${styles.filterChip} ${filter.active ? styles.active : ''}`}
            onClick={() => props.onFilterClick(filter.key)}
          >
            <span class={styles.filterIcon}>{filter.icon}</span>
            <span class={styles.filterLabel}>{filter.label}</span>
            <span class={styles.filterCount}>{filter.count}</span>
          </button>
        ))}
      </div>
      <button class={styles.clearAll} onClick={props.onClearAll}>
        Очистить все
      </button>
    </div>
  );
}

export default QuickFilters;
