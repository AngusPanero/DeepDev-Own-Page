import SalesCard from "../components/sections/SalesCard";
import TubesCursor from "../components/ui/TubesCursor";
import { UseTheme } from "../contexts/ThemeContext";
import "../styles/sales.css"

const Sales = () => {
    const { theme } = UseTheme();

    const plans = [
    {
        title: "Plan Landing Basic",
        price: "199000",
        subtitle: "Tu primera huella digital",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Interfaz de usuario moderna", included: true },
            { text: "Acceso a catálogo 3D", included: true },
            { text: "Mailing profesional", included: false },
            { text: "Experiencia de usuario pro", included: true },
            { text: "Optimización SEO básica", included: true },
            { text: "4 secciones personalizadas", included: true },
            { text: "Optimización SEO básica", included: true },
            { text: "Formulario de contacto", included: true },
            { text: "Panel de administrador", included: false },
            { text: "Modo claro/oscuro", included: false },
            { text: "Chat-Bot Inteligencia Artificial", included: false },
            { text: "Reseñas de Google", included: false },
        ]
    },
    {
        title: "Plan Landing Pro",
        price: "249000",
        subtitle: "Enfocada en conversiones",
        isPopular: true,
        buttonText: "Contratar Ahora",
        features: [
            { text: "Interfaz de usuario moderna", included: true },
            { text: "Responsive para celulares", included: true },
            { text: "Acceso a catálogo 3D", included: true },
            { text: "Mailing profesional", included: true },
            { text: "Experiencia de usuario pro", included: true },
            { text: "5 secciones personalizadas", included: true },
            { text: "Optimización SEO avanzada", included: true },
            { text: "Integración con Analytics/Pixel", included: true },
            { text: "Formulario de contacto", included: true },
            { text: "Panel de administrador", included: true },
            { text: "Modo Claro-Oscuro", included: true },
            { text: "Chat-Bot Inteligencia Artificial", included: true },
            { text: "Reseñas de Google", included: true },
        ]
    },
    {
        title: "Plan E-Commerce Lite",
        price: "299000",
        subtitle: "Empieza a vender online",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Carrito de compras", included: true },
            { text: "Gestión de hasta 50 productos", included: true },
            { text: "Pasarela de pagos Mercado Pago", included: true },
            { text: "Sincronización de stock real", included: false },
        ]
    },
    {
        title: "Plan E-Commerce Full",
        price: "349000",
        subtitle: "Un ecosistema de ventas",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Productos ilimitados", included: true },
            { text: "Cuentas de usuario y favoritos", included: true },
            { text: "Cálculo de envíos automático", included: true },
            { text: "Dashboard de ventas avanzado", included: true },
        ]
    }
];

    return (
        <>
        
        <div className={`sales-page-container ${theme === "light" ? "theme-light" : "theme-dark"}`}>
            {/* <h1 className="sales-title">Aplicaciones Webs Disponibles:</h1> */}
            <div className={`dd-grid-overlay ${theme}`}></div> 
            <div className="sales-grid">
                {plans.map((plan, index) => (
                    <SalesCard key={index} {...plan} />
                ))}
            </div>
            <TubesCursor />
        </div>
        
        </>
    );
};

export default Sales;