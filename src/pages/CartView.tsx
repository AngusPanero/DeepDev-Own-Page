import React, { useEffect } from 'react';
import { UseCart } from '../contexts/CartContext';
import '../styles/cartView.css';
import { UseTheme } from '../contexts/ThemeContext';

const CartView: React.FC = () => {
    const { theme } = UseTheme();
    const { cart, removeFromCart, updateQuantity, totalAmount, finalAmount, appliedCoupon, refreshCartPrices, isLocked, isInitialized, priceAlert, setPriceAlert } = UseCart();

    useEffect(() => {
        if (isInitialized && cart.length > 0) {
            refreshCartPrices(cart);
        }
    }, [isInitialized]); 

    if (!isInitialized) return <div className="loading-cart">Sincronizando...</div>;

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <p>Tu carrito está vacío 🛒</p>
                <a href="/testproducts"><button className="btn-qty">Ir a la tienda</button></a>
            </div>
        );
    }

    return (
        <div className={`cart-container ${theme}`}>
            <div className="cart-items-section">
                <h2 className="cart-title">Carrito de Compras</h2>
                
                {priceAlert && (
                    <div className="terminal-alert-box">
                        <span>⚠️ {priceAlert}</span>
                        <button onClick={() => setPriceAlert(null)}>X</button>
                    </div>
                )}

                {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                        <img src={item.imagen} alt={item.nombre} className="product-img" />
                        <div className="product-info">
                            <h4 className="product-name">{item.nombre}</h4>
                            <p className="product-price">${(item.precio || 0).toLocaleString()}</p>
                        </div>

                        <div className="quantity-controls">
                            <button 
                                onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                disabled={isLocked || item.cantidad <= 1}
                                className="btn-qty"
                            > - </button>
                            <span className="qty-value">{item.cantidad}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                disabled={isLocked || item.cantidad >= item.stockMax}
                                className="btn-qty"
                            > + </button>
                        </div>

                        <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="summary-section">
                <div className="summary-card">
                    <h3 style={{ marginBottom: '20px' }}>Resumen</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${totalAmount.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                        <div className="summary-row discount-text">
                            <span>Descuento ({appliedCoupon.discount}%)</span>
                            <span>- ${ (totalAmount - finalAmount).toLocaleString() }</span>
                        </div>
                    )}
                    <div className="total-row">
                        <strong>Total</strong>
                        <span className="total-price">${finalAmount.toLocaleString()}</span>
                    </div>
                    <a href="/checkout">
                        <button className="btn-checkout" disabled={isLocked}>Finalizar Compra</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CartView;