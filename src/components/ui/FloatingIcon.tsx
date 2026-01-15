import { motion, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const floatAnimation = {
    y: [0, -10, 0, 10, 0],
    x: [0, 6, 0, -6, 0],
}

const FloatingIcon = ({ src, delay, translateX, translateY }: any) => {
    const imgRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: imgRef,
        // Ampliamos el rango: detecta desde que entra por abajo hasta que sale por arriba
        offset: ["start end", "end start"]
    });
    
    // Movimiento lateral de entrada (X)
    // El icono viene de 200px y se queda en 0 desde la mitad del scroll en adelante
    const rawX = useTransform(scrollYProgress, [0, 0.4, 1], [200, 0, 0]);
    
    // --- MANEJO DE OPACIDAD INDEPENDIENTE ---
    // 0 -> 0.15: Aparece rápido al entrar (Fade in)
    // 0.15 -> 0.85: Se mantiene 100% visible (Meseta de visibilidad)
    // 0.85 -> 1: Se apaga solo al final (Fade out)
    const rawOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
    
    // Scroll Suavizado 
    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 50, damping: 25 });

    return(
        <motion.img 
            ref={imgRef} 
            src={src} 
            animate={floatAnimation} 
            transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay
            }}
            style={{
                width: "130px",
                filter: "grayscale(0%) brightness(1.15) drop-shadow(0 0 20px rgba(139, 92, 246, 0.1))",
                translateX: translateX,
                translateY: translateY,
                opacity, // Ahora usa el rango extendido
                x,
                pointerEvents: "none" // Evita que el icono bloquee clicks en el formulario o textos
            }}
        />
    )
};

export default FloatingIcon;