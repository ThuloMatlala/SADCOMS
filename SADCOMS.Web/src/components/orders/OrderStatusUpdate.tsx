import { useState } from 'react'
import type { OrderStatus } from '../../types/Order';
import { statusLabel as statusLabels } from "../../lib/orderStatus";

interface OrderStatusUpdateProps{
  orderStatus: OrderStatus;
  onUpdateStatus?: (status: OrderStatus) => Promise<void>;
}

export const OrderStatusUpdate = ({orderStatus, onUpdateStatus}:OrderStatusUpdateProps) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(orderStatus);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!onUpdateStatus) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      await onUpdateStatus(selectedStatus);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
    {onUpdateStatus && (
        <section className='status-drop-down'>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(Number(e.target.value) as OrderStatus)}
            disabled={updating}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={handleUpdate}
            disabled={updating || selectedStatus === orderStatus}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </section>
      )}
      {updateError && <p style={{ color: 'red', fontSize: '11px' }}>{updateError}</p>}
    </>
  )
}
