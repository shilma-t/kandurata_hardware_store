import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AssignedOrders = () => {
    const { state } = useLocation();
    const { assignments } = state || { assignments: [] };
    const navigate = useNavigate(); // Import and use navigate

    // Updated back navigation handler
    const handleBack = () => {
        navigate('/logistics'); // Navigate to the logistics dashboard
    };

    return (
        <div>
            <h1>Assigned Orders</h1>
            {assignments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Driver ID</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Address</th>
                            <th>Province</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => (
                            <tr key={assignment.orderId}>
                                <td>{assignment.orderId}</td>
                                <td>{assignment.userId}</td>
                                <td>{assignment.driverId}</td>
                                <td>{assignment.items.join(', ')}</td>
                                <td>${assignment.amount}</td>
                                <td>{new Date(assignment.date).toLocaleDateString()}</td>
                                <td>{assignment.status}</td>
                                <td>{assignment.address}</td>
                                <td>{assignment.province}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No orders assigned.</div>
            )}
            <button onClick={handleBack}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default AssignedOrders;
