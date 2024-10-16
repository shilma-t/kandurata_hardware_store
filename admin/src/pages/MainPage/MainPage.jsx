import React, { useEffect, useState } from "react";
import "./MainPage.css";
import EmployeeLogin from "../EmployeeLogin/EmployeeLogin";

const MainPage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [role, setRole] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
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
      <div className="login-container">
        <button
          onClick={() => setIsLoginVisible(true)}
          className="login-button"
        >
          Login
        </button>
        {isLoginVisible && <EmployeeLogin onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default MainPage;
