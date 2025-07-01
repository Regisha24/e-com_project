import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const { id } = useParams();  // category_id from URL
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [cartMessage, setCartMessage] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/category/${id}`)
      .then(res => setCategory(res.data))
      .catch(err => console.error('Error fetching category:', err));

    axios.get(`http://localhost:5000/api/product/category/${id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, [id]);

  const handleAddToCart = async (prod) => {
    try {
      const checkRes = await axios.get('http://localhost:5000/api/cart/check', {
        params: { product_id: prod.id }
      });

      if (checkRes.data.exists) {
        setCartMessage(prev => ({ ...prev, [prod.id]: 'Already in cart' }));
      } else {
        await axios.post('http://localhost:5000/api/cart', {
          product_id: prod.id,
          quantity: 1,
          price: prod.price
        });
        setCartMessage(prev => ({ ...prev, [prod.id]: 'Added to cart' }));
      }

      setTimeout(() => {
        setCartMessage(prev => ({ ...prev, [prod.id]: '' }));
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage(prev => ({ ...prev, [prod.id]: 'Error adding to cart' }));
      setTimeout(() => {
        setCartMessage(prev => ({ ...prev, [prod.id]: '' }));
      }, 3000);
    }
  };

  const handleBuyNow = (product) => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    navigate('/buy-now');
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '40px', paddingRight: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', color: '#333', fontFamily: 'Segoe UI, sans-serif' }}>
        <strong>{category.name}</strong>
      </h2>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>No products found in this category.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {products.map(prod => (
            <div key={prod.id} style={{
              border: '1px solid #ddd',
              padding: '16px',
              width: '240px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
              <img
                src={`http://localhost:5000/api/product/images/${prod.image}`}
                alt={prod.name}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }}
              />
              <h4 style={{ marginBottom: '4px', fontSize: '18px', color: '#333', fontWeight: '600' }}>{prod.name}</h4>
              <p style={{ margin: 0, color: '#007bff', fontSize: '16px', fontWeight: 'bold' }}>₹{prod.price}</p>
              <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>{prod.description}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => handleAddToCart(prod)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#20c997',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#17a589'}
                  onMouseOut={e => e.target.style.backgroundColor = '#20c997'}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(prod)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#fd7e14',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#e8590c'}
                  onMouseOut={e => e.target.style.backgroundColor = '#fd7e14'}
                >
                  Buy Now
                </button>
              </div>
              {cartMessage[prod.id] && (
                <p style={{
                  color: cartMessage[prod.id] === 'Already in cart' ? '#dc3545' : '#28a745',
                  marginTop: '10px',
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {cartMessage[prod.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
