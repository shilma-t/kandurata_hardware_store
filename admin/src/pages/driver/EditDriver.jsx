import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import './EditDriver.css'; // Import the CSS file

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
      <div className="sidebar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/sample">Manage Order</Link></li>
          <li><Link to="/drivers">Driver Details</Link></li>
          <li><Link to="/drivers/add">Add Driver</Link></li>
          <li><Link to="/drivers/edit">Edit Driver</Link></li>
          <li><Link to="/drivers">Delete Driver</Link></li>
        </ul>
      </div>

      <div className="form-content">
        <h2 className="header">Edit Driver</h2>
        <form onSubmit={handleEditSubmit}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required // Make the field required
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required // Make the field required
          />

          <label>Vehicle Model</label>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            required // Make the field required
          />

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/drivers')}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditDriver;
