import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UseTheme } from "../../contexts/ThemeContext";
import "../../styles/raffleAdmin.css";

const ease = [0.22, 1, 0.36, 1] as const;

interface ActiveRaffle {
    _id: string; title: string; description: string;
    prize: string; drawDate: string; isActive: boolean; createdAt: string;
}
interface Entry {
    _id: string; fullName: string; email: string; phone: string;
    country: string; instagram: string; description: string; createdAt: string;
}

export default function RaffleAdmin() {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    const [raffles,  setRaffles]  = useState<ActiveRaffle[]>([]);
    const [entries,  setEntries]  = useState<Entry[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading,  setLoading]  = useState(false);
    const [msg,      setMsg]      = useState("");
    const [tab,      setTab]      = useState<"create"|"list">("list");

    // create form
    const [form, setForm] = useState({
        title: "", description: "", prize: "", drawDate: ""
    });

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    // load all raffles
    const loadRaffles = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/raffle/admin/all`,
                { withCredentials: true }
            );
            setRaffles(Array.isArray(data?.raffles) ? data.raffles : []);
        } catch(error) {
            console.error("Error sortéo", error)
            setRaffles([]);
        }
    };

    // load entries for selected raffle
    const loadEntries = async (id: string) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/raffle/admin/entries/${id}`,
                { withCredentials: true }
            );
            setEntries(Array.isArray(data?.entries) ? data.entries : []);
        } catch(error) {
            console.error("Error sortéo Load", error)
            setEntries([]);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadRaffles(); }, []);
    useEffect(() => { if (selected) loadEntries(selected); }, [selected]);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(""); setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/raffle/admin/create`,
                form, { withCredentials: true }
            );
            setMsg("✅ Sorteo creado correctamente.");
            setForm({ title:"", description:"", prize:"", drawDate:"" });
            loadRaffles();
            setTab("list");
        } catch (err: any) {
            setMsg("❌ " + (err?.response?.data?.message ?? "Error"));
        } finally { setLoading(false); }
    };

    const deactivate = async (id: string) => {
        if (!confirm("¿Desactivar este sorteo?")) return;
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/raffle/admin/${id}/deactivate`,
                {}, { withCredentials: true }
            );
            loadRaffles();
            if (selected === id) setSelected(null);
        } catch (error) {
            console.error("Error desactivando sorteo", error);
        }
    };

    const fmtDate = (d: string) => new Date(d).toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
        day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
    });

    return (
        <div className={`ra-page ${isDark ? "ra-dark" : "ra-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />

            <div className="ra-wrap">
                {/* header */}
                <div className="ra-header">
                    <div className="ra-terminal">
                        <span className="ra-dot ra-d-r"/><span className="ra-dot ra-d-y"/><span className="ra-dot ra-d-g"/>
                        <span className="ra-tfile">raffle_admin.jsx</span>
                    </div>
                    <h1 className="ra-title">
                        <span>Admin</span>
                        <span className="ra-title-out" style={{ WebkitTextStrokeColor: accent }}>Sorteos</span>
                    </h1>
                </div>

                {/* tabs */}
                <div className="ra-tabs">
                    {(["list","create"] as const).map(t => (
                        <button key={t} className={`ra-tab ${tab===t?"ra-tab-active":""}`}
                            style={tab===t ? { borderBottomColor: accent, color: accent } : {}}
                            onClick={() => setTab(t)}>
                            {t === "list" ? "📋 Sorteos" : "➕ Nuevo sorteo"}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── CREATE ── */}
                    {tab === "create" && (
                        <motion.form key="create" className="ra-form"
                            onSubmit={create}
                            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, y:-8 }} transition={{ duration:0.35, ease }}>

                            <h2 className="ra-section-title">Crear nuevo sorteo</h2>

                            {[
                                { k:"title",       label:"Título del sorteo *",      type:"text" },
                                { k:"prize",       label:"Premio *",                  type:"text" },
                                { k:"drawDate",    label:"Fecha del sorteo (ARG) *",  type:"datetime-local" },
                            ].map(f => (
                                <div key={f.k} className="ra-field">
                                    <label className="ra-label" style={{ color:`${accent}99` }}>{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={(form as any)[f.k]}
                                        onChange={set(f.k)}
                                        className={`ra-input ${isDark ? "ra-input-dark" : "ra-input-light"}`}
                                        required
                                    />
                                </div>
                            ))}

                            {["description"].map(k => (
                                <div key={k} className="ra-field">
                                    <label className="ra-label" style={{ color:`${accent}99` }}>Descripción *</label>
                                    <textarea
                                        value={(form as any)[k]}
                                        onChange={set(k)}
                                        rows={4}
                                        className={`ra-input ra-textarea ${isDark ? "ra-input-dark" : "ra-input-light"}`}
                                        required
                                    />
                                </div>
                            ))}

                            {msg && <p className={`ra-msg ${msg.startsWith("✅") ? "ra-ok" : "ra-err"}`}>{msg}</p>}

                            <button type="submit" className="ra-btn"
                                style={{ background:`linear-gradient(135deg,${accent},${accent}bb)` }}
                                disabled={loading}>
                                {loading ? <span className="ra-spinner"/> : "Crear sorteo →"}
                            </button>
                        </motion.form>
                    )}

                    {/* ── LIST ── */}
                    {tab === "list" && (
                        <motion.div key="list"
                            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, y:-8 }} transition={{ duration:0.35, ease }}>

                            <h2 className="ra-section-title">Todos los sorteos</h2>

                            {raffles.length === 0 && (
                                <p className="ra-empty">Sin sorteos aún.</p>
                            )}

                            <div className="ra-raffle-list">
                                {raffles.map(r => (
                                    <div key={r._id}
                                        className={`ra-raffle-card ${isDark ? "ra-card-dark" : "ra-card-light"} ${selected===r._id?"ra-card-sel":""}`}
                                        style={selected===r._id ? { borderColor:accent } : {}}>

                                        <div className="ra-card-head">
                                            <div>
                                                <span className={`ra-status ${r.isActive ? "ra-active" : "ra-inactive"}`}>
                                                    {r.isActive ? "● ACTIVO" : "○ INACTIVO"}
                                                </span>
                                                <h3 className="ra-card-title">{r.title}</h3>
                                                <p className="ra-card-meta">
                                                    🏆 {r.prize} &nbsp;·&nbsp; 📅 {fmtDate(r.drawDate)}
                                                </p>
                                            </div>
                                            <div className="ra-card-actions">
                                                <button className="ra-btn-sm"
                                                    style={{ borderColor:`${accent}55`, color:accent }}
                                                    onClick={() => setSelected(selected===r._id ? null : r._id)}>
                                                    {selected===r._id ? "Ocultar" : "Ver participantes"}
                                                </button>
                                                {r.isActive && (
                                                    <button className="ra-btn-sm ra-btn-danger"
                                                        onClick={() => deactivate(r._id)}>
                                                        Desactivar
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* entries panel */}
                                        <AnimatePresence>
                                            {selected === r._id && (
                                                <motion.div className="ra-entries"
                                                    initial={{ opacity:0, height:0 }}
                                                    animate={{ opacity:1, height:"auto" }}
                                                    exit={{ opacity:0, height:0 }}
                                                    transition={{ duration:0.35, ease }}>

                                                    <p className="ra-entries-count" style={{ color:accent }}>
                                                        {loading ? "Cargando..." : `${entries.length} participante${entries.length!==1?"s":""}`}
                                                    </p>

                                                    {entries.length > 0 && (
                                                        <div className="ra-table-wrap">
                                                            <table className="ra-table">
                                                                <thead>
                                                                    <tr>
                                                                        {["Nombre","Email","Teléfono","País","Instagram","Registrado"].map(h => (
                                                                            <th key={h} className="ra-th">{h}</th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {entries.map(e => (
                                                                        <tr key={e._id} className="ra-tr">
                                                                            <td className="ra-td">{e.fullName}</td>
                                                                            <td className="ra-td">{e.email}</td>
                                                                            <td className="ra-td">{e.phone}</td>
                                                                            <td className="ra-td">{e.country}</td>
                                                                            <td className="ra-td">{e.instagram || "—"}</td>
                                                                            <td className="ra-td ra-td-date">{fmtDate(e.createdAt)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}