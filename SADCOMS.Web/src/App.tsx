import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import CustomerListPage from './pages/customers/CustomerListPage';
import './App.css'
import CustomerCreatePage from './pages/customers/create/CustomerCreatePage';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={() => navigate('/customers')}>Go to Customers</button>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
