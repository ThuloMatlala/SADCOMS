import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order } from '../../../types';
import { api } from '../../../api/client';
import { statusLabel } from '../../../lib/orderStatus';
import PageHeader from '../../../components/common/PageHeader';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Order>(`/orders/${id}`)
      .then(data => setOrder(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container">
      <PageHeader headerText={'Order detail'} parentPageName={'Orders'} parentPageLink={'/orders'} />
      <p className="text-xs">ID: {order.id}</p>

      <section>
        <p><strong>Customer:</strong> {order.customerId}</p>
        <p><strong>Status:</strong> {statusLabel[order.status]}</p>
        <p><strong>Currency:</strong> {order.currencyCode}</p>
        <p><strong>Total:</strong> {order.currencyCode} {Number(order.totalAmount).toFixed(2)}</p>
        <p><strong>Created:</strong> {order.createdAt}</p>
      </section>

      <section>
        <h4>Line Items</h4>
        <ul>
          {order.lineItems.map(item => (
            <li key={item.id}>
              {item.productSku} × {item.quantity} @ {Number(item.unitPrice).toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
