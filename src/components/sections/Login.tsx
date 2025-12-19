import { useState } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/login.css";
import ParticleButton from "../ui/ParticleButton";

const Login = ({ closeLogin }: any) => {
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
        <div className={`section-login ${exit ? "exit" : ""}`}>
            <button className="close-button" onClick={handleClose}>✕</button>

            <img className="img-logo-login" src={logo} alt="logo" width={200} />
            
            <h2 className="login-title">Welcome back!</h2>
            
            <p className="login-subtitle">Access your DeepDev account</p>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="login-btn" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>Sign In</button>
            </form>

            <p className="login-footer">New to DeepDev?<span className="login-link">Create an account</span></p>
            <ParticleButton active={hoverParticles} />
        </div>
    );
};

export default Login;