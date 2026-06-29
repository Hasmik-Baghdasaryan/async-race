import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllCars } from '../../garageSlice';
import { resetRace } from '@/features/race/raceSlice';
import { CARS_PER_PAGE } from '@/constants/constants';

import CarItem from './CarItem/CarItem';
import Pagination from '@/components/common/Pagination/Pagination';
import WinnerModal from '@/features/race/components/WinnerModal/WinnerModal';

import styles from './CarList.module.css';
import Empty from '@/components/common/Empty/Empty';

function CarList() {
  const { cars, total } = useAppSelector((state) => state.garage);
  const { isRaceRunning, winnerId } = useAppSelector((state) => state.race);

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    dispatch(fetchAllCars({ page, limit: CARS_PER_PAGE }));
  }, [dispatch, page]);

  useEffect(() => {
    return () => {
      dispatch(resetRace());
      return undefined;
    };
  }, [dispatch]);

  if (!cars.length) return <Empty name="cars" />;

  return (
    <>
      <div className={styles.carsWrapper}>
        {cars.map((car) => (
          <CarItem car={car} key={car.id} />
        ))}
      </div>
      <div className={styles.footer}>
        <p className={styles.total}>Total Cars: {total}</p>
        <Pagination
          count={total}
          disabled={isRaceRunning}
          limit={CARS_PER_PAGE}
        />
      </div>
      {winnerId !== null && <WinnerModal />}
    </>
  );
}

export default CarList;
