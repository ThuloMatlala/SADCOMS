import type { OrderLineItem } from "../../types"

interface OrderLineItemsProps{
  lineItems:Array<OrderLineItem>
}

export default function OrderLineItems({lineItems}:OrderLineItemsProps) {
  return (
      <section>
        <h4>Line Items</h4>
        <ul>
          {lineItems.map(item => (
            <li key={item.id}>
              {item.productSku} × {item.quantity} @ {Number(item.unitPrice).toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
  )
}
