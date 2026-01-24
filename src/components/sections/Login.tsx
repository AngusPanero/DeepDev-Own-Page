import { useState } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";

const Login = ({ closeLogin }: any) => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()

    const [hoverParticles, setHoverParticles] = useState(false);
    const [exit, setExit] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClose = () => {
        setExit(true);
        setTimeout(closeLogin, 600);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <div className={`section-login ${exit ? "exit" : ""}`} style={{ background: theme === "dark" ? "black" : "#f4f2ff" }}>
            <button className="close-button" onClick={handleClose}>✕</button>

            <img className="img-logo-login" src={logo} alt="logo" width={200} />
            
            <h2 className="login-title">{texts[language].login.title}</h2>
            
            <p className="login-subtitle">{texts[language].login.text}</p>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">{texts[language].login.email}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">{texts[language].login.password}</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="login-btn" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>{texts[language].login.button}</button>
            </form>

            <p className="login-footer" style={{ whiteSpace: "pre-line" }}>{texts[language].login.register.before}<span className="login-link">{texts[language].login.register.after}</span></p>
            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Login;