import { useEffect, useState } from 'react'
import type { Customer } from '../../types'
import { api } from '../../api/client';

export default function CustomerListPage() {
  const [customerList, setCustomerList] = useState<Array<Customer>>([]);

  useEffect(() => {
    api.get('/Customers').then((data) => setCustomerList(data as Customer[]));
  }, [])
  return (
    <div>{ JSON.stringify(customerList)}</div>
  )
}
