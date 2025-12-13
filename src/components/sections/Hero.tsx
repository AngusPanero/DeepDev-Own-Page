import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/hero.css"

const Hero = () => {
    return (
        <section style={{ height: "100vh", backgroundColor: "black", position: "relative" }}>
            <div className="nav-promo">
                🔥 -- Aprovechá un 20% OFF por tiempo limitado -- 🔥
            </div>

            <header className="hero-header" style={{ height: "5.5rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div className="left-actions" style={{ marginLeft: "2rem" }}>
                    <img className="img-logo" src={logo} alt="logo" width={150} />
                </div>
                <nav>
                    <ul style={{ display: "flex", gap: "5rem"}}>
                        <li><a href="#services">Productos</a></li>
                        <li><a href="#portfolio">Cotizaciones</a></li>
                        <li><a href="#about">Compañia</a></li>
                        <li><a href="#contact">Sorteos</a></li>
                    </ul>   
                </nav>

                <div className="right-actions" style={{ marginRight: "2rem", display: "flex", gap: "1rem" }}>
                    <button className="nav-buttons">Contacto</button>
                    <button className="nav-buttons">Inicio</button>
                </div>
            </header>
        </section>
    );
}

export default Hero;