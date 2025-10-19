import { For, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import styles from './Select.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

function Select(props: SelectProps): JSX.Element {
  const [local, selectProps] = splitProps(props, ['label', 'error', 'helperText', 'fullWidth', 'options', 'onChange', 'class']);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    local.onChange?.(target.value);
  };

  return (
    <div class={`${styles.selectContainer} ${local.fullWidth ? styles.fullWidth : ''} ${local.class || ''}`}>
      {local.label && (
        <label class={styles.label}>
          {local.label}
        </label>
      )}
      <select
        {...selectProps}
        class={`${styles.select} ${local.error ? styles.error : ''}`}
        onChange={handleChange}
      >
        <For each={local.options}>
          {(option) => (
            <option value={option.value}>
              {option.label}
            </option>
          )}
        </For>
      </select>
      {(local.error || local.helperText) && (
        <div class={local.error ? styles.errorText : styles.helperText}>
          {local.error || local.helperText}
        </div>
      )}
    </div>
  );
}

export default Select;

