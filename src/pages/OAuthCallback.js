import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const access = searchParams.get('access');
      const refresh = searchParams.get('refresh');

      if (access && refresh) {
        try {
          await loginWithTokens(access, refresh);
          navigate('/');
        } catch (error) {
          navigate('/login?error=oauth_failed');
        }
      } else {
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithTokens]);

  return (
    <div className="loading">
      Completing authentication...
    </div>
  );
};

export default OAuthCallback;
