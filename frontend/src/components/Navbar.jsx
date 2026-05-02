import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">NexusCart</Link>
      <div className="navbar-links">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart (0)</Link>
      </div>
    </nav>
  );
};

export default Navbar;
