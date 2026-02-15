import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/error.css"
import { UseTheme } from "../contexts/ThemeContext";
import { UseSession } from "../contexts/SessionContext";
import "/images/DeepDevLogo.jpg"
import { UseLanguage } from "../contexts/LanguageContext";


const Error404 = () => {
    const { theme } = UseTheme()
    const { setError } = UseSession()
    const { texts, language } = UseLanguage()
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null)
            navigate("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
        <div className={`error-container ${theme}`}>
            <div className="error-content">
                        <img src="../../public/images/DeepDevLogo.jpg" alt="deepdev-logo" style={{ border: theme === "dark" ? "2px solid #7701aeff" : "2px solid #0062FF" }} />
                        <h2 className={`error-title ${theme}`}>{texts[language].error404.title}</h2>
                <p className={`error-text small ${theme}`}>{texts[language].error404.errorMessage}</p>
            </div>
        </div>
        </>
    );
};

export default Error404;