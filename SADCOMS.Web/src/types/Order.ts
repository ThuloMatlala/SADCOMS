export interface Order{
  Id:string
  CustomerId:string
  Status:number
  CurrencyCode:string
  TotalAmount:number
  CreatedAt:string
  LineItems: Array<OrderLineItem>;
}

export interface OrderLineItem{
  Id: string,
  ProductSku: string
  Quantity: number,
  UnitPrice: number
}