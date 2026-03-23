import { useEffect, useState } from "react";
import { UseTheme } from "../contexts/ThemeContext";
import { UseCart } from "../contexts/CartContext";
import { UseSession } from "../contexts/SessionContext";
import "./checkoutPage.css";
import CreditCard from "../components/ui/CreditCard";

const CheckoutPage = () => {
    const { theme } = UseTheme();
    const { user } = UseSession();
    const { cart, totalAmount, finalAmount, appliedCoupon, applyCoupon, handlePaymentSuccess, priceAlert, setPriceAlert, refreshCartPrices } = UseCart();
    
    const [ isFlipped, setIsFlipped ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ couponInput, setCouponInput ] = useState('');
    const [ couponMsg, setCouponMsg ] = useState({ text: '', isError: false });

    const [formData, setFormData] = useState({ 
        nombre: "", email: user?.email || "", dni: "", 
        tarjetaNumero: "", mesVencimiento: "", añoVencimiento: "", cvv: "", 
        cuotas: "1", tipoEntrega: "domicilio", calle: "", numero: "", 
        piso: "", ciudad: "", provincia: "", cp: "" 
    });

    useEffect(() => {
        if (cart.length > 0) refreshCartPrices(cart);
    }, []); 
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!user) {
            setCouponMsg({ text: "Debes iniciar sesión para usar cupones 🔴", isError: true });
            return;
        }
        if (!couponInput.trim()) return;
        setLoading(true);
        const message = await applyCoupon(couponInput);
        const isError = message.includes('Error') || message.includes('expirado') || message.includes('inactivo') || message.includes('sesión');
        setCouponMsg({ text: message, isError });
        setLoading(false);
    };

    const onCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (window.confirm("¿Confirmar el procesamiento del pago?")) {
            setLoading(true);
            await handlePaymentSuccess();
            setLoading(false);
            alert("SISTEMA: Transacción completada con éxito. 🟢");
        }
    };

    return (
        <div className={`checkout-screen ${theme}`}>
            <div className="checkout-wrapper">
                
                <div className="checkout-form-column">
                    <header className="checkout-header">
                        <span className="terminal-text">SYSTEM_STATUS: PAYMENT_PENDING</span>
                        <h1>CHECKOUT_PROMPT</h1>
                    </header>

                    <form className="main-checkout-form" onSubmit={onCheckoutSubmit}>
                        {/* 01 // IDENTIFICACIÓN */}
                        <section className="checkout-section">
                            <h2 className="section-label">01 // IDENTIFICACIÓN</h2>
                            <div className="input-field">
                                <label>TITULAR DE TARJETA</label>
                                <input name="nombre" placeholder="NOMBRE COMPLETO" onChange={handleChange} required />
                            </div>
                            <div className="input-row">
                                <div className="input-field" style={{flex: 2}}><label>EMAIL</label><input name="email" type="email" value={formData.email} disabled /></div>
                                <div className="input-field" style={{flex: 1}}><label>DNI</label><input name="dni" placeholder="NÚMERO" onChange={handleChange} required /></div>
                            </div>
                        </section>

                        {/* 02 // LOGÍSTICA_ENVÍO (DETALLADA) */}
                        <section className="checkout-section">
                            <h2 className="section-label">02 // LOGÍSTICA_ENVÍO</h2>
                            <div className="delivery-selector">
                                <button type="button" className={formData.tipoEntrega === 'domicilio' ? 'active' : ''} onClick={() => setFormData({...formData, tipoEntrega: 'domicilio'})}>DOMICILIO</button>
                                <button type="button" className={formData.tipoEntrega === 'sucursal' ? 'active' : ''} onClick={() => setFormData({...formData, tipoEntrega: 'sucursal'})}>CORREO_ARG</button>
                                <button type="button" className={formData.tipoEntrega === 'local' ? 'active' : ''} onClick={() => setFormData({...formData, tipoEntrega: 'local'})}>PICKUP</button>
                            </div>

                            <div className="shipping-detailed-grid">
                                <div className="input-row">
                                    <div className="input-field" style={{flex: 3}}>
                                        <label>CALLE / AVENIDA</label>
                                        <input name="calle" value={formData.calle} placeholder="Ej: Av. Rivadavia" onChange={handleChange} required />
                                    </div>
                                    <div className="input-field" style={{flex: 1}}>
                                        <label>NÚMERO</label>
                                        <input name="numero" placeholder="1234" onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="input-row">
                                    <div className="input-field"><label>PISO (OPC)</label><input name="piso" placeholder="2" onChange={handleChange} /></div>
                                    <div className="input-field"><label>DPTO / PUERTA</label><input name="puerta" placeholder="B" onChange={handleChange} /></div>
                                    <div className="input-field" style={{flex: 2}}><label>CÓDIGO POSTAL</label><input name="cp" placeholder="1407" onChange={handleChange} required /></div>
                                </div>

                                <div className="input-row">
                                    <div className="input-field"><label>CIUDAD</label><input name="ciudad" value={formData.ciudad} placeholder="CABA" onChange={handleChange} required /></div>
                                    <div className="input-field"><label>PROVINCIA</label><input name="provincia" value={formData.provincia} placeholder="Buenos Aires" onChange={handleChange} required /></div>
                                </div>

                                {/* MAP PLACEHOLDER / INTEGRACIÓN */}
                                <div className="google-map-preview">
                                    <div className="map-overlay">
                                        <span>MAP_ENGINE_READY: {formData.calle || "AWAITING_ADDRESS"}</span>
                                    </div>
                   
                                </div>
                            </div>
                        </section>

                        {/* 03 // PAGO */}
                        <section className="checkout-section">
                            <h2 className="section-label">03 // PROCESAMIENTO_PAGO</h2>
                            <div className="input-field">
                                <label>NÚMERO DE TARJETA</label>
                                <input name="tarjetaNumero" placeholder="0000 0000 0000 0000" onChange={handleChange} maxLength={19} required />
                            </div>
                            <div className="input-row">
                                <input name="mesVencimiento" placeholder="MM" maxLength={2} onFocus={() => setIsFlipped(false)} onChange={handleChange} required />
                                <input name="añoVencimiento" placeholder="YY" maxLength={2} onFocus={() => setIsFlipped(false)} onChange={handleChange} required />
                                <input name="cvv" placeholder="CVV" maxLength={4} onFocus={() => setIsFlipped(true)} onBlur={() => setIsFlipped(false)} onChange={handleChange} required />
                                <select className="select-cuotas" name="cuotas" onChange={handleChange}>
                                    <option value="1">1 PAGO</option>
                                    <option value="3">3 CUOTAS</option>
                                    <option value="6">6 CUOTAS</option>
                                </select>
                            </div>
                        </section>

                        <button type="submit" className="final-pay-btn" disabled={loading}>
                            {loading ? "EXECUTING..." : "CONFIRM_PAYMENT"}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary-column">
                    <div className="summary-sticky-content">
                        <CreditCard data={formData} isFlipped={isFlipped} />
                        
                        {/* PREVISUALIZACIÓN DE PRODUCTOS */}
                        <div className="checkout-items-preview">
                            <label className="section-label" style={{fontSize: '0.6rem', border: 'none'}}>ITEMS_IN_ORDER</label>
                            {cart.map(item => (
                                <div key={item.id} className="mini-item">
                                    <img src={item.imagen} alt={item.nombre} />
                                    <div className="mini-details">
                                        <p>{item.nombre} (x{item.cantidad})</p>
                                        <span>
                                            ${((item.precio ?? 0) * (item.cantidad ?? 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SECCIÓN CUPONES */}
                        <div className="checkout-coupon-box">
                            <div className="coupon-input-group">
                                <input 
                                    type="text" 
                                    placeholder="COUPON_CODE" 
                                    value={couponInput} 
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    className="coupon-input"
                                />
                                <button type="button" onClick={handleApplyCoupon} className="btn-apply-checkout">OK</button>
                            </div>
                            {couponMsg.text && (
                                <p className={`coupon-status ${couponMsg.isError ? 'error' : 'success'}`}>
                                    {couponMsg.text}
                                </p>
                            )}
                        </div>

                        {priceAlert && (
                            <div className="terminal-alert-box">
                                <span className="blink">{">"}</span> {priceAlert}
                                <button onClick={() => setPriceAlert(null)}>X</button>
                            </div>
                        )}    

                        <div className="cart-summary-card">
                            <div className="summary-line">
                                <span>SUBTOTAL</span>
                                <span>${totalAmount.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="summary-line highlight-green">
                                    <span>DISCOUNT ({appliedCoupon.discount}%)</span>
                                    <span>- ${(totalAmount - finalAmount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="summary-divider"></div>
                            <div className="summary-line total">
                                <span>TOTAL:</span>
                                <span>${finalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage