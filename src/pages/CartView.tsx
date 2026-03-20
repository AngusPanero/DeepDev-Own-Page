import React, { useState } from 'react';
import { UseSession } from '../contexts/SessionContext';
import { UseCart } from '../contexts/CartContext';
import '../styles/cartView.css';

const CartView: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalAmount, finalAmount, appliedCoupon, applyCoupon, handlePaymentSuccess, isLocked } = UseCart();
    
    const { user } = UseSession();
    const [ couponInput, setCouponInput ] = useState('');
    const [ couponMsg, setCouponMsg ] = useState({ text: '', isError: false });
    const [ loading, setLoading ] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setLoading(true);
        const message = await applyCoupon(couponInput);
        const isError = message.includes('🔴') || message.includes('Error') || message.includes('expirado');
        setCouponMsg({ text: message, isError });
        setLoading(false);
    };

    const onCheckout = async () => {
        if (window.confirm("¿Confirmar compra? Se descontará el stock real.")) {
            setLoading(true);
            await handlePaymentSuccess();
            setLoading(false);
            alert("¡Compra realizada con éxito! 🟢");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <p>Tu carrito está vacío 🛒</p>
                <button className="btn-qty" >
                    Ir a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            
            {/* LISTA DE PRODUCTOS */}
            <div className="cart-items-section">
                <h2 className="cart-title">Carrito de Compras</h2>
                
                {cart.map((item) => (
                    <div key={item.id} className="cart-item-card">
                        <img src={item.imagen} alt={item.nombre} className="product-img" />
                        
                        <div className="product-info">
                            <h3 className="product-name">{item.nombre}</h3>
                            <p className="product-price">${item.precio.toLocaleString()}</p>
                            
                            {/* ALERTA DE STOCK (Backend) */}
                            {(item as any).alert && (
                                <div className="stock-alert">
                                    ⚠️ {(item as any).alert}
                                </div>
                            )}
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

                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="btn-remove"
                            title="Eliminar"
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* RESUMEN DE COMPRA */}
            <div className="summary-section">
                <div className="summary-card">
                    <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Resumen</h3>
                    
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
                        <span style={{ fontWeight: 'bold' }}>Total</span>
                        <span className="total-price">${finalAmount.toLocaleString()}</span>
                    </div>

                    {/* SECCIÓN CUPONES */}
                    <div className="coupon-section">
                        <label className="coupon-label">¿Tienes un cupón?</label>
                        <div className="coupon-input-group">
                            <input 
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                placeholder="CODIGO10"
                                className="coupon-input"
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                disabled={loading || !user}
                                className="btn-apply"
                            > {loading ? '...' : 'Aplicar'} </button>
                        </div>
                        {couponMsg.text && (
                            <p style={{ 
                                marginTop: '8px', 
                                fontSize: '0.75rem', 
                                color: couponMsg.isError ? '#ef4444' : '#10b981' 
                            }}>
                                {couponMsg.text}
                            </p>
                        )}
                    </div>

                    <button 
                        onClick={onCheckout}
                        disabled={loading || isLocked}
                        className="btn-checkout"
                    >
                        {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartView;