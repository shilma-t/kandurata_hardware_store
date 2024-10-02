import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SampleComponent.css';

const SampleComponent = () => {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
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
                setError(`Order Fetch Error: ${err.message}`);
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
                setError(`Driver Fetch Error: ${err.message}`);
            }
        };

        fetchOrders();
        fetchDrivers().finally(() => setLoading(false));
    }, []);

    const handleSelectChange = (orderId, driverId) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, driverId } : order
            )
        );
    };

    const handleCheckboxChange = (orderId) => {
        setSelectedOrders((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            updatedSelected.has(orderId) ? updatedSelected.delete(orderId) : updatedSelected.add(orderId);
            return updatedSelected;
        });
    };

    const handleAssignDrivers = () => {
        const unassignedOrders = Array.from(selectedOrders).filter((orderId) => {
            const order = orders.find((o) => o._id === orderId);
            return !order?.driverId;
        });

        if (unassignedOrders.length > 0) {
            alert('Please select a driver for all selected orders.');
            return;
        }

        const assignments = Array.from(selectedOrders).map((orderId) => {
            const order = orders.find((o) => o._id === orderId);
            const driverId = order.driverId;
            const driver = drivers.find((d) => d._id === driverId);

            return {
                orderId,
                driverId,
                driverName: driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned',
                ...order,
            };
        });

        navigate('/assigned-orders', { state: { assignments } });
    };

    const handleBack = () => {
        navigate('/logistics');
    };

    const filteredOrders = orders.filter((order) => {
        return (
            order.province.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedProvince === '' || order.province === selectedProvince)
        );
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="app-content">
            <h1 className="header1">Delivery Schedule</h1>

            <div className="controls-container">
                <div className="sort-bar-container">
                    <label htmlFor="provinceSelect">Sort by Province: </label>
                    <select
                        id="provinceSelect"
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                        <option value="">All Provinces</option>
                        {Array.from(new Set(orders.map((order) => order.province))).map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by province..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                    />
                </div>
            </div>

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
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => {
                        const { _id, userId, items, amount, date, status, address, province } = order;
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
                                <td>
                                    <ul>
                                        {items.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${amount}</td>
                                <td>{new Date(date).toLocaleDateString()}</td>
                                <td>{status}</td>
                                <td>{address}</td>
                                <td>{province}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="assign-driver-container">
                <select
                    onChange={(e) => {
                        const driverId = e.target.value;
                        selectedOrders.forEach((orderId) => handleSelectChange(orderId, driverId));
                    }}
                >
                    <option value="">Select Driver</option>
                    {drivers.length > 0 ? (
                        drivers.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                                {driver.firstName} {driver.lastName} ({driver.vehicleModel})
                            </option>
                        ))
                    ) : (
                        <option disabled>No drivers available</option>
                    )}
                </select>
                <button onClick={handleAssignDrivers} disabled={selectedOrders.size === 0}>
                    Assign to Driver
                </button>
                <button onClick={handleBack}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default SampleComponent;
