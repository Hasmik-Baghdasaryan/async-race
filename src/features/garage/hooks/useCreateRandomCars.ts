import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import toast from 'react-hot-toast';
import { generateRandomCars } from '../garageSlice';
import { getErrorMessage } from '@/helpers/errorHelper';
import { CARS_PER_PAGE } from '@/constants/constants';

export function useCreateRandomCars() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const setSearchParams = useSearchParams()[1];

  async function generateCars() {
    setIsLoading(true);
    try {
      const result = await dispatch(generateRandomCars(100)).unwrap();
      const lastPage = Math.ceil(result.totalCount / CARS_PER_PAGE);

      setSearchParams({ page: String(lastPage) });

      toast.success('The cars have been successfully created');
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Could not generate cars');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return { generateCars, isLoading };
}
