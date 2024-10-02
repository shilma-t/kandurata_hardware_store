import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './DriverList.css';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const confirmDelete = (id) => {
    setDriverToDelete(id);
    setIsModalOpen(true);
  };

  const deleteDriver = async () => {
    if (driverToDelete) {
      try {
        await axios.delete(`http://localhost:5001/drivers/${driverToDelete}`);
        fetchDrivers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
      setIsModalOpen(false);
      setDriverToDelete(null);
    }
  };

  const editDriver = (id) => {
    navigate(`/edit-driver/${id}`);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="driver-list-container">
      <div className="sidebar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/sample">Manage Order</Link></li>
          <li><Link to="/drivers">Driver Details</Link></li>
          <li><Link to="/drivers/add">Add Driver</Link></li>
          <li><Link to="/drivers">Delete Driver</Link></li>
        </ul>
      </div>

      <div className="driver-list-content">
        <h1>Driver Details</h1>
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
                    <button className="delete-button" onClick={() => confirmDelete(driver._id)}>Delete</button>
                    <button className="edit-button" onClick={() => editDriver(driver._id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this driver?</p>
              <div className="modal-actions">
                <button onClick={deleteDriver}>Delete</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverList;
