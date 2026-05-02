import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const [isBackendUp, setIsBackendUp] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setIsBackendUp(true);
        } else {
          setIsBackendUp(false);
        }
      } catch (e) {
        setIsBackendUp(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">NexusCart</Link>
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isBackendUp ? '#22c55e' : '#ef4444',
            boxShadow: isBackendUp ? '0 0 8px #22c55e' : '0 0 8px #ef4444'
          }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>{isBackendUp ? 'Backend Online' : 'Backend Offline'}</span>
        </div>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({getCartCount()})</Link>
      </div>
    </nav>
  );
};

export default Navbar;
