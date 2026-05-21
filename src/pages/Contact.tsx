import { useState, useEffect, useRef } from "react"
import "../styles/contactForm.css"
import axios from "axios"
import TagManager from "react-gtm-module"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import { UseTheme } from "../contexts/ThemeContext"
import Loader from "../components/sections/Loader"
import ProcessOk from "../components/sections/ProcessOk"
import Error from "../components/sections/Error"
import ParticleButton from "../components/ui/ParticleButton"
import TubesCursor from "../components/ui/TubesCursor"

// ── Select data ───────────────────────────────────────────────
const TIPO_TRABAJO   = ["Nuevo Proyecto", "Rediseño de sitio existente"]
const TIPO_WEB       = ["Landing Page", "Sitio Corporativo", "E-commerce", "Portfolio", "Aplicación Web / Plataforma", "Sistema Customizado", "No estoy seguro todavía"]
const OBJETIVO       = ["Recibir consultas / Leads", "Vender productos o servicios", "Fortalecer mi marca", "Automatizar procesos", "Otro"]
const PRESUPUESTO    = ["Menos de $500.000", "$500k – $1M", "$1M – $2M", "Más de $2.000.000", "No estoy seguro todavía"]
const DISPONIBILIDAD = ["Lo antes posible", "1–2 meses", "+3 meses", "Flexible"]

// ── Animations ────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: cubicBezier(0.42, 0, 0.58, 1) } }, // use cubic bezier for ease
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

// ── Step indicator ────────────────────────────────────────────
const STEPS = ["Sobre vos", "El proyecto", "Detalles", "Descripción"]

