import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RobpA35rvDoogtABAh2rj7iRg20EC07ro7vWQlqsDqUUESPit8ouZTw09j7flU3JZhR231YnuaAPMYBG2jiEbA800PIN1hqqc');
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Elements stripe={stripePromise}>

        <App />

      </Elements>
    </AuthProvider>
  </BrowserRouter>
);


