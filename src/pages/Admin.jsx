import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/product';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    image: null,
    description: '',
    category_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('description', form.description);
      formData.append('category_id', form.category_id);
      if (form.image) formData.append('image', form.image);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, formData, config);
      } else {
        await axios.post(API_BASE, formData, config);
      }

      setForm({
        name: '',
        price: '',
        stock: '',
        image: null,
        description: '',
        category_id: ''
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      image: null,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div
      className="container"
      style={{ paddingLeft: '70px', paddingRight: '50px', paddingTop: '100px' }}
    >
      <h2>Admin Product Manager</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }} encType="multipart/form-data">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required type="number" />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required type="number" />
        <input name="image" type="file" accept="image/*" onChange={handleChange} required={!editingId} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="category_id" placeholder="Category ID" value={form.category_id} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>

      <hr />

      <h3>All Products</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Description</th>
            <th>Category ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.price}</td>
              <td>{prod.stock}</td>
              <td>
                <img
                  src={`http://localhost:5000/api/product/images/${prod.image}`}
                  alt={prod.name}
                  width="50"
                  height="50"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    if (!e.target.dataset.retry) {
                      e.target.dataset.retry = "true";
                      e.target.src = "http://localhost:5000/api/product/images/default.jpg";
                    }
                  }}
                />
              </td>
              <td>{prod.description}</td>
              <td>{prod.category_id}</td>
              <td>
                <button onClick={() => handleEdit(prod)}>Edit</button>{' '}
                <button onClick={() => handleDelete(prod.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
