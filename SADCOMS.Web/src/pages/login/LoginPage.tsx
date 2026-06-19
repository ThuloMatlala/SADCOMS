import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom";

interface LoginForm{
  password:string
}

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<LoginForm>({ password: '' })

  const handleSubmit = async (e: { preventDefault(): void }) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    await login(form.password);
    navigate('/');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Invalid password');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
}
  
  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="login-form">
      <div className='form-group'>
        <label htmlFor="name">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        </div>
        {error && <p className="form-full" style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying credentials...' : 'Get Started'}
        </button>
      </form>
    </div>
  )
}
