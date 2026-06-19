import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Customer, Order } from '../../../types';
import { OrderStatus } from '../../../types/Order';
import { createApi } from '../../../api/client';
import { statusLabel } from '../../../lib/orderStatus';
import {PageHeader} from '../../../components/common/PageHeader';
import {OrderDetails} from '../../../components/orders/OrderDetails';
import {OrderLineItems} from '../../../components/orders/OrderLineItems';
import { useAuth } from '../../../hooks/useAuth';

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
;
  const { token } = useAuth();
  const api = createApi(token);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    api.get<Order>(`/orders/${id}`)
      .then(data => {
        setOrder(data);
        return api.get<Customer>(`/customers/${data.customerId}`);
      })
      .then(data => setCustomer(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  const handleUpdateStatus = async (status: OrderStatus) => {
    const updated = await api.put<Order>(`/orders/${id}/status`, { status });
    setOrder(updated);
  };

  return (
    <div className="container">
      <PageHeader headerText={'Order detail'} parentPageName={'Orders'} parentPageLink={'/orders'} />
      <p className="text-xs">ID: {order.id}</p>

      {customer && <OrderDetails customer={customer} order={order} statusLabel={statusLabel[order.status]} onUpdateStatus={handleUpdateStatus} />}

      {order && <OrderLineItems lineItems={order.lineItems} />}
    </div>
  );
}
