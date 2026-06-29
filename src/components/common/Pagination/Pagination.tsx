import React from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';

import Button from '../Button/Button';

import styles from './Pagination.module.css';

type PaginationProps = {
  count: number;
  disabled?: boolean;
  limit: number;
};

function Pagination({ count, disabled, limit }: PaginationProps): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(
    1,
    !searchParams.get('page') ? 1 : Number(searchParams.get('page'))
  );

  const pageCount = Math.ceil(count / limit);

  function updatePage(page: number) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
  }

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    updatePage(next);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    updatePage(prev);
  }

  if (pageCount <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button
        label="Prev"
        btnClass="paginationBtn"
        onClick={prevPage}
        disabled={currentPage === 1 || disabled}
      />
      <span className={styles.count}>
        {currentPage} of {pageCount}
      </span>
      <Button
        label="Next"
        btnClass="paginationBtn"
        onClick={nextPage}
        disabled={currentPage === pageCount || disabled}
      />
    </div>
  );
}

export default React.memo(Pagination);
