import React from 'react'
import './LogisticsManagerSidebar.css'
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const LogisticsManagerSidebar = () => {
  return (
    <div className='sidebar'>

        <NavLink to="/" className="sidebar-option">
          <img className='dash_icon' src={assets.dashboard_icon} alt="Dashboard" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink to='/listSupplier' className='sidebar-option'>
            <img src={assets.order_icon} alt="List Items" />
            <p>Supplier List</p>
        </NavLink>

        <NavLink to='/addSupplier' className='sidebar-option'>
            <img src={assets.add_icon} alt="Add Items" />
            <p>Add Suppliers</p>
        </NavLink>


    </div>
  )
}

export default LogisticsManagerSidebar
