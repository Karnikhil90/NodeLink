import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // When a new service worker is available, show a notification
    if (registration?.waiting) {
      // Create a custom dialog element
      const dialog = document.createElement('div');
      dialog.style.position = 'fixed';
      dialog.style.top = '20px';
      dialog.style.right = '20px';
      dialog.style.backgroundColor = '#fff';
      dialog.style.padding = '20px';
      dialog.style.borderRadius = '8px';
      dialog.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      dialog.style.zIndex = '9999';

      const message = document.createElement('p');
      message.textContent = 'New version available!';
      dialog.appendChild(message);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '10px';
      buttonContainer.style.marginTop = '10px';

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.style.padding = '8px 16px';
      updateButton.style.backgroundColor = '#1976d2';
      updateButton.style.color = '#fff';
      updateButton.style.border = 'none';
      updateButton.style.borderRadius = '4px';
      updateButton.style.cursor = 'pointer';

      const dismissButton = document.createElement('button');
      dismissButton.textContent = 'Dismiss';
      dismissButton.style.padding = '8px 16px';
      dismissButton.style.backgroundColor = '#f5f5f5';
      dismissButton.style.border = '1px solid #ddd';
      dismissButton.style.borderRadius = '4px';
      dismissButton.style.cursor = 'pointer';

      buttonContainer.appendChild(updateButton);
      buttonContainer.appendChild(dismissButton);
      dialog.appendChild(buttonContainer);

      document.body.appendChild(dialog);

      updateButton.onclick = () => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        dialog.remove();
      };

      dismissButton.onclick = () => {
        dialog.remove();
      };
    }
  },
  onSuccess: (registration) => {
    console.log('Service Worker registered successfully:', registration);
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 