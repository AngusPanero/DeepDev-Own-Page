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
        offset: ["start 30%", "end 70%"]
    });
    
    // Entrada y salida del IMG
    const rawX = useTransform(scrollYProgress, [0, 0.5, 1], [400, 0, 400]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    
    // Scroll Suavizado 
    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 20 });

    return(
        <motion.img ref={imgRef} src={src} animate={floatAnimation} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay}}
        style={{
            width: "130px",
            filter: "grayscale(0%) brightness(1.15)",
            translateX: translateX,
            translateY: translateY,
            opacity, 
            x
        }}
    />
    )
};

export default FloatingIcon