import { motion } from "framer-motion";
import { UseTheme } from "../../contexts/ThemeContext";

interface HighPerformanceSectionProps {
    label: string;
    text1: string;
    text1span: string;
    description: string;
}

const HighPerformanceSection = ({ label, text1, text1span, description }: HighPerformanceSectionProps) => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";

    return (
        <section className={`dd-warp-section ${isDark ? "warp-dark" : "warp-light"}`}>
            {/* Shutter blocks that reveal content */}
            <div className="dd-warp-container">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`dd-warp-block ${isDark ? "warp-block-dark" : "warp-block-light"}`}
                        initial={{ scaleX: 1 }}
                        whileInView={{ scaleX: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            duration: 0.38,
                            delay: i * 0.08,
                            ease: [0.85, 0, 0.15, 1],
                        }}
                    />
                ))}
            </div>

            {/* Content revealed behind shutters */}
            <div className="dd-warp-content">
                <motion.div
                    className="dd-warp-text-box"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                        {label}
                    </span>
                    <h2 className={`dd-warp-title ${isDark ? "warp-title-dark" : "warp-title-light"}`}>
                        {text1}
                        <br />
                        <span>{text1span}</span>
                    </h2>
                    <p className={`dd-warp-desc ${isDark ? "warp-desc-dark" : "warp-desc-light"}`}>
                        {description}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HighPerformanceSection;