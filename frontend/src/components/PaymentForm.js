import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import '../styles/PaymentForm.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      
      // Create payment intent on your server
      const response = await fetch('http://localhost:5002/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Confirm the payment
      const { error: stripeError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: event.target.card.elements.getElement('card'),
          billing_details: {
            name: event.target.name.value,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <label htmlFor="card">Card Details</label>
        <div id="card" className="card-element" />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={isProcessing}
        className="payment-button"
      >
        {isProcessing ? 'Processing...' : 'Make Donation'}
      </button>
    </form>
  );
};

export default PaymentForm;
