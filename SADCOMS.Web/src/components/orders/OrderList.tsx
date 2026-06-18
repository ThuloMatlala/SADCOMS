import type { Order } from '../../types';

interface OrderListProps{
  orders: Array<Order>;
}

export default function OrderList({orders}:OrderListProps) {
  return (
    <ul>
      {orders.map(o => (
        <li className='text-white' key={o.id}>
          <span>{o.customerId} — ({o.status}) {o.currencyCode} {o.totalAmount} {o.createdAt}</span>
          <ul>
            {o.lineItems.map(item => (
              <li key={item.id}>
                {item.productSku} × {item.quantity} @ {item.unitPrice}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
