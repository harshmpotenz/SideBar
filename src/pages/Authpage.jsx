import React, { useState } from 'react';
import '../css/AuthPage.css';
import { supabase } from '../utils/SupabaseClient';
import { Button } from '@mui/material';

const AuthPage = () => {
  const [error, setError] = useState('');
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_REDIRECT_URL || ""   
      }
    });
    if (error) console.error("OAuth error", error.message);
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <Button
          onClick={handleGoogleLogin}
          onError={() => {
            setError('Google login failed');
            console.log('Login Failed');
          }}
        >Login</Button>

        {error && <div className="error-message">{error}</div>}

    

        
      </div>
    </div>
  );
};

export default AuthPage;