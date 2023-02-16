import { FC } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  pageCount: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ pageCount, page, onPageChange }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Вперед"
      onPageChange={(e) => onPageChange(e.selected + 1)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel="Назад"
      renderOnZeroPageCount={() => {}}
      containerClassName={styles.container}
      pageLinkClassName={styles.page}
      activeLinkClassName={styles.active}
      previousLinkClassName={styles.next}
      nextLinkClassName={styles.next}
      disabledLinkClassName={styles.disabled}
      breakLinkClassName={styles.break}
      forcePage={page - 1}
    />
  );
};

export default Pagination;
