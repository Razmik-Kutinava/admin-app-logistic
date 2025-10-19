import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import styles from './Input.module.css';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

function Input(props: InputProps): JSX.Element {
  const [local, inputProps] = splitProps(props, ['label', 'error', 'helperText', 'fullWidth', 'class']);

  return (
    <div class={`${styles.inputContainer} ${local.fullWidth ? styles.fullWidth : ''} ${local.class || ''}`}>
      {local.label && (
        <label class={styles.label}>
          {local.label}
        </label>
      )}
      <input
        {...inputProps}
        class={`${styles.input} ${local.error ? styles.error : ''}`}
      />
      {(local.error || local.helperText) && (
        <div class={local.error ? styles.errorText : styles.helperText}>
          {local.error || local.helperText}
        </div>
      )}
    </div>
  );
}

export default Input;

