import { UseTheme } from "../contexts/ThemeContext";
import "../styles/raffleTerms.css";

const TerminosSorteo = () => {
    const { theme } = UseTheme();

    return (
        <section className={`terminos-page-wrapper ${theme}`}>
            <div className="terminos-container">
                <h1 className="terminos-title">Términos y Condiciones</h1>
                <p className="terminos-intro">
                    Al participar en el sorteo de <strong>DeepDev</strong>, aceptás de manera íntegra las bases y condiciones detalladas a continuación.
                </p>

                <div className="terminos-content-body">
                    <h3>Requisitos de Participación</h3>
                    <p className="terminos-text">
                        Para participar, es obligatorio ser <strong>mayor de 18 años</strong>. Dado que una Landing Page o eCommerce puede tener fines lucrativos y/o económicos, el participante debe contar con capacidad legal para administrar este tipo de activos digitales.
                    </p>

                    <h3>El Premio y Alcance</h3>
                    <p className="terminos-text">
                        El premio consiste exclusivamente en el <strong>desarrollo y entrega</strong> de una Landing Page o eCommerce basado en los modelos de nuestra sección de ventas. 
                    </p>
                    <p className="terminos-text">
                        <strong>DeepDev</strong> se encarga únicamente de la creación del sitio. Los gastos de gestión, publicación en servidores (hosting), mantenimiento de bases de datos y adquisición de dominio web son <strong>pura y exclusivamente responsabilidad económica del ganador</strong>.
                    </p>

                    <h3>Deslinde de Responsabilidad</h3>
                    <p className="terminos-text">
                        <strong>DeepDev</strong> entrega la herramienta técnica, pero se desliga completamente de la finalidad, contenido o uso que el ganador le dé al sitio web en el futuro. No somos hacemos responsables por usos malintencionados, actividades ilícitas o cualquier gestión económica derivada del sitio una vez entregado.
                    </p>

                    <h3>Veracidad y Reclamo</h3>
                    <p className="terminos-text">
                        Cualquier dato no verídico en el formulario anula al ganador. Tras la notificación, el ganador dispone de <strong>72 horas</strong> para reclamar su premio; de lo contrario, se procederá a una nueva selección.
                    </p>

                    <h3>Consentimiento de Datos</h3>
                    <p className="terminos-text">
                        Los datos se usarán solo para fines del sorteo y publicidad de <strong>DeepDev</strong>. Al participar, das tu consentimiento para el tratamiento de dicha información y para recibir comunicaciones de la empresa.
                    </p>

                    <div className="terminos-footer">
                        <p>DeepDev se reserva el derecho de interpretación de las presentes bases.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TerminosSorteo;