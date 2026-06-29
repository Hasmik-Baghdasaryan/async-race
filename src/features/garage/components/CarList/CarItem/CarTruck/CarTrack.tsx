import { useRef, type ReactNode } from 'react';
import type { Car } from '@/features/garage/types';

import CarIcon from './CarIcon/CarIcon';

import styles from './CarTrack.module.css';
import { useCarAnimation } from '@/features/garage/hooks/useCarAnimation';

interface CarTrackProps {
  car: Car;
}

function CarTrack({ car }: CarTrackProps): ReactNode {
  const trackRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  useCarAnimation(car.id, trackRef, finishRef, carRef, startRef);

  return (
    <div ref={trackRef} className={styles.track}>
      <div className={styles.startLine} ref={startRef}>
        <span className={`${styles.lineText} ${styles.startText}`}>START</span>
      </div>
      <div className={styles.car} ref={carRef}>
        <CarIcon color={car.color} />
      </div>
      <div className={styles.finishLine} ref={finishRef}>
        <span className={`${styles.lineText} ${styles.finishText}`}>
          FINISH
        </span>
      </div>
    </div>
  );
}

export default CarTrack;
