import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SampleComponent.css';

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
                    {orders.map((order) => {
                        const { _id, userId, items, amount, date, status, address, province } = order; // Destructuring order properties
                        return (
                            <tr key={_id}>
                                <td>{userId}</td>
                                <td>{items.join(', ')}</td>
                                <td>${amount}</td>
                                <td>{new Date(date).toLocaleDateString()}</td>
                                <td>{status}</td>
                                <td>{address}</td>
                                <td>{province}</td>
                                <td>
                                    <select onChange={(e) => handleSelectChange(_id, e.target.value)}>
                                        <option value="">Select Driver</option>
                                        {drivers.length > 0 ? (
                                            drivers.map(driver => (
                                                <option key={driver._id} value={driver._id}>
                                                    {driver.firstName} {driver.lastName} ({driver.vehicleModel})
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No drivers available</option>
                                        )}
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleSelectButtonClick(_id)}>Select</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SampleComponent;
