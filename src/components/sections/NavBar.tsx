import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/navBar.css"
import Login from "./Login";
import moon from "../../../public/logos/moon2.svg"
import sun from "../../../public/logos/sun.svg"
import useLanguage from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";
import NavBarMobile from "./NavBarMobile";
import Register from "./Register";

const NavBar = () => {
    const [ openRegister, setOpenRegister ] = useState<boolean>(false)
    const [ loginOpen, setLoginOpen ] = useState(false);    
    const [ showPromo, setShowPromo ] = useState(true);
    const [ menuOpen, setMenuOpen ] = useState(false);

    const lastScrollY = useRef(0);
    const menuRef = useRef(); 

    const { language, handleLanguage, texts } = useLanguage()
    const { theme, handleTheme } = useTheme()

    const openRegisterFromLogin = () => {
        setLoginOpen(false);
        setOpenRegister(true);
    };

    // Lógica para cerrar menú mobile al hacer clic fuera o scroll fuerte
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            
            // Ocultar promo al bajar
            if( currentScroll > lastScrollY.current && currentScroll > 20){
                setShowPromo(false);
            } else {
                setShowPromo(true); 
            }
            lastScrollY.current = currentScroll
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [language]);

    return (
        <>
        <section className={`nav-wrapper ${theme === "light" ? "theme-light" : "theme-dark"}`}>
            {/* PROMO BAR */}
            <div className={`nav-promo ${showPromo ? "open" : "closed"}`}>
                {texts[language].nav.promo}
            </div>

            <header className="hero-header" style={{ background: theme === "dark" ? "#00000095" : "rgba(186, 174, 233, 0.64)" }}>
                <div className="left-actions" style={{ marginLeft: "2rem" }}>
                    <Link to="/"><img className="img-logo" src={logo} alt="logo" width={165} /></Link>
                </div>

                {/* NAVEGACIÓN DESKTOP */}
                <nav className="nav-desktop">
                    <ul style={{ display: "flex", gap: "5rem"}}>
                        <li><Link to="/products">{texts[language].nav.products}</Link></li>
                        <li><Link to="/company">{texts[language].nav.company}</Link></li>
                        <li><Link to="/raffles">{texts[language].nav.raffles}</Link></li>
                        <li><Link to="/contact">{texts[language].nav.contact}</Link></li>
                    </ul>   
                </nav>

                <div className="right-actions" style={{ marginRight: "1.5rem", display: "flex", gap: "1rem" }}>
                    {/* ACCIONES DESKTOP */}
                    <div className="actions-desktop-group">
                        <button className="nav-buttons" onClick={() => handleTheme(theme === "dark" ? "light" : "dark")}>
                            <img style={{ backgroundColor: "transparent" }} src={theme === "dark" ? sun : moon} alt="theme-icon" width={22} />
                        </button>
                            
                        <select className="nav-buttons lan" value={language} onChange={(e) => handleLanguage(e.target.value)} style={{ cursor: 'pointer', width: '110px'}}>
                            <option value="es">🌎 {texts[language].language}</option> 
                            <option value="es">🇪🇸 Es</option>
                            <option value="en">🇺🇸 En</option>
                            <option value="it">🇮🇹 It</option>
                            <option value="de">🇩🇪 De</option>
                            <option value="ru">🇷🇺 Ru</option>
                            <option value="fr">🇫🇷 Fr</option>
                        </select>

                        <button onClick={() => setLoginOpen(true)} className="nav-buttons">{texts[language].nav.login}</button>
                    </div>

                    {/* BOTÓN HAMBURGUESA (Solo Mobile) */}
                    <button style={{ border: theme === "dark" ? "white" : "#0062FF"}} className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                        <span style={{ backgroundColor: theme === "dark" ? "white" : "#0062FF"}} className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span style={{ backgroundColor: theme === "dark" ? "white" : "#0062FF"}} className={`bar ${menuOpen ? "open" : ""}`}></span>
                        <span style={{ backgroundColor: theme === "dark" ? "white" : "#0062FF"}} className={`bar ${menuOpen ? "open" : ""}`}></span>
                    </button>
                </div>
            </header>

            {/* MENÚ MOBILE DESPLEGABLE */}
            {menuOpen && (
                <NavBarMobile 
                    ref={menuRef}
                    closeMenu={() => setMenuOpen(false)}
                    texts={texts}
                    language={language}
                    theme={theme}
                    handleTheme={() => handleTheme(theme === "dark" ? "light" : "dark")}
                    handleLanguage={handleLanguage}
                    openLogin={() => setLoginOpen(true)}
                />
            )}
        </section>

        { loginOpen && <Login openRegister={openRegisterFromLogin} closeLogin={() => setLoginOpen(false)} /> }
        { openRegister && <Register closeRegister={() => setOpenRegister(false)} /> }   
        </>
    );
}

export default NavBar;