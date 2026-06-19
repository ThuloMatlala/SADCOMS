import type { OrderLineItem } from "../../types"

interface OrderLineItemsProps{
  lineItems:Array<OrderLineItem>
}

export const OrderLineItems = ({lineItems}:OrderLineItemsProps) => {
  return (
      <section>
        <h4>Line Items</h4>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map(item => (
              <tr key={item.id}>
                <td>{item.productSku}</td>
                <td>{item.quantity}</td>
                <td>{Number(item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
  )
}
