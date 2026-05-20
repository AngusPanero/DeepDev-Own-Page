import React, { useRef } from 'react';
import { motion, useInView, cubicBezier } from 'framer-motion';
import { Link } from 'react-router-dom';
import "../../styles/company.css";
import FloatingTitle from '../ui/FloatingTitle';
import HighPerformanceSection from '../ui/HighPerformanceSection';
import { MetricGrid } from '../ui/MetricGrid';
import { UseTheme } from '../../contexts/ThemeContext';

// ── Data (español hardcoded) ───────────────────────────────────

const ACT1_MILESTONES = [
    { year: "2022", title: "Fundación en Buenos Aires con foco en desarrollo web de alto rendimiento." },
    { year: "EXP",  title: "Primeros proyectos para clientes en Latinoamérica y España." },
    { year: "GROW", title: "Consolidación del stack: React, Node.js, TypeScript y cloud." },
];

const ACT2_MILESTONES = [
    { year: "2024",  title: "Apertura de operaciones en España — presencia dual ARG/ESP." },
    { year: "AI",    title: "Integración de modelos de IA en productos de clientes." },
    { year: "SCALE", title: "Expansión a proyectos de software a medida para empresas." },
];

const ACT3_MILESTONES = [
    { year: "2026",   title: "DeepDev Global: estudio boutique internacional consolidado." },
    { year: "FULL",   title: "Stack completo: web, mobile, IA y automatización de flujos." },
    { year: "GLOBAL", title: "Clientes activos en 4 países con soporte 24/7." },
];

const METRICS_ACT1 = [
    { id: "PRJ", value: "70",  suffix: "+",  label: "Proyectos entregados a clientes reales." },
    { id: "UPT", value: "99",  suffix: "%",  label: "Disponibilidad garantizada en producción." },
    { id: "SAT", value: "4.9", suffix: "★",  label: "Rating promedio de satisfacción del cliente." },
];

const METRICS_ACT2 = [
    { id: "YRS", value: "3",   suffix: "+",  label: "Años de experiencia en desarrollo full stack." },
    { id: "STK", value: "12",  suffix: "",   label: "Tecnologías activamente dominadas en el equipo." },
    { id: "SRT", value: "24",  suffix: "/7", label: "Horas de soporte técnico disponibles." },
];

// ── Shared stagger helper ──────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: cubicBezier(0.42, 0, 0.58, 1) } },
};

const InView = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div
            ref={ref}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ── Main ───────────────────────────────────────────────────────
