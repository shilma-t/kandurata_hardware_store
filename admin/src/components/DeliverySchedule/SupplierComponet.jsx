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
     

      <div className="content-area">
        <div className="controls-container">
          <div className="button-container">
          <Link to="/logistics" className="assign-driver-btn">Back To Dashboard </Link>
            <Link to="/addSupplier" className="assign-driver-btn">Add Supplier</Link>
            <Link to="/listSupplier" className="pdf-btn">Supplier List</Link>
          </div>
        </div>
        {/* Add other components like tables or search bars here if needed */}
      </div>
    </div>
  );
};

export default SupplierComponent;
