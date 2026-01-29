import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Scene from "../three/Scene";
import AetherWaves from "../three/AetherWaves";
import LogoCarrousel from "./LogoCarrousel";
import FbxMacBook from "../ui/macBook";
/* import AmbientOverlay from "../ui/AmbientOverlat"; */
import NeuralWaveDome from "../three/NeuralWaveDome";
import useLanguage from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";
import "../../styles/scroll3D.css"

const Scroll3DSection = () => {
    const textRef = useRef(null);
    const text2Ref = useRef(null);
    const { language, texts } = useLanguage()
    const { theme, handleTheme } = useTheme()

    const { scrollYProgress } = useScroll({
        target: textRef,
        offset: ["start 80%", "end 20%"]
    });

    // Entrada y salida del Texto
    const rawX = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -400]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    // Scroll Suavizado 
    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 20 });

    // TEXTO 2
    const { scrollYProgress: scroll2 } = useScroll({
        target: text2Ref,
        offset: ["start 70%", "end 30%"]
    });

    const x2Raw = useTransform(scroll2, [0, 0.5, 1], [-300, 0, 500]);
    const opacity2Raw = useTransform(scroll2, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const x2 = useSpring(x2Raw, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity2 = useSpring(opacity2Raw, { stiffness: 70, damping: 20 });

    const gradientBase = {
        background: theme === "dark" ? "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #8B5CF6 100%)" :
        "linear-gradient(90deg, #102A43 0%, #0062FF 50%, #00D1FF 100%)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    const gradientAnim = {
        backgroundPosition: ["100% 50%", "100% 50%"],
        transition: { duration: 4, repeat: Infinity, ease: "backInOut" }
    };

    return (
        <>
        <section style={{ height: "110vh", position: "relative" }}>
            {/* <AmbientOverlay /> */}
            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", zIndex: 2 }}>
                <Scene> {/*En scene tengo el background them del AetherWaves*/}
                    <AetherWaves />
                </Scene>
            </div>

            <motion.h1 className="h1-reinventing" ref={textRef} animate={gradientAnim} style={{ ...gradientBase, opacity, x}}>
                {texts[language].home.reinventing}
            </motion.h1>
        </section>

        <LogoCarrousel />        
        <FbxMacBook />        

        <div style={{ height: "100vh", width: "100%", position: "relative", zIndex: 2 }}>
            <Scene>
                    <NeuralWaveDome />
            </Scene>

            <motion.h1 className="h1-ai-3d" ref={text2Ref} animate={gradientAnim} style={{ ...gradientBase, opacity: opacity2, x: x2}}>
                {texts[language].home.ai}
            </motion.h1>
        </div>

        </>
    );
};

export default Scroll3DSection;