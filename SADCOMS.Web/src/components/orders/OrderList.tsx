import { Link } from 'react-router-dom';
import type { Order } from '../../types';

interface OrderListProps{
  orders: Array<Order>;
}

export default function OrderList({ orders }: OrderListProps) {
  const statusLabel: Record<number, string> = {
  0: 'Pending',
  1: 'Paid', 
  2: 'Fulfilled',
  3: 'Cancelled',
};
  return (
    <ul>
      {orders.map(o => (
        <Link key={o.id} to={`/orders/${o.id}`}>
        <li className='text-white' >
          <span>{o.customerId} — ({statusLabel[o.status]}) {o.currencyCode} {o.totalAmount} {o.createdAt}</span>
          <ul>
            {o.lineItems.map(item => (
              <li key={item.id}>
                  {item.productSku} × {item.quantity} @ {item.unitPrice}
              </li>
            ))}
          </ul>
          </li>
                </Link>
          
      ))}
    </ul>
  )
}
