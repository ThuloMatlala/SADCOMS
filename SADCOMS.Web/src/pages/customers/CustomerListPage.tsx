import { useEffect, useState } from 'react'
import type { Customer, PagedResult } from '../../types'
import { api } from '../../api/client';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PagedResult<Customer>>('/customers')
      .then(data => setCustomers(data.items))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ul>
        {customers.map(c => (
          <li className='text-white' key={c.id}>{c.name} — {c.email} ({c.countryCode})</li>
        ))}
      </ul>
      </div>
  )
}