const Company: React.FC = () => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";

    return (
        <main className={`co-root ${isDark ? "theme-dark" : "theme-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} />

            {/* ══ HERO ═════════════════════════════════════════ */}
            <section className="co-hero">
                <div className="co-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <FloatingTitle text="DEEP DEV" className="dd-massive-title" />
                    </motion.div>
                    <motion.p
                        className={`co-hero-sub ${isDark ? "sub-dark" : "sub-light"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                    >
                        Desarrollo Web & App Full Stack · IA · Automatización
                    </motion.p>
                </div>
                {/* scroll hint */}
                <motion.div
                    className={`co-scroll-hint ${isDark ? "hint-dark" : "hint-light"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
                >
                    <motion.div
                        className="co-scroll-mouse"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="co-scroll-wheel" />
                    </motion.div>
                    <span className="co-scroll-label">Scroll para descubrir</span>
                </motion.div>

                <div className={`co-hero-glow ${isDark ? "glow-dark" : "glow-light"}`} />
            </section>

            {/* ══ ACT 01 — ORIGEN ══════════════════════════════ */}
            <section className="co-dna">
                <div className="co-dna-grid">
                    <div className="co-dna-left">
                        <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                            01 // GENESIS
                        </span>
                    </div>
                    <div className="co-dna-right">
                        <p className={`co-dna-text ${isDark ? "dna-dark" : "dna-light"}`}>
                            DeepDev nació en Argentina de una motivación simple: construir productos digitales
                            de clase mundial sin los límites de una agencia tradicional. Un equipo pequeño,
                            decisiones rápidas y foco absoluto en la calidad técnica.
                        </p>
                    </div>
                </div>
            </section>

            <HighPerformanceSection
                label="// STATUS: ORIGIN_STORY"
                text1="DEL CÓDIGO A"
                text1span="PRODUCTOS REALES"
                description="Lo que comenzó como proyectos freelance detectó un patrón: los clientes no necesitaban más agencias, necesitaban un equipo técnico de confianza que entendiera su negocio."
            />

            <section className="co-evolution">
                <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                    01 // EARLY MILESTONES
                </span>
                <div className="co-evo-list">
                    {ACT1_MILESTONES.map((m, i) => (
                        <motion.div
                            key={i}
                            className={`co-evo-row ${isDark ? "evo-dark" : "evo-light"}`}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.1 }}
                        >
                            <span className={`co-evo-year ${isDark ? "year-dark" : "year-light"}`}>
                                {m.year}
                            </span>
                            <h4 className="co-evo-title">{m.title}</h4>
                            <div className={`co-evo-line ${isDark ? "evo-line-dark" : "evo-line-light"}`} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <MetricGrid items={METRICS_ACT1} columns={3} />

            {/* ══ ACT 02 — EXPANSIÓN ═══════════════════════════ */}
            <section className="co-dna">
                <div className="co-dna-grid">
                    <div className="co-dna-left">
                        <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                            02 // EXPANSION
                        </span>
                    </div>
                    <div className="co-dna-right">
                        <p className={`co-dna-text ${isDark ? "dna-dark" : "dna-light"}`}>
                            Abrimos operaciones en España e integramos IA en nuestros desarrollos.
                            La dualidad Argentina–Europa nos da cobertura de zona horaria completa
                            y una perspectiva de mercado que pocas agencias pueden ofrecer.
                        </p>
                    </div>
                </div>
            </section>

            <HighPerformanceSection
                label="// FOCUS: DUAL_PRESENCE"
                text1="TECNOLOGÍA SIN"
                text1span="FRONTERAS"
                description="Combinamos la innovación técnica europea con el ingenio y la velocidad del talento latinoamericano. El resultado: entregas rápidas con calidad de producto de primer nivel."
            />

            <section className="co-evolution">
                <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                    02 // EXPANSION MILESTONES
                </span>
                <div className="co-evo-list">
                    {ACT2_MILESTONES.map((m, i) => (
                        <motion.div
                            key={i}
                            className={`co-evo-row ${isDark ? "evo-dark" : "evo-light"}`}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.1 }}
                        >
                            <span className={`co-evo-year ${isDark ? "year-dark" : "year-light"}`}>
                                {m.year}
                            </span>
                            <h4 className="co-evo-title">{m.title}</h4>
                            <div className={`co-evo-line ${isDark ? "evo-line-dark" : "evo-line-light"}`} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <MetricGrid items={METRICS_ACT2} columns={3} />

            {/* ══ ACT 03 — FUTURO ══════════════════════════════ */}
            <section className="co-dna">
                <div className="co-dna-grid">
                    <div className="co-dna-left">
                        <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                            03 // VISION
                        </span>
                    </div>
                    <div className="co-dna-right">
                        <p className={`co-dna-text ${isDark ? "dna-dark" : "dna-light"}`}>
                            DeepDev no es una agencia más. Somos un estudio técnico boutique
                            que construye el futuro digital de nuestros clientes. Cada proyecto
                            es una asociación estratégica, no un ticket de soporte.
                        </p>
                    </div>
                </div>
            </section>

            <HighPerformanceSection
                label="// TARGET: GLOBAL_SCALE"
                text1="REDEFINIENDO EL"
                text1span="DESARROLLO WEB"
                description="Partimos del desarrollo web pero nuestra visión se expande hacia ecosistemas digitales completos: web, mobile, IA y automatización como un sistema integrado."
            />

            <section className="co-evolution">
                <span className={`dd-label ${isDark ? "label-dark" : "label-light"}`}>
                    03 // STRATEGIC ROADMAP
                </span>
                <div className="co-evo-list">
                    {ACT3_MILESTONES.map((m, i) => (
                        <motion.div
                            key={i}
                            className={`co-evo-row ${isDark ? "evo-dark" : "evo-light"}`}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.1 }}
                        >
                            <span className={`co-evo-year ${isDark ? "year-dark" : "year-light"}`}>
                                {m.year}
                            </span>
                            <h4 className="co-evo-title">{m.title}</h4>
                            <div className={`co-evo-line ${isDark ? "evo-line-dark" : "evo-line-light"}`} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ NETWORK ══════════════════════════════════════ */}
            <section className={`co-network ${isDark ? "network-dark" : "network-light"}`}>
                <div className="co-net-wrapper">
                    <InView className="co-net-item">
                        <motion.span variants={fadeUp} className={`co-net-title ${isDark ? "year-dark" : "year-light"}`}>
                            CLIENTES
                        </motion.span>
                        <motion.span variants={fadeUp} className="co-net-desc">
                            Startups, pymes y empresas que necesitan un equipo técnico de confianza para escalar.
                        </motion.span>
                    </InView>
                    <InView className="co-net-item">
                        <motion.span variants={fadeUp} className={`co-net-title ${isDark ? "year-dark" : "year-light"}`}>
                            ARGENTINA 🇦🇷
                        </motion.span>
                        <motion.a
                            href={import.meta.env.VITE_WHATSAPP_ARG}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={fadeUp}
                            className="co-net-desc co-net-link"
                        >
                            WhatsApp Buenos Aires →
                        </motion.a>
                    </InView>
                    <InView className="co-net-item">
                        <motion.span variants={fadeUp} className={`co-net-title ${isDark ? "year-dark" : "year-light"}`}>
                            ESPAÑA 🇪🇸
                        </motion.span>
                        <motion.a
                            href={import.meta.env.VITE_WHATSAPP_ESP}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={fadeUp}
                            className="co-net-desc co-net-link"
                        >
                            WhatsApp Madrid →
                        </motion.a>
                    </InView>
                </div>
            </section>

            {/* ══ FOOTER BIG LINK ══════════════════════════════ */}
            <footer className={`co-footer ${isDark ? "footer-dark" : "footer-light"}`}>
                <Link to="/contact">
                    <motion.span
                        className={`co-big-link ${isDark ? "big-dark" : "big-light"}`}
                        whileHover={{ x: -24 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        HABLEMOS DE TU PROYECTO →
                    </motion.span>
                </Link>
            </footer>
        </main>
    );
};

export default Company;