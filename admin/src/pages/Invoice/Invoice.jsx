import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import jsPDF auto-table plugin
import './Invoice.css';

const Invoice = () => {
  const { state } = useLocation();
  const initialItems = state?.invoiceItems || [];
  const [invoiceItems, setInvoiceItems] = useState(initialItems);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [invoiceNumber] = useState(`INV-${Date.now()}`); // Generate a unique invoice number
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const item = invoiceItems[index];

    // Check if the new quantity is valid
    if (newQuantity < 1 || newQuantity > item.availableQuantity || isNaN(newQuantity)) {
      alert(`Quantity must be between 1 and ${item.availableQuantity}`);
      return;
    }

    // Update the quantity and total for the item
    const updatedItems = invoiceItems.map((item, i) => {
      if (i === index) {
        return { 
          ...item, 
          quantity: newQuantity, 
          total: item.price * newQuantity 
        };
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

  // Calculate total price
  const calculateTotal = () => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
    return subtotal - discount; // Apply discount
  };

  // Navigate back to the product list
  const handleBackToList = () => {
    navigate('/dashboard/cashier', { state: { invoiceItems } });
  };

  // Function to generate PDF invoice
  // Function to generate PDF invoice
const generatePDF = async () => {
  // Check if customer name is provided
  if (!customerName) {
    alert('Please enter the customer name before generating the invoice.');
    return;
  }

  // Check if any quantity is invalid (less than 1 or not provided)
  for (const item of invoiceItems) {
    if (!item.quantity || item.quantity < 1 || item.quantity > item.availableQuantity) {
      alert(`Invalid quantity for item ${item.name}. Please ensure all quantities are at least 1 and not more than available quantity.`);
      return;
    }
  }

  const doc = new jsPDF();

  // Add invoice number
  doc.text(`Invoice Number: ${invoiceNumber}`, 10, 10);
  
  // Add customer name
  doc.text(`Customer Name: ${customerName}`, 10, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);
  
  // Define table columns
  const columns = ['Item', 'Quantity', 'Price', 'Subtotal'];
  const rows = invoiceItems.map(item => [
    item.name,
    item.quantity,
    item.price.toFixed(2),
    item.total.toFixed(2),
  ]);
  
  // Add table to PDF
  doc.autoTable(columns, rows, { startY: 40 });
  
  // Calculate totals
  const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal - discount;
  
  // Add discount and total
  doc.text(`Discount: LKR ${discount.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
  doc.text(`Total: LKR ${total.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 20);
  
  // Save the PDF
  doc.save('invoice.pdf');

  // Save invoice to the database
  try {
    const response = await fetch('http://localhost:5001/api/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceNumber,
        customerName,
        items: invoiceItems,
        discount,
        totalAmount: total
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert('Invoice created successfully!');

      // Update product quantities
      await updateProductQuantities();

      // Reset invoice state
      setInvoiceItems([]); // Reset items
      setCustomerName(''); // Reset customer name
      setDiscount(0); // Reset discount
    } else {
      alert('Failed to create invoice.');
    }
  } catch (error) {
    alert('Error occurred while creating the invoice.');
    console.error(error);
  }
};

  // Function to update product quantities
  const updateProductQuantities = async () => {
    try {
      await Promise.all(
        invoiceItems.map(async (item) => {
          const response = await fetch(`http://localhost:5001/api/product/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: item._id, // Assuming the product item has an `_id` field
              quantity: item.availableQuantity - item.quantity, // Update quantity
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Failed to update quantity for ${item.name}`);
          }
        })
      );
      alert('Product quantities updated successfully!');
    } catch (error) {
      console.error('Error updating product quantities:', error);
      alert('Error occurred while updating product quantities.');
    }
  };
  
  

  // Update the discount handler
  const handleDiscountChange = (value) => {
    const newDiscount = parseFloat(value);
    const total = calculateTotal(); // Calculate total without the discount

    // Ensure the discount does not exceed the total
    if (newDiscount > total) {
      alert('Discount cannot be more than the total amount.');
      setDiscount(total); // Set discount to total if it exceeds
    } else {
      setDiscount(newDiscount); // Update discount if valid
    }
  };

  return (
    <div className='Invoice'>
      <h2>Invoice</h2>

      {/* Customer Name Input */}
      <div className="customer-name">
        <label>Customer Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
        />
      </div>

      <div className="invoice-table">
        <div className="invoice-table-header">
          <b>Name</b>
          <b>Available</b>
          <b>Price</b>
          <b>Quantity</b>
          <b>Total Price</b>
          <b>Action</b>
        </div>
        {invoiceItems.length > 0 ? (
          invoiceItems.map((item, index) => (
            <div key={index} className="invoice-table-row">
              <p>{item.name}</p>
              <p>{item.availableQuantity}</p>
              <p>{item.price}</p>
              <input
                type="number"
                value={item.quantity}
                min="1"
                max={item.availableQuantity} // Set max to available quantity
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                required // Ensure the field is required
              />
              <p>{item.total.toFixed(2)}</p>
              <button className="delete-button" onClick={() => handleDelete(index)}>
                X
              </button>
            </div>
          ))
        ) : (
          <p>No items added to the invoice</p>
        )}
      </div>

      {/* Discount Input */}
      <div className="discount-section">
        <label>Discount:</label>
        <input
          type="number"
          value={discount}
          min="0"
          onChange={(e) => handleDiscountChange(e.target.value)}
          placeholder="Enter discount amount"
        />
      </div>

      {/* Total Price Display */}
      <div className="total-price">
        <h3>Total: LKR {calculateTotal().toFixed(2)}</h3>
      </div>

      {/* Generate Invoice Button */}
      <button onClick={generatePDF} className="generate-button">
        Generate Bill
      </button>

      {/* Back to List Button */}
      <button onClick={handleBackToList} className="back-button">
        Back to Product List
      </button>
    </div>
  );
};

export default Invoice;
