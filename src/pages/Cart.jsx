import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ FIXED import

const Cart = () => {
  const [products, setProducts] = useState(null); // null = loading state
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ FIXED usage

  const fetchCart = () => {
    axios.get('http://localhost:5000/api/cart/all')
      .then(res => {
        console.log("✅ Cart API response:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('🛑 Error fetching cart items:', err);
        setError('Failed to load cart items.');
        setProducts([]); // ensure rendering continues
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleBuyNow = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate('/buy-now');
  };

  const handleRemove = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`);
      setProducts(prev => prev.filter(item => item.id !== cartId));
    } catch (err) {
      console.error('❌ Failed to remove item from cart:', err);
      alert('Error removing item.');
    }
  };

  if (products === null) {
    return <p style={{ paddingTop: '100px', textAlign: 'center' }}>Loading cart...</p>;
  }

  if (error) {
    return <p style={{ paddingTop: '100px', textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={containerStyle}>
      {products.length === 0 ? (
        <p style={{ marginTop: '100px', fontSize: '20px' }}>No items in cart.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} style={styles.card}>
            <img
              src={`http://localhost:5000/api/product/images/${product.image}`}
              alt={product.name}
              style={styles.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
            <h2>{product.name || 'Unnamed Product'}</h2>
            <p><strong>Price:</strong> ₹{product.price || '--'}</p>
            <p><strong>Stock:</strong> {product.stock ?? '—'}</p>
            <p>{product.description || 'No description available.'}</p>
            <button onClick={() => handleBuyNow(product)} style={styles.button}>Buy Now</button>
            <button style={styles.removeButton} onClick={() => handleRemove(product.id)}>
              Remove from Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  paddingLeft: '70px',
  paddingRight: '50px',
  paddingTop: '100px',
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    width: '280px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '5px',
  },
  removeButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Cart;
