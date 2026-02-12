import { useEffect, useRef, useState } from "react";
import logo from "/images/DeepDevLogo.jpg"
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";
import { UseLanguage }   from "../../contexts/LanguageContext";
import { UseTheme } from "../../contexts/ThemeContext";
import eyeClose from "/logos/eye-close.svg"
import eyeOpen from "/logos/eye-open.svg"
import { UseSession } from "../../contexts/SessionContext";
import Loader from "./Loader";

interface LoginProps {
  openRegister: () => void; // antes estaba como boolean en el comment de la funcion anterior
  closeLogin: () => void
}

const Login = ({ closeLogin, openRegister }: LoginProps) => {
    const { language, texts } = UseLanguage()  
    const { theme } = UseTheme()
    const { handleLogin, loading, error, handleResetPassword } = UseSession()
    const loginRef = useRef<HTMLDivElement>(null);

    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ exit, setExit ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false)

    /* const handleClose = () => {
        setExit(true);
        setTimeout(closeLogin, 600);
    }; */

    const handleClose = () => {
        setExit(true);
        
        setTimeout(() => {
            closeLogin(); 
        }, 600);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleLogin(email, password); 
                
        if (response) {
            closeLogin();
        }
    }

    if(loading) return <Loader />

    return (
        <div ref={loginRef} className={`section-login ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>

            <img className="img-logo-login" src={logo} alt="logo" />
            
            <h2 className="login-title">{texts[language].login.title}</h2>
            
            <p className="login-subtitle">{texts[language].login.text}</p>

            <form className="login-form" onSubmit={loginSubmit}>
                {/* EMAIL */}
                <div className="input-group">
                    <label htmlFor="email">{texts[language].login.email}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                {/* PASSWORD */}
                <div className="input-group">
                    <label htmlFor="password">{texts[language].login.password}</label>
                    <div className="div-password">
                        <input id="password" type={visiblePassword === true ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <img className="eye-password" src={visiblePassword === false ? eyeOpen : eyeClose} alt="eye_password_svg" onClick={() => setVisiblePassword(!visiblePassword)}/>
                    </div>
                </div>
                {/* ERROR MSJ */}
                {error && <p className="error-password">{error}</p>}
                {/* BOTÓN */}
                <button type="submit" className="login-btn" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>{texts[language].login.button}</button>
            </form>

            <p className="login-footer" onClick={openRegister} style={{ whiteSpace: "pre-line" }}>{texts[language].login.register.before}<span className="login-link">{texts[language].login.register.after}</span></p>
            
            {/* RESET PASSWORD */}
            <p className="reset-password" onClick={() => handleResetPassword(email)} style={{ whiteSpace: "pre-line" }}>¿Olvidó su contraseña?</p>
            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Login;