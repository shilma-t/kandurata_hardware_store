import React from 'react'
import './MainPage.css'
import { Link } from 'react-router-dom'; 

const MainPage = () => {
  return (
    <div>
      <Link to="/drivers/add">
        <button>Logistic Manager</button>
      </Link>
      <p>
        <Link to="/hr">
          <button>HR Manager</button>
        </Link>
      </p>
      <p><button>Employee</button></p>
    </div>
  )
}

export default MainPage
