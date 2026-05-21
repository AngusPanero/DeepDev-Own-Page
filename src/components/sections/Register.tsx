import { useEffect, useRef, useState } from "react";
import "../../styles/register.css";
import ParticleButton from "../ui/ParticleButton";
import { UseTheme } from "../../contexts/ThemeContext";
import eyeClose from "/logos/eye-close.svg";
import eyeOpen from "/logos/eye-open.svg";
import { UseSession } from "../../contexts/SessionContext";
import Loader from "./Loader";
import Error from "./Error";

const REQUIREMENTS = [
    { label: "Mínimo 10 caracteres",        test: (p: string) => p.length >= 10 },
    { label: "Una letra mayúscula",          test: (p: string) => /[A-Z]/.test(p) },
    { label: "Un número",                    test: (p: string) => /\d/.test(p) },
    { label: "Carácter especial (@$!%*?&)",  test: (p: string) => /[@$!%*?&]/.test(p) },
];

const Register = ({ openLogin, closeRegister }: any) => {
    const { theme } = UseTheme();
    const { handleRegister, loading, error } = UseSession();
    const registerRef = useRef<HTMLDivElement>(null);
    const isDark = theme !== "light";

    const [hoverParticles, setHoverParticles] = useState(false);
    const [exit, setExit]                     = useState(false);
    const [email, setEmail]                   = useState("");
    const [password, setPassword]             = useState("");
    const [password2, setPassword2]           = useState("");
    const [passwordError, setPasswordError]   = useState("");
    const [showReqs, setShowReqs]             = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);

    const handleClose = () => {
        setExit(true);
        setTimeout(closeRegister, 600);
    };

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (registerRef.current && !registerRef.current.contains(e.target as Node)) handleClose();
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const validatePassword = (pass: string) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        if (!regex.test(pass)) {
            setPasswordError("Error en la codificación de la contraseña.");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const isValid = email.includes("@") && password.length >= 10 && password === password2 && !passwordError;

    if (loading) return <Loader />;
    if (error)   return <Error errorMessage="Error al registrar usuario." />;

    const accent = isDark ? "#8e2de2" : "#0062FF";

    return (
        <div
            ref={registerRef}
            className={`rg-panel ${exit ? "rg-exit" : ""} ${isDark ? "rg-dark" : "rg-light"}`}
        >
            <button className="rg-close" onClick={handleClose} aria-label="Cerrar">✕</button>

            {/* wordmark */}
            <div className="rg-wordmark">
                <span className="rg-wm-deep">Deep</span>
                <span className="rg-wm-dev" style={{ color: accent }}>Dev</span>
                <span className="rg-wm-studio">Studio</span>
            </div>

            {/* terminal dots */}
            <div className="rg-terminal">
                <span className="rg-dot rg-dot-r" />
                <span className="rg-dot rg-dot-y" />
                <span className="rg-dot rg-dot-g" />
                <span className="rg-file">new_user.jsx</span>
            </div>

            <h2 className="rg-title">Nuevo Usuario</h2>
            <p className="rg-sub">Creá tu cuenta DeepDev</p>

            <form
                className="rg-form"
                noValidate
                onSubmit={e => {
                    e.preventDefault();
                    if (!validatePassword(password)) return;
                    handleRegister(email, password, openLogin, closeRegister);
                }}
            >
                {/* email */}
                <div className="rg-field">
                    <label htmlFor="r-email">Email</label>
                    <input
                        id="r-email" type="email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="hola@empresa.com" required
                    />
                </div>

                {/* password requirements */}
                {showReqs && (
                    <div className="rg-reqs">
                        <span className="rg-reqs-title" style={{ color: accent }}>
                            Seguridad de la contraseña
                        </span>
                        <ul>
                            {REQUIREMENTS.map(r => {
                                const met = r.test(password);
                                return (
                                    <li key={r.label} className={met ? "rg-req-met" : "rg-req-unmet"}>
                                        {met ? "✓" : "○"} {r.label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* pass 1 */}
                <div className="rg-field">
                    <label htmlFor="r-pass">Contraseña</label>
                    <div className="rg-pass-wrap">
                        <input
                            id="r-pass"
                            type={visiblePassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={() => setShowReqs(true)}
                            onBlur={() => setShowReqs(false)}
                            placeholder="••••••••••" required
                        />
                        <img className="rg-eye" src={visiblePassword ? eyeClose : eyeOpen}
                            alt="toggle" onClick={() => setVisiblePassword(v => !v)} />
                    </div>
                </div>

                {/* pass 2 */}
                <div className="rg-field">
                    <label htmlFor="r-pass2">Verificar contraseña</label>
                    <div className="rg-pass-wrap">
                        <input
                            id="r-pass2"
                            type={visiblePassword ? "text" : "password"}
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            placeholder="••••••••••" required
                        />
                        <img className="rg-eye" src={visiblePassword ? eyeClose : eyeOpen}
                            alt="toggle" onClick={() => setVisiblePassword(v => !v)} />
                    </div>
                </div>

                {password && password2 && password !== password2 && (
                    <p className="rg-error">Las contraseñas no coinciden</p>
                )}
                {passwordError && <p className="rg-error">{passwordError}</p>}

                {isValid && (
                    <button
                        type="submit"
                        className="rg-btn"
                        style={{
                            background: isDark
                                ? "linear-gradient(135deg,#8e2de2,#4a00e0)"
                                : "linear-gradient(135deg,#0062FF,#0041cb)",
                        }}
                        onMouseEnter={() => setHoverParticles(true)}
                        onMouseLeave={() => setHoverParticles(false)}
                    >
                        Registrarse
                    </button>
                )}
            </form>

            <p className="rg-footer">
                ¿Ya tenés cuenta?{" "}
                <span className="rg-link" style={{ color: accent }} onClick={openLogin}>
                    Iniciá sesión
                </span>
            </p>

            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Register;