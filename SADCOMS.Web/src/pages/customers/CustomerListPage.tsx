import { useEffect, useReducer, useState } from 'react'
import type { Customer, PagedResult } from '../../types'
import { createApi } from '../../api/client';
import { Link } from 'react-router-dom';
import {CustomerList} from '../../components/customers/CustomerList';
import {PageHeader} from '../../components/common/PageHeader';
import { NumberPerPageSelector } from '../../components/common/Pagination/NumberPerPageSelector';
import { PageSelector } from '../../components/common/Pagination/PageSelector';
import { useAuth } from '../../hooks/useAuth';


type FetchState = {
  customers: Customer[];
  totalCount: number;
  loading: boolean;
  error: string | null;
};

type FetchAction =
  | { type: 'start' }
  | { type: 'success'; customers: Customer[]; totalCount: number }
  | { type: 'error'; error: string };

const fetchReducer = (state: FetchState, action: FetchAction): FetchState  =>{
  switch (action.type) {
    case 'start':   return { ...state, loading: true, error: null };
    case 'success': return { loading: false, error: null, customers: action.customers, totalCount: action.totalCount };
    case 'error':   return { ...state, loading: false, error: action.error };
  }
}

export const CustomerListPage=()=> {;
  const { token } = useAuth();
  const api = createApi(token);

  const [{ customers, totalCount, loading, error }, dispatch] = useReducer(fetchReducer, {
    customers: [],
    totalCount: 0,
    loading: true,
    error: null,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    dispatch({ type: 'start' });
    const params = new URLSearchParams({
      search,
      page: String(page),
      pageSize: String(pageSize),
    });
    api.get<PagedResult<Customer>>(`/customers?${params}`)
      .then(data => dispatch({ type: 'success', customers: data.items, totalCount: data.totalCount }))
      .catch(err => dispatch({ type: 'error', error: err.message }));
  }, [search, page, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className='container'>
      <PageHeader headerText={'Customers'} parentPageName={'Home'} parentPageLink={'/'} />
      <input
        type="search"
        placeholder="Search by name, email or country…"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      {error && <div>Error: {error}</div>}
      {loading ? <div>Loading...</div> : <CustomerList customers={customers} search={search} />}
      {totalPages > 1 && (
        <PageSelector page={page} setPage={setPage} totalPages={totalPages}/>
      )}

      <NumberPerPageSelector setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} />

      <Link to="/customers/create">
        <button>Create New Customer</button>
      </Link>
    </div>
  )
}
