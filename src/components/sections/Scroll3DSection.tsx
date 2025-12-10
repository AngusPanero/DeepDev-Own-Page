import { motion } from "framer-motion";
import Scene from "../three/Scene";
import AetherWaves from "../three/AetherWaves";

const Scroll3DSection = () => {
    return (
        <section style={{ height: "250vh", background: "#0f0f14",position: "relative", overflow: "hidden"}}>
            {/* 3D fijo */}
            <div
                style={{ position: "sticky", top: 0, height: "100vh", width: "100%", zIndex: 1}}>
                <Scene>
                    <AetherWaves />
                </Scene>
            </div>

            <motion.h1
            initial={{ opacity: 0, x: 200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            style={{
                position: "relative",
                zIndex: 5,
                marginTop: "8vh",
                color: "#ffffff",
                fontSize: "7rem",
                fontWeight: "800",
                letterSpacing: "-1px",
                textAlign: "center",
                fontFamily: "Inter, Poppins, sans-serif",
            }}>
                DeepDev Reinventing Digital Experiences.
            </motion.h1>
        </section>
    );
};

export default Scroll3DSection;