import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import { setWinner } from '../../raceSlice';

import styles from './WinnerModal.module.css';

function WinnerModal() {
  const dispatch = useAppDispatch();
  const { winnerId, engines } = useAppSelector((state) => state.race);
  const { cars } = useAppSelector((state) => state.garage);

  if (!winnerId) return null;

  const winner = cars.find((car) => car.id === winnerId);
  if (!winner) return null;

  const duration = (engines[winnerId].duration / 1000).toFixed(2);

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button
          onClick={() => dispatch(setWinner(null))}
          className={styles.button}
        >
          <HiXMark />
        </button>
        <p className={styles.text}>
          🏆 {winner.name} wins race in {duration} seconds
        </p>
      </div>
    </div>,
    document.body
  );
}

export default WinnerModal;
