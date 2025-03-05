import React from "react";
import App from "./App";
//import "bootstrap/dist/css/bootstrap.css";
//import "font-awesome/css/font-awesome.css";
//import "animate.css/animate.compat.css";
// import "./scss/main.scss";
// import "./style.css"
import "./index.css";
import { createRoot } from 'react-dom/client';

// Add global debug logging
if (import.meta.env.DEV) {
  window.addEventListener('fetch', (event) => {
    console.log('Network request:', event.request.url);
  });
  
  console.log('React version:', React.version);
  console.log('Environment:', import.meta.env.MODE);
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
