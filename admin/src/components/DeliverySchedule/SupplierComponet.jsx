import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SupplierComponent.css'; // Import the CSS file for styles

const SupplierComponent = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleBack = () => {
    navigate('/sup'); // Navigate to the specified path
  };

  return (
    <div className="app-content">
     <div className="DriverListSidebar">
        <ul>
          <li><Link to="/logistics">Dashboard</Link></li>
          <li><Link to="/addSupplier">Add Supplier</Link></li>
          <li><Link to="/listSupplier">List Supplier </Link></li>
        </ul>
      </div>

      
    </div>
  );
};

export default SupplierComponent;
