import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  driveCar,
  setRaceRunning,
  setStatusBroken,
  setWinner,
  startEngine,
  stopEngine,
} from '../raceSlice';
import {
  createWinnerApi,
  getWinnerApi,
  updateWinnerApi,
} from '@/services/winnerApi';

import store from '@/store/store';

export function useRace() {
  const dispatch = useAppDispatch();
  const { cars } = useAppSelector((state) => state.garage);

  async function startRace() {
    dispatch(setRaceRunning(true));
    const racePromises = cars.map((car) =>
      dispatch(startEngine({ carId: car.id }))
        .unwrap()
        .then(() => dispatch(driveCar({ carId: car.id })).unwrap())
        .then((result) => ({
          ...result,
          carId: car.id,
          duration: store.getState().race.engines[car.id]?.duration,
        }))
        .catch(() => {
          dispatch(setStatusBroken(car.id));
        })
    );
    const silentPromises = racePromises.map(
      (p) =>
        new Promise<{ carId: number; success: boolean; duration: number }>(
          (resolve) =>
            p
              .then((result) => {
                if (result) resolve(result);
              })
              .catch(() => {})
        )
    );

    Promise.allSettled(racePromises).then(() => {
      dispatch(setRaceRunning(false));
    });

    const winner = await Promise.race(silentPromises);

    if (!winner) {
      dispatch(setWinner(null));
      return;
    }

    dispatch(setWinner(winner.carId));

    const duration = Number((winner.duration / 1000).toFixed(2));

    try {
      const existingWinner = await getWinnerApi(winner.carId);
      await updateWinnerApi(winner.carId, {
        wins: existingWinner.wins + 1,
        time: Math.min(existingWinner.time, duration),
      });
    } catch {
      await createWinnerApi({
        id: winner.carId,
        wins: 1,
        time: duration,
      });
    }
  }

  async function resetRace() {
    dispatch(setRaceRunning(false));
    const resetRacePromises = cars.map((car) =>
      dispatch(stopEngine({ carId: car.id }))
    );
    await Promise.allSettled(resetRacePromises);
    dispatch(setWinner(null));
  }

  return { startRace, resetRace };
}
