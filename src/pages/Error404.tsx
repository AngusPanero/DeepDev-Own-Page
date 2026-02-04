import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/error.css"
import useTheme from "../contexts/ThemeContext";
import useSession from "../contexts/SessionContext";
import "../../public/images/DeepDev Logo.jpg"


const Error404 = ({ errorMessage404 }) => {
    const { theme } = useTheme()
    const { setError } = useSession()
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
                        <img src="../../public/images/DeepDev Logo.jpg" alt="deepdev-logo" style={{ border: theme === "dark" ? "2px solid #7701aeff" : "2px solid #0062FF" }} />
                        <h1 className={`error-title ${theme}`}>{errorMessage404}</h1>
                <p className={`error-text small ${theme}`}>Serás redirigido automáticamente al inicio.</p>
            </div>
        </div>
        </>
    );
};

export default Error404;