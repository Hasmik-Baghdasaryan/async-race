import type { ReactNode } from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

function Loader({
  size = 'medium',
  fullScreen = false,
}: LoaderProps): ReactNode {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenLoader}>
        <div className={`${styles.spinner} ${styles[size]}`} />
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[size]}`} />;
}

export default Loader;
