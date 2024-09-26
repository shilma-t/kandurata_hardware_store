// SampleComponent.js

import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import './SampleComponent.css';
=======
>>>>>>> parent of df68de6 (SampleComponent update)

const SampleComponent = () => {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response = await fetch('http://localhost:5001/drivers');
                if (!response.ok) {
                    throw new Error('Failed to fetch drivers');
                }
                const data = await response.json();
                setDrivers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrders();
        fetchDrivers();
    }, []);

    const handleSelectChange = (orderId, driverId) => {
        console.log(`Order ${orderId} assigned to Driver ${driverId}`);
    };

    const handleSelectButtonClick = (orderId) => {
        sessionStorage.setItem('selectedOrderId', orderId);
        navigate('/order-details');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Orders</h1>
<<<<<<< HEAD
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Address</th>
                        <th>Province</th>
                        <th>Assign Driver</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={`${order._id}-${index}`}> {/* Unique key combining _id with index */}
                            <td>{order.userId}</td>
                            <td>{order.items.join(', ')}</td>
                            <td>${order.amount}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                            <td>{order.address}</td>
                            <td>{order.province}</td>
                            <td>
                                <select onChange={(e) => handleSelectChange(order._id, e.target.value)}>
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver._id} value={driver._id}>
                                            {driver.firstName} {driver.lastName} ({driver.vehicleModel})
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleSelectButtonClick(order._id)}>Select</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
=======
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        User ID: {order.userId} - Amount: ${order.amount} - Status: {order.status}
                    </li>
                ))}
            </ul>
>>>>>>> parent of df68de6 (SampleComponent update)
        </div>
    );
};

export default SampleComponent;
