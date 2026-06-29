import type { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRace } from '../../hooks/useRace';

import Button from '@/components/common/Button/Button';

import styles from './RaceControl.module.css';

function RaceControl(): ReactNode {
  const { startRace, resetRace } = useRace();
  const { isRaceRunning, engines } = useAppSelector((state) => state.race);

  const { cars } = useAppSelector((state) => state.garage);

  const canRace = cars.every(
    (car) => !engines[car.id] || engines[car.id].status === 'stopped'
  );

  return (
    <div className={styles.raceControlContainer}>
      <Button
        label="Race"
        btnClass="raceBtn"
        onClick={startRace}
        disabled={isRaceRunning || !canRace}
      />
      <Button
        label="Reset"
        btnClass="resetBtn"
        onClick={resetRace}
        disabled={isRaceRunning}
      />
    </div>
  );
}

export default RaceControl;
