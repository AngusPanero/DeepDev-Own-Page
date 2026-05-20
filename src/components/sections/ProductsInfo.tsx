import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence, cubicBezier } from "framer-motion";
import "../../styles/products.css";
import { UseTheme } from "../../contexts/ThemeContext";

// ── Data ──────────────────────────────────────────────────────
const PRODUCTS = [
    {
        id: "web",
        index: "01",
        tag: "WEB APPLICATIONS",
        title: ["Hacemos", "Aplicaciones", "Web."],
        accentDark: "#8e2de2",
        accentLight: "#0062FF",
        text: "Desde landing pages de alto impacto hasta plataformas de eCommerce y sistemas web completamente personalizados. Un sitio bien construido convierte visitantes en clientes y permite que tu negocio crezca con control total.",
        stats: [{ n: "120+", label: "Proyectos" }, { n: "99%", label: "Uptime" }, { n: "4.9★", label: "Rating" }],
        icons: ["/logos/chrome.svg", "/logos/safari2.svg", "/logos/firefox.svg", "/logos/edge.svg"],
    },
    {
        id: "apps",
        index: "02",
        tag: "MOBILE APPS",
        title: ["Apps para", "iOS y", "Android."],
        accentDark: "#4a00e0",
        accentLight: "#0041cb",
        text: "Diseñamos aplicaciones móviles desde MVPs hasta productos completos. Una app bien lograda entrega velocidad, rendimiento y experiencia fluida — una conexión directa entre tu producto y tu audiencia.",
        stats: [{ n: "iOS", label: "App Store" }, { n: "Android", label: "Play Store" }, { n: "React Native", label: "Cross-platform" }],
        icons: ["/logos/appstore.svg", "/logos/playstore.svg", "/logos/apple.svg", "/logos/android2.svg"],
    },
    {
        id: "software",
        index: "03",
        tag: "CUSTOM SOFTWARE",
        title: ["Software", "Completamente", "Customizado."],
        accentDark: "#7b29ff",
        accentLight: "#1d6ffa",
        text: "Sistemas de gestión, plataformas internas y automatización de procesos a medida. El software custom permite centralizar información y obtener control absoluto sobre tus operaciones.",
        stats: [{ n: "Escalable", label: "Arquitectura" }, { n: "Seguro", label: "Infraestructura" }, { n: "A medida", label: "100%" }],
        icons: ["/logos/soft.svg", "/logos/graf.svg", "/logos/ingenieria.svg", "/logos/flow.svg"],
    },
    {
        id: "ai",
        index: "04",
        tag: "INTELIGENCIA ARTIFICIAL",
        title: ["IA", "Integrada", "en tu Producto."],
        accentDark: "#a855f7",
        accentLight: "#0080ff",
        text: "Chatbots personalizados, asistentes virtuales y flujos de decisión inteligentes. Una IA controlada, segura e integrada sin fricciones en tus sistemas y datos existentes.",
        stats: [{ n: "LLM", label: "Integración" }, { n: "24/7", label: "Disponible" }, { n: "Custom", label: "Training" }],
        icons: ["/logos/brain.svg", "/logos/cubo.svg", "/logos/platform.svg", "/logos/chat.svg"],
    },
    {
        id: "automation",
        index: "05",
        tag: "AUTOMATIZACIÓN",
        title: ["Flujos de", "Trabajo", "Automatizados."],
        accentDark: "#6366f1",
        accentLight: "#0062FF",
        text: "Conectamos CRMs, APIs y herramientas internas para que los datos fluyan solos. Respuestas más rápidas, menos errores y operaciones completamente consistentes en toda tu organización.",
        stats: [{ n: "n8n", label: "Workflows" }, { n: "Zapier", label: "Integraciones" }, { n: "0", label: "Errores manuales" }],
        icons: ["/logos/recycle.svg", "/logos/work.svg", "/logos/ingenieria.svg", "/logos/flow.svg"],
    },
];

// ── Stagger variants ──────────────────────────────────────────
const easeCustom = cubicBezier(0.22, 1, 0.36, 1);
const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemV = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: easeCustom } },
};
const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    show:   { opacity: 1, x: 0,  transition: { duration: 0.6, ease: easeCustom } },
};
const slideRight = {
    hidden: { opacity: 0, x: 60 },
    show:   { opacity: 1, x: 0,  transition: { duration: 0.6, ease: easeCustom } },
};

