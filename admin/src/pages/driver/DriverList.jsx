import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DriverList.css';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const deleteDriver = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/drivers/${id}`);
      fetchDrivers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  // Navigate to edit driver page
  const editDriver = (id) => {
    navigate(`/edit-driver/${id}`); // Navigate to edit page with driver ID
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="driver-list">
      {drivers.length === 0 ? (
        <p>No drivers available</p>
      ) : (
        <table className="driver-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Vehicle Model</th>
              <th>NIC Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.firstName}</td>
                <td>{driver.lastName}</td>
                <td>{driver.vehicleModel}</td>
                <td>{driver.nicNumber}</td>
                <td className="driver-actions">
                  <button onClick={() => deleteDriver(driver._id)}>Delete</button>
                  <button onClick={() => editDriver(driver._id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverList;
