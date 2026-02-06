import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useMercadoPago from "../../hooks/useMercadoPago";
import Error from "./Error";
import Loader from "./Loader";
import "../../styles/checkout.css"
import useTheme from "../../contexts/ThemeContext";
import CreditCard from "../ui/CreditCard";

const CheckoutPayment = ({ openPayment, productData }) => {
    const checkoutRef = useRef<HTMLDivElement>(null);

    const { theme } = useTheme()
    const [ exit, setExit ] = useState(false);
    const [ formData, setFormData ] = useState({ nombre: "", email: "", dni: "", tarjetaNumero: "", mesVencimiento: "", añoVencimiento: "", cvv: "", cuotas: "1" })

    const [ isFlipped, setIsFlipped ] = useState(false);
    const [ status, setStatus ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
            setExit(true);
            setTimeout(openPayment, 600);
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

    return(
        <div ref={checkoutRef} className={`checkout-container ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>
            {/* <h2 className="checkout-title">Checkout</h2>
            <p className="checkout-subtitle">{productData.name} — ${productData.price}</p> */}

            <CreditCard data={formData} isFlipped={isFlipped} />

            <form className="checkout-form" /* onSubmit={realizarPago} */>
                
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
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                </div>

                <div className="checkout-input-group">
                    <label>Número de Tarjeta</label>
                    <input name="tarjetaNumero" placeholder="0000 0000 0000 0000" onChange={handleChange} className="checkout-input" required />
                </div>

                <div className="card-row">
                    <input name="mesVencimiento" onFocus={() => setIsFlipped(false)} placeholder="Mes" onChange={handleChange} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input name="añoVencimiento" onFocus={() => setIsFlipped(false)} placeholder="Año" onChange={handleChange} className="checkout-input numbers" style={{ flex: 1 }} required />
                    <input name="cvv" onFocus={() => setIsFlipped(true)} onBlur={()=> setIsFlipped(false)} placeholder="CVV" onChange={handleChange} className="checkout-input numbers" style={{ flex: 1 }} required />
                </div>

                {error && <p className="error-password" style={{marginTop: '1rem'}}>{error}</p>}

                <button type="submit" className="checkout-btn" disabled={loading}>Procesar Pago</button>
            </form>
        </div>
    )
}

export default CheckoutPayment