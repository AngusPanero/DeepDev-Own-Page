import { useEffect, useRef, useState } from "react";
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";
import { UseTheme } from "../../contexts/ThemeContext";
import eyeClose from "/logos/eye-close.svg";
import eyeOpen from "/logos/eye-open.svg";
import { UseSession } from "../../contexts/SessionContext";
import Loader from "./Loader";

interface LoginProps {
    openRegister: () => void;
    closeLogin: () => void;
}

const Login = ({ closeLogin, openRegister }: LoginProps) => {
    const { theme } = UseTheme();
    const { handleLogin, loading, error, handleResetPassword } = UseSession();
    const loginRef = useRef<HTMLDivElement>(null);
    const isDark = theme !== "light";

    const [hoverParticles, setHoverParticles] = useState(false);
    const [exit, setExit]                     = useState(false);
    const [email, setEmail]                   = useState("");
    const [password, setPassword]             = useState("");
    const [visiblePassword, setVisiblePassword] = useState(false);

    const handleClose = () => {
        setExit(true);
        setTimeout(closeLogin, 600);
    };

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (loginRef.current && !loginRef.current.contains(e.target as Node)) handleClose();
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const loginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await handleLogin(email, password);
        if (ok) closeLogin();
    };

    if (loading) return <Loader />;

    return (
        <div
            ref={loginRef}
            className={`sl-panel ${exit ? "sl-exit" : ""} ${isDark ? "sl-dark" : "sl-light"}`}
        >
            {/* close */}
            <button className="sl-close" onClick={handleClose} aria-label="Cerrar">✕</button>

            {/* wordmark */}
            <div className="sl-wordmark">
                <span className="sl-wm-deep">Deep</span>
                <span className="sl-wm-dev" style={{ color: isDark ? "#8e2de2" : "#0062FF" }}>Dev</span>
                <span className="sl-wm-studio">Studio</span>
            </div>

            {/* terminal dots */}
            <div className="sl-terminal">
                <span className="sl-dot sl-dot-r" />
                <span className="sl-dot sl-dot-y" />
                <span className="sl-dot sl-dot-g" />
                <span className="sl-file">auth.jsx</span>
            </div>

            <h2 className="sl-title">Bienvenido de nuevo</h2>
            <p className="sl-sub">Accedé a tu cuenta DeepDev</p>

            <form className="sl-form" onSubmit={loginSubmit} noValidate>
                {/* email */}
                <div className="sl-field">
                    <label htmlFor="l-email">Email</label>
                    <input
                        id="l-email" type="email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="hola@empresa.com" required
                    />
                </div>

                {/* password */}
                <div className="sl-field">
                    <label htmlFor="l-pass">Contraseña</label>
                    <div className="sl-pass-wrap">
                        <input
                            id="l-pass"
                            type={visiblePassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••" required
                        />
                        <img
                            className="sl-eye"
                            src={visiblePassword ? eyeClose : eyeOpen}
                            alt="toggle password"
                            onClick={() => setVisiblePassword(v => !v)}
                        />
                    </div>
                </div>

                {error && <p className="sl-error">{error}</p>}

                <button
                    type="submit"
                    className="sl-btn"
                    style={{
                        background: isDark
                            ? "linear-gradient(135deg,#8e2de2,#4a00e0)"
                            : "linear-gradient(135deg,#0062FF,#0041cb)",
                    }}
                    onMouseEnter={() => setHoverParticles(true)}
                    onMouseLeave={() => setHoverParticles(false)}
                >
                    Ingresar
                </button>
            </form>

            <p className="sl-footer">
                ¿Sos nuevo en DeepDev?{" "}
                <span className="sl-link" style={{ color: isDark ? "#8e2de2" : "#0062FF" }} onClick={openRegister}>
                    Crear cuenta
                </span>
            </p>

            <p
                className="sl-reset"
                onClick={() => handleResetPassword(email)}
                style={{ "--acc": isDark ? "#8e2de2" : "#0062FF" } as any}
            >
                ¿Olvidaste tu contraseña?
            </p>

            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Login;