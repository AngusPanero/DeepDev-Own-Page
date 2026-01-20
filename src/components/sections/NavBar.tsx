import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/navBar.css"
import Login from "./Login";
import moon from "../../../public/logos/moon2.svg"
import sun from "../../../public/logos/sun.svg"
import useLanguage from "../../contexts/LanguageContext";

// z-Index 999
const NavBar = () => {
    const [ loginOpen, setLoginOpen ] = useState(false);    
    const [ showPromo, setShowPromo ] = useState(true); 
    const [ isDarkMode, setIsDarkMode ] = useState(true);

    const lastScrollY = useRef(0);  
    const { language, setLanguage, texts } = useLanguage()

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            
            if( currentScroll > lastScrollY.current && currentScroll > 20){
                setShowPromo(false);
            } else {
                setShowPromo(true); 
            }
            lastScrollY.current = currentScroll
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [language])

    return (
        <>
        <section className={"nav-wrapper"}>
            <div className={`nav-promo ${showPromo ? "open" : "closed"}`}>
                {texts[language].nav.promo}
            </div>

            <header className="hero-header" style={{ height: "5.5rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div className="left-actions" style={{ marginLeft: "2rem" }}>
                    <Link to="/"><img className="img-logo" src={logo} alt="logo" width={165} /></Link>
                </div>
                <nav>
                    <ul style={{ display: "flex", gap: "5rem"}}>
                        <li><a href="/products">{texts[language].nav.products}</a></li>
                        <li><a href="/company">{texts[language].nav.company}</a></li>
                        <li><a href="/raffles">{texts[language].nav.raffles}</a></li>
                        <li><a href="/contact">{texts[language].nav.contact}</a></li>
                    </ul>   
                </nav>

                <div className="right-actions" style={{ marginRight: "1.5rem", display: "flex", gap: "1rem" }}>
                    <button className="nav-buttons" onClick={() => setIsDarkMode(!isDarkMode)}>{<img style={{ backgroundColor: "transparent" }} src={isDarkMode? sun : moon} alt="moon" width={22} />}</button>
                        
                    <div>
                        <select className="nav-buttons" onChange={(e) => setLanguage(e.target.value)} style={{ cursor: 'pointer', width: '110px' }}>
                            <option value="es">🌎 Lan</option> 
                            <option value="es">🇪🇸 Es</option>
                            <option value="en">🇺🇸 En</option>
                            <option value="it">🇮🇹 It</option>
                            <option value="de">🇩🇪 De</option>
                            <option value="ru">🇷🇺 Ru</option>
                            <option value="fr">🇫🇷 Fr</option>
                        </select>
                    </div>

                    <button onClick={() => setLoginOpen(true)} className="nav-buttons">{texts[language].nav.login}</button>
                </div>
            </header>
        </section>
        { loginOpen && <Login closeLogin={() => setLoginOpen(false)} /> }
        </>
    );
}

export default NavBar;