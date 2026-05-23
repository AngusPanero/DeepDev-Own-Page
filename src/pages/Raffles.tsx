import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/raffleInfo.css";
import { UseLanguage } from "../contexts/LanguageContext";
import { UseTheme } from "../contexts/ThemeContext";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Types ─────────────────────────────────────────────────────
interface ActiveRaffle {
    _id: string;
    title: string;
    description: string;
    prize: string;
    drawDate: string;
    isActive: boolean;
}

// ── Confetti ─────────────────────────────────────────────────
function Confetti({ accent }: { accent: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        const colors = [accent, "#a855f7", "#fff", "#e879f9", "#c4b5fd", "#38bdf8"];
        const pieces = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 7 + 3,
            d: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltSpeed: Math.random() * 0.1 + 0.05,
        }));
        let raf = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
                ctx.stroke();
                p.y += p.d;
                p.tiltAngle += p.tiltSpeed;
                p.tilt = Math.sin(p.tiltAngle) * 12;
                if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        const t = setTimeout(() => cancelAnimationFrame(raf), 5000);
        return () => { cancelAnimationFrame(raf); clearTimeout(t); };
    }, [accent]);
    return <canvas ref={canvasRef} className="rp-confetti" aria-hidden="true" />;
}

// ── Countdown ─────────────────────────────────────────────────
function useCountdown(drawDate: string) {
    const calc = () => {
        const diff = new Date(drawDate).getTime() - Date.now();
        if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0, done:true };
        return {
            days:    Math.floor(diff / 86400000),
            hours:   Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000)  / 60000),
            seconds: Math.floor((diff % 60000)    / 1000),
            done:    false,
        };
    };
    const [t, setT] = useState(calc);
    useEffect(() => {
        const i = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(i);
    }, [drawDate]);
    return t;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="rp-cd-box">
            <motion.span
                key={value}
                className="rp-cd-num"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease }}
            >
                {String(value).padStart(2, "0")}
            </motion.span>
            <span className="rp-cd-label">{label}</span>
        </div>
    );
}

// ── Form ──────────────────────────────────────────────────────
interface FormData {
    fullName: string; email: string; phone: string;
    country: string; instagram: string; description: string;
}

const INITIAL: FormData = { fullName:"", email:"", phone:"", country:"", instagram:"", description:"" };

