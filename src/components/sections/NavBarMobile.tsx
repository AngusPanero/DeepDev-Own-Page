import { forwardRef, useEffect } from "react";
import { UseSession } from "../../contexts/SessionContext";

// ── Real viewport height fix ───────────────────────────────────
// En Android/Samsung 100vh incluye la barra del browser y desborda.
// Calculamos window.innerHeight (siempre el área visible real) y lo
// exponemos como CSS variable --real-vh que usamos en el drawer.
const useRealVh = () => {
    useEffect(() => {
        const set = () => {
            const vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty("--real-vh", `${vh}px`)
        }
        set()
        window.addEventListener("resize", set, { passive: true })
        window.addEventListener("orientationchange", () => setTimeout(set, 150))
        return () => {
            window.removeEventListener("resize", set)
            window.removeEventListener("orientationchange", set)
        }
    }, [])
}

// ── SVG icons ──────────────────────────────────────────────────
const MoonIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
)

const SunIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

interface NavBarMobileProps {
    closeMenu: () => void;
    texts: any;
    language: string;
    theme: string;
    handleTheme: () => void;
    handleLanguage: (e: string) => void;
    openLogin: () => void;
}

const NavBarMobile = forwardRef(({
    closeMenu, texts, language, theme, handleTheme, handleLanguage, openLogin
}: NavBarMobileProps, ref: any) => {
    const { user, handleLogout } = UseSession()
    const isDark = theme !== "light"

    useRealVh()

    const links = [
        { href: "/",         label: texts[language].footer?.navigation?.[0] ?? "Home" },
        { href: "/products", label: texts[language].nav.products },
        { href: "/company",  label: texts[language].nav.company  },
        { href: "/raffles",  label: texts[language].nav.raffles  },
        { href: "/contact",  label: texts[language].nav.contact  },
    ]

    return (
        <div
            ref={ref}
            className={`mobile-menu-container ${isDark ? "theme-dark" : "theme-light"}`}
        >
            {/* wordmark */}
            <div className="mob-wordmark">
                <span className="mob-wm-deep">Deep</span>
                <span className="mob-wm-dev">Dev</span>
            </div>

            {/* nav links */}
            <nav className="mobile-nav-links" aria-label="Menú móvil">
                {links.map(({ href, label }, i) => (
                    <a
                        key={href}
                        href={href}
                        onClick={closeMenu}
                        style={{ animationDelay: `${i * 0.06}s` }}
                    >
                        {label}
                    </a>
                ))}
                {user && (
                    <a
                        href={`/${user.admin ? "admin" : "dashboard"}`}
                        onClick={closeMenu}
                        style={{ animationDelay: `${links.length * 0.06}s` }}
                    >
                        {user.admin ? "Admin" : "Dashboard"}
                    </a>
                )}
            </nav>

            {/* bottom actions */}
            <div className="mobile-extra-actions">
                <div className="mob-controls-row">
                    <button
                        className="mob-icon-btn"
                        onClick={handleTheme}
                        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
                    >
                        {isDark ? <SunIcon /> : <MoonIcon />}
                        <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
                    </button>

                    <div className="mob-lang-wrap">
                        <GlobeIcon />
                        <select
                            className="mob-lang-select"
                            value={language}
                            onChange={e => { handleLanguage(e.target.value); closeMenu(); }}
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
                </div>

                {user ? (
                    <button className="mob-cta-btn" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                ) : (
                    <button className="mob-cta-btn" onClick={() => { openLogin(); closeMenu(); }}>
                        {texts[language].nav.login}
                    </button>
                )}
            </div>
        </div>
    )
})

NavBarMobile.displayName = "NavBarMobile"

export default NavBarMobile;