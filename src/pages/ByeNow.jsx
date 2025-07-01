import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyNow = () => {
  const product = JSON.parse(localStorage.getItem('selectedProduct'));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!product) return <p style={{ textAlign: 'center', marginTop: '100px' }}>No product selected.</p>;

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

  const totalPrice = product.price * quantity;

  const handleConfirm = () => {
    setError('');
    // Navigate to payment page with details, size removed
    navigate('/payment', {
      state: {
        product,
        quantity,
        totalPrice
      }
    });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Buy Now</h2>

        <img
          src={`http://localhost:5000/api/product/images/${product.image}`}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
          style={imageStyle}
        />

        <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{product.name}</h3>

        {/* Quantity selector */}
        <div style={quantityContainer}>
          <button onClick={decrement} style={smallButtonStyle}>−</button>
          <span style={quantityText}>{quantity}</span>
          <button onClick={increment} style={smallButtonStyle}>+</button>
        </div>

        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>
          Total Price: ₹{totalPrice}
        </p>

        <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>{product.description}</p>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button
          onClick={handleConfirm}
          style={confirmButtonStyle}
          onMouseOver={e => e.target.style.backgroundColor = '#218838'}
          onMouseOut={e => e.target.style.backgroundColor = '#28a745'}
        >
          Confirm Purchase
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  padding: '30px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const imageStyle = {
  width: '100%',
  height: '250px',
  objectFit: 'cover',
  borderRadius: '10px',
  marginBottom: '20px',
};

const quantityContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
};

const smallButtonStyle = {
  fontSize: '16px',
  width: '28px',
  height: '28px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#28a745',
  color: '#fff',
  cursor: 'pointer',
  lineHeight: '1',
  userSelect: 'none',
};

const quantityText = {
  fontSize: '18px',
  fontWeight: '600',
  minWidth: '24px',
  textAlign: 'center',
};

const confirmButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#28a745',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

export default BuyNow;
