import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SpeedInsights } from "@vercel/speed-insights/react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//how is itttt?

root.render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);
reportWebVitals(); 