import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/error.css";
import useTheme from "../../contexts/ThemeContext";
import useSession from "../../contexts/SessionContext";

const ProcessOk = ({processMessage}) => {
    const { theme } = useTheme()
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
        <div className={`error-container ${theme}`}>
            <div className="error-content">
                <h1 className={`error-title ${theme}`}>{processMessage}</h1>
                <p className={`error-text small ${theme}`}>Serás redirigido automáticamente al inicio.</p>
            </div>
        </div>
        </>
    );
};

export default ProcessOk;