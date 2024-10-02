import React, { useState ,useContext,useEffect} from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import LoginPopup from './components/LoginPopup/LoginPopup';  
import { StoreContext } from './context/StoreContext';


const App = () => {
  const [showLogin, setShowLogin] = useState(false); 
  const { token, setToken } = useContext(StoreContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        setToken(storedToken);
    }
}, [setToken]);

  return (
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} token ={token} /> 

      {/* Conditionally render the LoginPopup based on state */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        
        <Route path='/order' element={<PlaceOrder />} />
        {/* Login route */}
        <Route path='/login' element={<LoginPopup setShowLogin={setShowLogin} />} />
      </Routes>
    </div>
  );
};

export default App;