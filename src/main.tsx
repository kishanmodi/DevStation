import React from 'react';
import './index.css';
import {createRoot} from 'react-dom/client';
import App from './App';

// entry point for the application - render the main App component
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
