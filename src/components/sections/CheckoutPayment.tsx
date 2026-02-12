import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useMercadoPago from "../../hooks/useMercadoPago";
import Loader from "./Loader";
import "../../styles/checkout.css"
import { UseTheme } from "../../contexts/ThemeContext";
import CreditCard from "../ui/CreditCard";
import ProcessOk from "./ProcessOk";
import { v4 } from 'uuid';
import { createPortal } from "react-dom";

interface CheckoutPaymentProps {
  openPayment: () => void; // antes estaba como boolean en el comment de la funcion anterior
  productData: any
}

const CheckoutPayment = ({ openPayment, productData }: CheckoutPaymentProps) => {
    const checkoutRef = useRef<HTMLDivElement>(null);
    const mp = useMercadoPago();

    const { theme } = UseTheme()
    const [ exit, setExit ] = useState(false);
    const [ formData, setFormData ] = useState({ nombre: "", email: "", dni: "", tarjetaNumero: "", mesVencimiento: "", añoVencimiento: "", cvv: "", cuotas: "1" })
    
    const [ idempotencyKey ] = useState(v4());
    const [ isFlipped, setIsFlipped ] = useState(false);
    const [ status, setStatus ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null | boolean>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* const handleClose = () => {
            setExit(true);
            setTimeout(openPayment, 600);
    }; */

    const handleClose = () => {
        setExit(true);
        
        setTimeout(() => {
            openPayment(); 
        }, 600);
    };

        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (checkoutRef.current && !checkoutRef.current.contains(e.target as Node)) {
                    handleClose();
                }
            };
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);


        const makePayment = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!mp) return;

            try {
                setError(false);
                setLoading(true);

                // 1. Crear el token de la tarjeta
                const cardToken = await mp.createCardToken({
                    cardNumber: formData.tarjetaNumero.trim().replace(/\s/g, ""),
                    cardholderName: formData.nombre.trim(),
                    cardExpirationMonth: formData.mesVencimiento.trim(),
                    cardExpirationYear: formData.añoVencimiento.trim(),
                    securityCode: formData.cvv.trim(),
                    identificationType: "DNI",
                    identificationNumber: formData.dni.trim(),
                });

                if (!cardToken || !cardToken.id) {
                    setError("Datos de tarjeta inválidos");
                    return;
                }

                // 2. Determinar el payment_method_id dinámicamente
                // Sacamos el primer número del BIN (523937 -> 5)
                const firstDigit = cardToken.first_six_digits.charAt(0);
                let detectedMethod = "visa"; // Valor por defecto inicial

                if (firstDigit === '5') {
                    detectedMethod = "mastercard";
                } else if (firstDigit === '3') {
                    detectedMethod = "amex";
                } else if (firstDigit === '4') {
                    detectedMethod = "visa";
                }

                // 3. Limpiar datos sensibles
                setFormData(prev => ({
                    ...prev, tarjetaNumero: "", cvv: "", mesVencimiento: "", añoVencimiento: ""
                }));

                // 4. Armar el Payload
                const payload = {
                    token: cardToken.id,
                    // Aquí usamos el método detectado o lo que devuelva el cardToken
                    payment_method_id: cardToken.payment_method_id || detectedMethod,
                    issuer_id: cardToken.issuer_id ? String(cardToken.issuer_id) : null,
                    transaction_amount: Number(productData.price), // IMPORTANTE: Enviarlo como número
                    installments: Number(formData.cuotas),
                    payer: {
                        email: formData.email,
                        identification: { type: "DNI", number: formData.dni },
                        id_internal: `${import.meta.env.VITE_ID__MP_INTERNAL}`
                    },
                    idempotencyKey: idempotencyKey
                };

                console.log("PAYLOAD LISTO PARA ENVIAR: ", payload);

                // 5. Envío al backend
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/mercado-pago-payments`, payload);

                if (response.data.status === "approved") {
                    await axios.post(`${import.meta.env.VITE_API_URL}/ticket-order`, { 
                        name: formData.nombre, 
                        plan: productData.title, 
                        price: productData.price, 
                        email: formData.email 
                    });
                    setStatus("ok");
                } else {
                    setError(`Pago no aprobado: ${response.data.status}`);
                }

            } catch (error) {
                setError(true);
                console.error("Error en el proceso de pago:", error);
            } finally {
                setLoading(false);
            }
        };

     if (loading) return <Loader />;
     if(status === "ok") return <ProcessOk processMessage={"Pago procesado exitosamente, Muchas Gracias!"} />

        const content = <div ref={checkoutRef} className={`checkout-container ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>
            {/* <h2 className="checkout-title">Checkout</h2> */}
        
            <CreditCard data={formData} isFlipped={isFlipped} />

            <p className="checkout-subtitle">{productData.name} — ${productData.price}</p>

            <form className="checkout-form" onSubmit={makePayment}>
                
                <div className="checkout-input-group">
                    <label>Titular de la tarjeta</label>
                    <input name="nombre" placeholder="Nombre completo" onChange={handleChange} className="checkout-input" required />
                </div>

                <div className="checkout-input-group">
                    <label>Email de facturación</label>
                    <input name="email" type="email" placeholder="email@ejemplo.com" onChange={handleChange} className="checkout-input" required />
                </div>

                <div className="card-row">
                    <div className="checkout-input-group" style={{ flex: 2 }}>
                        <label>DNI</label>
                        <input name="dni" placeholder="Número" onChange={handleChange} className="checkout-input" required />
                    </div>
                    <div className="checkout-input-group" style={{ flex: 1 }}>
                        <label>Cuotas</label>
                        <select name="cuotas" onChange={handleChange} className="checkout-input">
                            <option value="1">1 Pago ${productData.price}</option>
                            <option value="3">3 Pagos ${Math.round(productData.price / 3)}</option>
                            <option value="6">6 Pagos ${Math.round(productData.price / 6)}</option>
                        </select>
                    </div>
                </div>

                <div className="checkout-input-group">
                    <label>Número de Tarjeta</label>
                    <input placeholder="0000 0000 0000 0000" onChange={(e) => setFormData({...formData, tarjetaNumero: e.target.value})} className="checkout-input" required />
                </div>

                <div className="card-row">
                    <input onFocus={() => setIsFlipped(false)} placeholder="Mes" onChange={(e) => setFormData({...formData, mesVencimiento: e.target.value})} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input onFocus={() => setIsFlipped(false)} placeholder="Año" onChange={(e) => setFormData({...formData, añoVencimiento: e.target.value})} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input onFocus={() => setIsFlipped(true)} onBlur={()=> setIsFlipped(false)} onChange={(e) => setFormData({...formData, cvv: e.target.value})} placeholder="CVV"  className="checkout-input numbers" style={{ flex: 1 }} required />
                </div>

                {error && <p className="error-password" style={{marginTop: '1rem'}}>{error}</p>}

                <button type="submit" className="checkout-btn" disabled={loading}>{loading ? "Procesando..." : "Procesar Pago"}</button>
            </form>
        </div>
    
    return createPortal(content, document.body);
}

export default CheckoutPayment