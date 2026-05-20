import { motion, cubicBezier } from "framer-motion";

interface FloatingTitleProps {
    text: string;
    className?: string;
}

const FloatingTitle = ({ text, className = "dd-massive-title" }: FloatingTitleProps) => {
    const letters = Array.from(text);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.15 },
        },
    };

    const letterVariants = {
        hidden: () => ({
            opacity: 0,
            x: Math.random() * 900 - 450,
            y: Math.random() * 900 - 450,
            z: Math.random() * -1800 - 400,
            scale: 0.2,
            rotateX: Math.random() * 360 - 180,
            rotateY: Math.random() * 360 - 180,
            rotateZ: Math.random() * 360 - 180,
            filter: "blur(18px) brightness(0)",
        }),
        visible: {
            opacity: 1,
            x: 0, y: 0, z: 0,
            scale: 1,
            rotateX: 0, rotateY: 0, rotateZ: 0,
            filter: "blur(0px) brightness(1)",
            transition: { duration: 1.6, ease: cubicBezier(0.16, 1, 0.3, 1) },
        },
    };

    return (
        <motion.h1
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                perspective: "1200px",
                transformStyle: "preserve-3d",
                position: "relative",
                zIndex: 10,
                fontFamily: "'Montserrat', sans-serif",
            }}
        >
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    variants={letterVariants}
                    style={{
                        display: "inline-block",
                        whiteSpace: char === " " ? "pre" : "normal",
                        willChange: "transform, opacity, filter",
                        transformOrigin: "center center -200px",
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.h1>
    );
};

export default FloatingTitle;