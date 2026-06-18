import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

interface CustomerForm {
  name: string;
  email: string;
  countryCode: string;
}

export default function CustomerCreateForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CustomerForm>({ name: '', email: '', countryCode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: { target: { name: string; value: string } }) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
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
          required
        />
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
      {error && <p className='form-full' style={{ color: 'red', margin: 0 }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create Customer'}
      </button>
    </form>
  )
}
