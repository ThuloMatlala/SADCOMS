import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApi } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

interface CustomerForm {
  name: string;
  email: string;
  countryCode: string;
}

export const CustomerCreateForm = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const api = createApi(token);
  const [form, setForm] = useState<CustomerForm>({ name: '', email: '', countryCode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'email') setEmailError(null)
  }

  const handleEmailBlur = () => {
    if (form.email && !isValidEmail(form.email)) {
      setEmailError('Please enter a valid email address')
    }
  }

  const handleSubmit = async(e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!isValidEmail(form.email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await api.post('/customers', form)
      navigate('/customers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div className='form-group'>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          required
        />
        {emailError && <span style={{ color: 'red', fontSize: '0.85em' }}>{emailError}</span>}
      </div>
      <div className='form-group'>
        <label htmlFor="countryCode">Country Code</label>
        <input
          id="countryCode"
          name="countryCode"
          value={form.countryCode}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className='form-full' style={{ color: 'red', margin: 0, fontSize: '9px' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create Customer'}
      </button>
    </form>
  )
}
