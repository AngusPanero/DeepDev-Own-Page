import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import "./pricing.css";
import { UseTheme } from "../contexts/ThemeContext";

// ─── WhatsApp config ──────────────────────────────────────────
const WP = {
    arg:    import.meta.env.VITE_WHATSAPP_ARG,
    esp:    import.meta.env.VITE_WHATSAPP_ESP,
    suiza:  import.meta.env.VITE_WHATSAPP_SUIZA ?? import.meta.env.VITE_WHATSAPP_ESP,
};

function buildWpUrl(number: string, product: string) {
    const msg = encodeURIComponent(`Hola! Me interesa el servicio de *${product}*. ¿Podemos hablar?`);
    return `https://wa.me/${number.replace(/\D/g,"")}?text=${msg}`;
}

// ─── Products ─────────────────────────────────────────────────
const PRODUCTS = [
    {
        id:       "landing",
        index:    "01",
        tag:      "WEB · BÁSICO",
        name:     "Landing Page",
        subtitle: "Sin servidor",
        price:    { ars: "Desde $200.000", eur: "Desde €200" },
        accent:   { dark: "#8e2de2", light: "#0062FF" },
        desc:     "Sitio estático de alto impacto. Diseño a medida, animaciones, mobile-first y deploy en Vercel o Netlify. Ideal para presentar tu marca, producto o evento.",
        features: ["Diseño 100% a medida","Animaciones con Framer Motion","SEO básico","Deploy incluido (Render)","Formulario de contacto","Dominio .com.ar o .com"],
        badge:    null,
    },
    {
        id:       "admin",
        index:    "02",
        tag:      "WEB · FULL STACK",
        name:     "Admin Landing",
        subtitle: "Con panel administrativo",
        price:    { ars: "Desde $300.000", eur: "Desde €300" },
        accent:   { dark: "#7b29ff", light: "#0041cb" },
        desc:     "Sitio web completo con backend, base de datos y panel de control para gestionar contenido, usuarios, pedidos o lo que necesite tu negocio.",
        features: ["Todo lo del plan anterior","Backend Node.js + MongoDB","Panel admin con login seguro","Gestión de contenido dinámica","API REST documentada","Soporte post-deploy 15 días"],
        badge:    "MÁS ELEGIDO",
    },
    {
        id:       "ecommerce",
        index:    "03",
        tag:      "E-COMMERCE",
        name:     "Headless E-commerce",
        subtitle: "Sin comisión por venta, arquitectura desacoplada",
        price:    { ars: "Desde $450.000", eur: "Desde €500" },
        accent:   { dark: "#a855f7", light: "#0080ff" },
        desc:     "Tienda online con arquitectura headless — frontend React ultra-rápido, integración MercadoPago / Stripe, inventario, órdenes y panel de ventas.",
        features: ["Catálogo y filtros dinámicos","Checkout MercadoPago / Stripe","Panel de gestión de stock","Órdenes y envíos automáticos","Notificaciones por email","Analytics de ventas"],
        badge:    null,
    },
    {
        id:       "mobile",
        index:    "04",
        tag:      "MOBILE · iOS / ANDROID",
        name:     "App Móvil",
        subtitle: "React Native cross-platform",
        price:    { ars: "A cotizar", eur: "A Cotizar" },
        accent:   { dark: "#ec4899", light: "#0062FF" },
        desc:     "Aplicación nativa para iOS y Android Desde un único codebase. MVP a producto completo, publicación en App Store y Play Store incluida.",
        features: ["React Native cross-platform","Diseño UI/UX mobile-first","Integración de APIs y notificaciones","Publicación App Store + Play Store","Auth, pagos, geolocalización","Mantenimiento y updates por 30 Días"],
        badge:    null,
    },
    {
        id:       "software",
        index:    "05",
        tag:      "SOFTWARE · CUSTOM",
        name:     "Software a Medida",
        subtitle: "Sistemas internos · IA · Automatización",
        price:    { ars: "A cotizar", eur: "A cotizar" },
        accent:   { dark: "#ec4899", light: "#0062FF" },
        desc:     "Plataformas internas, dashboards empresariales, integraciones de IA, flujos n8n/Zapier, scrapers, bots y cualquier sistema que necesite tu operación.",
        features: ["Relevamiento y arquitectura","IA integrada (OpenAI / custom)","Automatizaciones","APIs e integraciones","Dashboards y reportes","Soporte y mantenimiento por 30 días "],
        badge:    "CUSTOM",
    },
];

