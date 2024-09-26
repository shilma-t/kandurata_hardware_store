import React, { useEffect, useState } from 'react';
import './SampleComponent.css'; // Ensure you import the CSS file if you have styles

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
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.userId}</td>
                            <td>{order.items.join(', ')}</td>
                            <td>${order.amount}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                            <td>{order.address}</td>
                            <td>{order.province}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SampleComponent;
