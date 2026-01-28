import { Link } from "react-router-dom";
import { forwardRef } from "react";
import moon from "../../../public/logos/moon2.svg"
import sun from "../../../public/logos/sun.svg"

const NavBarMobile = forwardRef(({ closeMenu, texts, language, theme, handleTheme, handleLanguage, openLogin }, ref) => {
    return (
        <div className={`mobile-menu-container ${theme}`} ref={ref}>
            <nav className="mobile-nav-links">
                <Link to="/products" onClick={closeMenu}>{texts[language].nav.products}</Link>
                <Link to="/company" onClick={closeMenu}>{texts[language].nav.company}</Link>
                <Link to="/raffles" onClick={closeMenu}>{texts[language].nav.raffles}</Link>
                <Link to="/contact" onClick={closeMenu}>{texts[language].nav.contact}</Link>
            </nav>

            <div className="mobile-extra-actions">
                <div className="mobile-selectors">
                    <select className="nav-buttons lan" value={language}onChange={(e) => {handleLanguage(e.target.value);closeMenu();}}>
                        <option value="es">🌎 {texts[language].language}</option> 
                        <option value="es">🇪🇸 Es</option>
                        <option value="en">🇺🇸 En</option>
                        <option value="it">🇮🇹 It</option>
                        <option value="de">🇩🇪 De</option>
                        <option value="ru">🇷🇺 Ru</option>
                        <option value="fr">🇫🇷 Fr</option>
                    </select>

                    <button className="nav-buttons" onClick={handleTheme}>
                        <img style={{ backgroundColor: "transparent" }} src={theme === "dark" ? sun : moon} alt="theme-icon" width={22} />
                    </button>
                </div>

                <button onClick={() => {openLogin(); closeMenu();}} className="nav-buttons login-mobile-btn">
                    {texts[language].nav.login}
                </button>
            </div>
        </div>
    );
});

export default NavBarMobile;