import type { JSX } from 'solid-js';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  class?: string;
  children?: JSX.Element;
}

function Modal(props: ModalProps): JSX.Element {
  // Debug props
  console.log('🔍 Modal render:', {
    open: props.open,
    hasChildren: !!props.children,
    title: props.title
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (props.closeOnOverlayClick !== false && e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const sizeClass = () => {
    switch (props.size || 'medium') {
      case 'small': return styles.small;
      case 'large': return styles.large;
      case 'fullscreen': return styles.fullscreen;
      default: return styles.medium;
    }
  };

  return (
    <>
      {props.open && (
        <div class={styles.overlay} onClick={handleOverlayClick}>
          <div class={`${styles.modal} ${sizeClass()} ${props.class || ''}`}>
            {props.title && (
              <div class={styles.header}>
                <h2 class={styles.title}>{props.title}</h2>
                <button
                  class={styles.closeButton}
                  onClick={props.onClose}
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>
            )}
            <div class={props.title ? styles.content : styles.contentNoHeader}>
              {props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;

