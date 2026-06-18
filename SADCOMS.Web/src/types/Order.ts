export interface Order{
  id: string;
  customerId: string;
  status: OrderStatus;
  currencyCode: string;
  totalAmount: number;
  createdAt: string;
  lineItems: Array<OrderLineItem>;
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
  id: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
}
