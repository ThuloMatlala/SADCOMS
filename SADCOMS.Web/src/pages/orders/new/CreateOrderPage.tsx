import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createApi } from '../../../api/client';
import type { Customer, PagedResult } from '../../../types';
import {OrderCreateForm} from '../../../components/orders/OrderCreateForm';
import { useAuth } from '../../../hooks/useAuth';

export const CreateOrderPage = () => {
  const { token } = useAuth();
  const api = createApi(token);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PagedResult<Customer>>('/customers')
      .then(data => setCustomers(data.items))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <Link to="/orders">← Back to Orders</Link>
      <h1>New Order</h1>
      <OrderCreateForm customers={customers} />
    </div>
  )
}
