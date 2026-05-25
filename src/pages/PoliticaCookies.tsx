import { motion } from "framer-motion";
import { UseTheme } from "../contexts/ThemeContext";
import "../styles/politicaCookie.css";

const ease = [0.22, 1, 0.36, 1] as const;

const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemV = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const SECTIONS = [
    {
        num: "01",
        title: "¿Qué son las cookies?",
        text: "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitás un sitio web. Sirven para recordar tus preferencias y ayudarte a tener una experiencia más fluida.",
        isList: false,
    },
    {
        num: "02",
        title: "¿Qué tipos de cookies usamos?",
        text: null,
        isList: true,
    },
    {
        num: "03",
        title: "¿Cómo puedo gestionar las cookies?",
        text: "Podés configurar tu navegador para aceptar o rechazar cookies. Tené en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio.",
        isList: false,
    },
];

const COOKIE_TYPES = [
    { label: "Cookies esenciales",     desc: "Necesarias para que el sitio funcione correctamente." },
    { label: "Cookies de rendimiento", desc: "Analizan el uso del sitio para mejorar la experiencia." },
    { label: "Cookies de funcionalidad", desc: "Recuerdan tus preferencias y configuraciones." },
    { label: "Cookies de terceros",    desc: "Servicios externos como redes sociales e integraciones." },
];

const PoliticaCookies = () => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    return (
        <section className={`ck-page ${isDark ? "ck-dark" : "ck-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />

            <motion.div
                className="ck-container"
                variants={containerV}
                initial="hidden"
                animate="show"
            >
                {/* terminal dots */}
                <motion.div className="ck-terminal" variants={itemV}>
                    <span className="ck-dot ck-d-r"/><span className="ck-dot ck-d-y"/><span className="ck-dot ck-d-g"/>
                    <span className="ck-tfile">cookies.jsx</span>
                </motion.div>

                {/* eyebrow */}
                <motion.span className="ck-eyebrow" variants={itemV}>
                    <span className="ck-eyebrow-dot" style={{ background: accent }} />
                    Legal · Privacidad
                </motion.span>

                {/* title */}
                <motion.h1 className="ck-title" variants={itemV}>
                    <span className="ck-title-solid">Política de</span>
                    <span className="ck-title-outline" style={{ WebkitTextStrokeColor: accent }}>
                        Cookies
                    </span>
                </motion.h1>

                {/* intro */}
                <motion.p className="ck-intro" variants={itemV}>
                    En DeepDev utilizamos cookies para mejorar tu experiencia de navegación y ofrecerte un servicio personalizado. Al continuar navegando en nuestro sitio, entendemos que aceptás su uso.
                </motion.p>

                {/* divider */}
                <motion.div
                    className="ck-divider"
                    variants={itemV}
                    style={{ background: `linear-gradient(to right, ${accent}66, transparent)` }}
                />

                {/* sections */}
                <motion.div className="ck-body" variants={containerV}>
                    {SECTIONS.map(s => (
                        <motion.div key={s.num} className="ck-section" variants={itemV}>
                            <div className="ck-section-head">
                                <span className="ck-section-num" style={{ color: accent }}>{s.num}</span>
                                <div className="ck-section-bar" style={{ background: accent }} />
                                <h3 className="ck-section-title">{s.title}</h3>
                            </div>

                            {!s.isList && s.text && (
                                <p className="ck-section-text">{s.text}</p>
                            )}

                            {s.isList && (
                                <ul className="ck-list">
                                    {COOKIE_TYPES.map((c, i) => (
                                        <motion.li
                                            key={c.label}
                                            className="ck-list-item"
                                            style={{ borderColor: `${accent}44`, background: `${accent}0a` }}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.45, delay: i * 0.07, ease }}
                                            whileHover={{ x: 6 }}
                                        >
                                            <span className="ck-list-dot" style={{ background: accent }} />
                                            <span>
                                                <strong>{c.label}:</strong> {c.desc}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* footer */}
                <motion.div
                    className="ck-footer"
                    variants={itemV}
                    style={{ borderColor: `${accent}44`, background: `${accent}0a` }}
                >
                    <span className="ck-footer-icon" style={{ color: accent }}>◈</span>
                    <p className="ck-footer-text" style={{ color: accent }}>
                        DeepDev Studio · Política de Cookies · Todos los derechos reservados
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default PoliticaCookies;