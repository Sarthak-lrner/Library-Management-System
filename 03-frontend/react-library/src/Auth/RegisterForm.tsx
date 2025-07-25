import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import authService ,{ RegisterData } from '../Api/authService';

export const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.registerUser(form);
      alert('Registration successful! You can now login.');
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'USER' });
      history.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="text-center mt-3">
        <p>Already have an account?</p>
        <Link to="/login" className="btn btn-outline-primary w-100">
          Sign In
        </Link>
      </div>
    </div>
  );
};
