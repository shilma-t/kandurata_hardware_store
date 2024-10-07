import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import LogisticsManagerSidebar from "../../components/LogisticsManagerSidebar/LogisticsManagerSidebar";
import './SupplierList.css';

const SupplierList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/suppliers/getUsers')
            .then(result => {
                setUsers(result.data);
                setFilteredUsers(result.data);
            })
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        const filtered = users.filter(user => 
            (user.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (user.company_name || '').toLowerCase().includes(query.toLowerCase()) ||
            (user.product_name || '').toLowerCase().includes(query.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };
    

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5001/api/suppliers/deleteUser/${id}`)
            .then(res => {
                setMessage('Successfully deleted!');
                setTimeout(() => setMessage(''), 3000);
                setUsers(users.filter(user => user._id !== id));
                setFilteredUsers(filteredUsers.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    const generateReport = () => {
        if (selectedUsers.length === 0) {
            alert("Please select at least one user to generate a report.");
            return;
        }

        axios.post('http://localhost:5001/api/suppliers/generateReport', { userIds: selectedUsers }, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'SupplierManagementReport.pdf');
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => console.log(err));
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const modifier = sortOrder === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -1 * modifier;
        if (a[sortField] > b[sortField]) return 1 * modifier;
        return 0;
    });

    // Handle select all users
    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]); // Deselect all if everything is selected
        } else {
            setSelectedUsers(filteredUsers.map(user => user._id)); // Select all filtered users
        }
    };

    // Handle individual user selection
    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId)); // Deselect the user
        } else {
            setSelectedUsers([...selectedUsers, userId]); // Select the user
        }
    };


    return (
        <div className='supplier-list-container'>
            <LogisticsManagerSidebar />
            <div className="supplier-list-content">
                <div className="users-container">
                    <div className="users-wrapper">
                        <div className="users-header">
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
                                <select onChange={(e) => setSortField(e.target.value)} value={sortField} className="form-select">
                                    <option value="name">Name</option>
                                    <option value="company_name">Company Name</option>
                                    <option value="product_name">Product Name</option>
                                    <option value="email">Email</option>
                                </select>
                                <button onClick={toggleSortOrder} className="btn btn-sort">
                                    <i className="fas fa-filter"></i>
                                </button>
                                <button onClick={generateReport} className="btn btn-warning">Generate Report</button>
                            </div>
                        </div>
                        {message && <div className="alert alert-success">{message}</div>}
                        {sortedUsers.length === 0 && <div className="alert alert-warning">No users found based on your search criteria.</div>}
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.length === filteredUsers.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Company Name</th>
                                    <th>Product Name</th>
                                    <th>Contact Number</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(sortedUsers) && sortedUsers.length > 0 ? (
                                    sortedUsers.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedUsers.includes(user._id)}
                                                    onChange={() => handleSelectUser(user._id)}
                                                />
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.company_name}</td>
                                            <td>{user.product_name}</td>
                                            <td>{user.contact_number}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Link to={`/updateSupplier/${user._id}`} className="btn btn-edit">
                                                   EDIT
                                                </Link>
                                                <button className="btn btn-delete" onClick={() => handleDelete(user._id)}>
                                                   DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierList;
