import "antd/dist/reset.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { App as AntdApp } from "antd";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AntdApp>
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AntdApp>
);

reportWebVitals();
