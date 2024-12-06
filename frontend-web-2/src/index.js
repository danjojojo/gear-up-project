import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.scss"
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='944431468690-iited8t3bj1i37emdfvg0gdem7v0p60b.apps.googleusercontent.com'>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

