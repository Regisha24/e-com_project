import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Navbar from './component/Navbar';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Footer from './component/Footer';
import ProductList from './component/ProductList';
import CategoryList from './component/CategoryList';
import BuyNow from './pages/ByeNow';
import Payment from './pages/Payment';



function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
         <Route path="/cart" element={<Cart />} />
         
          <Route path="/product/:id" element={<ProductList />} />
          
          <Route path="/buy-now" element={<BuyNow />} />
            <Route path="/payment" element={<Payment />} />
        <Route path="/category/:id" element={<CategoryList />} />

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
