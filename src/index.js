import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.querySelector('.whatsappwidget'));
const widget = document.querySelector('.whatsappwidget');
root.render(
  <React.StrictMode>
    <App
      show={widget.dataset.status}
      chat={widget.dataset.chat}
      clientid={widget.dataset.clientid}
    />
  </React.StrictMode>
);
