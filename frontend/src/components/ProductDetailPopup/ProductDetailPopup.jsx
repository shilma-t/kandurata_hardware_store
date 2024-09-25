import React, { useContext } from 'react';
import './ProductDetailPopup.css';
import { StoreContext } from '../../context/StoreContext';

const ProductDetailPopup = ({ product, onClose }) => {
    const { addToCart } = useContext(StoreContext); // Get addToCart from context
    if (!product) return null;

    return (
        <div className="product-detail-popup">
            <div className="product-detail-content">
                <img className="product-detail-image" src={`http://localhost:5001/images/${product.image}`} alt={product.name} />
                <div className="product-detail-info">
                    <span className="close-btn" onClick={onClose}>&times;</span>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Retail Price: LKR {product.retailPrice}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Category: {product.category}</p>
                    
                    <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>Add to Cart</button> {/* Updated here */}
                 </div>
            </div>
        </div>
    );
}

export default ProductDetailPopup;
