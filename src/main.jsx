import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Store from './Config/Store';
import './index.css'
import App from './App.jsx'
import { AdminProvider } from '../src/context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={Store}> 
    <BrowserRouter>
    <AdminProvider>
      <App />
      </AdminProvider>
    </BrowserRouter>
    
  </Provider>
);


