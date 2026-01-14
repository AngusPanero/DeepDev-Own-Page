import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti'; 
import '../../styles/sorteoDev.css';
import ParticleButton from './ParticleButton';

const SorteoDev: React.FC = () => {
    const [ status, setStatus ] = useState<'idle' | 'registered' | 'winner'>('idle');
    const [ user, setUser ] = useState({ nombre: '', email: '', proyecto: '' });
    const [ showConfetti, setShowConfetti ] = useState(false);
    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ check, setCheck ] = useState(false)
    const [ shake, setShake ] = useState(false);

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
        <div className="dev-sorteo-container">
            {showConfetti && <Confetti numberOfPieces={1200} recycle={false} />}
            
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className={`dev-card ${shake ? 'animate-shake' : ''}`} >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_raffle_entry.jsx</p>
                        </div>
                        
                        <h2>&lt;FullStack_Raffle /&gt;</h2>
                        <p className="subtitle">Enter for a chance to win a complete professional website built by DeepDev.</p>

                        <form onSubmit={handleSubmit} className="dev-form">
                            <input required placeholder="Your Name" onChange={e => setUser({...user, nombre: e.target.value})} />
                            <input required type="email" placeholder="Your Email" onChange={e => setUser({...user, email: e.target.value})} />
                            <textarea required placeholder="What website would you like to develop?" onChange={e => setUser({...user, proyecto: e.target.value})} />

                            <div className={`dev-checkbox-group`}>
                                <label className="checkbox-wrapper">
                                    <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} />
                                    <span className="checkmark"></span>
                                    <span className="label-text">I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a> of the raffle.</span>
                                </label>
                            </div>
                            {shake && <p className="checkbox-warning">You must agree to the terms and conditions to proceed.</p>}
                            
                            <button type="submit" className="btn-glow" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)} >GENERATE RAFFLE TICKET</button>
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
                        <p className="typing-text">Processing entry_{user.nombre.toLowerCase().replace(" ", "_")}...</p>
                        <div className="console-log">
                            <p>{`> Verifying email: ${user.email}`}</p>
                            <p>{`> Analyzing project: "${user.proyecto.substring(0, 20)}..."`}</p>
                            <p>{`> Status: Compiling luck...`}</p>
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
                        
                        <h1>¡Ticket Registered!</h1>
                        <div className="success-icon">✨</div>
                        <p>Thanks <strong>{user.nombre}</strong>. Your entry has been saved.<br></br>Good Luck!</p>

                        <div className="ticket-summary">
                            <p><strong>ID:</strong> {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            <p><strong>Prize:</strong> FullStack Web Development</p>
                        </div>

                        <button onClick={() => window.location.reload()} className="btn-glow">GO BACK</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SorteoDev;