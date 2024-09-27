import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditDriver = () => {
    const { driverId } = useParams(); // Capture driverId from URL
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);

    useEffect(() => {
        if (driverId) {
            fetchDriver(driverId);
        }
    }, [driverId]);

    const fetchDriver = async (id) => {
        try {
            setLoading(true); // Set loading before request
            const response = await axios.get(`http://localhost:5001/drivers/${id}`);
            setDriver(response.data);
            setLoading(false); // Stop loading after request
        } catch (error) {
            console.error('Error fetching driver:', error);
            setError(error.message || 'An error occurred while fetching the driver details.');
            setLoading(false); // Stop loading in case of error
        }
    };

    if (loading) {
        return <p>Loading driver details...</p>;
    }

    if (error) {
        return <div>Error fetching driver details: {error}</div>;
    }

    if (!driver) {
        return <div>No driver data available.</div>;
    }

    // Destructure driver details
    const { name, email } = driver;

    return (
        <div>
            <h1>Edit Driver: {driverId}</h1>
            <div>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                {/* Add more driver details as needed */}
            </div>
        </div>
    );
};

export default EditDriver;
