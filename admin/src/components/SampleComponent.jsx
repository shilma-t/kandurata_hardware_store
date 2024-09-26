// SampleComponent.js

import React, { useEffect, useState } from 'react';

const SampleComponent = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/orders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        User ID: {order.userId} - Amount: ${order.amount} - Status: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SampleComponent;
