import "../../styles/footer.css";
import { UseLanguage } from "../../contexts/LanguageContext";
import { UseTheme } from "../../contexts/ThemeContext";

const Footer = () => {
    const { language, texts } = UseLanguage() 
    const { theme } = UseTheme()
    return (
        <footer className={`footer ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
            <div className="footer-grid">

                <div className="footer-brand">
                    <h2 className="footer-logo">DeepDev</h2>
                    <p className="footer-tagline">{texts[language].footer.deepdev[0]}</p>
                    <p className="footer-description">{texts[language].footer.deepdev[1]}</p>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">{texts[language].footer.navigationTitle}</h4>
                    <ul className="footer-list">
                        {/*Uso a potr el footer y nav que estan siempre no me lleva arriba solo renderizaba el contenido*/}
                    <li><a href="/">{texts[language].footer.navigation[0]}</a></li>
                    <li><a href="/products">{texts[language].footer.navigation[1]}</a></li>
                    <li><a href="/sales">{texts[language].footer.navigation[2]}</a></li>
                    <li><a href="/company">{texts[language].footer.navigation[3]}</a></li>
                    <li><a href="/raffles">{texts[language].footer.navigation[4]}</a></li>
                    <li><a href="/contact">{texts[language].footer.navigation[5]}</a></li>
                    </ul>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">{texts[language].footer.expertiseTitle}</h4>
                    <ul className="footer-list">
                        <li>{texts[language].footer.expertise[0]}</li>
                        <li>{texts[language].footer.expertise[1]}</li>
                        <li>{texts[language].footer.expertise[2]}</li>
                        <li>{texts[language].footer.expertise[3]}</li>
                    </ul>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">{texts[language].footer.connectTitle}</h4>
                    <ul className="footer-list">
                        <li><a href="mailto:contact@deepdev.dev">deepdevsolutions@gmail.com</a></li>
                        <li style={{ marginTop: "10px" }} className="footer-location"><strong>Argentina</strong> · {texts[language].footer.connect[0]}</li>
                        <li style={{ marginLeft: "10px" }} className="footer-location">{texts[language].footer.connect[1]}: +54 9 11-7118-7463</li>
                        
                        <li className="footer-location"><strong>Spain</strong> · {texts[language].footer.connect[0]}</li>
                        <li style={{ marginLeft: "10px" }} className="footer-location">{texts[language].footer.connect[1]}: +34 622-777-426</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} DeepDev. {texts[language].footer.rights}</span>
                <div className="footer-legal">
                    {/* <Link to="/privacy">{texts[language].footer.privacy}</Link>
                    <Link to="/terms">{texts[language].footer.terms}</Link> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;