interface FieldProps {
    k: keyof FormData;
    placeholder: string;
    type?: string;
    form: FormData;
    set: (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    loading: boolean;
    isDark: boolean;
}

// Movido afuera para evitar re-creaciones de componente y pérdida de focus
function Field({ k, placeholder, type = "text", form, set, loading, isDark }: FieldProps) {
    return (
        <div className="rp-field">
            <input
                type={type}
                value={form[k]}
                onChange={set(k)}
                placeholder={placeholder}
                className={`rp-input ${isDark ? "rp-input-dark" : "rp-input-light"}`}
                disabled={loading}
                required={k !== "instagram"}
            />
        </div>
    );
}

function RaffleForm({ raffleId, accent, isDark, onSuccess }: {
    raffleId: string; accent: string; isDark: boolean; onSuccess: () => void;
}) {
    const [form, setForm]     = useState<FormData>(INITIAL);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");

    const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/raffle/enter`, { ...form, raffleId });
            onSuccess();
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Error al registrarse.");
        } finally { setLoading(false); }
    };

    return (
        <motion.form
            className="rp-form"
            onSubmit={submit}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease }}
        >
            <div className="rp-form-grid">
                <Field k="fullName"    placeholder="Nombre completo *" form={form} set={set} loading={loading} isDark={isDark} />
                <Field k="email"       placeholder="Email *" type="email" form={form} set={set} loading={loading} isDark={isDark} />
                <Field k="phone"       placeholder="Teléfono *" form={form} set={set} loading={loading} isDark={isDark} />
                <Field k="country"     placeholder="País *" form={form} set={set} loading={loading} isDark={isDark} />
                <Field k="instagram"   placeholder="@instagram (opcional)" form={form} set={set} loading={loading} isDark={isDark} />
            </div>

            <div className="rp-field">
                <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="¿Por qué querés ganar este sorteo? *"
                    className={`rp-input rp-textarea ${isDark ? "rp-input-dark" : "rp-input-light"}`}
                    rows={3} disabled={loading} required
                />
            </div>

            {error && (
                <motion.p className="rp-error"
                    initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}>
                    ⚠ {error}
                </motion.p>
            )}

            <button
                type="submit"
                className="rp-btn"
                disabled={loading}
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
            >
                {loading ? <span className="rp-spinner" /> : "Participar →"}
            </button>
            <span style={{ color: accent, fontFamily: "Montserrat" }}>* Al inscribirte estás aceptando las <a href="/raffle-terms" target="_blank"><strong>Bases y Condiciones</strong></a> del sorteo</span> 
        </motion.form>
    );
}

// ── Main ──────────────────────────────────────────────────────
export default function RafflePage() {
    const { theme }          = UseTheme();
    const { language, texts } = UseLanguage();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    const [raffle,   setRaffle]   = useState<ActiveRaffle | null | undefined>(undefined);
    const [success,  setSuccess]  = useState(false);
    const [showConf, setShowConf] = useState(false);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/raffle/active`)
            .then(r => setRaffle(r.data?.raffle ?? null))
            .catch(() => setRaffle(null));
    }, []);

    const countdown = useCountdown(raffle?.drawDate ?? "");

    const handleSuccess = () => {
        setSuccess(true);
        setShowConf(true);
        setTimeout(() => setShowConf(false), 5000);
    };

    // loading
    if (raffle === undefined) return (
        <div className={`rp-page ${isDark ? "rp-dark" : "rp-light"}`}>
            <div className="rp-loader">
                <span className="rp-spin" style={{ borderTopColor: accent }} />
            </div>
        </div>
    );

    // no active raffle
    if (!raffle) return (
        <div className={`rp-page ${isDark ? "rp-dark" : "rp-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />
            <motion.div className="rp-empty"
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.6, ease }}>
                <span className="rp-empty-icon" style={{ color: accent }}>◈</span>
                <h2 className="rp-empty-title">No hay sorteos activos</h2>
                <p className="rp-empty-sub">Seguí nuestras redes para enterarte del próximo.</p>
            </motion.div>
        </div>
    );

    // format draw date for display (Argentina time)
    const drawLocal = new Date(raffle.drawDate).toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div className={`rp-page ${isDark ? "rp-dark" : "rp-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />
            {showConf && <Confetti accent={accent} />}

            <motion.div className="rp-inner"
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ duration:0.5 }}>

                {/* terminal dots */}
                <div className="rp-terminal">
                    <span className="rp-dot rp-d-r"/><span className="rp-dot rp-d-y"/><span className="rp-dot rp-d-g"/>
                    <span className="rp-tfile">sorteo.jsx</span>
                </div>

                {/* badge */}
                <div className="rp-badge" style={{ background:`${accent}22`, color:accent, borderColor:`${accent}55` }}>
                    <span className="rp-badge-dot" style={{ background:accent }} />
                    SORTEO ACTIVO
                </div>

                {/* title */}
                <motion.h1 className="rp-heading"
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.6, delay:0.1, ease }}>
                    {raffle.title}
                </motion.h1>

                {/* prize */}
                <motion.div className="rp-prize"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.5, delay:0.15, ease }}
                    style={{ borderColor:`${accent}33`, background:`${accent}0d` }}>
                    <span className="rp-prize-label" style={{ color:accent }}>🏆 Premio</span>
                    <span className="rp-prize-text">{raffle.prize}</span>
                </motion.div>

                {/* description */}
                <motion.p className="rp-desc"
                    initial={{ opacity:0 }} animate={{ opacity:1 }}
                    transition={{ duration:0.5, delay:0.2 }}>
                    {raffle.description}
                </motion.p>

                {/* draw date */}
                <p className="rp-draw-date">
                    <span style={{ color: accent }}>📅</span> Sorteo el {drawLocal} (ARG)
                </p>

                {/* divider */}
                <div className="rp-divider"
                    style={{ background:`linear-gradient(to right,${accent}55,transparent)` }} />

                {/* countdown */}
                {!countdown.done && (
                    <motion.div className="rp-countdown"
                        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.5, delay:0.25, ease }}>
                        <p className="rp-cd-title">Tiempo restante</p>
                        <div className="rp-cd-wrap">
                            <CountdownBox value={countdown.days}    label={texts[language].raffles.days} />
                            <span className="rp-cd-sep">:</span>
                            <CountdownBox value={countdown.hours}   label={texts[language].raffles.hours} />
                            <span className="rp-cd-sep">:</span>
                            <CountdownBox value={countdown.minutes} label={texts[language].raffles.minutes} />
                            <span className="rp-cd-sep">:</span>
                            <CountdownBox value={countdown.seconds} label={texts[language].raffles.seconds} />
                        </div>
                    </motion.div>
                )}

                {/* success or form */}
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div key="success" className="rp-success"
                            initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                            exit={{ opacity:0 }} transition={{ duration:0.4, ease }}
                            style={{ borderColor:`${accent}44`, background:`${accent}0d` }}>
                            {/* <span className="rp-success-icon">🎉</span> */}
                            <h3 className="rp-success-title" style={{ color:accent }}>¡Registrado!</h3>
                            <p className="rp-success-sub">Ya estás participando del sorteo. ¡Buena suerte!</p>
                        </motion.div>
                    ) : (
                        <motion.div key="form">
                            <p className="rp-form-heading">Completá tus datos para participar</p>
                            <RaffleForm
                                raffleId={raffle._id}
                                accent={accent}
                                isDark={isDark}
                                onSuccess={handleSuccess}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}