import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity, selectedSize, totalPrice } = location.state || {};

  if (!product) {
    return <p style={{ textAlign: 'center', marginTop: '100px' }}>No purchase data found.</p>;
  }

  const [paymentMethod, setPaymentMethod] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [paymentInfo, setPaymentInfo] = useState({
    upiId: '',
    phone: '',
    accountNumber: '',
    ifsc: '',
  });

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (paymentMethod !== 'cod') {
      const { upiId, phone, accountNumber, ifsc } = paymentInfo;
      if (!upiId || !phone || !accountNumber || !ifsc) {
        setError('Please fill in all payment fields.');
        return;
      }
    }

    setError('');

    // Prepare data for backend
    const orderData = {
      product_id: product.id,
       product_name: product.name,
      quantity,
      size: selectedSize || '',
      total_price: totalPrice,
      payment_method: paymentMethod,
      upi_id: paymentInfo.upiId,
      phone: paymentInfo.phone,
      account_number: paymentInfo.accountNumber,
      ifsc: paymentInfo.ifsc,
    };

    try {
      await axios.post('http://localhost:5000/api/order', orderData);
      setSuccess(`Order confirmed! Payment via ${paymentMethod.toUpperCase()}`);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to submit order. Try again later.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Confirm Your Order</h2>

      <div style={{ marginBottom: '20px' }}>
        <img
          src={`http://localhost:5000/api/product/images/${product.image}`}
          alt={product.name}
          style={imageStyle}
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <h3>{product.name}</h3>
        {selectedSize && <p>Size: <strong>{selectedSize}</strong></p>}
        <p>Quantity: <strong>{quantity}</strong></p>
        <p>Total Price: <strong>₹{totalPrice}</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Payment Method</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="gpay"
              checked={paymentMethod === 'gpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            /> GPay
          </label>
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="paytm"
              checked={paymentMethod === 'paytm'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            /> Paytm
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            /> Cash on Delivery
          </label>
        </div>

        {paymentMethod !== 'cod' && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="upiId"
                value={paymentInfo.upiId}
                onChange={handlePaymentChange}
                placeholder="UPI ID"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="tel"
                name="phone"
                value={paymentInfo.phone}
                onChange={handlePaymentChange}
                placeholder="Phone Number"
                style={inputStyle}
                maxLength={10}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="accountNumber"
                value={paymentInfo.accountNumber}
                onChange={handlePaymentChange}
                placeholder="Bank Account Number"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                name="ifsc"
                value={paymentInfo.ifsc}
                onChange={handlePaymentChange}
                placeholder="IFSC Code"
                style={inputStyle}
                maxLength={11}
              />
            </div>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" style={submitButtonStyle} disabled={!!success}>
          Confirm & Pay
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '900px',
 paddingLeft:'450px',
  paddingtBottom: '600px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontFamily: 'Arial, sans-serif',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Payment;
