import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Card = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all products
    axios.get('http://localhost:5000/api/product')
      .then(res => {
        const uniqueProducts = getFirstProductOfEachCategory(res.data);
        setProducts(uniqueProducts);
      })
      .catch(err => console.error('Error fetching products:', err));

    // Get all categories
    axios.get('http://localhost:5000/api/category')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // ✅ Filter: Get only first product of each category
  const getFirstProductOfEachCategory = (allProducts) => {
    const seen = new Set();
    const filtered = [];
    for (let product of allProducts) {
      if (!seen.has(product.category_id)) {
        seen.add(product.category_id);
        filtered.push(product);
      }
    }
    return filtered;
  };

  // ✅ Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Product Categories</h3>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '20px',
        justifyContent: 'center', marginTop: '20px'
      }}>
        {products.map((prod) => (
          <div key={prod.id} style={{
            width: '18rem', padding: '10px',
            boxShadow: '0 0 10px lightblue', borderRadius: '10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <img
              src={`http://localhost:5000/api/product/images/${prod.image}`}
              alt={prod.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'http://localhost:5000/api/category/images/default.jpg';
              }}
              style={{ width: '90%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <p><strong>{getCategoryName(prod.category_id)}</strong></p>
              <button
                className="btn btn-info"
                onClick={() => navigate(`/category/${prod.category_id}`)}
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
