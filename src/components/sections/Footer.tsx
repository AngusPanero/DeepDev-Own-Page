import { Link } from "react-router-dom"; // Importación necesaria
import "../../styles/footer.css";
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";

const Footer = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    return (
        <footer className="footer">
            <div className="footer-grid">

                <div className="footer-brand">
                    <h3 className="footer-logo">DeepDev</h3>
                    <p className="footer-tagline">{texts[language].footer.deepdev[0]}</p>
                    <p className="footer-description">{texts[language].footer.deepdev[1]}</p>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">{texts[language].footer.navigationTitle}</h4>
                    <ul className="footer-list">
                    <li><Link to="/">{texts[language].footer.navigation[0]}</Link></li>
                    <li><Link to="/products">{texts[language].footer.navigation[1]}</Link></li>
                    <li><Link to="/company">{texts[language].footer.navigation[2]}</Link></li>
                    <li><Link to="/raffles">{texts[language].footer.navigation[3]}</Link></li>
                    <li><Link to="/contact">{texts[language].footer.navigation[4]}</Link></li>
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
                <span>© 2026 DeepDev. {texts[language].footer.rights}</span>
                <div className="footer-legal">
                    <Link to="/privacy">{texts[language].footer.privacy}</Link>
                    <Link to="/terms">{texts[language].footer.terms}</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;