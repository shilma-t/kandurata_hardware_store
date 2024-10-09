import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SupplierComponent = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleBack = () => {
    navigate('/sup'); // Navigate to the specified path
  };

  return (
    <div>
      <button onClick={handleBack}>Back</button> {/* Example button to go back */}
      <br />
      <Link to="/addSupplier">Add Supplier</Link> {/* Link to Add Supplier */}
    </div>
  );
};

export default SupplierComponent;
