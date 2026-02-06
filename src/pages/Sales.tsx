import CheckoutPayment from "../components/sections/CheckoutPayment";
import SalesCard from "../components/sections/SalesCard";
import TubesCursor from "../components/ui/TubesCursor";
import useTheme from "../contexts/ThemeContext";
import "../styles/sales.css"

const Sales = () => {
    const { theme } = useTheme();

    const plans = [
    {
        title: "Landing Basic",
        price: "199.000",
        subtitle: "Tu primera huella digital",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Diseño One-Page moderno", included: true },
            { text: "Optimización SEO básica", included: true },
            { text: "Formulario de contacto", included: true },
            { text: "Panel de administración", included: false },
        ]
    },
    {
        title: "Landing Pro",
        price: "299.000",
        subtitle: "Enfocada en conversiones",
        isPopular: true,
        buttonText: "Contratar Ahora",
        features: [
            { text: "Hasta 5 secciones personalizadas", included: true },
            { text: "Copywriting persuasivo", included: true },
            { text: "Integración con Analytics/Pixel", included: true },
            { text: "Blog o sección de noticias", included: true },
        ]
    },
    {
        title: "E-shop Lite",
        price: "299.000",
        subtitle: "Empieza a vender online",
        buttonText: "Contratar Ahora",
        features: [
            { text: "Carrito de compras", included: true },
            { text: "Gestión de hasta 50 productos", included: true },
            { text: "Pasarela de pagos (Stripe/PayPal)", included: true },
            { text: "Sincronización de stock real", included: false },
        ]
    },
    {
        title: "E-shop Full",
        price: "399.999",
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
            <h1 className="sales-title">Aplicaciones Webs Disponibles:</h1>
            <div className="sales-grid">
                {plans.map((plan, index) => (
                    <SalesCard key={index} {...plan} />
                ))}
            </div>
            {/* <TubesCursor /> */}
        </div>
        </>
    );
};

export default Sales;