// ─── Region modal ─────────────────────────────────────────────
type Region = "latam" | "europe" | null;
type EuSub  = "esp" | "suiza" | null;

interface RegionModalProps {
    product: string;
    onClose: () => void;
    isDark:  boolean;
    accent:  string;
}

const ease = cubicBezier(0.22, 1, 0.36, 1);

function RegionModal({ product, onClose, isDark, accent }: RegionModalProps) {
    const [region, setRegion] = useState<Region>(null);
    const [euSub,  setEuSub]  = useState<EuSub>(null);

    const goWp = (number: string) => {
        window.open(buildWpUrl(number, product), "_blank");
        onClose();
    };

    return (
        <motion.div
            className="pm-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                className={`pm-modal ${isDark ? "pm-dark" : "pm-light"}`}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.35, ease }}
            >
                {/* dots */}
                <div className="pm-dots">
                    <span className="pm-dot pm-d-r"/><span className="pm-dot pm-d-y"/><span className="pm-dot pm-d-g"/>
                    <span className="pm-filename">contact.jsx</span>
                </div>

                <AnimatePresence mode="wait">
                    {/* step 1 — region */}
                    {!region && (
                        <motion.div key="step1" className="pm-step"
                            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                            exit={{ opacity:0, x:-20 }} transition={{ duration:0.28, ease }}>
                            <p className="pm-question">¿Desde dónde nos escribís?</p>
                            <p className="pm-sub">Así te conectamos con el equipo correcto.</p>
                            <div className="pm-options">
                                <button className="pm-opt" onClick={() => setRegion("latam")}
                                    style={{ borderColor:`${accent}66` }}>
                                    <span className="pm-flag">🌎</span>
                                    <span className="pm-opt-label">Latinoamérica</span>
                                    <span className="pm-opt-sub">Argentina · México · Chile · …</span>
                                </button>
                                <button className="pm-opt" onClick={() => setRegion("europe")}
                                    style={{ borderColor:`${accent}66` }}>
                                    <span className="pm-flag">🌍</span>
                                    <span className="pm-opt-label">Europa</span>
                                    <span className="pm-opt-sub">España · Suiza · …</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* step 2a — latam → go */}
                    {region === "latam" && (
                        <motion.div key="step2a" className="pm-step"
                            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                            exit={{ opacity:0, x:-20 }} transition={{ duration:0.28, ease }}>
                            <p className="pm-question">¡Perfecto!</p>
                            <p className="pm-sub">Te conectamos con nuestro equipo en Argentina.</p>
                            <div className="pm-product-tag" style={{ borderColor:`${accent}44`, color:accent }}>
                                📦 {product}
                            </div>
                            <div className="pm-actions">
                                <button className="pm-btn-wp" style={{ background: accent }}
                                    onClick={() => goWp(WP.arg)}>
                                    Abrir WhatsApp →
                                </button>
                                <button className="pm-btn-back" onClick={() => setRegion(null)}>← Volver</button>
                            </div>
                        </motion.div>
                    )}

                    {/* step 2b — europe subregion */}
                    {region === "europe" && !euSub && (
                        <motion.div key="step2b" className="pm-step"
                            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                            exit={{ opacity:0, x:-20 }} transition={{ duration:0.28, ease }}>
                            <p className="pm-question">¿Desde qué país?</p>
                            <div className="pm-options">
                                <button className="pm-opt" onClick={() => setEuSub("esp")}
                                    style={{ borderColor:`${accent}66` }}>
                                    <span className="pm-flag">🇪🇸</span>
                                    <span className="pm-opt-label">España</span>
                                    <span className="pm-opt-sub">Madrid · Barcelona · …</span>
                                </button>
                                <button className="pm-opt" onClick={() => setEuSub("suiza")}
                                    style={{ borderColor:`${accent}66` }}>
                                    <span className="pm-flag">🇨🇭</span>
                                    <span className="pm-opt-label">Suiza</span>
                                    <span className="pm-opt-sub">Zürich · Ginebra · Berna · …</span>
                                </button>
                            </div>
                            <button className="pm-btn-back" onClick={() => setRegion(null)}>← Volver</button>
                        </motion.div>
                    )}

                    {/* step 3 — europe + subregion → go */}
                    {region === "europe" && euSub && (
                        <motion.div key="step3" className="pm-step"
                            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                            exit={{ opacity:0, x:-20 }} transition={{ duration:0.28, ease }}>
                            <p className="pm-question">
                                {euSub === "esp" ? "¡Perfecto! Equipo en España." : "¡Genial! Equipo para Suiza."}
                            </p>
                            <p className="pm-sub">
                                {euSub === "esp"
                                    ? "Te atendemos en horario CET."
                                    : "Podemos comunicarnos en español, inglés o francés."}
                            </p>
                            <div className="pm-product-tag" style={{ borderColor:`${accent}44`, color:accent }}>
                                📦 {product}
                            </div>
                            <div className="pm-actions">
                                <button className="pm-btn-wp" style={{ background: accent }}
                                    onClick={() => goWp(euSub === "esp" ? WP.esp : WP.suiza)}>
                                    Abrir WhatsApp →
                                </button>
                                <button className="pm-btn-back" onClick={() => setEuSub(null)}>← Volver</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button className="pm-close" onClick={onClose}>✕</button>
            </motion.div>
        </motion.div>
    );
}

// ─── Pricing card ─────────────────────────────────────────────
interface CardProps {
    product:  typeof PRODUCTS[0];
    isDark:   boolean;
    region:   "ars" | "eur";
    onContact:(name: string, accent: string) => void;
}

function PricingCard({ product: p, isDark, region, onContact }: CardProps) {
    const accent = isDark ? p.accent.dark : p.accent.light;
    const cardRef = useRef<HTMLDivElement>(null);

    // mouse glow per card
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`pc-card ${isDark ? "pc-dark" : "pc-light"} ${p.badge === "MÁS ELEGIDO" ? "pc-featured" : ""}`}
            style={{ "--accent": accent } as React.CSSProperties}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
            whileHover={{ y: -4 }}
        >
            {/* glow */}
            <div className="pc-glow" aria-hidden="true" />

            {/* top bar */}
            <div className="pc-topbar">
                <div className="pc-dots">
                    <span className="pc-dot pc-d-r"/><span className="pc-dot pc-d-y"/><span className="pc-dot pc-d-g"/>
                </div>
                <span className="pc-index" style={{ color:`${accent}88` }}>{p.index}</span>
            </div>

            {/* badge */}
            {p.badge && (
                <div className="pc-badge" style={{ background:`${accent}22`, color:accent, borderColor:`${accent}55` }}>
                    <span className="pc-badge-dot" style={{ background:accent }} />
                    {p.badge}
                </div>
            )}

            {/* tag */}
            <p className="pc-tag" style={{ color:`${accent}99` }}>{p.tag}</p>

            {/* name */}
            <h3 className="pc-name">{p.name}</h3>
            <p className="pc-subtitle">{p.subtitle}</p>

            {/* price */}
            <div className="pc-price-wrap">
                <span className="pc-price">{p.price[region]}</span>
                {p.id !== "software" && (
                    <span className="pc-price-note">pago único · sin cuota</span>
                )}
            </div>

            {/* divider */}
            <div className="pc-divider" style={{ background:`linear-gradient(to right,${accent}44,transparent)` }} />

            {/* desc */}
            <p className="pc-desc">{p.desc}</p>

            {/* features */}
            <ul className="pc-features">
                {p.features.map(f => (
                    <li key={f} className="pc-feat">
                        <span className="pc-feat-dot" style={{ background:accent }} />
                        {f}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                className="pc-cta"
                style={{ background:`linear-gradient(135deg,${accent},${accent}bb)` }}
                onClick={() => onContact(p.name, accent)}
            >
                <span>Hablar por WhatsApp</span>
                <span className="pc-cta-arrow">→</span>
            </button>
        </motion.div>
    );
}

// ─── Main ─────────────────────────────────────────────────────
export default function Pricing() {
    const { theme } = UseTheme();
    const isDark    = theme !== "light";
    const [currency, setCurrency]         = useState<"ars"|"eur">("ars");
    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [modalAccent,  setModalAccent]  = useState("#8e2de2");
    const pageRef = useRef<HTMLDivElement>(null);

    // mouse glow on page
    useEffect(() => {
        const el = pageRef.current;
        if (!el) return;
        const fn = (e: MouseEvent) => {
            el.style.setProperty("--pmx", `${(e.clientX / window.innerWidth) * 100}%`);
            el.style.setProperty("--pmy", `${(e.clientY / window.innerHeight) * 100}%`);
        };
        el.addEventListener("mousemove", fn);
        return () => el.removeEventListener("mousemove", fn);
    }, []);

    return (
        <div ref={pageRef} className={`pricing-page ${isDark ? "pr-dark" : "pr-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />
            <div className="pr-mouse-glow" aria-hidden="true" />

            {/* ── HEADER ── */}
            <motion.div className="pr-header"
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}>

                <span className="pr-eyebrow">
                    <span className="pr-eyebrow-dot" style={{ background: isDark ? "#8e2de2" : "#0062FF" }} />
                    Servicios & Precios
                </span>

                <h1 className="pr-heading">
                    <span>Soluciones</span>
                    <span className="pr-heading-outline"
                        style={{ WebkitTextStrokeColor: isDark ? "#8e2de2" : "#0062FF" }}>
                        a medida.
                    </span>
                </h1>

                <p className="pr-desc">
                    Cada proyecto es único. Estos son nuestros precios de referencia —
                    el valor final depende del alcance, las integraciones y el plazo.
                </p>

                {/* currency toggle */}
                <div className="pr-toggle">
                    <button
                        className={`pr-tog-btn ${currency === "ars" ? "active" : ""}`}
                        style={currency === "ars" ? { background: isDark ? "#8e2de2" : "#0062FF" } : {}}
                        onClick={() => setCurrency("ars")}
                    >🇦🇷 ARGENTINA</button>
                    <button
                        className={`pr-tog-btn ${currency === "eur" ? "active" : ""}`}
                        style={currency === "eur" ? { background: isDark ? "#8e2de2" : "#0062FF" } : {}}
                        onClick={() => setCurrency("eur")}
                    >🇪🇺 EUROPA</button>
                </div>
            </motion.div>

            {/* ── GRID ── */}
            <div className="pr-grid">
                {PRODUCTS.map(p => (
                    <PricingCard
                        key={p.id}
                        product={p}
                        isDark={isDark}
                        region={currency}
                        onContact={(name, accent) => {
                            setModalProduct(name);
                            setModalAccent(accent);
                        }}
                    />
                ))}
            </div>

            {/* ── NOTE ── */}
            <motion.p className="pr-note"
                initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true }} transition={{ delay:0.3 }}>
                Todos los precios son referenciales e incluyen diseño, desarrollo y deploy inicial.
                Consultá por mantenimiento mensual, SEO avanzado o integraciones específicas. Los gastos de Dominio, Hosting, Base de Datos e Integraciones de terceros corren por cuenta del comprador
            </motion.p>

            {/* ── MODAL ── */}
            <AnimatePresence>
                {modalProduct && (
                    <RegionModal
                        product={modalProduct}
                        accent={modalAccent}
                        isDark={isDark}
                        onClose={() => setModalProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}