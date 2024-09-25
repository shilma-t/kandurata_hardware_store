import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';

import './UpdateModal.css'; // Assuming you saved the CSS above in this file
import { assets } from '../../assets/assets';

const UpdateModal = ({ isOpen, onRequestClose, product, onUpdate }) => {
  const url = "http://localhost:5001";

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [date, setDate] = useState('');

  // Define categories as options for the dropdown
  const categories = [
    'Building and Hardware', 
    'Safety Gear', 
    'Paint', 
    'Tools', 
    'Storage', 
    'Lighting', 
    'Gardening', 
    'Fasteners'
  ];

  useEffect(() => {
    if (product && isOpen) {
      setName(product.name);
      setDescription(product.description);
      setWholesalePrice(product.wholesalePrice);
      setRetailPrice(product.retailPrice);
      setQuantity(product.quantity);
      setCategory(product.category);
      setSupplierName(product.supplierName);
      setDate(product.date.split('T')[0]); // Split to handle date formatting if necessary
    }
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/product/update`, {
        id: product._id,   // Make sure _id is being sent to the backend
        name,
        description,
        wholesalePrice: parseFloat(wholesalePrice), 
        retailPrice: parseFloat(retailPrice),     
        quantity: parseInt(quantity),               // Ensure quantity is an integer
        category,
        supplierName,
        date: new Date(date),                       // Ensure the date is in proper format
      });

      if (response.data.success) {
        toast.success("Product updated successfully!");
        onUpdate(); // Call the onUpdate to refresh product list
        onRequestClose(); // Close modal after successful update
      } else {
        toast.error("Error updating product");
      }
    } catch (error) {
      toast.error("Network Error");
      console.error("Error updating product:", error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      ariaHideApp={false}
      overlayClassName="update-modal-overlay"
      className="update-modal-content"
    >
      <div className="update-modal-title">
        <h2>Edit Product</h2>
        <img src={assets.cross_icon} onClick={onRequestClose} alt="Close" />
      </div>
      <form onSubmit={handleSubmit} className="update-modal-input">
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4"></textarea>
        </div>
        <div>
          <label>Wholesale Price:</label>
          <input type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} required />
        </div>
        <div>
          <label>Retail Price:</label>
          <input type="number" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>

        {/* Replace Category input with Dropdown */}
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Supplier Name:</label>
          <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="update-modal-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateModal;
