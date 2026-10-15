import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shared form for Login and Register
export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">{isRegister ? 'Create account' : 'Welcome back'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        {isRegister && <input className="form-control mb-3" name="name" placeholder="Full name" value={form.name} onChange={change} required />}
        <input className="form-control mb-3" type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
        <input className="form-control mb-3" type="password" name="password" placeholder="Password (min 6 chars)" minLength={6} value={form.password} onChange={change} required />
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Please wait...' : isRegister ? 'Sign up' : 'Login'}</button>
      </form>
      <p className="mt-3 text-center">
        {isRegister ? <>Already have an account? <Link to="/login">Login</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
    </div>
  );
}
