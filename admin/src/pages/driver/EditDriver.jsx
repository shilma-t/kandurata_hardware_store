import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditDriver.css';

const EditDriver = () => {
  const { id } = useParams(); // Get the driver ID from the URL
  const navigate = useNavigate();

  // State variables for driver details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [nicNumber, setNicNumber] = useState(''); // NIC number
  const [homeAddress, setHomeAddress] = useState(''); // Home Address
  const [mobileNumber, setMobileNumber] = useState(''); // Mobile Number
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  // Array for vehicle models (dropdown options)
  const vehicleModels = [
    'Lorry',
    'Van',
    'Bike',
    'Three Wheeler',
  ];

  // Fetch driver details on component mount
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/drivers/${id}`);
        const driver = response.data;

        // Set state with fetched data
        setFirstName(driver.firstName || '');
        setLastName(driver.lastName || '');
        setVehicleModel(driver.vehicleModel || '');
        setNicNumber(driver.nicNumber || ''); // Set NIC Number
        setHomeAddress(driver.homeAddress || ''); // Set Home Address
        setMobileNumber(driver.mobileNumber || ''); // Set Mobile Number
      } catch (error) {
        console.error('Error fetching driver:', error);
        setError('Error fetching driver details.'); // Set error message
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchDriver();
  }, [id]);

  // Handle form submission with validation
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Basic validation checks
    if (!firstName || !lastName || !vehicleModel || !homeAddress) {
      setError('All fields are required.');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/drivers/${id}`, {
        firstName,
        lastName,
        vehicleModel,
        nicNumber,
        homeAddress,
        mobileNumber,
      });
      navigate('/drivers'); // Redirect to driver list after update
    } catch (error) {
      console.error('Error updating driver:', error);
      setError('Error updating driver.'); // Set error message
    }
  };

  // Render loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-driver-container">
      <div className="EditDriverSidebar">
        <ul>
          <li><Link to="/logistics">Dashboard</Link></li>
          <li><Link to="/sample">Manage Order</Link></li>
          <li><Link to="/drivers">Driver Details</Link></li>
          <li><Link to="/drivers/add">Add Driver</Link></li>
          <li><Link to="/drivers">Delete Driver</Link></li>
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
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>NIC Number</label>
          <input
            type="text"
            value={nicNumber}
            readOnly // Make NIC number read-only
          />

          <label>Home Address</label>
          <input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            value={mobileNumber}
            readOnly // Make mobile number read-only
          />

          <label>Vehicle Model</label>
          {/* Dropdown for selecting vehicle model */}
          <select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            required
          >
            <option value="" disabled>Select Vehicle Model</option>
            {vehicleModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>

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
