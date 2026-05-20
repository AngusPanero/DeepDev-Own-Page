import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../styles/navBar.css"
import Login from "./Login";
import { UseLanguage } from "../../contexts/LanguageContext";
import { UseTheme } from "../../contexts/ThemeContext";
import NavBarMobile from "./NavBarMobile";
import Register from "./Register";
import { UseSession } from "../../contexts/SessionContext";

// ── SVG icons ─────────────────────────────────────────────────
const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
)

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1"  x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1"  y1="12" x2="3"  y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
    </svg>
)

const GlobeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

const NavBar = () => {
    const [openRegister, setOpenRegister] = useState(false)
    const [loginOpen, setLoginOpen]       = useState(false)
    const [showPromo, setShowPromo]       = useState(true)
    const [menuOpen, setMenuOpen]         = useState(false)

    const lastScrollY = useRef(0)
    const menuRef     = useRef<HTMLDivElement>(null)

    const { user, handleLogout, verifyIsAdmin } = UseSession()
    const { language, handleLanguage, texts }   = UseLanguage()
    const { theme, handleTheme }                = UseTheme()
    const isDark = theme !== "light"

    const openRegisterFromLogin = () => { setLoginOpen(false);    setOpenRegister(true) }
    const openLoginFromRegister = () => { setLoginOpen(true);     setOpenRegister(false) }

    useEffect(() => { verifyIsAdmin() }, [user])

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest(".hamburger-btn"))
                setMenuOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [menuOpen])

    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY
            setShowPromo(!(current > lastScrollY.current && current > 20))
            lastScrollY.current = current
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [language])

    return (
        <>
        <section className={`nav-wrapper ${isDark ? "theme-dark" : "theme-light"}`}>

            {/* ── PROMO TICKER ── */}
            <div className={`nav-promo ${showPromo ? "open" : "closed"}`} aria-live="polite">
                <div className="nav-promo-track">
                    {/* duplicated for seamless loop */}
                    {[0, 1].map(i => (
                        <span key={i} className="nav-promo-text" aria-hidden={i === 1 ? "true" : undefined}>
                            {texts[language].nav.promo}
                            &nbsp;&nbsp;·&nbsp;&nbsp;
                            {texts[language].nav.promo}
                            &nbsp;&nbsp;·&nbsp;&nbsp;
                            {texts[language].nav.promo}
                            &nbsp;&nbsp;·&nbsp;&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            {/* ── HEADER ── */}
            <header className="hero-header">

                {/* LOGO / WORDMARK */}
                <Link to="/" className="nav-wordmark">
                    <span className="nav-wordmark-deep">Deep</span>
                    <span className="nav-wordmark-dev">Dev</span>
                    <span className="nav-wordmark-studio">Studio</span>
                </Link>

                {/* NAV LINKS — desktop */}
                <nav className="nav-desktop" aria-label="Navegación principal">
                    <ul>
                        <li><a href="/products">{texts[language].nav.products}</a></li>
                        <li><a href="/company">{texts[language].nav.company}</a></li>
                        <li><a href="/raffles">{texts[language].nav.raffles}</a></li>
                        <li><a href="/contact">{texts[language].nav.contact}</a></li>
                        {user && (
                            <li>
                                <a href={`/${user.admin ? "admin" : "dashboard"}`}>
                                    {user.admin ? "Admin" : "Dashboard"}
                                </a>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* RIGHT ACTIONS — desktop */}
                <div className="right-actions actions-desktop-group">
                    {/* theme toggle */}
                    <button
                        className="nav-icon-btn"
                        onClick={() => handleTheme(isDark ? "light" : "dark")}
                        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
                    >
                        {isDark ? <SunIcon /> : <MoonIcon />}
                    </button>

                    {/* language select */}
                    <div className="nav-lang-wrap">
                        <GlobeIcon />
                        <select
                            className="nav-lang-select"
                            value={language}
                            onChange={e => handleLanguage(e.target.value)}
                            aria-label="Seleccionar idioma"
                        >
                            <option value="es">Es</option>
                            <option value="en">En</option>
                            <option value="it">It</option>
                            <option value="de">De</option>
                            <option value="ru">Ru</option>
                            <option value="fr">Fr</option>
                        </select>
                    </div>

                    {/* login / logout */}
                    {user ? (
                        <button onClick={handleLogout} className="nav-cta-btn">
                            Cerrar Sesión
                        </button>
                    ) : (
                        <button onClick={() => setLoginOpen(true)} className="nav-cta-btn">
                            {texts[language].nav.login}
                        </button>
                    )}
                </div>

                {/* HAMBURGER — mobile only */}
                <button
                    className={`hamburger-btn ${menuOpen ? "is-open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menú"
                    aria-expanded={menuOpen}
                >
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </button>
            </header>

            {/* MOBILE MENU */}
            {menuOpen && (
                <NavBarMobile
                    ref={menuRef}
                    closeMenu={() => setMenuOpen(false)}
                    texts={texts}
                    language={language}
                    theme={theme}
                    handleTheme={() => handleTheme(isDark ? "light" : "dark")}
                    handleLanguage={handleLanguage}
                    openLogin={() => setLoginOpen(true)}
                />
            )}
        </section>

        {loginOpen    && <Login openRegister={openRegisterFromLogin} closeLogin={() => setLoginOpen(false)} />}
        {openRegister && <Register openLogin={openLoginFromRegister} closeRegister={() => setOpenRegister(false)} />}
        </>
    )
}

export default NavBar;