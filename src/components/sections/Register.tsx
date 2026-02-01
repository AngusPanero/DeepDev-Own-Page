import { useEffect, useRef, useState } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";
import eyeClose from "../../../public/logos/eye-close.svg"
import eyeOpen from "../../../public/logos/eye-open.svg"
import useSession from "../../contexts/SessionContext";

const Register = ({ openLogin, closeRegister }: any) => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { handleRegister } = useSession()
    const { theme } = useTheme()
    const registerRef = useRef<HTMLDivElement>(null);

    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ exit, setExit ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ password2, setPassword2 ] = useState("");
    const [ passwordError, setPasswordError ] = useState<string>("");
    const [ showRequirements, setShowRequirements ] = useState(false);
    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false)

    const handleClose = () => {
        setExit(true);
        setTimeout(closeRegister, 600);
    };
    // Pass Requerida
    const passwordRequirements = [
    { label: "Mínimo 10 caracteres", test: (pass: string) => pass.length >= 10 },
    { label: "Una mayúscula", test: (pass: string) => /[A-Z]/.test(pass) },
    { label: "Un número", test: (pass: string) => /\d/.test(pass) },
    { label: "Carácter especial (@$!%*?&)", test: (pass: string) => /[@$!%*?&]/.test(pass) },
];

    // Form Válido
    const isFormValid = email.includes("@") && password.length >= 10 && password === password2 && !passwordError;
    
    // Regex Pass
    const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    if (!regex.test(pass)) {
        setPasswordError("La contraseña debe tener 10+ caracteres, una mayúscula, un número y un carácter especial.");
        return false;
    }
    setPasswordError("");
    return true;
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

    return (
        <div ref={registerRef} className={`section-login ${exit ? "exit" : ""} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ background: theme === "dark" ? "#0000009a" : "#f4f2ffa0" }}>
            <button className="close-button" onClick={handleClose}>✕</button>

            <img className="img-logo-login" src={logo} alt="logo" />
            
            <h2 className="login-title">Crea tu sesión</h2>

            <form className="login-form" onSubmit={(e) => {e.preventDefault(); if (!validatePassword(password)) return; handleRegister(email, password, openLogin, closeRegister)}}>
                {/*EMAIL*/}
                <div className="input-group">
                    <label htmlFor="email">{texts[language].login.email}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                {/*Comprobar Pass*/}
                <div className="input-group-password-container">
                    {showRequirements && (
                        <div className="password-requirements-box">
                            <ul>
                                {passwordRequirements.map((req, index) => {
                                    const isMet = req.test(password);
                                    return (
                                        <li key={index} style={{ 
                                            textDecoration: isMet ? "line-through" : "none",
                                            color: isMet ? "#4caf50" : "#ff4d4d",
                                            transition: "all 0.3s ease"
                                        }}>
                                            {isMet ? "✓ " : "○ "} {req.label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    {/*PASS 1*/}
                    <div className="input-group">
                        <label htmlFor="password">{texts[language].login.password}</label>

                        <div className="div-password">
                            <input id="password" type={visiblePassword === true ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setShowRequirements(true)} onBlur={() => setShowRequirements(false)} required />
                            <img className="eye-password" src={visiblePassword === false ? eyeOpen : eyeClose} alt="eye_password_svg" onClick={() => setVisiblePassword(!visiblePassword)}/>
                        </div>
                    </div>
                    {/*PASS 2*/}
                    <div className="input-group pass-group-2">
                        <label htmlFor="password2">Verificar Contraseña:</label>
                        
                        <div className="div-password">    
                            <input id="password2" type={visiblePassword === true ? "text" : "password"} value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                            <img className="eye-password" src={visiblePassword === false ? eyeOpen : eyeClose} alt="eye_password_svg" onClick={() => setVisiblePassword(!visiblePassword)}/>
                        </div>    
                    </div>
                </div>
                {/*COINCIDEN*/}
                {password === password2 ? "" : <span className="check-password">Las contraseñas no coinciden!</span>}
                {/*REGEX*/}
                {passwordError && <span className="check-password">asasas</span>}
                { password === password2 && <button type="submit" className="login-btn" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)} disabled={!isFormValid}>Registrarse</button>}
            </form>

            <p className="login-footer" onClick={openLogin} style={{ whiteSpace: "pre-line" }}>Ya eres usuario DeepDev?<span className="login-link">Iniciar Sesión</span></p>
            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Register;