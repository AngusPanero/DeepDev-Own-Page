import { motion } from "framer-motion";
import { UseLanguage } from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";
import "../styles/raffleTerms.css";

const ease = [0.22, 1, 0.36, 1] as const;

const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemV = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const TERM_KEYS = ["term1","term2","term3","term4","term5"] as const;

const TerminosSorteo = () => {
    const { theme } = UseTheme();
    const { texts, language } = UseLanguage();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    return (
        <section className={`rt-page ${isDark ? "rt-dark" : "rt-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />

            <motion.div
                className="rt-container"
                variants={containerV}
                initial="hidden"
                animate="show"
            >
                {/* terminal dots */}
                <motion.div className="rt-terminal" variants={itemV}>
                    <span className="rt-dot rt-d-r"/><span className="rt-dot rt-d-y"/><span className="rt-dot rt-d-g"/>
                    <span className="rt-tfile">terminos.jsx</span>
                </motion.div>

                {/* eyebrow */}
                <motion.span className="rt-eyebrow" variants={itemV}>
                    <span className="rt-eyebrow-dot" style={{ background: accent }} />
                    Sorteos · Términos Legales
                </motion.span>

                {/* title */}
                <motion.h1 className="rt-title" variants={itemV}>
                    <span className="rt-title-solid">
                        {texts[language].raffleTerm.terms_title.split(" ").slice(0,2).join(" ")}
                    </span>
                    <span className="rt-title-outline" style={{ WebkitTextStrokeColor: accent }}>
                        {texts[language].raffleTerm.terms_title.split(" ").slice(2).join(" ")}
                    </span>
                </motion.h1>

                {/* intro */}
                <motion.p className="rt-intro" variants={itemV}>
                    {texts[language].raffleTerm.terms_subtitle}
                </motion.p>

                {/* divider */}
                <motion.div
                    className="rt-divider"
                    variants={itemV}
                    style={{ background: `linear-gradient(to right, ${accent}66, transparent)` }}
                />

                {/* terms */}
                <motion.div className="rt-body" variants={containerV}>
                    {TERM_KEYS.map((key, i) => (
                        <motion.div key={key} className="rt-section" variants={itemV}>
                            <div className="rt-section-head">
                                <span className="rt-section-num" style={{ color: accent }}>
                                    0{i + 1}
                                </span>
                                <div className="rt-section-bar" style={{ background: accent }} />
                                <h3 className="rt-section-title">
                                    {texts[language].raffleTerm[`${key}_title`]}
                                </h3>
                            </div>
                            <p className="rt-section-text">
                                {texts[language].raffleTerm[`${key}_text`]}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* footer */}
                <motion.div
                    className="rt-footer"
                    variants={itemV}
                    style={{ borderColor: `${accent}44`, background: `${accent}0a` }}
                >
                    <span className="rt-footer-icon" style={{ color: accent }}>◈</span>
                    <p className="rt-footer-text" style={{ color: accent }}>
                        {texts[language].raffleTerm.terms_footer}
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default TerminosSorteo;