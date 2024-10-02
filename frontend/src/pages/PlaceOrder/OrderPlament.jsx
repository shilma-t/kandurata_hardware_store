import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderPlacement.css'; 

const OrderPlacement = () => {
  const location = useLocation();
  const { state } = location;
  const { totalAmount, deliveryFee, firstName, lastName, address, phone } = state || {};

  const handlePlaceOrder = () => {
    // Handle order placement logic here
    console.log('Order placed successfully');
    // Optionally redirect to home or another page
    // window.location.href = '/';
  };

  const handleBackToHome = () => {
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <div className='order-placement'>
      <h2>Order Summary</h2>
      <p>Subtotal: Rs.{totalAmount - deliveryFee}</p>
      <p>Delivery Fee: Rs.{deliveryFee}</p>
      <p>Total: Rs.{totalAmount}</p>
      <div className='order-details'>
        <p><strong>Delivery Information:</strong></p>
        <p>Name: {firstName} {lastName}</p>
        <p>Address: {address}</p>
        <p>Phone: {phone}</p>
      </div>
      <div className='order-buttons'>
        <button onClick={handlePlaceOrder}>Place Order</button>
        <button onClick={handleBackToHome}>Back to Home</button>
      </div>
    </div>
  );
}

export default OrderPlacement;
