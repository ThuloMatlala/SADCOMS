import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types';
import { statusLabel } from '../../lib/orderStatus';
import './OrderList.css';

interface OrderListProps{
  orders: Array<Order>;
}

export default function OrderList({ orders }: OrderListProps) {
  const navigate = useNavigate();
  

  if(!orders || orders.length < 1)
    return (<p>There are no orders for the selected status</p>)
  
  return (
    <table className="w-full text-white border-collapse">
      <thead>
        <tr className="text-left border-b border-white/20">
          <th className="py-2 pr-4">Order Id</th>
          <th className="py-2 pr-4">Created</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Currency</th>
          <th className="py-2 pr-4">Total</th>
        </tr>
      </thead>
      
      <tbody>
        {orders.map(o => (
          <tr
            key={o.id}
            onClick={() => navigate(`/orders/${o.id}`)}
            className="orderRow"
          >
            <td className="py-2 pr-4">{o.id}</td>
            <td className="py-2 pr-4">{o.createdAt}</td>
            <td className="py-2 pr-4">{statusLabel[o.status]}</td>
            <td className="py-2 pr-4">{o.currencyCode}</td>
            <td className="py-2 pr-4">{Number(o.totalAmount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
