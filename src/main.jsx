import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import { isSignedIn } from './services/authStorage.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
if (!isSignedIn()) {
  window.location.replace('/login.html');
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
