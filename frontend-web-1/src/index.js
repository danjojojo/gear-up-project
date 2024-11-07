import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import moment from 'moment-timezone';


moment.tz.setDefault("Asia/Manila");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 
 