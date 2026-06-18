import { useEffect, useState } from 'react'
import type { Customer, PagedResult } from '../../types'
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import CustomerList from '../../components/customers/CustomerList';

export default function CustomerListPage() {
  const navigate = useNavigate();
  
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
      <CustomerList customers={customers} />
      <button onClick={() => navigate('/customers/create')}>Create New Customer</button>
    </div>
  )
}
