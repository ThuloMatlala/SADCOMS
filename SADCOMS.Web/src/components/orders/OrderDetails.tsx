import type { Customer, Order } from "../../types";
import { OrderStatus } from "../../types/Order";
import { OrderStatusUpdate } from './OrderStatusUpdate';

interface OrderDetailsProps {
  customer: Customer;
  order: Order;
  statusLabel: string;
  onUpdateStatus?: (status: OrderStatus) => Promise<void>;
}

export const OrderDetails = ({ customer, order, statusLabel, onUpdateStatus }: OrderDetailsProps) => {


  return (
    <div>
      <section>
        <p><strong>Customer:</strong> {customer ? `${customer.name} (${customer.email})` : order.customerId}</p>
        <p><strong>Currency:</strong> {order.currencyCode}</p>
        <p><strong>Total:</strong> {order.currencyCode} {Number(order.totalAmount).toFixed(2)}</p>
        <p><strong>Created:</strong> {order.createdAt}</p>
      </section>
      <p><strong>Status:</strong> {statusLabel}</p>
      <OrderStatusUpdate onUpdateStatus={onUpdateStatus } orderStatus={order.status}/>
    </div>
  );
}