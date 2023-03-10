import { FC } from 'react';

export interface ITableCustomCell {
  accessor: string;
  cell: FC<any>;
  props?: any;
}
