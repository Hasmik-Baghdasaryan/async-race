import React from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { Car } from '@/features/garage/types';

import CarTrack from './CarTruck/CarTrack';
import CarItemControlPanel from './CarItemControlPanel/CarItemControlPanel';

import styles from './CarItem.module.css';

interface CarItemProps {
  car: Car;
}

function CarItem({ car }: CarItemProps): ReactNode {
  const selectedCar = useAppSelector((state) => state.garage.selectedCar);
  return (
    <div
      className={`${selectedCar && selectedCar.id === car.id ? styles.selected : ''}`}
    >
      <h4 className={styles.title}>{car.name}</h4>
      <div className={styles.carItemWrapper}>
        <CarItemControlPanel car={car} />
        <CarTrack car={car} />
      </div>
    </div>
  );
}

export default React.memo(CarItem);
