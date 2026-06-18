import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order } from '../../../types';
import { api } from '../../../api/client';

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
      <div className="header">
        <Link to="/orders">← Back to Orders</Link>
        <h3>Order #{order.id}</h3>
      </div>

      <section>
        <p><strong>Customer:</strong> {order.customerId}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Currency:</strong> {order.currencyCode}</p>
        <p><strong>Total:</strong> {order.currencyCode} {order.totalAmount}</p>
        <p><strong>Created:</strong> {order.createdAt}</p>
      </section>

      <section>
        <h4>Line Items</h4>
        <ul>
          {order.lineItems.map(item => (
            <li key={item.id}>
              {item.productSku} × {item.quantity} @ {item.unitPrice}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
