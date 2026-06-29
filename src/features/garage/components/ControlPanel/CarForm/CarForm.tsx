import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import type { ReactNode } from 'react';
import type { Car, CarCreateParams } from '@/features/garage/types';

import Button from '@/components/common/Button/Button';
import Error from '@/components/common/Error/Error';

import styles from './CarFrom.module.css';

interface CarFormProps {
  initialValue?: Car | null;
  onSubmit: (
    params: CarCreateParams | { id: number; car: CarCreateParams }
  ) => void;
  isLoading?: boolean;
}

function CarForm({
  onSubmit,
  initialValue,
  isLoading,
}: CarFormProps): ReactNode {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      name: initialValue?.name ?? '',
      color: initialValue?.color ?? '#000000',
    },
  });

  const { errors, isValid } = formState;

  useEffect(() => {
    reset({
      name: initialValue?.name ?? '',
      color: initialValue?.color ?? '#000000',
    });
  }, [initialValue, reset]);

  const onFormSubmit = (data: { name: string; color: string }) => {
    if (initialValue?.id) {
      onSubmit({ id: initialValue.id, car: data });
    } else {
      onSubmit(data);
    }
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
      <input
        type="text"
        className={styles.carName}
        placeholder="Type Car Brand"
        {...register('name', { required: 'Car name is required' })}
      />
      {errors.name?.message && <Error message={errors.name?.message} />}

      <input
        type="color"
        className={styles.colorPicker}
        {...register('color', { required: 'Color is required' })}
      />
      {errors.color?.message && <Error message={errors.color?.message} />}
      <Button
        label={initialValue ? 'Update' : 'Create'}
        type="submit"
        disabled={!isValid}
        isLoading={isLoading}
        loadingLabel={initialValue ? 'Updating...' : 'Creating...'}
      />
    </form>
  );
}

export default CarForm;
