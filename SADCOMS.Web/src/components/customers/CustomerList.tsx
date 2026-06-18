import React from 'react'
import type { Customer } from '../../types'

interface CustomerListProps {
  customers: Array<Customer>
}

export default function CustomerList({customers}:CustomerListProps) {
  return (
      <table className='w-full text-white'>
        <thead>
          <tr className='text-left border-b border-white/20'>
            <th className='pb-2 pr-4'>Name</th>
            <th className='pb-2 pr-4'>Email</th>
            <th className='pb-2'>Country</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className='border-b border-white/10'>
              <td className='py-2 pr-4'>{c.name}</td>
              <td className='py-2 pr-4'>{c.email}</td>
              <td className='py-2'>{c.countryCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}
