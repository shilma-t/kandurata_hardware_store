import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SampleComponent.css';

const SampleComponent = () => {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState(new Set());
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
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === orderId ? { ...order, driverId } : order
            )
        );
    };

    const handleCheckboxChange = (orderId) => {
        setSelectedOrders((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            if (updatedSelected.has(orderId)) {
                updatedSelected.delete(orderId);
            } else {
                updatedSelected.add(orderId);
            }
            return updatedSelected;
        });
    };

    const handleAssignDrivers = () => {
        const assignments = Array.from(selectedOrders).map(orderId => {
            const order = orders.find(o => o._id === orderId);
            const driverId = order.driverId; // Assume you store the driverId in the order
            return {
                orderId,
                driverId,
                ...order
            };
        });

        navigate('/assigned-orders', { state: { assignments } });
    };

    // Updated back navigation handler
    const handleBack = () => {
        navigate('/logistics'); // Navigate to the dashboard
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="header1">Delivery Schedule</h1>
            {/* Back Button */}
            
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>User ID</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Address</th>
                        <th>Province</th>
                        <th>Assign Driver</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const { _id, userId, items, amount, date, status, address, province, driverId } = order;
                        const isChecked = selectedOrders.has(_id);
                        return (
                            <tr key={_id}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={isChecked} 
                                        onChange={() => handleCheckboxChange(_id)} 
                                    />
                                </td>
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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={handleAssignDrivers} disabled={selectedOrders.size === 0}>
                Assign to Driver
            </button>
            <button onClick={handleBack}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default SampleComponent;
