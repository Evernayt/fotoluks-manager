import { FC } from 'react';
import ReactPaginate from 'react-paginate';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import styles from './Pagination.module.scss';

export interface PaginationProps {
  pageCount: number;
  page: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  pageCount,
  page,
  isDisabled,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<IconArrowRight size={16} />}
      previousLabel={<IconArrowLeft size={16} />}
      pageCount={pageCount}
      pageRangeDisplayed={5}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      renderOnZeroPageCount={() => null}
      containerClassName={[
        styles.container,
        isDisabled && styles.disabled,
      ].join(' ')}
      pageLinkClassName={styles.button}
      activeLinkClassName={styles.active}
      previousLinkClassName={styles.button}
      nextLinkClassName={styles.button}
      breakLinkClassName={styles.button}
      disabledClassName={styles.disabled}
      forcePage={page - 1}
    />
  );
};

export default Pagination;
