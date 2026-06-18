import { useEffect, useState } from 'react'
import type { Order, PagedResult } from '../../types'
import { api } from '../../api/client';
import { Link } from 'react-router-dom';
import OrderList from '../../components/orders/OrderList';
import StatusFilter from '../../components/orders/StatusFilter';

export default function OrderListPage() {


  
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const url = status !== null ? `/orders?status=${status}` : '/orders';
    api.get<PagedResult<Order>>(url)
      .then(data => setOrders(data.items))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value !== '' ? Number(e.target.value) : null);
    setLoading(true);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    
    <div className='container'>
      <div className='header'>
        <Link to="/">← Back to Home</Link>
        <h1>Orders</h1>
        <StatusFilter status={status} handleStatusChange={ handleStatusChange} />
      </div>
      <OrderList orders={orders} />

      <Link to="/orders/new">
        <button>Create New Order</button>
      </Link>
    </div>
  )
}