import React from 'react'
import './MainPage.css'
import { Link } from 'react-router-dom'; 

const MainPage = () => {
  return (
    <div>
      <p>This is a main page for all admins</p>
      <Link to="/drivers/add">
        <button>Logistic Manager</button>
      </Link>
    </div>
  )
}

export default MainPage
