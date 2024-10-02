import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HrManagerDashboardSidebar.css';

const HrManagerDashboardSidebar = () => {

    const navigate = useNavigate();

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    const handleListUsers = () => {
        navigate('/hr');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-buttons">
                <button onClick={handleCreateAccount}>Create Account</button>
                <button onClick={handleListUsers}>List Users</button>
            </div>
        </div>
    );
}

export default HrManagerDashboardSidebar;
