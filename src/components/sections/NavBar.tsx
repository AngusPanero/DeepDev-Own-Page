import { Link } from "react-router-dom";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/navBar.css"

const NavBar = () => {
    return (
        <section style={{ height: "14.1vh", backgroundColor: "black", position: "relative" }}>
            <div className="nav-promo">
                🔥 -- Aprovechá un 20% OFF por tiempo limitado -- 🔥
            </div>

            <header className="hero-header" style={{ height: "5.5rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div className="left-actions" style={{ marginLeft: "2rem" }}>
                    <img className="img-logo" src={logo} alt="logo" width={165} />
                </div>
                <nav>
                    <ul style={{ display: "flex", gap: "5rem"}}>
                        <li><a href="/services">Productos</a></li>
                        <li><a href="/portfolio">Cotizaciones</a></li>
                        <li><a href="/about">Compañía</a></li>
                        <li><a href="/lottery">Sorteos</a></li>
                        <li><a href="/recluiters">Reclutadores</a></li>
                    </ul>   
                </nav>

                <div className="right-actions" style={{ marginRight: "2rem", display: "flex", gap: "1rem" }}>
                    <Link to="/contact" className="nav-buttons">Contacto</Link>
                    <Link to="/login" className="nav-buttons">Inicio</Link>
                </div>
            </header>
        </section>
    );
}

export default NavBar;