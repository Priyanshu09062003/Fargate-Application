import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import './App.css'; // Just keeping it empty or relying on index.css

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/cart" element={<div className="container text-center"><h2 style={{marginTop:'4rem'}}>Cart is empty for MVP.</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;
