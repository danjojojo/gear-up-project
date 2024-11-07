import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import moment from 'moment';

// Make moment available globally
window.moment = moment;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 
 