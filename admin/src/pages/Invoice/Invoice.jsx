import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Invoice.css';

const Invoice = () => {
  const { state } = useLocation();
  const initialItems = state?.invoiceItems || [];
  const [invoiceItems, setInvoiceItems] = useState(initialItems);
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = invoiceItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity, total: item.price * newQuantity };
      }
      return item;
    });
    setInvoiceItems(updatedItems);
  };

  // Handle product deletion
  const handleDelete = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  // Navigate back to the product list
  const handleBackToList = () => {
    navigate('/dashboard/cashier', { state: { invoiceItems } });
  };

  return (
    <div>
      <h2>Invoice</h2>
      <div className="invoice-table">
        <div className="invoice-table-header">
          <b>Name</b>
          <b>Price</b>
          <b>Quantity</b>
          <b>Total Price</b>
          <b>Action</b>
        </div>
        {invoiceItems.length > 0 ? (
          invoiceItems.map((item, index) => (
            <div key={index} className="invoice-table-row">
              <p>{item.name}</p>
              <p>{item.price}</p>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
              />
              <p>{item.total}</p>
              <button className="delete-button" onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No items added to the invoice</p>
        )}
      </div>

      {/* Back to List Button */}
      <button onClick={handleBackToList} className="back-button">
        Back to Product List
      </button>
    </div>
  );
};

export default Invoice;
