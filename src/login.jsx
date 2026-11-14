import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './components/Login.jsx';
import './login.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>
);