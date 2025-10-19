import type { JSX } from 'solid-js';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  onClick?: () => void;
  class?: string;
  children?: JSX.Element;
}

function Card(props: CardProps): JSX.Element {
  const paddingClass = () => {
    switch (props.padding || 'medium') {
      case 'none': return styles.paddingNone;
      case 'small': return styles.paddingSmall;
      case 'large': return styles.paddingLarge;
      default: return styles.paddingMedium;
    }
  };

  const shadowClass = () => {
    switch (props.shadow || 'small') {
      case 'none': return styles.shadowNone;
      case 'medium': return styles.shadowMedium;
      case 'large': return styles.shadowLarge;
      default: return styles.shadowSmall;
    }
  };

  return (
    <div
      class={`${styles.card} ${paddingClass()} ${shadowClass()} ${props.hover ? styles.hover : ''} ${props.class || ''}`}
      onClick={props.onClick}
      classList={{ [styles.clickable]: !!props.onClick }}
    >
      {(props.title || props.subtitle) && (
        <div class={styles.header}>
          {props.title && <h3 class={styles.title}>{props.title}</h3>}
          {props.subtitle && <p class={styles.subtitle}>{props.subtitle}</p>}
        </div>
      )}
      <div class={styles.content}>
        {props.children}
      </div>
    </div>
  );
}

export default Card;

