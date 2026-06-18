import React from 'react'
import type { Customer } from '../../types'

interface CustomerListProps {
  customers: Array<Customer>
}

export default function CustomerList({customers}:CustomerListProps) {
  return (
      <ul>
        {customers.map(c => (
          <li className='text-white' key={c.id}>{c.name} — {c.email} ({c.countryCode})</li>
        ))}
      </ul>
  )
}
