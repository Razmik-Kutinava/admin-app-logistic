import { For, Show, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import styles from './Table.module.css';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  render?: (row: T) => JSX.Element;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  class?: string;
}

function Table(props: TableProps): JSX.Element {
  const [sortKey, setSortKey] = createSignal<string | null>(null);
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');

  const handleSort = (column: TableColumn) => {
    if (!column.sortable) return;

    if (sortKey() === column.key) {
      // Toggle direction
      setSortDirection(sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(column.key);
      setSortDirection('asc');
    }
  };

  const sortedData = () => {
    const key = sortKey();
    if (!key) return props.data;

    const sorted = [...props.data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection() === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const getCellValue = (row: any, column: TableColumn) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.key];
  };

  return (
    <div class={`${styles.tableContainer} ${props.class || ''}`}>
      <table class={styles.table}>
        <thead>
          <tr>
            <For each={props.columns}>
              {(column) => (
                <th
                  class={styles.th}
                  style={{
                    width: column.width,
                    'text-align': column.align || 'left',
                    cursor: column.sortable ? 'pointer' : 'default'
                  }}
                  onClick={() => handleSort(column)}
                >
                  <div class={styles.thContent}>
                    <span>{column.header}</span>
                    <Show when={column.sortable}>
                      <span class={styles.sortIcon}>
                        {sortKey() === column.key ? (
                          sortDirection() === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    </Show>
                  </div>
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <Show
            when={!props.loading && sortedData().length > 0}
            fallback={
              <tr>
                <td colspan={props.columns.length} class={styles.emptyCell}>
                  {props.loading ? 'Загрузка...' : props.emptyMessage || 'Нет данных'}
                </td>
              </tr>
            }
          >
            <For each={sortedData()}>
              {(row, _) => (
                <tr
                  class={styles.tr}
                  classList={{ [styles.clickable]: !!props.onRowClick }}
                  onClick={() => props.onRowClick?.(row)}
                >
                  <For each={props.columns}>
                    {(column) => (
                      <td
                        class={styles.td}
                        style={{ 'text-align': column.align || 'left' }}
                      >
                        {getCellValue(row, column)}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </Show>
        </tbody>
      </table>
    </div>
  );
}

export default Table;