const Contact = () => {
    const { theme } = UseTheme()
    const isDark = theme !== "light"
    const pageRef = useRef<HTMLDivElement>(null)

    const WP_ARG = import.meta.env.VITE_WHATSAPP_ARG
    const WP_ESP = import.meta.env.VITE_WHATSAPP_ESP

    // mouse glow
    useEffect(() => {
        const el = pageRef.current
        if (!el) return
        const fn = (e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
            el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`)
        }
        el.addEventListener("mousemove", fn)
        return () => el.removeEventListener("mousemove", fn)
    }, [])

    const [step, setStep] = useState(0)
    const [form, setForm] = useState({
        name: "", lastName: "", companyName: "", contactRole: "",
        email: "", phone: "", projectOption: "", typeOfWork: "",
        currentUrl: "", projectGoal: "", budgetRange: "",
        availableTime: "", description: "",
    })
    const [hoverParticles, setHoverParticles] = useState(false)
    const [error, setError]     = useState(false)
    const [loading, setLoading] = useState(false)
    const [process, setProcess] = useState("")

    const set = (field: string) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm(p => ({ ...p, [field]: e.target.value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(false); setLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, form)
            if (res.status === 201) {
                setProcess("ok"); setLoading(false)
                TagManager.dataLayer({ event: "form_contacto_deepdev" } as any)
                axios.post(`${import.meta.env.VITE_API_URL}/send-email`, form)
                    .catch(err => console.error("Mail silencioso:", err))
            }
        } catch { setLoading(false); setError(true) }
    }

    if (loading)          return <Loader />
    if (process === "ok") return <ProcessOk processMessage="Contacto Enviado Exitosamente." />
    if (error)            return <Error errorMessage="Error en el Envío, Intentá Nuevamente." />

    const accentColor = isDark ? "#8e2de2" : "#0062FF"

    // step fields validity check (basic — just checks non-empty)
    const canNext = () => {
        if (step === 0) return form.name && form.lastName && form.email && form.phone
        if (step === 1) return form.projectOption && form.typeOfWork
        if (step === 2) return form.projectGoal && form.budgetRange && form.availableTime
        return true
    }

    return (
        <>
        <div ref={pageRef} className={`ct-page ${isDark ? "ct-dark" : "ct-light"}`}>
            {/* <div className={`dd-grid-overlay ${theme}`} /> */}
            <div className="ct-glow" aria-hidden="true" />

            {/* ══ HEADER BAR ══════════════════════════════════ */}
            <div className="ct-header-bar">
                <div className="ct-header-left">
                    <span className="ct-dot ct-dot-red" />
                    <span className="ct-dot ct-dot-yellow" />
                    <span className="ct-dot ct-dot-green" />
                    <span className="ct-file-name">new_project.jsx</span>
                </div>
                <div className="ct-header-right">
                    <span className="ct-badge" style={{ borderColor: `${accentColor}55`, color: accentColor }}>
                        <span className="ct-badge-dot" style={{ background: accentColor }} />
                        DeepDev Studio
                    </span>
                </div>
            </div>

            {/* ══ MAIN GRID ═══════════════════════════════════ */}
            <div className="ct-grid">

                {/* ── LEFT: info panel ─────────────────────── */}
                <motion.aside
                    className="ct-info"
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                >
                    <motion.h1 variants={fadeUp} className="ct-title">
                        <span>HABLEMOS</span>
                        <span className="ct-title-outline" style={{ WebkitTextStrokeColor: accentColor }}>
                            DE TU
                        </span>
                        <span>PROYECTO.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="ct-desc">
                        Desarrollo web full stack a medida.<br />
                        De la idea al deploy, sin intermediarios.
                    </motion.p>

                    {/* stats row */}
                    <motion.div variants={fadeUp} className="ct-stats">
                        {[
                            { n: "70+", label: "proyectos" },
                            { n: "99%", label: "uptime" },
                            { n: "24/7", label: "soporte" },
                        ].map(s => (
                            <div key={s.label} className="ct-stat">
                                <span className="ct-stat-n" style={{ color: accentColor }}>{s.n}</span>
                                <span className="ct-stat-l">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* divider */}
                    <motion.div variants={fadeUp} className="ct-divider" style={{ background: `linear-gradient(to right, ${accentColor}44, transparent)` }} />

                    {/* contact options */}
                    <motion.p variants={fadeUp} className="ct-contact-label">
                        O escribinos directo
                    </motion.p>

                    <motion.div variants={fadeUp} className="ct-wp-stack">
                        {[
                            { href: WP_ARG, label: "Argentina", sub: "Buenos Aires", flag: "🇦🇷" },
                            { href: WP_ESP, label: "España",    sub: "Madrid / Barcelona", flag: "🇪🇸" },
                        ].map(w => (
                            <a
                                key={w.label}
                                href={w.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ct-wp-row"
                            >
                                <span className="ct-wp-flag">{w.flag}</span>
                                <span className="ct-wp-info">
                                    <span className="ct-wp-country">{w.label}</span>
                                    <span className="ct-wp-sub">{w.sub}</span>
                                </span>
                                <span className="ct-wp-arrow" style={{ color: accentColor }}>WhatsApp →</span>
                            </a>
                        ))}
                    </motion.div>
                </motion.aside>

                {/* ── RIGHT: stepped form ──────────────────── */}
                <div className="ct-form-wrap">

                    {/* step progress */}
                    <div className="ct-steps">
                        {STEPS.map((s, i) => (
                            <div
                                key={s}
                                className={`ct-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                                style={i === step ? { borderColor: accentColor, color: accentColor } : {}}
                            >
                                <span className="ct-step-num"
                                    style={i <= step ? { background: accentColor } : {}}>
                                    {i < step ? "✓" : i + 1}
                                </span>
                                <span className="ct-step-label">{s}</span>
                            </div>
                        ))}
                        {/* progress line */}
                        <div className="ct-step-track">
                            <div
                                className="ct-step-fill"
                                style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, background: accentColor }}
                            />
                        </div>
                    </div>

                    {/* form */}
                    <form className="ct-form" onSubmit={handleSubmit} noValidate>
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div key="s0" className="ct-step-body"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                                    <h2 className="ct-step-title">¿Con quién hablamos?</h2>
                                    <div className="ct-row">
                                        <div className="ct-field">
                                            <label htmlFor="name">Nombre</label>
                                            <input id="name" type="text" value={form.name} onChange={set("name")} placeholder="Juan" required />
                                        </div>
                                        <div className="ct-field">
                                            <label htmlFor="lastName">Apellido</label>
                                            <input id="lastName" type="text" value={form.lastName} onChange={set("lastName")} placeholder="García" required />
                                        </div>
                                    </div>
                                    <div className="ct-row">
                                        <div className="ct-field">
                                            <label htmlFor="companyName">Empresa</label>
                                            <input id="companyName" type="text" value={form.companyName} onChange={set("companyName")} placeholder="Mi Empresa S.A." />
                                        </div>
                                        <div className="ct-field">
                                            <label htmlFor="contactRole">Cargo</label>
                                            <input id="contactRole" type="text" value={form.contactRole} onChange={set("contactRole")} placeholder="CEO / Fundador" />
                                        </div>
                                    </div>
                                    <div className="ct-row">
                                        <div className="ct-field">
                                            <label htmlFor="email">Email *</label>
                                            <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="hola@empresa.com" required />
                                        </div>
                                        <div className="ct-field">
                                            <label htmlFor="phone">Teléfono / WhatsApp *</label>
                                            <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+54 11 0000-0000" required />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div key="s1" className="ct-step-body"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                                    <h2 className="ct-step-title">¿Qué querés construir?</h2>
                                    <div className="ct-row">
                                        <div className="ct-field">
                                            <label htmlFor="projectOption">Tipo de trabajo *</label>
                                            <select id="projectOption" value={form.projectOption} onChange={set("projectOption")} required>
                                                <option value="" disabled>Seleccioná</option>
                                                {TIPO_TRABAJO.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="ct-field">
                                            <label htmlFor="typeOfWork">Tipo de Web / App *</label>
                                            <select id="typeOfWork" value={form.typeOfWork} onChange={set("typeOfWork")} required>
                                                <option value="" disabled>Seleccioná</option>
                                                {TIPO_WEB.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {form.projectOption === "Rediseño de sitio existente" && (
                                            <motion.div
                                                className="ct-field"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <label htmlFor="currentUrl">URL del sitio actual</label>
                                                <input id="currentUrl" type="text" value={form.currentUrl} onChange={set("currentUrl")} placeholder="https://tu-sitio.com" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="s2" className="ct-step-body"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                                    <h2 className="ct-step-title">Contanos más</h2>
                                    <div className="ct-field">
                                        <label htmlFor="projectGoal">Objetivo principal *</label>
                                        <select id="projectGoal" value={form.projectGoal} onChange={set("projectGoal")} required>
                                            <option value="" disabled>Seleccioná</option>
                                            {OBJETIVO.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div className="ct-row">
                                        <div className="ct-field">
                                            <label htmlFor="budgetRange">Presupuesto estimado *</label>
                                            <select id="budgetRange" value={form.budgetRange} onChange={set("budgetRange")} required>
                                                <option value="" disabled>Seleccioná</option>
                                                {PRESUPUESTO.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="ct-field">
                                            <label htmlFor="availableTime">Plazo disponible *</label>
                                            <select id="availableTime" value={form.availableTime} onChange={set("availableTime")} required>
                                                <option value="" disabled>Seleccioná</option>
                                                {DISPONIBILIDAD.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="s3" className="ct-step-body"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                                    <h2 className="ct-step-title">Describí tu proyecto</h2>
                                    <div className="ct-field">
                                        <label htmlFor="description">Contanos todo lo que necesites</label>
                                        <textarea
                                            id="description"
                                            value={form.description}
                                            onChange={set("description")}
                                            placeholder="Describí tu idea, qué funcionalidades necesitás, referencias de diseño, o cualquier detalle relevante..."
                                            required
                                        />
                                    </div>
                                    <p className="ct-final-note">
                                        Al enviar aceptás que nos pongamos en contacto con vos a la brevedad.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* nav buttons */}
                        <div className="ct-nav-btns">
                            {step > 0 && (
                                <button
                                    type="button"
                                    className="ct-btn-back"
                                    onClick={() => setStep(s => s - 1)}
                                >
                                    ← Atrás
                                </button>
                            )}
                            {step < STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    className="ct-btn-next"
                                    style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}55` }}
                                    onClick={() => canNext() && setStep(s => s + 1)}
                                    disabled={!canNext()}
                                >
                                    Siguiente →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="ct-btn-next ct-btn-submit"
                                    style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}55` }}
                                    onMouseEnter={() => setHoverParticles(true)}
                                    onMouseLeave={() => setHoverParticles(false)}
                                >
                                    ENVIAR CONSULTA ✦
                                </button>
                            )}
                        </div>
                        <ParticleButton active={hoverParticles} />
                    </form>
                </div>
            </div>
        </div>
        <TubesCursor />
        </>
    )
}

export default Contact