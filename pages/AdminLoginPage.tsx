
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { X } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    // Focus the username input field when the component mounts
    usernameInputRef.current?.focus();
  }, []);


  // If user is already authenticated, redirect them away from the login page.
  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await auth.login(username, password);
      // Navigation is handled by the declarative <Navigate> component above
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-10 rounded-xl shadow-lg animate-slide-up-fade-in">
        <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-dark-subtext dark:hover:text-dark-text transition-colors" aria-label="Close login panel">
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-brand-primary dark:text-dark-text">
            Admin Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                ref={usernameInputRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-dark-border dark:placeholder-dark-subtext dark:text-dark-text"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-dark-border dark:placeholder-dark-subtext dark:text-dark-text"
                placeholder="Password (password)"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
