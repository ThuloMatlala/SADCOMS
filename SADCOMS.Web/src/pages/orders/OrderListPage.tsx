import { useEffect, useState } from 'react'
import type { Order, PagedResult } from '../../types'
import { api } from '../../api/client';
import { Link } from 'react-router-dom';
import OrderList from '../../components/orders/OrderList';

export default function OrderListPage() {


  
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PagedResult<Order>>('/orders')
      .then(data => setOrders(data.items))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    
    <div className='container'>
      OrderListPage
      <OrderList orders={orders} />

      <Link to="/order/new">
        <button>Create New Order</button>
      </Link>
    </div>
  )
}
