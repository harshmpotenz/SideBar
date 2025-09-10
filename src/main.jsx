import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="923891201853-rtrs5p1fvr4ibtunrkb6s160ke62jcol.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

