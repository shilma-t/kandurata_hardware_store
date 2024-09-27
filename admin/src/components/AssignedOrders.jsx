import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';

const AssignedOrders = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignments } = location.state || { assignments: [] }; // Get assignments passed from the previous component

    const [orders, setOrders] = useState(assignments);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!assignments.length) {
            setError('No assignments available');
        }
    }, [assignments]);

    const handleReadyToShip = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Order not found or already deleted');
            }

            // Filter out the deleted order from the state
            setOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
        } catch (error) {
            console.error('Failed to delete order:', error.message);
            alert(`Error: ${error.message}`); // Provide feedback to the user
        }
    };

    const handleBack = () => {
        navigate('/logistics'); // Navigate back to the logistics dashboard
    };

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Assigned Orders', 14, 22);

        // Set font size for table header
        doc.setFontSize(12);
        const headers = ["User ID", "Items", "Amount", "Date", "Status", "Address", "Province", "Driver Name"];
        const data = orders.map(order => [
            order.userId,
            order.items.join(', '),
            `$${order.amount}`,
            new Date(order.date).toLocaleDateString(),
            order.status,
            order.address,
            order.province,
            order.driverName
        ]);

        // Add the table to the PDF
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30, // Start below the title
        });

        // Save the PDF
        doc.save('assigned_orders.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="header1">Assigned Orders</h1>
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
                        <th>Driver Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const { orderId, userId, items, amount, date, status, address, province, driverName } = order;
                        return (
                            <tr key={orderId}>
                                <td>{userId}</td>
                                <td>{items.join(', ')}</td>
                                <td>${amount}</td>
                                <td>{new Date(date).toLocaleDateString()}</td>
                                <td>{status}</td>
                                <td>{address}</td>
                                <td>{province}</td>
                                <td>{driverName}</td>
                                <td>
                                    <button onClick={() => handleReadyToShip(orderId)}>Ready to Ship</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={handleBack}>
                Back to Dashboard
            </button>
            <button onClick={generatePDF}>
                Download PDF
            </button>
        </div>
    );
};

export default AssignedOrders;
