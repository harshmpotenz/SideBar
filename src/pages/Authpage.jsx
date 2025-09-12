import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import '../css/AuthPage.css';
import { supabase } from '../utils/SupabaseClient';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUsers) {
          throw new Error('Email already exists');
        }

        const { error } = await signUp(email, password);
        if (error) throw error;

        setMessage('Check your email for verification link!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async (credentialResponse) => {
  //   setError('');
  //   setLoading(true);

  //   try {
  //     // Sign in with Supabase OAuth using Google provider
  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         // Pass the Google access token from the credentialResponse
          
  //         access_token: credentialResponse.credential,
          
  //       },
  //     });

  //     if (error) throw error;

  //   } catch (error) {
  //     setError(error.message || 'Google login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // LoginButton.jsx

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173"  // must match Supabase dashboard
      }
    });
    if (error) console.error("OAuth error", error.message);
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <Button
          onClick={handleGoogleLogin}
          onError={() => {
            setError('Google login failed');
            console.log('Login Failed');
          }}
        >Login</Button>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

    

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="toggle-link"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;