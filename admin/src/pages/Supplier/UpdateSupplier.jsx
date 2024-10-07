import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import axios from 'axios';
import LogisticsManagerSidebar from '../../components/LogisticsManagerSidebar/LogisticsManagerSidebar';
import './UpdateSupplier.css'

const UpdateSupplier = () => {
    const { id } = useParams(); // useParams is now defined
    const [name, setName] = useState('');
    const [company_name, setCompany_Name] = useState('');
    const [product_name, setProduct_Name] = useState('');
    const [contact_number, setContact_Number] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({}); // State to store validation errors
    const [duplicateError, setDuplicateError] = useState(''); // State for duplicate error message
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
        return re.test(email);
    };

    useEffect(() => {
        axios.get(`http://localhost:5001/api/suppliers/getUser/${id}`)
            .then(result => {
                setName(result.data.name);
                setCompany_Name(result.data.company_name);
                setProduct_Name(result.data.product_name);
                setContact_Number(result.data.contact_number);
                setEmail(result.data.email);
            })
            .catch(err => console.log(err));
    }, [id]);

    const Update = (e) => {
        e.preventDefault();
        // Clear previous errors
        let validationErrors = {};
        setDuplicateError(''); // Clear the duplicate error message before checking

        // Check if all fields are filled
        if (!name) validationErrors.name = 'Name is required';
        if (!company_name) validationErrors.company_name = 'Company Name is required';
        if (!product_name) validationErrors.product_name = 'Product Name is required';
        if (!contact_number) validationErrors.contact_number = 'Contact Number is required';
        if (!email) validationErrors.email = 'Email is required';

        // Validate contact number
        if (contact_number && !/^\d{10}$/.test(contact_number)) {
            validationErrors.contact_number = 'Contact number should be exactly 10 digits';
        }

        // Validate email format
        if (email && !validateEmail(email)) {
            validationErrors.email = 'Invalid email format';
        }

        // Set errors if there are any
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // If validation passes, send the update request
        axios.put(`http://localhost:5001/api/suppliers/UpdateUser/${id}`, { name, company_name, product_name, contact_number, email })
            .then(result => {
                console.log(result);
                navigate('/listSupplier');
            })
            .catch(err => {
                console.log(err);
                if (err.response) {
                    if (err.response.data.message === 'User with the same details already exists') {
                        setDuplicateError('This information already exists');
                    } else if (err.response.data.errors) {
                        setErrors(err.response.data.errors.reduce((acc, error) => {
                            acc[error.param] = error.msg;
                            return acc;
                        }, {}));
                    }
                }
            });
    };

    return (
        <div className='upd-supplier-container'>
            <LogisticsManagerSidebar />
            <div className="update-user-container">
                <div className="form-container">
                    <h2>Edit Supplier Information</h2>
                    <form onSubmit={Update}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyName" className="form-label">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                className="form-control"
                                placeholder="Enter Company Name"
                                value={company_name}
                                onChange={(e) => setCompany_Name(e.target.value)}
                            />
                            {errors.company_name && <div className="text-danger">{errors.company_name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                className="form-control"
                                placeholder="Enter Product Name"
                                value={product_name}
                                onChange={(e) => setProduct_Name(e.target.value)}
                            />
                            {errors.product_name && <div className="text-danger">{errors.product_name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                className="form-control"
                                placeholder="Enter Contact Number"
                                value={contact_number}
                                onChange={(e) => setContact_Number(e.target.value)}
                            />
                            {errors.contact_number && <div className="text-danger">{errors.contact_number}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>

                        {/* Display duplicate error message */}
                        {duplicateError && <div className="text-danger">{duplicateError}</div>}

                        <button
                            type="submit"
                            className="btn-update"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateSupplier;
