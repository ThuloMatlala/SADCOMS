import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import CustomerListPage from './pages/customers/CustomerListPage';
import './App.css'
import CustomerCreatePage from './pages/customers/create/CustomerCreatePage';
import OrderListPage from './pages/orders/OrderListPage';
import CreateOrderPage from './pages/orders/new/CreateOrderPage';
import OrderDetailPage from './pages/orders/[id]/OrderDetailPage';

function Home() {
  const navigate = useNavigate();
  return (
    <div className='container'>
      <button onClick={() => navigate('/customers')}>Go to Customers</button>
      <button onClick={() => navigate('/orders')}>Go to Orders</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/create" element={<CustomerCreatePage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/new" element={<CreateOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
