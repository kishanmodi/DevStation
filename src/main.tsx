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

// once the app is up we can remove the static mobile warning (if it still
// exists). we do this after rendering rather than on DOMContentLoaded so that
// the message stays visible until react has actually taken over.
const splash = document.getElementById('mobile-warning');
if (splash) {
  splash.style.display = 'none';
}
