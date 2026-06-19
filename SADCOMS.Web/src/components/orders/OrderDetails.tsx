import type { Customer, Order } from "../../types";

interface OrderDetailsProps{
  customer: Customer;
  order: Order;
  statusLabel: string;
}

export default function OrderDetails({ customer, order, statusLabel}:OrderDetailsProps) {
  return (
    <div>
      <section>
        <p><strong>Customer:</strong> {customer ? `${customer.name} (${customer.email})` : order.customerId}</p>
        <p><strong>Status:</strong> {statusLabel}</p>
        <p><strong>Currency:</strong> {order.currencyCode}</p>
        <p><strong>Total:</strong> {order.currencyCode} {Number(order.totalAmount).toFixed(2)}</p>
        <p><strong>Created:</strong> {order.createdAt}</p>
      </section>
    </div>
  )
}