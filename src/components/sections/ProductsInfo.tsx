import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import "../../styles/products.css"
import FloatingIcon from "../ui/FloatingIcon"
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";

const ProductsInfo = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    // Configuración de suavizado
    const springConfig = { stiffness: 50, damping: 25, mass: 0.5 };

    // WEB APPS
    const textRef = useRef(null);
    const { scrollYProgress: scroll1 } = useScroll({
        target: textRef,
        offset: ["start end", "end start"]
    });
    const x = useSpring(useTransform(scroll1, [0, 0.5, 1], [-500, 0, 200]), springConfig);
    const opacity = useSpring(useTransform(scroll1, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // APPS
    const textRef2 = useRef(null);
    const { scrollYProgress: scroll2 } = useScroll({
        target: textRef2,
        offset: ["start end", "end start"]
    });
    const x2 = useSpring(useTransform(scroll2, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity2 = useSpring(useTransform(scroll2, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // CUSTOM SOFTWARE
    const textRef3 = useRef(null);
    const { scrollYProgress: scroll3 } = useScroll({
        target: textRef3,
        offset: ["start end", "end start"]
    });
    const x3 = useSpring(useTransform(scroll3, [0, 0.5, 1], [-500, 0, -150]), springConfig);
    const opacity3 = useSpring(useTransform(scroll3, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AI INTEGRATION
    const textRef4 = useRef(null);
    const { scrollYProgress: scroll4 } = useScroll({
        target: textRef4,
        offset: ["start end", "end start"]
    });
    const x4 = useSpring(useTransform(scroll4, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity4 = useSpring(useTransform(scroll4, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AUTOMATION
    const textRef5 = useRef(null);
    const { scrollYProgress: scroll5 } = useScroll({
        target: textRef5,
        offset: ["start end", "end start"]
    });
    const x5 = useSpring(useTransform(scroll5, [0, 0.5, 1], [-500, 0, -250]), springConfig);
    const opacity5 = useSpring(useTransform(scroll5, [0, 0.1, 0.9, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // Estilo de gradiente animado reutilizable
    const gradientBase = {
        background: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, #8B5CF6 100%)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    const gradientAnim = {
        backgroundPosition: ["100% 50%", "100% 50%"],
        transition: { duration: 4, repeat: Infinity, ease: "backInOut" }
    };

    return (
        <div className="products-section">
            {/* WEB APPLICATIONS */}
            <div className="web-apps-section" ref={textRef}>
                <motion.h1 style={{ ...gradientBase, textAlignLast: "start", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity, x: x }} 
                    animate={gradientAnim}>
                    {texts[language].products.webTitle}
                </motion.h1>

                <div className="web-text-icons-section">
                    <motion.p style={{ ...gradientBase, whiteSpace: "pre-line", margin: 0, width: "50rem", marginLeft: "3rem", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity, x: x }} 
                        animate={gradientAnim}>
                        {texts[language].products.webText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "1rem" }}>
                        <FloatingIcon src="../../../public/logos/chrome.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/safari2.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/firefox.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/edge.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>

            {/* MOBILE APPS */}
            <div className="apps-section" ref={textRef2}>
                <motion.h1 style={{ ...gradientBase, marginTop: "3rem", textAlign: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity2, x: x2 }} 
                    animate={gradientAnim}>
                        {texts[language].products.appTitle}
                </motion.h1>

                <div className="app-text-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/appstore.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/playstore.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/apple.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/android2.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ ...gradientBase, whiteSpace: "pre-line", margin: 0, width: "50rem", marginRight: "3rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity2, x: x2 }} 
                        animate={gradientAnim}>
                        {texts[language].products.appText}
                    </motion.p>
                </div> 
            </div>

            {/* CUSTOM SOFTWARE */}
            <div className="custom-section" ref={textRef3}>
                <motion.h1 style={{ ...gradientBase, marginTop: "5rem", textAlign: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity3, x: x3 }} 
                    animate={gradientAnim}>
                        {texts[language].products.customTitle}
                </motion.h1>

                <div className="custom-icons-section">
                    <motion.p style={{ ...gradientBase, whiteSpace: "pre-line", margin: 0, width: "50rem", marginLeft: "10rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity3, x: x3 }} 
                        animate={gradientAnim}>
                        {texts[language].products.customText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/soft.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/graf.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>     

            {/* AI INTEGRATION */}
            <div className="ai-section" ref={textRef4} style={{ marginRight: "3rem" }}>
                <motion.h1 style={{ ...gradientBase, whiteSpace: "pre-line", marginRight: "3rem", marginTop: "3rem", textAlignLast: "end", position: "relative", zIndex: 3, fontSize: "6rem", fontWeight: "800", letterSpacing: "1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity4, x: x4 }} 
                    animate={gradientAnim}>
                        {texts[language].products.AiTitle}
                </motion.h1>

                <div className="ai-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/brain.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/cubo.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/platform.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/chat.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ ...gradientBase, whiteSpace: "pre-line", margin: 0, width: "45rem", marginTop: "2rem", marginRight: "3rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity4, x: x4 }} 
                        animate={gradientAnim}>
                        {texts[language].products.AiText}
                    </motion.p>
                </div> 
            </div>       

            {/* AUTOMATION */}
            <div className="automation-section" ref={textRef5}>
                <motion.h1 style={{ ...gradientBase, marginTop: "3rem", textAlignLast: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity5, x: x5 }} 
                    animate={gradientAnim}>
                        {texts[language].products.automationTitle}
                </motion.h1>

                <div className="automation-icons-section">
                    <motion.p style={{ ...gradientBase, whiteSpace: "pre-line", margin: 0, width: "50rem", marginLeft: "10rem", textAlignLast: "start", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity5, x: x5 }} 
                        animate={gradientAnim}>
                        {texts[language].products.automationText}
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem"}}>
                        <FloatingIcon src="../../../public/logos/recycle.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/work.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>  
        </div>
    );
};

export default ProductsInfo;