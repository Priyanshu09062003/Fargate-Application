import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    const orderRequest = {
      customerEmail: email,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderRequest)
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <h1 style={{ color: '#22c55e' }}>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. A confirmation email will be sent to {email}.</p>
        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <h2>Your cart is empty.</h2>
        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => navigate('/')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="page-title">Your Cart</h1>
      
      <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '1rem', padding: '2rem', border: '1px solid var(--border-color)' }}>
        {cartItems.map((item) => (
          <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.product.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>${item.product.price.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn" style={{ padding: '0.25rem 0.75rem' }} onClick={() => updateQuantity(item.product.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button className="btn" style={{ padding: '0.25rem 0.75rem' }} onClick={() => updateQuantity(item.product.id, 1)}>+</button>
              <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '1rem', fontWeight: 'bold' }}>Remove</button>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Total:</h2>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>${getCartTotal().toFixed(2)}</h2>
        </div>

        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address for Order Confirmation</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cart;
