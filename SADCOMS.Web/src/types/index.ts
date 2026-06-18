export type { Customer } from './Customer';
export type { Order, OrderLineItem } from './Order';

export interface PagedResult<T> {
  Items: Array<T>;
  TotalCount: number;
  Page: number;
  PageSize: number;
}
