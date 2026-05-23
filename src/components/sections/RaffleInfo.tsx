import React from 'react';
import { motion } from 'framer-motion';
import "../../styles/raffleInfo.css";
import { UseLanguage } from '../../contexts/LanguageContext';
import { UseTheme } from '../../contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemV = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const slideV = {
    hidden: { opacity: 0, x: -40 },
    show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const FEATURES = (texts: any, language: string) => [
    {
        icon: "⚡",
        title: texts[language].raffles.performance,
        desc:  texts[language].raffles.performanceText,
    },
    {
        icon: "🎨",
        title: texts[language].raffles.design,
        desc:  texts[language].raffles.designText,
    },
];

const RaffleInfo: React.FC = () => {
    const { language, texts } = UseLanguage();
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    return (
        <motion.div
            className={`ri-wrap ${isDark ? "ri-dark" : "ri-light"}`}
            variants={containerV}
            initial="hidden"
            animate="show"
        >
            {/* terminal dots */}
            <motion.div className="ri-terminal" variants={itemV}>
                <span className="ri-dot ri-d-r" />
                <span className="ri-dot ri-d-y" />
                <span className="ri-dot ri-d-g" />
                <span className="ri-tfile">sorteo.jsx</span>
            </motion.div>

            {/* badge */}
            <motion.div variants={itemV}>
                <span
                    className="ri-badge"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${isDark ? "#4a00e0" : "#0041cb"})` }}
                >
                    {texts[language].raffles.premiere.toUpperCase()}
                </span>
            </motion.div>

            {/* heading */}
            <motion.h1 className="ri-heading" variants={slideV}>
                <span
                    className="ri-heading-solid"
                    style={{ color: isDark ? "#fff" : "#0a192f" }}
                >
                    {texts[language].raffles.premiereTitle.split(" ").slice(0, 2).join(" ")}
                </span>
                <span
                    className="ri-heading-outline"
                    style={{ WebkitTextStrokeColor: accent }}
                >
                    {texts[language].raffles.premiereTitle.split(" ").slice(2).join(" ")}
                </span>
            </motion.h1>

            {/* description */}
            <motion.p className="ri-desc" variants={itemV}>
                {texts[language].raffles.premiereText}
            </motion.p>

            {/* divider */}
            <motion.div
                className="ri-divider"
                variants={itemV}
                style={{ background: `linear-gradient(to right, ${accent}55, transparent)` }}
            />

            {/* features */}
            <motion.div className="ri-features" variants={containerV}>
                {FEATURES(texts, language).map((f, i) => (
                    <motion.div
                        key={i}
                        className="ri-feat"
                        variants={itemV}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                        <div
                            className="ri-feat-icon"
                            style={{ borderColor: `${accent}33`, background: `${accent}14` }}
                        >
                            {f.icon}
                        </div>
                        <div className="ri-feat-text">
                            <h4 className="ri-feat-title">{f.title}</h4>
                            <p className="ri-feat-desc">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default RaffleInfo;