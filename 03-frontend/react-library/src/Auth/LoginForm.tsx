import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginForm: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { login, isLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);





  // If already logged in, redirect to home or from page
  if (isLoggedIn) {
    const redirectTo = location.state?.from?.pathname || '/home';
    return <Redirect to={redirectTo} />;
  }




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = await login(email, password);

    if (success) {
      // Redirect to the page user wanted before login or home
      const redirectTo = location.state?.from?.pathname || '/home';
      history.replace(redirectTo);
    } else {
      setError('Invalid email or password');
    }
  };

  const redirectToRegister = () => {
    history.push('/register');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            id="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      <hr />
      <p className="text-center mt-3">Don't have an account?</p>
      <button onClick={redirectToRegister} className="btn btn-outline-secondary w-100">
        Sign Up
      </button>
    </div>
  );
};
