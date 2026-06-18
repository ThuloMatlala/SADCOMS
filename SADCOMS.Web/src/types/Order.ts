export interface Order{
  Id: string;
  CustomerId: string;
  Status: OrderStatus;
  CurrencyCode: string;
  TotalAmount: number;
  CreatedAt: string;
  LineItems: Array<OrderLineItem>;
}

// Can't use enum here — erasableSyntaxOnly requires all TypeScript syntax to be erasable, and enums emit runtime JS
export const OrderStatus = {
  Pending: 0,
  Paid: 1,
  Fulfilled: 2,
  Cancelled: 3,
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];


export interface OrderLineItem{
  Id: string;
  ProductSku: string;
  Quantity: number;
  UnitPrice: number;
}