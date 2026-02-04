import useTheme from "../contexts/ThemeContext";
import "../styles/politicaCookie.css"

const PoliticaCookies = () => {
    const { theme } = useTheme()
    return (
        <section className={`cookies-page-wrapper ${theme}`}>
            <div className="cookies-container">
                <h1 className="cookies-title">Política de Cookies</h1>
                <p className="cookies-text">
                    En <strong>DeepDev</strong> utilizamos cookies para mejorar tu experiencia de navegación y ofrecerte un servicio personalizado. Al continuar navegando en nuestro sitio, entendemos que aceptás su uso.
                </p>

                <div className="cookies-content-body">
                    <h2>¿Qué son las cookies?</h2>
                    <p className="cookies-text">
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitás un sitio web. Sirven para recordar tus preferencias y ayudarte a tener una experiencia más fluida.
                    </p>

                    <h2>¿Qué tipos de cookies usamos?</h2>
                    <ul className="cookies-list">
                        <li><strong>Cookies esenciales:</strong> Necesarias para que el sitio funcione.</li>
                        <li><strong>Cookies de rendimiento:</strong> Analizan el uso del sitio.</li>
                        <li><strong>Cookies de funcionalidad:</strong> Recuerdan tus preferencias.</li>
                        <li><strong>Cookies de terceros:</strong> Servicios externos como redes sociales.</li>
                    </ul>

                    <h2>¿Cómo puedo gestionar las cookies?</h2>
                    <p className="cookies-text">
                        Podés configurar tu navegador para aceptar o rechazar cookies. Tené en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default PoliticaCookies;