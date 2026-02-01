import { useEffect, useRef, useState } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";
import eyeClose from "../../../public/logos/eye-close.svg"
import eyeOpen from "../../../public/logos/eye-open.svg"

const Register = ({ closeRegister }: any) => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()
    const registerRef = useRef<HTMLDivElement>(null);

    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ exit, setExit ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ password2, setPassword2 ] = useState("");
    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false)

    const handleClose = () => {
        setExit(true);
        setTimeout(closeRegister, 600);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (registerRef.current && !registerRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, password });
    };

    return (
        <div ref={registerRef} className={`section-login ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>

            <img className="img-logo-login" src={logo} alt="logo" />
            
            <h2 className="login-title">Bienvenido!</h2>
            
            <p className="login-subtitle">Crea tu cuenta DeepDev</p>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">{texts[language].login.email}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">{texts[language].login.password}</label>

                    <div className="div-password">
                        <input id="password" type={visiblePassword === true ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <img className="eye-password" src={visiblePassword === false ? eyeOpen : eyeClose} alt="eye_password_svg" onClick={() => setVisiblePassword(!visiblePassword)}/>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="password2">Repetir Contraseña:</label>
                    
                    <div className="div-password">    
                        <input id="password2" type={visiblePassword === true ? "text" : "password"} value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                        <img className="eye-password" src={visiblePassword === false ? eyeOpen : eyeClose} alt="eye_password_svg" onClick={() => setVisiblePassword(!visiblePassword)}/>
                    </div>    
                </div>

                {password === password2 ? "" : <span className="check-password">Las contraseñas no coinciden!</span>}

                <button type="submit" className="login-btn" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>Registrarse</button>
            </form>

            <p className="login-footer" style={{ whiteSpace: "pre-line" }}>Ya eres usuario DeepDev?<span className="login-link">Iniciar Sesión</span></p>
            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Register;