// src/components/EmployeeLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';

const EmployeeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/employees/login', { username, password });
            const { token, role } = response.data;

            // Save token to local storage or state management
            localStorage.setItem('token', token);

            // Redirect based on role
            if (role === 'admin') {
                window.location.href = '/admin'; // Admin dashboard
            } else {
                window.location.href = '/employee'; // Employee dashboard
            }
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default EmployeeLogin;
