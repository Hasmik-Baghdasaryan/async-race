import type { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import { NavLink } from 'react-router';

import styles from './Header.module.css';

function Header(): ReactNode {
  const { isRaceRunning } = useAppSelector((state) => state.race);

  return (
    <header>
      <nav className={styles.header}>
        <NavLink
          to="/"
          onClick={(e) => isRaceRunning && e.preventDefault()}
          className={isRaceRunning ? styles.disabled : ''}
        >
          Garage
        </NavLink>
        <NavLink
          to="/winners"
          onClick={(e) => isRaceRunning && e.preventDefault()}
          className={isRaceRunning ? styles.disabled : ''}
        >
          Winners
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
