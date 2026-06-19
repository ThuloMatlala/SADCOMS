import { useEffect, useReducer, useState } from 'react'
import type { Order, PagedResult } from '../../types'
import { api } from '../../api/client';
import { Link } from 'react-router-dom';
import OrderList from '../../components/orders/OrderList';
import StatusFilter from '../../components/orders/StatusFilter';
import SortSelector from '../../components/orders/SortSelector';
import { PageHeader } from '../../components/common/PageHeader';
import { NumberPerPageSelector } from '../../components/common/Pagination/NumberPerPageSelector';
import { PageSelector } from '../../components/common/Pagination/PageSelector';

type FetchState = {
  orders: Order[];
  totalCount: number;
  loading: boolean;
  error: string | null;
};

type FetchAction =
  | { type: 'start' }
  | { type: 'success'; orders: Order[]; totalCount: number }
  | { type: 'error'; error: string };

function fetchReducer(state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case 'start':   return { ...state, loading: true, error: null };
    case 'success': return { loading: false, error: null, orders: action.orders, totalCount: action.totalCount };
    case 'error':   return { ...state, loading: false, error: action.error };
  }
}

export default function OrderListPage() {
  const [{ orders, totalCount, loading, error }, dispatch] = useReducer(fetchReducer, {
    orders: [],
    totalCount: 0,
    loading: true,
    error: null,
  });

  const [status, setStatus] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch({ type: 'start' });
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (customerId) params.set('customerId', customerId);
    if (status !== null) params.set('status', String(status));
    if (sort) params.set('sort', sort);
    api.get<PagedResult<Order>>(`/orders?${params}`)
      .then(data => dispatch({ type: 'success', orders: data.items, totalCount: data.totalCount }))
      .catch(err => dispatch({ type: 'error', error: err.message }));
  }, [customerId, status, sort, page, pageSize]);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value !== '' ? Number(e.target.value) : null);
    setPage(1);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className='container'>
      <PageHeader headerText={'Orders'} parentPageName={'Home'} parentPageLink={'/'} />

      <input
        type="search"
        placeholder="Filter by customer ID…"
        value={customerId}
        onChange={e => { setCustomerId(e.target.value); setPage(1); }}
      />

      <StatusFilter status={status} handleStatusChange={handleStatusChange} />
      <SortSelector sort={sort} setSort={setSort} setPage={setPage} />

      {error && <div>Error: {error}</div>}
      {loading ? <div>Loading...</div> : <OrderList orders={orders} />}

      {totalPages > 1 && (
        <PageSelector page={page} setPage={setPage} totalPages={totalPages} />
      )}
      <NumberPerPageSelector setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} />

      <Link to="/orders/new">
        <button>Create New Order</button>
      </Link>
    </div>
  );
}
