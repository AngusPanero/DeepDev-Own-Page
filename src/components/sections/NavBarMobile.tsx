import { forwardRef } from "react";
import moon from "/logos/moon2.svg"
import sun from "/logos/sun.svg"
import { UseSession } from "../../contexts/SessionContext";

interface NavBarMobileProps {
    closeMenu: () => void;
    texts: any;
    language: string;
    theme: string;
    handleTheme: () => void;
    handleLanguage: (e: string) => void;
    openLogin: () => void;
}

const NavBarMobile = forwardRef(({ closeMenu, texts, language, theme, handleTheme, handleLanguage, openLogin }: NavBarMobileProps, ref: any) => {
    const { user, handleLogout } = UseSession()

    return (
        <div className={`mobile-menu-container ${theme}`} ref={ref}>
            <nav className="mobile-nav-links">
                <a href="/" onClick={closeMenu}> {texts[language].footer.navigation[0]}</a>
                <a href="/products" onClick={closeMenu}>{texts[language].nav.products}</a>
                <a href="/sales" onClick={closeMenu}>{texts[language].nav.sales}</a>
                <a href="/company" onClick={closeMenu}>{texts[language].nav.company}</a>
                <a href="/raffles" onClick={closeMenu}>{texts[language].nav.raffles}</a>
                <a href="/contact" onClick={closeMenu}>{texts[language].nav.contact}</a>
                {user && <li><a href={`/${user.admin === true ? "admin" : "dashboard" }`}>{user.admin === true ? "Admin" : "Dashboard"}</a></li>}
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
                {/* BOTÓN LOGIN LOGOUT */}
                {user ? 
                <button onClick={() => handleLogout()} className="nav-buttons login-mobile-btn">
                    Cerrar Sesión
                </button>
                :
                <button onClick={() => {openLogin(); closeMenu();}} className="nav-buttons login-mobile-btn">
                    {texts[language].nav.login}
                </button>
                }
                
            </div>
        </div>
    );
});

export default NavBarMobile;