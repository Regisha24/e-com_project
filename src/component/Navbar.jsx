import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartCount(cartItems.length);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartCount(updatedCart.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div style={{
      paddingLeft: '150px',
      paddingRight: '200px',
      position: "fixed",
      zIndex: "999",
      width: "100%",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">

          {/* Brand Logo / Text */}
          <Link className="navbar-brand" to="/" style={{ fontWeight: 'bold', fontSize: '24px', color: '#007bff' }}>
            Flipkart
          </Link>

          {/* Search Box */}
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "5px 10px",
            width: "400px",
            marginLeft: "20px"
          }}>
            <i className="bi bi-search" style={{ marginRight: "10px", fontSize: "18px", color: "#6f42c1" }}></i>
            <input
              type="text"
              placeholder="Search products"
              style={{
                border: "none",
                outline: "none",
                fontSize: "16px",
                width: "100%",
                backgroundColor: "transparent"
              }}
            />
          </div>

          {/* Nav Items */}
          <div className="collapse navbar-collapse" style={{ marginLeft: "auto" }}>
            <ul
              className="navbar-nav mb-2 mb-lg-0 d-flex flex-row"
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '400px',  // Controls spacing container width
              }}
            >

              <li className="nav-item d-flex align-items-center">
                <i className="bi bi-house-door-fill me-1" style={{ color: '#17a2b8' }}></i>
                <Link className="nav-link text-dark" to="/">Home</Link>
              </li>

              <li className="nav-item d-flex align-items-center">
                <i className="bi bi-person-circle me-1" style={{ color: '#28a745' }}></i>
                <Link className="nav-link text-dark" to="/login">Sign in</Link>
              </li>

              <li className="nav-item d-flex align-items-center position-relative">
                <i className="bi bi-cart-fill me-1" style={{ color: '#dc3545' }}></i>
                <Link className="nav-link text-dark" to="/cart">Cart</Link>
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {cartCount}
                  </span>
                )}
              </li>

              <li className="nav-item d-flex align-items-center">
                <i className="bi bi-shield-lock-fill me-1" style={{ color: '#ffc107' }}></i>
                <Link className="nav-link text-dark" to="/admin">Admin</Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
