import { useEffect, useState, useMemo } from "react";
import { UseTheme } from "../contexts/ThemeContext";
import { UseCart } from "../contexts/CartContext";
import { UseSession } from "../contexts/SessionContext";
import "./checkoutPage.css";
import CreditCard from "../components/ui/CreditCard";
import useMercadoPago from "../hooks/useMercadoPago";
import { v4 } from 'uuid';
import axios from "axios";
import Loader from "../components/sections/Loader";
import ProcessOk from "../components/sections/ProcessOk";
import Error from "../components/sections/Error";

const INTERES_RATES: Record<string, number> = {
    "1": 0,
    "3": 0.05, 
    "6": 0.10, 
    "9": 0.15, 
    "12": 0.20 
};

const CheckoutPage = () => {
    const mp = useMercadoPago()
    const [ idempotencyKey ] = useState(v4());

    const { theme } = UseTheme();
    const { user } = UseSession();
    const { cart, totalAmount, appliedCoupon, applyCoupon, clearCart, priceAlert, setPriceAlert, refreshCartPrices } = UseCart();
    
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
    const [ error, setError ] = useState<string | null | boolean>(null);
    const [ status, setStatus ] = useState<string>("");

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

    // --- LÓGICA DE CÁLCULO DE INTERESES SELECTIVOS ---
    const cuotasSeleccionadas = parseInt(formData.cuotas);

    const totalConInteres = useMemo(() => {
        return cart.reduce((acc, item) => {
            const precioBaseItem = (item.precio ?? 0) * (item.cantidad ?? 0);
            
            // Si las cuotas elegidas son <= a las permitidas sin interés, recargo es 0.
            // De lo contrario, aplicamos la tasa global correspondiente.
            const aplicaInteres = !item.cuotas_sin_interes || cuotasSeleccionadas > item.cuotas_sin_interes;
            const tasa = aplicaInteres ? (INTERES_RATES[formData.cuotas] || 0) : 0;
            
            return acc + (precioBaseItem * (1 + tasa));
        }, 0);
    }, [cart, formData.cuotas]);

    const finalAmountConInteres = useMemo(() => {
        if (!appliedCoupon) return totalConInteres;
        return totalConInteres * (1 - appliedCoupon.discount / 100);
    }, [totalConInteres, appliedCoupon]);

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

    const makePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mp) return;

        if (!window.confirm("¿Confirmar el procesamiento del pago?")) {
            return
        }
        try {
            setError(false);
            setLoading(true);

            const cardNumber = formData.tarjetaNumero.trim().replace(/\s/g, "");
            
            const bin = cardNumber.substring(0, 6);

            // 1. Obtener primero el método de pago
            const paymentMethodsResponse = await mp.getPaymentMethods({ bin });

            // CORRECCIÓN: Acceder a .results[0] según el log que mostraste
            const paymentMethod = paymentMethodsResponse && paymentMethodsResponse.results && paymentMethodsResponse.results.length > 0 
                ? paymentMethodsResponse.results[0] 
                : null;

            if (!paymentMethod) {
                console.error("No se pudo identificar el método de pago.");
            }

            // 2. Intentar obtener el emisor
            let issuerId = undefined;
            try {
                // el emisor ya viene dentro del paymentMethod: paymentMethod.issuer.id
                // Intentamos obtenerlo de la API por seguridad, pero tenemos el fallback del log
                const issuers = await mp.getIssuers({ 
                    paymentMethodId: paymentMethod.id, 
                    bin 
                });

                if (issuers && issuers.length > 0) {
                    issuerId = issuers[0].id;
                } else if (paymentMethod.issuer && paymentMethod.issuer.id) {
                    // Fallback: usar el que ya detectó getPaymentMethods
                    issuerId = paymentMethod.issuer.id;
                }
            } catch (issuerError) {
                console.warn("No se pudo obtener el emisor, continuando sin él...", issuerError);
            }

            // 3. Generar el CardToken
            // Nota: Asegúrate que identificationType sea dinámico si planeas aceptar otros que no sean DNI
            const cardToken = await mp.createCardToken({
                cardNumber,
                cardholderName: formData.nombre.trim(),
                cardExpirationMonth: formData.mesVencimiento.trim(),
                cardExpirationYear: formData.añoVencimiento.trim(),
                securityCode: formData.cvv.trim(),
                identificationType: "DNI", 
                identificationNumber: formData.dni.trim(),
            });
            
            if (!cardToken || !cardToken.id) {
                console.error("Error al generar el token de seguridad.");
            }

            // 4. Construir Payload
            const payload = {
                token: cardToken.id,
                issuer_id: issuerId ? String(issuerId) : undefined, 
                payment_method_id: paymentMethod.id,
                transaction_amount: Math.round(finalAmountConInteres),
                installments: Number(formData.cuotas),
                description: "DeepDev Studio - Servicio Digital",
                /* plan: productData.title, */
                payer: {
                    email: formData.email,
                    identification: {
                        type: "DNI",
                        number: formData.dni,
                    },
                    // Asegúrate que esta variable de entorno esté cargada
                    id_internal: `${import.meta.env.VITE_ID__MP_INTERNAL}`,
                },
                // Asegúrate que esta variable esté definida en tu componente
                idempotencyKey: typeof idempotencyKey !== 'undefined' ? idempotencyKey : undefined 
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/mercado-pago-payments`, payload);

            if (response.data.status === "approved") {
                clearCart()
                setStatus("ok");
            } else {
                setError(`Estado: ${response.data.status_detail || response.data.status}`);
            }

        } catch (error: any) {
            console.error("Error detallado en integración:", error);
            setError("Error al procesar el pago. Verifique los datos de su tarjeta.");
        } finally {
            setLoading(false);
        }
    };

    if (error) return <Error errorMessage="Error al procesar el pago!"/>
    if (loading) return <Loader />;
    if(status === "ok") return <ProcessOk processMessage={"Pago procesado exitosamente, Muchas Gracias!"} />

    return (
        <div className={`checkout-screen ${theme}`}>
            <div className="checkout-wrapper">
                <div className="checkout-form-column">
                    <header className="checkout-header">
                        <span className="terminal-text">SYSTEM_STATUS: PAYMENT_PENDING</span>
                        <h1>CHECKOUT_PROMPT</h1>
                    </header>

                    <form className="main-checkout-form" onSubmit={makePayment}>
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

                        <section className="checkout-section">
                            <h2 className="section-label">02 // LOGÍSTICA_ENVÍO</h2>
                            <div className="delivery-selector">
                                {['domicilio', 'sucursal', 'local'].map(tipo => (
                                    <button 
                                        key={tipo}
                                        type="button" 
                                        className={formData.tipoEntrega === tipo ? 'active' : ''} 
                                        onClick={() => setFormData({...formData, tipoEntrega: tipo})}
                                    >
                                        {tipo.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <div className="shipping-detailed-grid">
                                <div className="input-row">
                                    <div className="input-field" style={{flex: 3}}><label>CALLE / AVENIDA</label><input name="calle" value={formData.calle} placeholder="Ej: Av. Rivadavia" onChange={handleChange} required /></div>
                                    <div className="input-field" style={{flex: 1}}><label>NÚMERO</label><input name="numero" placeholder="1234" onChange={handleChange} required /></div>
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
                            </div>
                        </section>

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
                                <select className="select-cuotas" name="cuotas" value={formData.cuotas} onChange={handleChange}>
                                    <option value="1">1 PAGO (SIN INTERÉS)</option>
                                    <option value="3">3 CUOTAS (+5%*) </option>
                                    <option value="6">6 CUOTAS (+10%*) </option>
                                    <option value="9">9 CUOTAS (+15%*) </option>
                                    <option value="12">12 CUOTAS (+20%*) </option>
                                </select>
                            </div>
                            <small className="terminal-helper">* El recargo no aplica en productos con beneficio de cuotas sin interés.</small>
                            <p>Total: ${totalAmount.toLocaleString()}</p>
                            <p>Cuotas: {formData.cuotas}</p>
                            <p>Total Cuotas: ${typeof finalAmountConInteres}</p>
                            {cart.map((item, index) => <p key={index+1}>Prod: {index +1}: ${item.precio.toLocaleString()}</p>)}
                            
                        </section>

                        <button type="submit" className="final-pay-btn" disabled={loading || status === "ok"}>
                            {loading ? ("EJECUTANDO PAGO...") : status === "ok" ? ("PAGO APROBADO!") : ("CONFIRMAR_PAGO")}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary-column">
                    <div className="summary-sticky-content">
                        <CreditCard data={formData} isFlipped={isFlipped} />
                        
                        <div className="checkout-items-preview">
                            <label className="section-label" style={{fontSize: '0.6rem', border: 'none'}}>ITEMS_IN_ORDER</label>
                            {cart.map(item => {
                                const isFree = item.cuotas_sin_interes && cuotasSeleccionadas <= item.cuotas_sin_interes;
                                return (
                                <div key={item.id} className="mini-item-container">
                                    <div className="mini-item">
                                        <img src={item.imagen} alt={item.nombre} />
                                        <div className="mini-details">
                                            <p>{item.nombre} (x{item.cantidad})</p>
                                            <span>${((item.precio ?? 0) * (item.cantidad ?? 0)).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Promo CUOTAS */}
                                    {isFree ? (
                                        <div className="item-installment-badge benefit-active">
                                            <p>✓ Beneficio aplicado: Sin interés</p>
                                        </div>
                                    ) : null }

                                    {/* RECARGO: Solo si aplica interés (NO es gratis Y la cuota es > 1) */}
                                    {!isFree && cuotasSeleccionadas > 1 ? (
                                        <div className="item-installment-badge no-benefit">
                                            <p>✓ {formData.cuotas} Cuotas de: $ {Math.round(((item.precio * item.cantidad) * (1 + (INTERES_RATES[formData.cuotas] || 0))) / Number(formData.cuotas)).toLocaleString()}</p>
                                        </div>
                                    ) : null }
                                </div>
                            );
                            })}
                        </div>

                        <div className="checkout-coupon-box">
                            <div className="coupon-input-group">
                                <input type="text" placeholder="COUPON_CODE" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="coupon-input" />
                                <button type="button" onClick={handleApplyCoupon} className="btn-apply-checkout">OK</button>
                            </div>
                            {couponMsg.text && <p className={`coupon-status ${couponMsg.isError ? 'error' : 'success'}`}>{couponMsg.text}</p>}
                        </div>

                        {priceAlert && (
                            <div className="terminal-alert-box">
                                <span className="blink">{">"}</span> {priceAlert}
                                <button onClick={() => setPriceAlert(null)}>X</button>
                            </div>
                        )}    

                        <div className="cart-summary-card">
                            <div className="summary-line">
                                <span>SUBTOTAL PRODUCTOS</span>
                                <span>${totalAmount.toLocaleString()}</span>
                            </div>
                            {totalConInteres > totalAmount && (
                                <div className="summary-line highlight-red">
                                    <span>COSTO DE FINANCIACIÓN</span>
                                    <span>+ ${(totalConInteres - totalAmount).toLocaleString()}</span>
                                </div>
                            )}
                            {appliedCoupon && (
                                <div className="summary-line highlight-green">
                                    <span>DESCUENTO ({appliedCoupon.discount}%)</span>
                                    <span>- ${(totalConInteres - finalAmountConInteres).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="summary-divider"></div>
                            <div className="summary-line total">
                                <span>TOTAL FINAL:</span>
                                <span>${Math.round(finalAmountConInteres).toLocaleString()},-</span>
                            </div>
                            {cuotasSeleccionadas > 1 && (
                                <div className="summary-line installment-footer">
                                    <span>{cuotasSeleccionadas} PAGOS DE:</span>
                                    <span className="inst-amount">${(finalAmountConInteres / cuotasSeleccionadas).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;