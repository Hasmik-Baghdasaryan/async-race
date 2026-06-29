import type { ReactNode } from 'react';
import styles from './Empty.module.css';

interface EmptyProps {
  name: string;
}
function Empty({ name }: EmptyProps): ReactNode {
  return (
    <div className={styles.container}>
      <h2>👋 There are no {name} to show at this time</h2>
    </div>
  );
}

export default Empty;
