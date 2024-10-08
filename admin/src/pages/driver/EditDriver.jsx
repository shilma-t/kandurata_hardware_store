import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import './EditDriver.css';

const EditDriver = () => {
  const { id } = useParams(); // Get the driver ID from the URL
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/drivers/${id}`);
        const driver = response.data;
        setFirstName(driver.firstName);
        setLastName(driver.lastName);
        setVehicleModel(driver.vehicleModel);
      } catch (error) {
        console.error('Error fetching driver:', error);
      }
    };
    
    fetchDriver();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5001/drivers/${id}`, {
        firstName,
        lastName,
        vehicleModel,
      });
      navigate('/drivers'); // Redirect to driver list after update
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  return (
    <div className="edit-driver-container">
      <div className="EditDriverSidebar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/sample">Manage Order</Link></li>
          <li><Link to="/drivers">Driver Details</Link></li>
          <li><Link to="/drivers/add">Add Driver</Link></li>
          <li><Link to="/drivers/delete">Delete Driver</Link></li>
        </ul>
      </div>
      <div className="edit-driver-content">
        <h2>Edit Driver</h2>
        <form onSubmit={handleEditSubmit} className="edit-driver-form">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label>Vehicle Model</label>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          />

          <div className="form-buttons">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/drivers')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
