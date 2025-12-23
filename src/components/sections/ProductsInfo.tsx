import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import "../../styles/products.css"
import FloatingIcon from "../ui/FloatingIcon";

const ProductsInfo = () => {
    const textRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: textRef,
        offset: ["start 80%", "end 20%"]
    });

    // Entrada y salida del Texto
    const rawX = useTransform(scrollYProgress, [0, 0.5, 1], [500, 0, 200]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    // Scroll Suavizado 
    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 20 });

    return(
        <div className="products-section">
            <div className="web-apps-section">
                <motion.h1 ref={textRef} style={{ textAlignLast: "start", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Monserrat, Inter, Poppins, sans-serif", opacity, x, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                    We Build Web Applications.
                </motion.h1>

                <div className="text-icons-section">
                    <motion.p style={{ margin: 0, width: "50rem", marginLeft: "3rem", textAlignLast: "start", color: "#ffffff", fontSize: "25px", fontWeight: "300", textAlign: "center", fontFamily: "Monserrat, Inter, Poppins, sans-serif", opacity, x, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        We build modern web solutions tailored to your goals from high-impact<br/>landing pages and corporate websites to e-Commerce platforms and<br/>Fully custom web systems.
                        <br />
                        <br />
                        A web presence is often the first point of contact between your brand<br/>and your users. A well-built website not only communicates who you<br/>are, but also converts visitors into clients, centralizes your services, and allows your business to grow with flexibility and control.
                        <br />
                        <br />
                        Whether you need to showcase your brand, sell products online or<br/>manage information and users through a custom platform,<br/>web applications provide a scalable and accessible solution available<br/>from any device.
                    </motion.p>

                    <div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/chrome.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/safari2.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/firefox.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/edge.svg" delay={1.8} translateX={-50} translateY={120} />
                    </div>
                </div> 

            </div>
        </div>
    )
}

export default ProductsInfo