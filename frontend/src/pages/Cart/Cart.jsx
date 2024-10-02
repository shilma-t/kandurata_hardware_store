import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, featuredProducts, addToCart, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const totalAmount = getTotalCartAmount();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Add</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        
        {Object.keys(cartItems).length > 0 ? (
          featuredProducts.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={index}>
                  <div className="cart-items-title cart-items-item">
                    <img src={`http://localhost:5001/images/${item.image}`} alt={item.name} />
                    <p>{item.name}</p>
                    <p>Rs.{item.retailPrice}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>Rs.{item.retailPrice * cartItems[item._id]}</p>
                    <p onClick={() => addToCart(item._id)} className='add'>+</p>
                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>

      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <hr />
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>Rs.{totalAmount}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>Rs.{totalAmount}</b>
            </div>
          </div>
          <button 
            onClick={() => navigate('/order')} 
            disabled={totalAmount === 0} 
            className={totalAmount === 0 ? 'disabled' : ''}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
