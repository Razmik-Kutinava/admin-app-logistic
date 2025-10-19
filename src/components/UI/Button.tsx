import type { JSX } from 'solid-js';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent) => void;
  class?: string;
  children?: JSX.Element;
}

function Button(props: ButtonProps): JSX.Element {
  const variantClass = () => {
    switch (props.variant || 'primary') {
      case 'secondary': return styles.secondary;
      case 'danger': return styles.danger;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };

  const sizeClass = () => {
    switch (props.size || 'medium') {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  return (
    <button
      type={props.type || 'button'}
      class={`${styles.button} ${variantClass()} ${sizeClass()} ${props.fullWidth ? styles.fullWidth : ''} ${props.class || ''}`}
      disabled={props.disabled || props.loading}
      onClick={props.onClick}
      classList={{
        [styles.loading]: props.loading
      }}
    >
      {props.loading && <span class={styles.spinner} />}
      <span class={styles.content}>
        {props.children}
      </span>
    </button>
  );
}

export default Button;

