import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';
import './AssignedOrders.css';

const AssignedOrders = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignments } = location.state || { assignments: [] }; // Get assignments passed from the previous component

    const [orders, setOrders] = useState(assignments);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]); // State to track selected orders

    useEffect(() => {
        if (!assignments.length) {
            setError('No assignments available');
        }
    }, [assignments]);

    // Function to handle selection of orders
    const handleCheckboxChange = (id) => {
        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((orderId) => orderId !== id)
                : [...prevSelected, id]
        );
    };

    // Function to handle "Ready to Ship" for selected orders
    const handleReadyToShip = async () => {
        try {
            const promises = selectedOrders.map((id) =>
                fetch(`http://localhost:5001/api/${id}`, {
                    method: 'DELETE',
                })
            );

            const responses = await Promise.all(promises);

            // Check if any request failed
            const failed = responses.some((response) => !response.ok);
            if (failed) {
                throw new Error('Some orders were not found or already deleted');
            }

            // Filter out the deleted orders from the state
            setOrders((prevOrders) =>
                prevOrders.filter((order) => !selectedOrders.includes(order._id))
            );
            setSelectedOrders([]); // Clear the selected orders
        } catch (error) {
            console.error('Failed to delete orders:', error.message);
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
        
        // Prepare data for the PDF, with items listed on new lines
        const data = orders.map(order => [
            order.userId,
            order.items.map(item => item.name).join('\n'), // Join item names with newline characters
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
            theme: 'grid',
            styles: {
                cellPadding: 2,
                lineColor: [0, 0, 0],
                lineWidth: 0.5,
                halign: 'left',
                valign: 'middle',
            },
            didParseCell: (data) => {
                // If this cell is the 'Items' cell, set the text to wrap
                if (data.column.index === 1) {
                    data.cell.styles.cellWidth = 'auto'; // Allow auto width for wrapping
                    data.cell.styles.valign = 'top'; // Align text to the top
                }
            },
        });

        // Save the PDF
        doc.save('assigned_orders.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="header1">Assigned Orders</h1>
            <div className="table-responsive"> {/* Added a wrapper for responsive design */}
                <table>
                    <thead>
                        <tr>
                            <th>Select</th> {/* Add checkbox column */}
                            <th>User ID</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Address</th>
                            <th>Province</th>
                            <th>Driver Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const { _id, userId, items, amount, date, status, address, province, driverName } = order;
                            return (
                                <tr key={_id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(_id)} // Check if order is selected
                                            onChange={() => handleCheckboxChange(_id)}
                                        />
                                    </td>
                                    <td>{userId}</td>
                                    <td>
                                        <ul className="items-list"> {/* Added a class for styling */}
                                            {items.map((item, index) => (
                                                <li key={index}>{item.name}</li> // Print each item on a new line
                                            ))}
                                        </ul>
                                    </td>
                                    <td>${amount}</td>
                                    <td>{new Date(date).toLocaleDateString()}</td>
                                    <td>{status}</td>
                                    <td>{address}</td>
                                    <td>{province}</td>
                                    <td>{driverName}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="button-container">
                <button onClick={handleBack}>
                    Return to Logistics
                </button>
                <button className="pdf-button" onClick={generatePDF}>
                    Export PDF
                </button>
                <button
                    className="action-button"
                    onClick={handleReadyToShip}
                    disabled={selectedOrders.length === 0} // Disable if no orders selected
                >
                    Ready to Ship Selected
                </button>
            </div>
        </div>
    );
};

export default AssignedOrders;
