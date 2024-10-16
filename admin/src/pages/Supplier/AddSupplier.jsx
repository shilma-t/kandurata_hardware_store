import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AddSupplier.css';

const AddSupplier = () => {
  const [name, setName] = useState('');
  const [company_name, setCompany_Name] = useState('');
  const [product_name, setProduct_Name] = useState(''); // Optional
  const [contact_number, setContact_Number] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({}); // Store validation errors
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!company_name) newErrors.company_name = 'Company Name is required';
    if (!contact_number) {
      newErrors.contact_number = 'Contact Number is required';
    } else if (!/^\d{10}$/.test(contact_number)) {
      newErrors.contact_number = 'Contact Number must be exactly 10 digits';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  // Form submission handler
  const Submit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Set errors if validation fails
      return;
    }
    setErrors({}); // Clear errors

    // API call to create a new supplier
    axios
      .post('http://localhost:5001/api/suppliers/createSupplier', {
        name,
        company_name,
        product_name, // Optional
        contact_number,
        email,
      })
      .then(() => {
        navigate('/listSupplier'); // Navigate to the supplier list
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          setErrors({ ...errors, duplicate: err.response.data.message });
        } else {
          console.error(err);
          setErrors({ ...errors, generic: 'An error occurred. Please try again.' });
        }
      });
  };

  return (
    <div className='add-supplier-container'>
      <div className="DriverListSidebar">
        <ul>
          <li><Link to="/logistics">Dashboard</Link></li>
          <li><Link to="/addSupplier">Add Supplier</Link></li>
          <li><Link to="/listSupplier">List Supplier </Link></li>
        </ul>
      </div>
        <div className='create-user-container'>
        
            <h2>Supplier Management</h2>
            <form onSubmit={Submit}>
              <div className='mb-3 text-start'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input
                  type='text'
                  id='name'
                  className='form-control'
                  placeholder='Enter Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className='text-danger'>{errors.name}</div>}
              </div>
              <div className='mb-3 text-start'>
                <label htmlFor='companyName' className='form-label'>Company Name</label>
                <input
                  type='text'
                  id='companyName'
                  className='form-control'
                  placeholder='Enter Company Name'
                  value={company_name}
                  onChange={(e) => setCompany_Name(e.target.value)}
                />
                {errors.company_name && <div className='text-danger'>{errors.company_name}</div>}
              </div>
              <div className='mb-3 text-start'>
                <label htmlFor='productName' className='form-label'>Product Name (Optional)</label>
                <input
                  type='text'
                  id='productName'
                  className='form-control'
                  placeholder='Enter Product Name (Optional)'
                  value={product_name}
                  onChange={(e) => setProduct_Name(e.target.value)}
                />
              </div>
              <div className='mb-3 text-start'>
                <label htmlFor='contactNumber' className='form-label'>Contact Number</label>
                <input
                  type='tel'
                  id='contactNumber'
                  className='form-control'
                  placeholder='Enter Contact Number'
                  value={contact_number}
                  onChange={(e) => setContact_Number(e.target.value)}
                />
                {errors.contact_number && <div className='text-danger'>{errors.contact_number}</div>}
              </div>
              <div className='mb-3 text-start'>
                <label htmlFor='email' className='form-label'>Email</label>
                <input
                  type='email'
                  id='email'
                  className='form-control'
                  placeholder='Enter Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className='text-danger'>{errors.email}</div>}
              </div>
              {errors.duplicate && <div className='text-danger'>{errors.duplicate}</div>}
              {errors.generic && <div className='text-danger'>{errors.generic}</div>}
              <button type='submit' className='btn-submit'>Submit</button>
            </form>
          </div>
        </div>
  );
};

export default AddSupplier;
