import React, { useState } from "react";
import axios from "axios";
import useMercadoPago from "../../hooks/useMercadoPago";
import Error from "./Error";
import Loader from "./Loader";
import "../../styles/checkout.css"

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  planData: { name: string; price: number };
}

interface CheckoutProps {
  closeCheckout: () => void;
  planData: { name: string; price: number };
}

const Checkout: React.FC<CheckoutProps> = ({ closeCheckout, planData }) => {
  const mp = useMercadoPago();
  const { theme } = useTheme();
  const checkoutRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ 
    nombre: "", email: "", dni: "", 
    tarjetaNumero: "", mesVencimiento: "", anioVencimiento: "", 
    cvv: "", cuotas: "1" 
  });
  
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exit, setExit] = useState(false);

  // Manejo de cierre con animación
  const handleClose = () => {
    setExit(true);
    setTimeout(closeCheckout, 600);
  };

  // Cerrar al clickear afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (checkoutRef.current && !checkoutRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const realizarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mp) return;

    try {
      setError(null);
      setLoading(true);

      const cardToken = await mp.cardToken.create({
        cardNumber: formData.tarjetaNumero,
        cardholderName: formData.nombre,
        cardExpirationMonth: formData.mesVencimiento,
        cardExpirationYear: formData.anioVencimiento,
        securityCode: formData.cvv,
        identificationType: "DNI",
        identificationNumber: formData.dni,
      });

      if (!cardToken || !cardToken.id) {
        throw new Error("Datos de tarjeta inválidos");
      }

      const payload = {
        token: cardToken.id,
        issuer_id: cardToken.issuer_id,
        payment_method_id: cardToken.payment_method_id,
        transaction_amount: planData.price,
        installments: Number(formData.cuotas),
        payer: {
          email: formData.email,
          identification: { type: "DNI", number: formData.dni },
          id_internal: "USER_DEEP_DEV", 
        },
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/mercado-pago-payments`, payload);
      
      if (response.data.status === "approved") {
        setStatus("ok");
      } else {
        setError("El pago fue rechazado. Verifique sus fondos o tarjeta.");
      }
      
    } catch (err: any) {
      setError("Error al procesar el pago. Intente nuevamente.");
      console.error("Pago fallido", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (status === "ok") {
    return (
      <div className={`section-checkout ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
        <div className="success-container">
          <span className="check-mark">✓</span>
          <h2 className="checkout-title">¡Gracias!</h2>
          <p className="checkout-subtitle">Tu suscripción a {planData.name} está activa.</p>
          <button className="checkout-btn" onClick={handleClose}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={checkoutRef} 
      className={`section-checkout ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}
      style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}
    >
      <button className="close-button" onClick={handleClose}>✕</button>

      <h2 className="checkout-title">Checkout</h2>
      <p className="checkout-subtitle">{planData.name} — ${planData.price}</p>

      <form className="checkout-form" onSubmit={realizarPago}>
        
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
                <select name="cuotas" onChange={handleChange} className="checkout-input" style={{height: '100%'}}>
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
            <input name="mesVencimiento" placeholder="MM" onChange={handleChange} className="checkout-input" style={{ flex: 1 }} required />
            <input name="anioVencimiento" placeholder="YY" onChange={handleChange} className="checkout-input" style={{ flex: 1 }} required />
            <input name="cvv" placeholder="CVV" onChange={handleChange} className="checkout-input" style={{ flex: 1 }} required />
        </div>

        {error && <p className="error-password" style={{marginTop: '1rem'}}>{error}</p>}

        <button type="submit" className="checkout-btn" disabled={loading}>
          {loading ? "Procesando..." : `PAGAR $${planData.price}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;