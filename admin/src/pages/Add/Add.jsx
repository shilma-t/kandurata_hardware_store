import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the CSS for react-confirm-alert

const Add = () => {
  const url = "http://localhost:5001"; // Updated URL for API
  const [image, setImage] = useState(null);
  const [productId, setProductId] = useState('');
  const [date, setDate] = useState('');
  const [data, setData] = useState({
    name: "",
    description: "",
    wholesalePrice: "",
    retailPrice: "",
    quantity: "",
    category: "",
    supplierName: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Ensure wholesale price is not greater than retail price
    if (parseFloat(data.wholesalePrice) > parseFloat(data.retailPrice)) {
      alert('Wholesale price cannot be more than retail price!');
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("wholesalePrice", data.wholesalePrice);
    formData.append("retailPrice", data.retailPrice);
    formData.append("quantity", data.quantity);
    formData.append("supplierName", data.supplierName);
    formData.append("date", date);

    try {
      const response = await axios.post(`${url}/api/product/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          wholesalePrice: "",
          retailPrice: "",
          quantity: "",
          category: "",
          supplierName: ""
        });
        setImage(null);
        setProductId('');
        setDate('');

        confirmAlert({
          title: 'Product Added',
          message: 'The product has been successfully added.',
          buttons: [
            {
              label: 'OK',
              onClick: () => {}
            }
          ]
        });
      } else {
        console.error('Error response:', response.data);
        alert('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product');
    }
  };

  // Handle file change for image upload
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Generate a unique product ID (for simplicity, using a random number)
  useEffect(() => {
    const generateProductId = () => {
      const id = 'PROD-' + Math.floor(Math.random() * 1000000);
      setProductId(id);
    };
    generateProductId();

    // Get the current system date
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        {/* Product ID - Auto-generated */}
        <div className="add-product-id">
          <p>Product ID</p>
          <input type="text" name='productId' value={productId} readOnly />
        </div>

        {/* Upload Image */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={handleImageChange} type="file" id="image" hidden />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input type="text" name='name' placeholder='Type here' value={data.name} onChange={onChangeHandler} required />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea name="description" rows="6" placeholder='Write content here' value={data.description} onChange={onChangeHandler}></textarea>
        </div>

        {/* Category, Price, and Quantity */}
        <div className="add-category-price-quantity">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" value={data.category} onChange={onChangeHandler} required>
              <option value="">Select a category</option>
              <option value="Building and Hardware">Building and Hardware</option>
              <option value="Safety Gear">Safety Gear</option>
              <option value="Paint">Paint</option>
              <option value="Tools">Tools</option>
              <option value="Storage">Storage</option>
              <option value="Lighting">Lighting</option>
              <option value="Gardening">Gardening</option>
              <option value="Fasteners">Fasteners</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Wholesale Price</p>
            <input type="number" name='wholesalePrice' placeholder='LKR 100' value={data.wholesalePrice} onChange={onChangeHandler} required />
            <p>Retail Price</p>
            <input type="number" name='retailPrice' placeholder='LKR 100' value={data.retailPrice} onChange={onChangeHandler} required />
          </div>

          <div className="add-quantity flex-col">
            <p>Quantity</p>
            <input type="number" name='quantity' placeholder='Enter quantity' value={data.quantity} onChange={onChangeHandler} required />
          </div>
        </div>

        {/* Supplier Name */}
        <div className="add-supplier-name flex-col">
          <p>Supplier Name</p>
          <input type="text" name='supplierName' placeholder='Enter supplier name' value={data.supplierName} onChange={onChangeHandler} required />
        </div>

        {/* System Date */}
        <div className="add-date">
          <p>Date</p>
          <input type="text" name='date' value={date} readOnly />
        </div>

        {/* Submit Button */}
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
