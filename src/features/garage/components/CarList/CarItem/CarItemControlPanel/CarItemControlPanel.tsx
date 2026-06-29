import React from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useCars } from '@/features/garage/hooks/useCars';
import type { Car } from '@/features/garage/types';

import Button from '@/components/common/Button/Button';
import styles from './CarItemControlPanel.module.css';
import { useEngine } from '@/features/race/hooks/useEngine';

function CarItemControlPanel({ car }: { car: Car }): ReactNode {
  const { handleDelete, handleSelect, handleUnselect } = useCars();
  const { handleStartEngine, handleStopEngine } = useEngine();

  const { isRaceRunning } = useAppSelector((state) => state.race);
  const engineStatus = useAppSelector(
    (state) => state.race.engines[car.id]?.status
  );
  const isStartDisabled =
    engineStatus === 'started' ||
    engineStatus === 'driving' ||
    engineStatus === 'broken';
  const isStopDisabled =
    engineStatus !== 'started' && engineStatus !== 'driving';
  const isEngineActive =
    engineStatus === 'started' || engineStatus === 'driving';

  const selectedCar = useAppSelector((state) => state.garage.selectedCar);
  const isCarSelected = selectedCar && selectedCar.id === car.id;

  return (
    <div className={styles.controlPanel}>
      <div className={styles.btnContainer}>
        <Button
          label={isCarSelected ? 'Unselect' : 'Select'}
          btnClass="carTrackBtn"
          onClick={() => (isCarSelected ? handleUnselect() : handleSelect(car))}
          disabled={isRaceRunning || isEngineActive}
        />
        <Button
          label="Remove"
          btnClass="removeBtn"
          onClick={() => handleDelete(car.id)}
          disabled={isRaceRunning || isEngineActive}
        />
      </div>
      <div className={styles.btnContainer}>
        <Button
          label="Start"
          btnClass="carTrackBtn"
          onClick={() => handleStartEngine(car.id)}
          disabled={isStartDisabled}
        />
        <Button
          label="Stop"
          btnClass="stopBtn"
          onClick={() => handleStopEngine(car.id)}
          disabled={isStopDisabled}
        />
      </div>
    </div>
  );
}

export default React.memo(CarItemControlPanel);
