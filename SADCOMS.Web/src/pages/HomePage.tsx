import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  return (
    <div className='container'>
      <h1>SADC OMS</h1>
      <button onClick={() => navigate('/customers')}>Go to Customers</button>
      <button onClick={() => navigate('/orders')}>Go to Orders</button>
      {token && <button onClick={logout}>Logout</button>}
    </div>
  );
}