// ── Single product panel ──────────────────────────────────────
const ProductPanel = ({ product, isActive, theme }: {
    product: typeof PRODUCTS[0];
    isActive: boolean;
    theme: string;
}) => {
    const isDark = theme !== "light";
    const accent = isDark ? product.accentDark : product.accentLight;

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={product.id}
                    className="pp-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    {/* Background accent glow */}
                    <div
                        className="pp-bg-glow"
                        style={{ background: `radial-gradient(ellipse 55% 55% at 70% 45%, ${accent}${isDark ? "22" : "14"}, transparent 70%)` }}
                    />

                    <motion.div
                        className="pp-inner"
                        variants={containerV}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Left col */}
                        <div className="pp-left">
                            <motion.div className="pp-index" variants={itemV}>
                                {product.index} <span className="pp-separator">/</span> 05
                            </motion.div>

                            <motion.p className="pp-tag" variants={itemV}>
                                {product.tag}
                            </motion.p>

                            <motion.h2 className="pp-title" variants={slideLeft}>
                                {product.title.map((line, i) => (
                                    <span
                                        key={i}
                                        className="pp-title-line"
                                        style={i === product.title.length - 1
                                            ? { WebkitTextStroke: `2px ${accent}`, color: "transparent" }
                                            : undefined
                                        }
                                    >
                                        {line}
                                    </span>
                                ))}
                            </motion.h2>

                            <motion.p className="pp-text" variants={itemV}>
                                {product.text}
                            </motion.p>

                            {/* Stats row */}
                            <motion.div className="pp-stats" variants={containerV}>
                                {product.stats.map(s => (
                                    <motion.div key={s.label} className="pp-stat" variants={itemV}>
                                        <span
                                            className="pp-stat-n"
                                            style={{ color: accent }}
                                        >
                                            {s.n}
                                        </span>
                                        <span className="pp-stat-label">{s.label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right col — icon grid */}
                        <motion.div className="pp-right" variants={slideRight}>
                            {/* big decorative number */}
                            <div
                                className="pp-big-num"
                                style={{ color: accent }}
                            >
                                {product.index}
                            </div>

                            {/* icon grid */}
                            <div className="pp-icon-grid">
                                {product.icons.map((src) => (
                                    <motion.div
                                        key={src}
                                        className="pp-icon-card"
                                        variants={itemV}
                                        whileHover={{ scale: 1.08, y: -4 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{ borderColor: `${accent}33` }}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            width={44}
                                            height={44}
                                            style={{
                                                opacity: isDark ? 0.9 : 0.85,
                                                filter: isDark
                                                    ? "drop-shadow(0 0 8px rgba(255,255,255,0.06))"
                                                    : "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* accent pill */}
                            <motion.div
                                className="pp-pill"
                                style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}
                                variants={itemV}
                            >
                                <span className="pp-pill-dot" style={{ background: accent }} />
                                Disponible ahora
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* bottom progress bar */}
                    <div className="pp-progress-bar">
                        <motion.div
                            className="pp-progress-fill"
                            style={{ background: accent }}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.4, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ── Main component ────────────────────────────────────────────
const ProductsInfo = () => {
    const { theme } = UseTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Scroll-driven active index
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll 0→1 to product index 0→4
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

    useEffect(() => {
        const unsub = smoothProgress.on("change", v => {
            const idx = Math.min(
                PRODUCTS.length - 1,
                Math.floor(v * PRODUCTS.length)
            );
            setActiveIndex(idx);
        });
        return unsub;
    }, [smoothProgress]);

    const isDark = theme !== "light";

    return (
        <div
            ref={containerRef}
            className={`products-wrapper ${isDark ? "theme-dark" : "theme-light"}`}
            style={{ height: `${PRODUCTS.length * 100}vh` }}
        >
            {/* sticky viewport */}
            <div className="products-sticky">
                <div className={`dd-grid-overlay ${theme}`} />

                {/* side nav dots */}
                <nav className="pp-side-nav" aria-label="Secciones de productos">
                    {PRODUCTS.map((p, i) => (
                        <button
                            key={p.id}
                            className={`pp-nav-dot ${i === activeIndex ? "active" : ""}`}
                            style={i === activeIndex ? { background: isDark ? p.accentDark : p.accentLight, boxShadow: `0 0 10px ${isDark ? p.accentDark : p.accentLight}88` } : {}}
                            onClick={() => {
                                const el = containerRef.current;
                                if (!el) return;
                                const top = el.offsetTop + (i / PRODUCTS.length) * el.offsetHeight + 10;
                                window.scrollTo({ top, behavior: "smooth" });
                            }}
                            aria-label={PRODUCTS[i].tag}
                        />
                    ))}
                </nav>

                {/* active product number label */}
                <div className="pp-scroll-hint">
                    <span style={{ color: isDark ? PRODUCTS[activeIndex].accentDark : PRODUCTS[activeIndex].accentLight }}>
                        {PRODUCTS[activeIndex].index}
                    </span>
                    <span className="pp-scroll-label">
                        {PRODUCTS[activeIndex].tag}
                    </span>
                </div>

                {/* panels */}
                {PRODUCTS.map((p, i) => (
                    <ProductPanel
                        key={p.id}
                        product={p}
                        isActive={i === activeIndex}
                        theme={theme}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductsInfo;