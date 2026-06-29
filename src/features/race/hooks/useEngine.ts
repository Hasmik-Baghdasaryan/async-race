import { useAppDispatch } from '@/store/hooks';
import {
  driveCar,
  resetRace,
  setWinner,
  startEngine,
  stopEngine,
} from '../raceSlice';
import { useState } from 'react';
import { getErrorMessage } from '@/helpers/errorHelper';
import toast from 'react-hot-toast';

export function useEngine() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  async function handleStartEngine(carId: number) {
    setIsLoading(true);
    try {
      await dispatch(startEngine({ carId })).unwrap();
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Could not start the engine');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStopEngine(carId: number) {
    setIsLoading(true);
    try {
      await dispatch(stopEngine({ carId })).unwrap();
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Could not stop the engine');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDrive(carId: number) {
    setIsLoading(true);
    try {
      await dispatch(driveCar({ carId })).unwrap();
    } catch (err) {
      handleStopEngine(carId);
      const errorMessage = getErrorMessage(err, 'Could not start driving');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetRace() {
    dispatch(resetRace());
  }

  function handleSetWinner(id: number) {
    dispatch(setWinner(id));
  }

  return {
    handleStartEngine,
    handleStopEngine,
    handleDrive,
    handleResetRace,
    handleSetWinner,
    isLoading,
  };
}
