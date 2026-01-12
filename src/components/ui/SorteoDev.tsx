import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti'; 
import '../../styles/sorteoDev.css';

const SorteoDev: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'registered' | 'winner'>('idle');
    const [user, setUser] = useState({ nombre: '', email: '', proyecto: '' });
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('registered');
        // Simulamos un proceso de sorteo animado de 3 segundos
        setTimeout(() => {
            setStatus('winner');
            setShowConfetti(true);
        }, 3500);
    };

    return (
        <div className="dev-sorteo-container">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
            
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="dev-card" >
                        <div className="dev-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <p className="terminal-title">new_raffle_entry.js</p>
                        </div>
                        
                        <h2>&lt;Sorteo FullStack /&gt;</h2>
                        <p className="subtitle">Gana el desarrollo de tu sitio web profesional hecho por mí.</p>

                        <form onSubmit={handleSubmit} className="dev-form">
                            <input required placeholder="Tu Nombre" onChange={e => setUser({...user, nombre: e.target.value})} />
                            <input required type="email" placeholder="Tu mejor Email" onChange={e => setUser({...user, email: e.target.value})} />
                            <textarea required placeholder="¿Qué sitio web te gustaría que desarrolle?" onChange={e => setUser({...user, proyecto: e.target.value})} />

                            <button type="submit" className="btn-glow">GENERAR TICKET DE SORTEO</button>
                        </form>
                    </motion.div>
                )}

                {status === 'registered' && (
                    <motion.div  key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-stage">
                        <div className="spinner-dev"></div>
                        <p className="typing-text">Procesando entry_{user.nombre.toLowerCase().replace(" ", "_")}...</p>
                        <div className="console-log">
                            <p>{`> Verificando email: ${user.email}`}</p>
                            <p>{`> Analizando proyecto: "${user.proyecto.substring(0, 20)}..."`}</p>
                            <p>{`> Estado: Compilando suerte...`}</p>
                        </div>
                    </motion.div>
                )}

                {status === 'winner' && (
                    <motion.div key="winner" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="winner-card" >
                        <div className="success-icon">✨</div>
                        <h1>¡Ticket Registrado!</h1>
                        <p>Gracias <strong>{user.nombre}</strong>. Tu entrada ha sido guardada en mi base de datos.</p>

                        <div className="ticket-summary">
                            <p><strong>ID:</strong> {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            <p><strong>Premio:</strong> Desarrollo Web FullStack</p>
                        </div>

                        <button onClick={() => window.location.reload()} className="btn-back">Volver al inicio</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SorteoDev;