import React, { useEffect, useState } from 'react';
import './MainPage.css';
import { Link, Route, Routes } from 'react-router-dom';
import EmployeeLogin from '../adminLogin/AdminLoginPage';
import EmployeeRegister from './EmployeeRegister';

const MainPage = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [role, setRole] = useState('');
    const [unauthorized, setUnauthorized] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleCloseModal = () => {
        setIsLoginVisible(false);
    };

    const handleUnauthorized = (page) => {
        setUnauthorized(`You are not authorized to access the ${page} page.`);
    };

    return (
        <div className="main-page">
            <h1 className="welcome-message">Welcome to Kandurata Hardware!</h1>

            {unauthorized && <p className="unauthorized-message">{unauthorized}</p>}

            <div className="button-container">
                <Link to="/logistics">
                    <button
                        className="nav-button"
                        onClick={() => role !== 'logistics' && handleUnauthorized('Logistics')}
                    >
                        Logistics
                    </button>
                </Link>
                <Link to="/admin">
                    <button
                        className="nav-button"
                        onClick={() => role !== 'admin' && handleUnauthorized('Admin')}
                    >
                        Admin
                    </button>
                </Link>
                <Link to="/hr">
                    <button
                        className="nav-button"
                        onClick={() => role !== 'hr' && handleUnauthorized('HR')}
                    >
                        HR
                    </button>
                </Link>
                <Link to="/dashboard/cashier">
                    <button
                        className="nav-button"
                        onClick={() => role !== 'cashier' && handleUnauthorized('Cashier')}
                    >
                        Cashier
                    </button>
                </Link>
                <Link to="/employee">
                    <button
                        className="nav-button"
                        onClick={() => role !== 'employee' && handleUnauthorized('Employee')}
                    >
                        Employee
                    </button>
                </Link>
            </div>

            <div className="login-container">
                <button onClick={() => setIsLoginVisible(true)} className="login-button">Login</button>
                {isLoginVisible && <EmployeeLogin onClose={handleCloseModal} />}
            </div>

            <Routes>
                <Route path="*" element={<EmployeeRegister />} /> {/* This will catch all routes */}
                {/* You can add more specific routes as needed */}
            </Routes>
        </div>
    );
};

export default MainPage;
