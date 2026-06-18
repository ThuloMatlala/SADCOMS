import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Customer, Order } from '../../types'

interface LineItemDraft {
  productSku: string;
  quantity: number;
  unitPrice: number;
}

interface OrderCreateFormProps{
  customers: Array<Customer>
}

const emptyLineItem = (): LineItemDraft => ({ productSku: '', quantity: 1, unitPrice: 0 })

export default function OrderCreateForm({ customers}:OrderCreateFormProps) {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState('')
  const [currencyCode, setCurrencyCode] = useState('')
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([emptyLineItem()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateLineItem(index: number, field: keyof LineItemDraft, value: string) {
    setLineItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: field === 'productSku' ? value : Number(value) }
      return next
    })
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const created = await api.post<Order>('/orders', { customerId, currencyCode, lineItems })
      navigate(`/orders/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label htmlFor="customerId">Customer</label>
          <select id="customerId" value={customerId} onChange={e => setCustomerId(e.target.value)} required>
            <option value="">Select a customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currencyCode">Currency Code</label>
          <input
            id="currencyCode"
            value={currencyCode}
            onChange={e => setCurrencyCode(e.target.value.toUpperCase())}
            maxLength={3}
            minLength={3}
            placeholder="e.g. USD"
            required
          />
        </div>

        <div className="form-full">
          <h4 style={{ margin: '0 0 8px' }}>Line Items</h4>
          {lineItems.map((item, i) => (
            <div key={i} className='form-group'>
              <label>Product SKU</label>
              <input
                placeholder="Product SKU"
                value={item.productSku}
                onChange={e => updateLineItem(i, 'productSku', e.target.value)}
                required
              />
              <label>Item Quantity</label>
              <input
                type="number"
                min={1}
                placeholder="Qty"
                value={item.quantity}
                onChange={e => updateLineItem(i, 'quantity', e.target.value)}
                required
              />
              <label>Unit Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={e => updateLineItem(i, 'unitPrice', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setLineItems(prev => prev.filter((_, j) => j !== i))}
                disabled={lineItems.length === 1}
                style={{ padding: '8px 12px' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setLineItems(prev => [...prev, emptyLineItem()])} style={{ marginTop: 4 }}>
            + Add Item
          </button>
        </div>

        {error && <p className="form-full" style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
  )
}
