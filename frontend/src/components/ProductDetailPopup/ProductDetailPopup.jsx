import React, { useContext } from 'react';
import './ProductDetailPopup.css';
import { StoreContext } from '../../context/StoreContext';

const ProductDetailPopup = ({ product, onClose }) => {
    const { addToCart } = useContext(StoreContext); 
    if (!product) return null;

    return (
        <div className="product-detail-popup">
            <div className="product-detail-container">
                <span className="close-btn" onClick={onClose}>&times;</span>

                <div className="product-detail-left">
                    <img 
                        className="product-detail-image" 
                        src={`http://localhost:5001/images/${product.image}`} 
                        alt={product.name} 
                    />
                    <div className="product-info-small">Materials, Care and Origin</div>
                    <p className="product-detail-materials">
                        We work with monitoring programs to ensure compliance with our social, environmental and health and safety standards.
                    </p>
                </div>

                <div className="product-detail-right">
                    <div className="product-detail-header">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                    </div>
                    
                    <div className="product-detail-pricing">
                        <p className="old-price">Retail Price: LKR {product.retailPrice}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Category: {product.category}</p>
                    </div>

                    <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPopup;
