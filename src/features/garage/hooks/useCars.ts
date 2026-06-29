import { useState } from 'react';
import { useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createNewCar,
  updateCar,
  deleteCar,
  setSelectedCar,
  unSelectCar,
  fetchAllCars,
} from '../garageSlice';
import { getErrorMessage } from '@/helpers/errorHelper';
import { CARS_PER_PAGE } from '@/constants/constants';
import { deleteWinner } from '@/features/winners/winnersSlice';

import type { Car, CarCreateParams } from '../types';

export function useCars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { total } = useAppSelector((state) => state.garage);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFormSubmit(
    params: CarCreateParams | { id: number; car: CarCreateParams }
  ) {
    setIsLoading(true);
    try {
      if ('id' in params) {
        await dispatch(updateCar(params)).unwrap();
        dispatch(setSelectedCar(null));
        toast.success('The car has been successfully updated');
      } else {
        await dispatch(createNewCar(params)).unwrap();
        const updatedTotal = total + 1;
        const lastPage = Math.ceil(updatedTotal / CARS_PER_PAGE);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(lastPage));
        setSearchParams(newParams);
        toast.success('The car has been successfully created');
      }
    } catch (err) {
      const isUpdate = 'id' in params;
      const errorMessage = getErrorMessage(
        err,
        isUpdate ? 'Could not update car' : 'Could not create car'
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setIsLoading(true);
    try {
      await dispatch(deleteCar(id)).unwrap();

      try {
        await dispatch(deleteWinner(id));
      } catch {
        // no winner to delete
      }

      toast.success('The car has been successfully deleted');

      const currentPage = Number(searchParams.get('page')) || 1;
      const updatedTotal = total - 1;
      const maxPage = Math.ceil(updatedTotal / CARS_PER_PAGE);

      if (currentPage > maxPage && maxPage > 0) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(maxPage));
        setSearchParams(newParams);
      } else {
        await dispatch(
          fetchAllCars({ page: currentPage, limit: CARS_PER_PAGE })
        ).unwrap();
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Could not delete car');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(car: Car) {
    dispatch(setSelectedCar(car));
  }

  function handleUnselect() {
    dispatch(unSelectCar());
  }

  return {
    handleFormSubmit,
    handleDelete,
    handleSelect,
    handleUnselect,
    isLoading,
  };
}
