import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Scene from "../three/Scene";
import AetherWaves from "../three/AetherWaves";
import VaporPlanet from "../three/VaporPlanet";
import LogoCarrousel from "./LogoCarrousel";
import FbxMacBook from "../ui/macBook";

const Scroll3DSection = () => {
    const textRef = useRef(null);
    const text2Ref = useRef(null);

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

    const x2Raw = useTransform(scroll2, [0, 0.5, 1], [-300, 0, 2200]);
    const opacity2Raw = useTransform(scroll2, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const x2 = useSpring(x2Raw, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity2 = useSpring(opacity2Raw, { stiffness: 70, damping: 20 });

    return (
        <>
        <section style={{ height: "110vh", background: "#0f0f14", position: "relative" }}>

            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", zIndex: 2 }}>
                <Scene>
                    <AetherWaves />
                </Scene>
            </div>

            <motion.h1 ref={textRef} style={{ textAlignLast: "start", position: "relative", zIndex: 3, marginTop: "-45vh", color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Inter, Poppins, sans-serif", opacity, x, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                DeepDev Reinventing Digital<br></br>Experiences.
            </motion.h1>
        </section>

        <FbxMacBook />        
        <LogoCarrousel />

        <section style={{ height: "100vh", background: "#0f0f14", position: "relative" }}>
            
            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", zIndex: 3, }}>

                <motion.h1 ref={text2Ref} style={{ textAlignLast: "end", position: "absolute", margin: 0, paddingTop: "50vh", zIndex: 1, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity2, x: x2, 
                    background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }} >
                    Expand your business <br></br>With web or mobile Apps
                </motion.h1>

                <Scene>
                    <VaporPlanet />
                </Scene>
            </div>
            
        </section>
        </>
    );
};

export default Scroll3DSection;