import React, { useState } from 'react';
import Razorpay from 'razorpay';

const PaymentForm = ({ amount, onSuccess, onError, eventId }) => {
  const [paymentId, setPaymentId] = useState(null);

  const options = {
    key: 'rzp_test_4LD859IhYLd0'
    , // Replace with your Razorpay key
    amount: amount * 100,
    currency: 'INR',
    name: 'Event Booking',
    description: 'Payment for Event Booking',
    order_id: paymentId,
    handler: async (response) => {
      // Handle successful payment
      onSuccess(response);

      // Optionally, update the event status or perform other actions
      // For example, you can update the event status in Firebase
      // const eventRef = doc(txtDB, "events", eventId);
      // await updateDoc(eventRef, { status: 'paid' });
    },
    prefill: {
      name: 'User Name',
      email: 'user@example.com',
      contact: '1234567890',
    },
    theme: {
      color: '#3399cc',
    },
  };

  const razorpay = new Razorpay(options);

  const initiatePayment = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      setPaymentId(data.paymentId);

      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      onError();
    }
  };

  return (
    <div>
      <button onClick={initiatePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentForm;