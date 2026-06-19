import type { ChangeEvent } from "react";

interface StatusFilterProps{
  status: number | null;
  handleStatusChange: (e: ChangeEvent<HTMLSelectElement, Element>) => void
}

export const StatusFilter = ({status, handleStatusChange}:StatusFilterProps) => {
  return (
    <select value={status ?? ''} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          <option value="0">Pending</option>
          <option value="1">Paid</option>
          <option value="2">Fulfilled</option>
          <option value="3">Cancelled</option>
    </select>
  )
}
