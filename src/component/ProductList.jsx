import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/product/category/${categoryId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, [categoryId]);

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Products in Category ID: {categoryId}</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        {products.map((prod) => (
          <div
            key={prod.id}
            style={{
              width: '18rem',
              padding: '10px',
              boxShadow: '0 0 10px lightgray',
              borderRadius: '10px',
              textAlign: 'center'
            }}
          >
            <img
              src={`http://localhost:5000/api/product/images/${prod.image}`}
              alt={prod.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <h5>{prod.name}</h5>
            <p>Price: ₹{prod.price}</p>
            <p>{prod.description}</p>
            <button className="btn btn-primary" style={{ marginTop: '10px' }}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
