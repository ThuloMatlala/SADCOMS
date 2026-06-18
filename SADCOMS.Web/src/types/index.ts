export type { Customer } from './Customer';
export type { Order, OrderLineItem } from './Order';

export interface PagedResult<T> {
  items: Array<T>;
  totalCount: number;
  page: number;
  pageSize: number;
}
