import { useEffect, useState } from 'react'
import type { Customer, PagedResult } from '../../types'
import { api } from '../../api/client';
import { Link } from 'react-router-dom';
import CustomerList from '../../components/customers/CustomerList';
import PageHeader from '../../components/common/PageHeader';

export default function CustomerListPage() {

  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<PagedResult<Customer>>('/customers')
      .then(data => setCustomers(data.items))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const query = search.toLowerCase();
  const filtered = query
    ? customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.countryCode.toLowerCase().includes(query)
      )
    : customers;

  return (
    <div className='container'>
      <PageHeader headerText={'Customers'} parentPageName={'Home'} parentPageLink={'/'} />
      <input
        type="search"
        placeholder="Search by name, email or country…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <CustomerList customers={filtered} search={search} />
      <Link to="/customers/create">
        <button>Create New Customer</button>
      </Link>
    </div>
  )
}
