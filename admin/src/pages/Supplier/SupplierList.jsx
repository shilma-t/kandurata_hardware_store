import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import './SupplierList.css';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/suppliers/getSuppliers')
            .then(result => {
                setSuppliers(result.data);
                setFilteredSuppliers(result.data);
            })
            .catch(err => console.error("Error fetching suppliers:", err));
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = suppliers.filter(supplier => 
            (supplier.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (supplier.company_name || '').toLowerCase().includes(query.toLowerCase()) ||
            (supplier.product_name || '').toLowerCase().includes(query.toLowerCase()) ||
            (supplier.email || '').toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSuppliers(filtered);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5001/api/suppliers/deleteSupplier/${id}`)
            .then(res => {
                setMessage('Successfully deleted!');
                setTimeout(() => setMessage(''), 3000);
                setSuppliers(suppliers.filter(supplier => supplier._id !== id));
                setFilteredSuppliers(filteredSuppliers.filter(supplier => supplier._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleSort = (field) => {
        const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
            if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredSuppliers(sortedSuppliers);
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('Supplier List', 14, 20);
        
        filteredSuppliers.forEach((supplier, index) => {
            const { name, company_name, product_name, contact_number, email } = supplier;
            doc.text(`${index + 1}. Name: ${name}, Company: ${company_name}, Product: ${product_name}, Contact: ${contact_number}, Email: ${email}`, 14, 30 + (index * 10));
        });

        doc.save('suppliers.pdf');
    };

    return (
        <div className='supplier-list-container'>
           
            <div className="supplier-list-content">
                <div className="suppliers-container">
                    <div className="suppliers-wrapper">
                        <div className="suppliers-header">
                            <Link to="/addSupplier" className="btn btn-add">Add +</Link>
                            <form className="form-search">
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchQuery} 
                                    onChange={handleSearchChange} 
                                    className="form-control"
                                />
                                <button type="button" className="search-icon">
                                    <i className="fas fa-search"></i>
                                </button>
                            </form>
                            <div className="filter-wrapper">
                                <select onChange={(e) => {
                                    setSortField(e.target.value);
                                    handleSort(e.target.value);
                                }} value={sortField} className="form-select">
                                    <option value="name">Name</option>
                                    <option value="company_name">Company Name</option>
                                    <option value="product_name">Product Name</option>
                                    <option value="email">Email</option>
                                </select>
                                <button onClick={toggleSortOrder} className="btn btn-toggle-sort">
                                    {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                                </button>
                            </div>
                            <button onClick={generatePDF} className="btn btn-generate-pdf">Generate PDF</button>
                        </div>
                        {message && <div className="alert alert-success">{message}</div>}
                        {filteredSuppliers.length === 0 && <div className="alert alert-warning">No suppliers found based on your search criteria.</div>}
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Company Name</th>
                                    <th>Product Name</th>
                                    <th>Contact Number</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map(supplier => (
                                    <tr key={supplier._id}>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.company_name}</td>
                                        <td>{supplier.product_name}</td>
                                        <td>{supplier.contact_number}</td>
                                        <td>{supplier.email}</td>
                                        <td>
                                            <Link to={`/updateSupplier/${supplier._id}`} className="btn btn-edit">
                                               EDIT
                                            </Link>
                                            <button className="btn btn-delete" onClick={() => handleDelete(supplier._id)}>
                                               DELETE
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierList;
