import { useEffect, useState } from 'react'
import type { Customer, PagedResult } from '../../types'
import { api } from '../../api/client';
import { Link } from 'react-router-dom';
import CustomerList from '../../components/customers/CustomerList';

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
    <div className='container'>
      <h1>Customers</h1>
      <CustomerList customers={customers} />
      <Link to="/customers/create">
        <button>Create New Customer</button>
      </Link>
    </div>
  )
}
