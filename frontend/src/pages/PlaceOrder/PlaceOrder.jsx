import React, { useContext, useState } from 'react';
import './PlaceOrder.css'; 
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, userId, clearCart, token } = useContext(StoreContext);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); 

  const provinces = {
    'Central Province': 100,
    'Northern Province': 200,
    'North Central Province': 150,
    'Eastern Province': 180,
    'North Western Province': 120,
    'Sabaragamuwa': 130,
    'Southern Province': 170,
    'Uva': 140,
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setDeliveryFee(provinces[province] || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const validate = () => {
    const errors = {};
    if (!formValues.firstName) errors.firstName = 'First Name is required';
    if (!formValues.lastName) errors.lastName = 'Last Name is required';
    if (!formValues.address) errors.address = 'Address is required';
    if (!formValues.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(formValues.phone)) {
      errors.phone = 'Phone number must be 10 digits and start with 0';
    }
    if (!selectedProvince) errors.province = 'Province must be selected';
    if (!paymentMethod) errors.paymentMethod = 'Payment method must be selected';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const decreaseQuantity = async (productId, quantity) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/product/decrease-quantity',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message);
      }

      return data; // Handle success if needed
    } catch (error) {
      console.error('Error decreasing product quantity:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validate()) {
      setLoading(true); // Set loading state before the API call
  
      const orderData = {
        userId,
        items: cartItems,
        amount: getTotalCartAmount() + deliveryFee,
        date: Date.now(),
        address: formValues.address,
        province: selectedProvince,
        payment: paymentMethod === 'card',
        paymentMethod,
      };
  
      try {
        const response = await axios.post(
          'http://localhost:5001/api/orders/place',
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data.success) {
          // Decrease quantity for each item in the order
          for (const itemId in cartItems) {
            const { quantity } = cartItems[itemId];
            const decreaseResponse = await decreaseQuantity(itemId, quantity);
            if (!decreaseResponse.success) {
              console.error("Error decreasing product quantity:", decreaseResponse.message);
            }
          }
  
          clearCart();
          navigate('/order-confirmation', { 
            state: { 
              orderId: response.data.orderId,
              orderDetails: orderData.items,
              totalAmount: orderData.amount 
            } 
          });
        } else {
          throw new Error(response.data.message || 'Order placement failed');
        }
      } catch (error) {
        if (error.response) {
          console.error("Error placing the order:", error.response.data);
          alert(`Error: ${error.response.data.message || error.message}`);
        } else {
          console.error("Error:", error.message);
          alert(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false); // Reset loading state after API call
      }
    }
  };
  

  return (
    <div>
      <form className='place-order' onSubmit={handleSubmit}>
        <div className="place-order-left">
          <p className='title'>Delivery Information</p>
          <div className="multi-fields">
            <input 
              type="text" 
              name="firstName" 
              placeholder='First Name' 
              value={formValues.firstName} 
              onChange={handleChange}
            />
            {formErrors.firstName && <p className="error">{formErrors.firstName}</p>}
            <input 
              type="text" 
              name="lastName" 
              placeholder='Last Name' 
              value={formValues.lastName} 
              onChange={handleChange}
            />
            {formErrors.lastName && <p className="error">{formErrors.lastName}</p>}
          </div>
          <input 
            type="text" 
            name="address" 
            placeholder='Address' 
            value={formValues.address} 
            onChange={handleChange}
          />
          {formErrors.address && <p className="error">{formErrors.address}</p>}
          <input 
            type="text" 
            name="phone" 
            placeholder='Phone' 
            value={formValues.phone} 
            onChange={handleChange}
          />
          {formErrors.phone && <p className="error">{formErrors.phone}</p>}
          <div className="province-selection">
            <select 
              id="province" 
              value={selectedProvince} 
              onChange={handleProvinceChange}
            >
              <option value="">Select Province</option>
              {Object.keys(provinces).map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {formErrors.province && <p className="error">{formErrors.province}</p>}
          </div>
        </div>

        <div className="place-order-right">
          <div className='cart-total'>
            <h2>Cart Totals</h2>
            <div>
              <hr />
              <div className='cart-total-details'>
                <p>Subtotal</p>
                <p>Rs.{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <p>Delivery Fee</p>
                <p>Rs.{deliveryFee}</p>
              </div>
              <hr />
              <div className='cart-total-details'>
                <b>Total</b>
                <b>Rs.{getTotalCartAmount() + deliveryFee}</b>
              </div>
            </div>
          </div>

          <div className="payment-method-selection">
            <p>Payment Method</p>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handlePaymentMethodChange}
                />
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                />
                Card Payment
              </label>
              {formErrors.paymentMethod && <p className="error">{formErrors.paymentMethod}</p>}
            </div>
          </div>

          <button className={paymentMethod === 'card' ? "proceed-payment" : "place-order"} type="submit" disabled={loading}>
            {loading ? 'Processing...' : (paymentMethod === 'card' ? 'PROCEED TO PAYMENT' : 'PLACE ORDER')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlaceOrder;
