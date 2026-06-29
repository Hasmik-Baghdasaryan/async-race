import type { ReactNode } from 'react';

import Loader from '@/components/common/Loader/Loader';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  type?: 'button' | 'submit';
  btnClass?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
}

function Button({
  label,
  type = 'button',
  btnClass,
  onClick,
  disabled = false,
  isLoading = false,
  loadingLabel = 'Loading...',
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={`${styles.button} ${btnClass ? styles[btnClass] : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader size="small" />
          <span>{loadingLabel}</span>
        </div>
      ) : (
        label
      )}
    </button>
  );
}

export default Button;
