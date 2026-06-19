import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {CustomerListPage} from './pages/customers/CustomerListPage';
import './App.css'
import {CustomerCreatePage} from './pages/customers/create/CustomerCreatePage';
import {OrderListPage} from './pages/orders/OrderListPage';
import {CreateOrderPage} from './pages/orders/new/CreateOrderPage';
import {OrderDetailPage} from './pages/orders/[id]/OrderDetailPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/login/LoginPage';
import { Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={<ProtectedRoute><CustomerListPage /></ProtectedRoute>} />
          <Route path="/customers/create" element={<ProtectedRoute><CustomerCreatePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
          <Route path="/orders/new" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
      </Routes>
      </BrowserRouter>
      </AuthProvider>
  )
}

export default App
