import {
  WINNERS_PER_PAGE,
  WINNERS_SORT_DEFAULT,
  WINNERS_SORT_ORDER_DEFAULT,
} from '@/constants/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { OrderTypes, SortTypes } from '../types';
import { fetchAllWinners } from '../winnersSlice';
import { fetchAllCars } from '@/features/garage/garageSlice';

export function useWinners() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sort = (searchParams.get('sort') as SortTypes) || WINNERS_SORT_DEFAULT;
  const order =
    (searchParams.get('order') as OrderTypes) || WINNERS_SORT_ORDER_DEFAULT;

  const { winners, total } = useAppSelector((state) => state.winners);
  const { cars } = useAppSelector((state) => state.garage);
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let changed = false;

    if (!searchParams.get('page')) {
      newParams.set('page', '1');
      changed = true;
    }
    if (!searchParams.get('sort')) {
      newParams.set('sort', WINNERS_SORT_DEFAULT);
      changed = true;
    }
    if (!searchParams.get('order')) {
      newParams.set('order', WINNERS_SORT_ORDER_DEFAULT);
      changed = true;
    }

    if (changed) setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    dispatch(fetchAllCars({ page: 1, limit: 10000 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllWinners({
        page,
        limit: WINNERS_PER_PAGE,
        sort,
        order,
      })
    );
  }, [dispatch, page, sort, order]);

  const carMap = useMemo(
    () => new Map(cars.map((car) => [car.id, car])),
    [cars]
  );
  const winnersDetails = useMemo(
    () =>
      winners
        .map((winner) => {
          const car = carMap.get(winner.id);
          return car ? { ...winner, ...car } : null;
        })
        .filter(Boolean),
    [winners, carMap]
  );

  function handleSort(field: 'wins' | 'time') {
    const newParams = new URLSearchParams(searchParams);

    if (sort === field) {
      newParams.set('order', order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      newParams.set('sort', field);
      newParams.set('order', 'ASC');
    }

    setSearchParams(newParams);
  }

  return { total, winnersDetails, handleSort, sort, order, page };
}
