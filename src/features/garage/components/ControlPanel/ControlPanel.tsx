import { useAppSelector } from '@/store/hooks';
import { useCars } from '../../hooks/useCars';
import { useCreateRandomCars } from '../../hooks/useCreateRandomCars';

import { type ReactNode } from 'react';

import CarForm from './CarForm/CarForm';
import Button from '@/components/common/Button/Button';
import RaceControl from '../../../race/components/RaceControl/RaceControl';

import styles from './ControlPanel.module.css';

function ControlPanel(): ReactNode {
  const { handleFormSubmit, isLoading: formIsLoading } = useCars();
  const { isRaceRunning } = useAppSelector((state) => state.race);
  const { selectedCar, cars } = useAppSelector((state) => state.garage);
  const { generateCars, isLoading: generateIsLoading } = useCreateRandomCars();

  return (
    <>
      <div className={styles.controlPanel}>
        {cars.length > 0 && <RaceControl />}
        <CarForm
          key={selectedCar?.id || 'create'}
          initialValue={selectedCar}
          onSubmit={handleFormSubmit}
          isLoading={formIsLoading}
        />
        <Button
          label="Create Cars"
          btnClass="createCarsBtn"
          onClick={generateCars}
          isLoading={generateIsLoading}
          loadingLabel="Generating..."
          disabled={isRaceRunning}
        />
      </div>
    </>
  );
}

export default ControlPanel;
