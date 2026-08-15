import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/index';

// Automatic reset for security update
const APP_VERSION = '1.1';
if (localStorage.getItem('taskflow_version') !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem('taskflow_version', APP_VERSION);
  window.location.reload();
}

createRoot(document.getElementById('root')!).render(
 <StrictMode>
 <App />
 </StrictMode>,
)
