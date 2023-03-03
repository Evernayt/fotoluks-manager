import { FC } from 'react';
import { PaginationProps } from '../Pagination/Pagination';

export interface ITableCustomCell {
  accessor: string;
  cell: FC<any>;
  props?: any;
}

export interface IPagination extends PaginationProps {
  isShowing?: boolean;
}
