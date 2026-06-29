import { useWinners } from '../hooks/useWinners';
import { WINNERS_PER_PAGE } from '@/constants/constants';

import CarIcon from '@/features/garage/components/CarList/CarItem/CarTruck/CarIcon/CarIcon';
import Pagination from '@/components/common/Pagination/Pagination';

import styles from './WinnersList.module.css';
import Empty from '@/components/common/Empty/Empty';

function WinnersList() {
  const { handleSort, winnersDetails, total, sort, order, page } = useWinners();

  if (!winnersDetails.length) return <Empty name="winners" />;
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>N:</th>
            <th>Car</th>
            <th>Name</th>
            <th onClick={() => handleSort('wins')}>
              <span
                className={
                  sort === 'wins' ? styles.sortIconActive : styles.sortIcon
                }
              >
                Wins {sort === 'wins' ? (order === 'ASC' ? '↑' : '↓') : '↕'}
              </span>
            </th>
            <th onClick={() => handleSort('time')}>
              <span
                className={
                  sort === 'time' ? styles.sortIconActive : styles.sortIcon
                }
              >
                Best Time{' '}
                {sort === 'time' ? (order === 'ASC' ? '↑' : '↓') : '↕'}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {winnersDetails.map((winner, index) => (
            <tr key={winner.id}>
              <td>{(page - 1) * WINNERS_PER_PAGE + index + 1}</td>
              <td>
                <CarIcon color={winner.color} width="40" height="40" />
              </td>
              <td>{winner.name}</td>
              <td>{winner.wins}</td>
              <td>{winner.time} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.footer}>
        <p className={styles.total}>Total Winners: {total}</p>
        <Pagination count={total} limit={WINNERS_PER_PAGE} />
      </div>
    </>
  );
}

export default WinnersList;
