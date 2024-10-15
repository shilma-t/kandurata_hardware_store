import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const { token, setToken, featuredProducts } = useContext(StoreContext);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
const {getTotalCartAmount} =useContext(StoreContext)
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");  
    setShowLogin(true); 
    setShowPopup(true); 
    setTimeout(() => {
      setShowPopup(false); 
    }, 3000);
  };
  const handleSearchClick = () => {
    setIsSearching(!isSearching);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = featuredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" />
      <ul className='navbar-menu'>
        <Link to='./'><li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</li></Link>
        <li onClick={() => setMenu("Shop")} className={menu === "Shop" ? "active" : ""}>Shop</li>
        <Link to='/card'><li onClick={() => setMenu("card")} className={menu === "card" ? "active" : ""}>Card</li></Link> 
        <Link to='/contact-us'><li onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact us</li></Link> 
      </ul>

      <div className='navbar-right'>
        <img
          src={assets.search_icon}
          alt="Search"
          onClick={handleSearchClick}
          className='search-icon'
        />
        <div className={`navbar-search ${isSearching ? 'show' : ''}`}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className='search-results'>
            {searchQuery && filteredProducts.length > 0 ? (
              <ul>
                {filteredProducts.map(product => (
                  <li key={product._id} className='search-result-item'>
                    <img src={`http://localhost:5001/images/${product.image}`} alt={product.name} className='search-result-image' />
                    <div>
                      <h4>{product.name}</h4>
                    </div>
                  </li>
                ))}
              </ul>
            ) : searchQuery ? (
              <p>No products found.</p>
            ) : null}
          </div>
        </div>
        <div className='navbar-search-icon'>
         <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link> 
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token ? <button onClick={() => setShowLogin(true)}>Sign in</button>
          : <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
             

              <li>
    <Link to="/u-orders">
        <img src={assets.bag_icon} alt="" />
        <p>Orders</p>
    </Link>
</li>

                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            </div>
        }
      </div>   

      {showPopup && (
        <div className="logout-popup">
          <p>You've been logged out.</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
