import React from 'react';
import { useLocation } from 'react-router-dom';

const AssignedOrders = () => {
    const { state } = useLocation();
    const { assignments } = state || { assignments: [] };

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
        </div>
    );
};

export default AssignedOrders;
