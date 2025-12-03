import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const access = searchParams.get('access');
    const refresh = searchParams.get('refresh');

    if (access && refresh) {
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Update auth context
      login({ access, refresh });

      // Redirect to home
      navigate('/');
    } else {
      // OAuth failed, redirect to login
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="loading">
      Completing authentication...
    </div>
  );
};

export default OAuthCallback;
