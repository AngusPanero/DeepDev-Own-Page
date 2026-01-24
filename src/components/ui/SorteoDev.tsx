import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti'; 
import '../../styles/sorteoDev.css';
import ParticleButton from './ParticleButton';
import RaffleInfo from '../sections/RaffleInfo';
import CountDown from './CountDown';
import useLanguage, { type LanguageContextType } from '../../contexts/LanguageContext';
import useTheme from '../../contexts/ThemeContext';

const SorteoDev: React.FC = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()

    const [ status, setStatus ] = useState<'idle' | 'registered' | 'winner'>('idle');
    const [ user, setUser ] = useState({ nombre: '', email: '', proyecto: '' });
    const [ showConfetti, setShowConfetti ] = useState(false);
    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ check, setCheck ] = useState(false)
    const [ shake, setShake ] = useState(false);
    const [ timeLeft, setTimeLeft ] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
            const target = new Date("2026-02-15T00:00:00").getTime();

            const timer = setInterval(() => {
                const now = Date.now();
                const distance = target - now;

                if (distance < 0) {
                    clearInterval(timer);
                } else {
                    setTimeLeft({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                    });
                }
            }, 1000);

            return () => clearInterval(timer);
        }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!check) {
            setShake(true);
            setTimeout(() => setShake(false), 10000); 
            return; 
        }
        setStatus('registered');

        setTimeout(() => {
            setStatus('winner');
            setShowConfetti(true);
        }, 3500);
    };

    return (
        <>
        {/* <TubesCursor /> */}
        <div className="dev-sorteo-container" style={{ marginTop: 0, background: theme === "dark" ? "black" : "#f4f2ff" }}>
            {showConfetti && <Confetti numberOfPieces={1200} recycle={false} />}

            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className={`dev-card ${shake ? 'animate-shake' : ''}`} >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_{user.nombre === "" ? "raffle" : user.nombre.toLowerCase().replace(" ", "_")}_entry.jsx</p>
                        </div>
                        
                        <h2>&lt;{texts[language].raffles.raffleTitle} /&gt;</h2>
                        
                        <p className="subtitle">{texts[language].raffles.raffleText}</p>
                        <CountDown timeLeft={timeLeft} />
                        <form onSubmit={handleSubmit} className="dev-form">
                            <input required placeholder={texts[language].raffles.name} onChange={e => setUser({...user, nombre: e.target.value})} />
                            <input required type="email" placeholder={texts[language].raffles.email} onChange={e => setUser({...user, email: e.target.value})} />
                            <textarea required placeholder={texts[language].raffles.project} onChange={e => setUser({...user, proyecto: e.target.value})} />

                            <div className={`dev-checkbox-group`}>
                                <label className="checkbox-wrapper">
                                    <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} />
                                    <span className="checkmark"></span>
                                    <span className="label-text">{texts[language].raffles.conditions.before}<a href="/terms" target="_blank" rel="noopener noreferrer">{texts[language].raffles.conditions.link}</a>{texts[language].raffles.conditions.after}</span>
                                </label>
                            </div>
                            {shake && <p className="checkbox-warning">You must agree to the terms and conditions to proceed.</p>}
                            
                            <button type="submit" className="btn-glow" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>{texts[language].raffles.button}</button>
                        </form>
                        <ParticleButton active={hoverParticles} />
                    </motion.div>
                )}

                {status === 'registered' && (
                    <motion.div  key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-stage">
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_{user.nombre}_entry.jsx</p>
                        </div>
                        <div className="spinner-dev"></div>
                        <p className="typing-text">{texts[language].raffles.processing}</p>
                        <div className="console-log">
                            <p>{texts[language].raffles.analyzing}</p>
                            <p>{texts[language].raffles.verify}: {user.email}</p>
                            <p>{texts[language].raffles.status}</p>
                        </div>
                    </motion.div>
                )}

                {status === 'winner' && (
                    <motion.div key="winner" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="winner-card" >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_{user.nombre}_entry.jsx</p>
                        </div>
                        
                        <h1>{texts[language].raffles.registered}</h1>
                        <div className="success-icon">✨</div>
                        <p style={{ whiteSpace: "pre-line" }} >{texts[language].raffles.thanks.before} <strong>{user.nombre}</strong>. {texts[language].raffles.thanks.after}</p>

                        <div className="ticket-summary">
                            <p><strong>ID:</strong> {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            <p>{texts[language].raffles.premio}</p>
                        </div>

                        <button onClick={() => window.location.reload()} className="btn-glow">{texts[language].raffles.buttonBack.toUpperCase()}</button>
                    </motion.div>
                )}
            </AnimatePresence>
            <RaffleInfo />
        </div>
        </>
    );
};

export default SorteoDev;