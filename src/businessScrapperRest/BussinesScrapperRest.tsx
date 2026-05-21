/// <reference types="google.maps" />
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./businessScrapperRest.css";
import { UseTheme } from "../contexts/ThemeContext";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface BusinessData {
    id: string; name: string; address: string;
    phone: string | null; email: string | null;
    website: string | null; hasWebsite: boolean;
    rating: number | null; reviewCount: number | null;
    hours: string | null; types: string[];
    googleMapsUrl: string; lat: number; lng: number;
}
type FilterType = "all" | "email" | "phone" | "web" | "noweb";
interface BulkResult { sent: number; failed: number; errors: string[]; }
interface Props { googleApiKey: string; emailScraperEndpoint?: string; maxResults?: number; }

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? "";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google?.maps?.places) { resolve(); return; }
        const existing = document.getElementById("gmap-script");
        if (existing) { existing.addEventListener("load", () => resolve()); return; }
        const s = document.createElement("script");
        s.id = "gmap-script";
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        s.async = true; s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("No se pudo cargar Google Maps"));
        document.head.appendChild(s);
    });
}

function formatHours(periods: google.maps.places.PlaceOpeningHoursPeriod[] | undefined): string | null {
    if (!periods?.length) return null;
    const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
    return periods.slice(0,3).map(p => {
        const o = p.open  ? `${String(p.open.hours).padStart(2,"0")}:${String(p.open.minutes).padStart(2,"0")}` : "00:00";
        const c = p.close ? `${String(p.close.hours).padStart(2,"0")}:${String(p.close.minutes).padStart(2,"0")}` : "00:00";
        return `${p.open ? days[p.open.day] : ""} ${o}–${c}`;
    }).join(" · ") + (periods.length > 3 ? " …" : "");
}

function exportToCSV(data: BusinessData[], filename = "negocios.csv") {
    const h = ["Nombre","Dirección","Teléfono","Email","Sitio Web","Tiene Web","Rating","Reseñas","Horarios","Google Maps"];
    const rows = data.map(b =>
        [b.name,b.address,b.phone??"",b.email??"",b.website??"",b.hasWebsite?"Sí":"No",
         b.rating?.toString()??"",b.reviewCount?.toString()??"",b.hours??"",b.googleMapsUrl]
        .map(v=>`"${v.replace(/"/g,'""')}"`).join(",")
    );
    const csv = "\uFEFF" + [h.join(","),...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    Object.assign(document.createElement("a"),{href:url,download:filename}).click();
    URL.revokeObjectURL(url);
}

function fmtBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024*1024) return `${(b/1024).toFixed(1)} KB`;
    return `${(b/1024/1024).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
    return (
        <div className="bs-stat">
            <span className="bs-stat-n" style={{ color: accent }}>{value}</span>
            <span className="bs-stat-l">{label}</span>
        </div>
    );
}

// ─────────────────────────────────────────────
// BUSINESS CARD
// ─────────────────────────────────────────────
function BusinessCard({ biz, accent }: { biz: BusinessData; accent: string }) {
    const [open, setOpen] = useState(false);
    const stars = Math.round(biz.rating ?? 0);
    return (
        <div className="bs-biz">
            <div className="bs-biz-head">
                <div className="bs-biz-info">
                    <span className="bs-biz-name">{biz.name}</span>
                    {biz.address && (
                        <span className="bs-biz-addr">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {biz.address}
                        </span>
                    )}
                </div>
                <div className="bs-biz-meta">
                    {biz.rating && (
                        <span className="bs-rating">
                            <span style={{ color:"#f59e0b",fontSize:"0.72rem" }}>{"★".repeat(stars)}{"☆".repeat(5-stars)}</span>
                            <span className="bs-rating-n">{biz.rating.toFixed(1)}{biz.reviewCount?` (${biz.reviewCount.toLocaleString()})`:""}</span>
                        </span>
                    )}
                    <a href={biz.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                       className="bs-mapslink" style={{ color: accent }}>Maps →</a>
                </div>
            </div>

            <div className="bs-badges">
                {biz.phone    && <span className="bs-badge bs-badge-ph">📞 {biz.phone}</span>}
                {biz.email    && <span className="bs-badge bs-badge-em">✉ {biz.email}</span>}
                {biz.hasWebsite
                    ? <span className="bs-badge bs-badge-web">✓ Tiene web</span>
                    : <span className="bs-badge" style={{ color:accent, borderColor:`${accent}44`, background:`${accent}0d` }}>✗ Sin web</span>}
                {biz.hours && <span className="bs-badge bs-badge-hrs">🕐 {biz.hours}</span>}
            </div>

            {biz.website && (
                <a href={biz.website} target="_blank" rel="noopener noreferrer"
                   className="bs-weblink" style={{ color: accent }}>
                    🌐 {biz.website.replace(/^https?:\/\//,"").split("/")[0]}
                </a>
            )}

            {biz.types.length > 0 && (
                <>
                    <button className="bs-expandbtn" onClick={() => setOpen(o => !o)}>
                        {open ? "▲ Ocultar" : `▼ Categorías (${biz.types.length})`}
                    </button>
                    {open && (
                        <div className="bs-types">
                            {biz.types.map(t => <span key={t} className="bs-type">{t.replace(/_/g," ")}</span>)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// BULK MODAL — with file attachments
// ─────────────────────────────────────────────
interface BulkModalProps {
    emails: string[]; isDark: boolean; accent: string;
    onClose: () => void;
    onSend: (subject: string, message: string, files: File[], testMode?: boolean, testEmail?: string) => Promise<void>;
    sending: boolean; bulkResult: BulkResult | null; bulkProgress: string;
}

function BulkModal({ emails, isDark, accent, onClose, onSend, sending, bulkResult, bulkProgress }: BulkModalProps) {
    const [subject,   setSubject]   = useState("Job Aplication");
    const [message,   setMessage]   = useState("");
    const [testEmail, setTestEmail] = useState(ADMIN_EMAIL);
    const [files,     setFiles]     = useState<File[]>([]);
    const [dzOver,    setDzOver]    = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const addFiles = (fl: FileList | null) => {
        if (!fl) return;
        setFiles(p => [...p, ...Array.from(fl)]);
    };
    const removeFile = (i: number) => setFiles(p => p.filter((_,j) => j !== i));
    const totalSize = files.reduce((s,f) => s+f.size, 0);

    return (
        <div className="bs-overlay" onClick={e => e.target === e.currentTarget && !sending && onClose()}>
            <div className={`bs-modal ${isDark ? "bs-modal-dark" : "bs-modal-light"}`}>

                {/* ── modal header ── */}
                <div className="bs-mhead">
                    <div className="bs-mterm">
                        <span className="bs-mdot bs-mdot-r"/>
                        <span className="bs-mdot bs-mdot-y"/>
                        <span className="bs-mdot bs-mdot-g"/>
                        <span className="bs-mfile">bulk_campaign.jsx</span>
                    </div>
                    {!sending && <button className="bs-mx" onClick={onClose}>✕</button>}
                </div>

                <div className="bs-mtitle-wrap">
                    <h2 className="bs-mtitle">
                        CAMPAÑA <span style={{ color: accent }}>EMAIL</span>
                    </h2>
                    <p className="bs-msub">{emails.length} destinatarios · {files.length > 0 ? `${files.length} adjunto${files.length>1?"s":""} (${fmtBytes(totalSize)})` : "sin adjuntos"}</p>
                </div>

                {!bulkResult ? (
                    <>
                        <div className="bs-mbody">

                            {/* asunto */}
                            <div className="bs-mfield">
                                <label className="bs-mlabel" style={{ color: accent }}>ASUNTO</label>
                                <input className="bs-minput" value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    disabled={sending} placeholder="Asunto del email..." />
                            </div>

                            {/* mensaje */}
                            <div className="bs-mfield">
                                <label className="bs-mlabel" style={{ color: accent }}>MENSAJE INTRODUCTORIO</label>
                                <textarea className="bs-mtextarea" value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    disabled={sending} rows={3}
                                    placeholder="Texto introductorio antes del HTML de presentación..." />
                            </div>

                            {/* adjuntos */}
                            <div className="bs-mfield">
                                <label className="bs-mlabel" style={{ color: accent }}>
                                    ADJUNTOS
                                    {files.length > 0 && (
                                        <span className="bs-attach-info"> — {files.length} archivo{files.length>1?"s":""} · {fmtBytes(totalSize)}</span>
                                    )}
                                </label>

                                <div
                                    className={`bs-dropzone ${dzOver ? "bs-dz-over" : ""}`}
                                    style={{ borderColor: dzOver ? accent : `${accent}44` }}
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDzOver(true); }}
                                    onDragLeave={() => setDzOver(false)}
                                    onDrop={e => { e.preventDefault(); setDzOver(false); addFiles(e.dataTransfer.files); }}
                                >
                                    <span className="bs-dz-icon" style={{ color: accent }}>📎</span>
                                    <span className="bs-dz-text">Arrastrá archivos o <u>hacé click</u></span>
                                    <span className="bs-dz-hint">PDF, DOC, imágenes — múltiples permitidos</span>
                                    <input ref={fileRef} type="file" multiple hidden
                                        onChange={e => addFiles(e.target.files)} />
                                </div>

                                {files.length > 0 && (
                                    <div className="bs-attach-list">
                                        {files.map((f, i) => (
                                            <div key={i} className="bs-attach-item">
                                                <span className="bs-attach-icon">📄</span>
                                                <span className="bs-attach-name">{f.name}</span>
                                                <span className="bs-attach-size">{fmtBytes(f.size)}</span>
                                                <button className="bs-attach-rm"
                                                    onClick={() => removeFile(i)}
                                                    disabled={sending}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* prueba */}
                            <div className="bs-test-block" style={{ borderLeftColor: accent }}>
                                <label className="bs-mlabel" style={{ color: accent }}>
                                    🧪 MODO PRUEBA — enviá solo a tu email primero
                                </label>
                                <div className="bs-test-row">
                                    <input className="bs-minput" type="email" value={testEmail}
                                        onChange={e => setTestEmail(e.target.value)}
                                        disabled={sending} placeholder="tu@email.com" style={{ flex:1 }} />
                                    <button className="bs-btn-test"
                                        style={{ borderColor: accent, color: accent }}
                                        onClick={() => onSend(subject, message, files, true, testEmail.trim())}
                                        disabled={sending || !subject.trim() || !testEmail.trim()}>
                                        {sending ? "…" : "ENVIAR PRUEBA →"}
                                    </button>
                                </div>
                                <p className="bs-test-note">No toca la lista de {emails.length} destinatarios.</p>
                            </div>

                            {/* destinatarios */}
                            <div className="bs-mfield">
                                <label className="bs-mlabel" style={{ color: accent }}>DESTINATARIOS ({emails.length})</label>
                                <div className="bs-recip-list">
                                    {emails.map(e => <span key={e} className="bs-recip-tag">{e}</span>)}
                                </div>
                            </div>

                            {sending && (
                                <div className="bs-progress" style={{ marginTop:16 }}>
                                    <span className="bs-spinner" style={{ borderTopColor: accent }}/>
                                    {bulkProgress}
                                </div>
                            )}
                        </div>

                        <div className="bs-mfooter">
                            <button className="bs-btn-cancel" onClick={onClose} disabled={sending}>CANCELAR</button>
                            <button className="bs-btn-send" style={{ background: accent }}
                                onClick={() => onSend(subject, message, files, false)}
                                disabled={sending || !subject.trim()}>
                                {sending ? "ENVIANDO…" : `ENVIAR A ${emails.length} CONTACTOS →`}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bs-result-wrap">
                        <div className="bs-result-grid">
                            <div className="bs-result-item bs-ok">
                                <span className="bs-result-n">{bulkResult.sent}</span>
                                <span className="bs-result-l">ENVIADOS</span>
                            </div>
                            <div className="bs-result-item bs-err">
                                <span className="bs-result-n">{bulkResult.failed}</span>
                                <span className="bs-result-l">FALLIDOS</span>
                            </div>
                        </div>
                        {bulkResult.errors.length > 0 && (
                            <div className="bs-err-list">
                                {bulkResult.errors.map((e,i) => <p key={i} className="bs-err-item">{e}</p>)}
                            </div>
                        )}
                        <button className="bs-btn-send" style={{ background:accent, marginTop:20 }} onClick={onClose}>
                            CERRAR →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function BusinessScraperRest({ googleApiKey, emailScraperEndpoint, maxResults = 60 }: Props) {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const accent = isDark ? "#8e2de2" : "#0062FF";

    const [category,      setCategory]      = useState("");
    const [location,      setLocation]      = useState("");
    const [results,       setResults]       = useState<BusinessData[]>([]);
    const [loading,       setLoading]       = useState(false);
    const [progress,      setProgress]      = useState("");
    const [error,         setError]         = useState<string | null>(null);
    const [filter,        setFilter]        = useState<FilterType>("all");
    const [mapsReady,     setMapsReady]     = useState(false);
    const [showModal,     setShowModal]     = useState(false);
    const [bulkSending,   setBulkSending]   = useState(false);
    const [bulkProgress,  setBulkProgress]  = useState("");
    const [bulkResult,    setBulkResult]    = useState<BulkResult | null>(null);

    const serviceRef = useRef<google.maps.places.PlacesService | null>(null);
    const mapDivRef  = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadGoogleMapsScript(googleApiKey)
            .then(() => setMapsReady(true))
            .catch(e => setError(e.message));
    }, [googleApiKey]);

    useEffect(() => {
        if (mapsReady && mapDivRef.current) {
            const map = new window.google.maps.Map(mapDivRef.current, { center:{lat:-34.6,lng:-58.4}, zoom:12 });
            serviceRef.current = new window.google.maps.places.PlacesService(map);
        }
    }, [mapsReady]);

    const fetchEmail = useCallback(async (url: string): Promise<string | null> => {
        if (!emailScraperEndpoint) return null;
        try {
            const { data } = await axios.post(emailScraperEndpoint, { url }, { withCredentials:true });
            return data.email ?? null;
        } catch { return null; }
    }, [emailScraperEndpoint]);

    const getPlaceDetails = useCallback((placeId: string): Promise<google.maps.places.PlaceResult> => {
        return new Promise((resolve, reject) => {
            if (!serviceRef.current) return reject(new Error("Places service no inicializado"));
            serviceRef.current.getDetails(
                { placeId, fields:["place_id","name","formatted_address","formatted_phone_number","website","rating","user_ratings_total","opening_hours","types","url","geometry"] },
                (result:any, status:any) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && result) resolve(result);
                    else reject(new Error(`PlacesService error: ${status}`));
                }
            );
        });
    }, []);

    const searchPlaces = useCallback((query: string): Promise<google.maps.places.PlaceResult[]> => {
        return new Promise((resolve, reject) => {
            if (!serviceRef.current) return reject(new Error("Places service no inicializado"));
            const all: google.maps.places.PlaceResult[] = [];
            const handle = (res:any, status:any, pagination:any) => {
                if (status !== window.google.maps.places.PlacesServiceStatus.OK || !res) {
                    if (all.length > 0) resolve(all); else reject(new Error(`Sin resultados: ${status}`)); return;
                }
                all.push(...res);
                if (all.length < maxResults && pagination?.hasNextPage) setTimeout(() => pagination.nextPage(), 2000);
                else resolve(all.slice(0, maxResults));
            };
            serviceRef.current.textSearch({ query }, handle);
        });
    }, [maxResults]);

    const handleSearch = async () => {
        if (!category.trim() || !location.trim()) { setError("Completá el rubro y la zona."); return; }
        if (!serviceRef.current) { setError("Google Maps aún no está listo."); return; }
        setLoading(true); setError(null); setResults([]); setFilter("all");
        const zonas = location.split(",").map(z => z.trim()).filter(Boolean);
        const seen = new Set<string>();
        const all: BusinessData[] = [];
        try {
            for (let zi = 0; zi < zonas.length; zi++) {
                const zona = zonas[zi];
                setProgress(`Buscando "${category}" en ${zona}...`);
                let places: google.maps.places.PlaceResult[] = [];
                try { places = await searchPlaces(`${category.trim()} en ${zona}`); } catch { continue; }
                setProgress(`Procesando ${places.length} resultados de ${zona}...`);
                for (let i = 0; i < places.length; i++) {
                    const p = places[i];
                    if (!p.place_id || seen.has(p.place_id)) continue;
                    seen.add(p.place_id);
                    setProgress(`[${zona}] ${i+1}/${places.length}: ${p.name}`);
                    try {
                        const d = await getPlaceDetails(p.place_id);
                        const em = d.website && emailScraperEndpoint ? await fetchEmail(d.website) : null;
                        all.push({
                            id: d.place_id ?? p.place_id!, name: d.name ?? "Sin nombre",
                            address: d.formatted_address ?? "", phone: d.formatted_phone_number ?? null,
                            email: em, website: d.website ?? null, hasWebsite: !!d.website,
                            rating: d.rating ?? null, reviewCount: d.user_ratings_total ?? null,
                            hours: formatHours(d.opening_hours?.periods), types: d.types ?? [],
                            googleMapsUrl: d.url ?? `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
                            lat: d.geometry?.location?.lat() ?? 0, lng: d.geometry?.location?.lng() ?? 0,
                        });
                        setResults([...all]);
                    } catch { continue; }
                    await new Promise(r => setTimeout(r, 200));
                }
                if (zi < zonas.length-1) {
                    setProgress(`Zona ${zi+1}/${zonas.length} completa. Siguiente en 1s...`);
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        } catch (e:unknown) { setError(e instanceof Error ? e.message : "Error inesperado"); }
        finally { setLoading(false); setProgress(""); }
    };

    const handleBulkSend = async (subject: string, message: string, files: File[], testMode = false, testEmail?: string) => {
        const buildFormData = (email: string) => {
            const fd = new FormData();
            fd.append("email", email);
            fd.append("subject", subject);
            fd.append("message", message);
            files.forEach(f => fd.append("attachments", f));
            return fd;
        };

        if (testMode && testEmail) {
            setBulkSending(true); setBulkResult(null);
            setBulkProgress(`Enviando prueba a ${testEmail}...`);
            const result: BulkResult = { sent:0, failed:0, errors:[] };
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/rest/send-bulk-email`,
                    buildFormData(testEmail), { withCredentials:true });
                result.sent = 1;
            } catch (err:any) {
                result.failed = 1;
                result.errors.push(`${testEmail}: ${err?.response?.data?.message ?? err.message}`);
            }
            setBulkSending(false); setBulkResult(result); return;
        }

        const emails = filtered.filter(b => b.email).map(b => b.email as string);
        if (!emails.length) return;
        setBulkSending(true); setBulkResult(null);
        const result: BulkResult = { sent:0, failed:0, errors:[] };
        const BATCH = 5, DELAY = 2000;
        for (let i = 0; i < emails.length; i += BATCH) {
            const batch = emails.slice(i, i+BATCH);
            setBulkProgress(`Enviando ${i+1}–${Math.min(i+BATCH, emails.length)} de ${emails.length}...`);
            await Promise.all(batch.map(async email => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/rest/send-bulk-email`,
                        buildFormData(email), { withCredentials:true });
                    result.sent++;
                } catch (err:any) {
                    result.failed++;
                    result.errors.push(`${email}: ${err?.response?.data?.message ?? err.message}`);
                }
            }));
            if (i+BATCH < emails.length) await new Promise(r => setTimeout(r, DELAY));
        }
        setBulkSending(false); setBulkResult(result);
    };

    const filtered = results.filter(b => {
        if (filter==="email") return !!b.email;
        if (filter==="phone") return !!b.phone;
        if (filter==="web")   return b.hasWebsite;
        if (filter==="noweb") return !b.hasWebsite;
        return true;
    });
    const emailsInView = filtered.filter(b => b.email).map(b => b.email as string);
    const stats = {
        total: results.length,
        phone: results.filter(b => b.phone).length,
        email: results.filter(b => b.email).length,
        web:   results.filter(b => b.hasWebsite).length,
    };
    const zonaCount = location.split(",").filter(z => z.trim()).length;
    const FILTER_LABELS: Record<FilterType, string> = {
        all:   `TODOS (${stats.total})`,
        phone: `TELÉFONO (${stats.phone})`,
        email: `EMAIL (${stats.email})`,
        web:   `CON WEB (${stats.web})`,
        noweb: `SIN WEB (${stats.total - stats.web})`,
    };

    return (
        <div className={`bs-root ${isDark ? "bs-dark" : "bs-light"}`}>
            <div ref={mapDivRef} style={{ display:"none" }} />

            {showModal && (
                <BulkModal
                    emails={emailsInView} isDark={isDark} accent={accent}
                    onClose={() => { setShowModal(false); setBulkResult(null); }}
                    onSend={handleBulkSend}
                    sending={bulkSending} bulkResult={bulkResult} bulkProgress={bulkProgress}
                />
            )}

            {/* ── PAGE HEADER ── */}
            <header className="bs-page-header">
                <div className="bs-header-term">
                    <span className="bs-hdot bs-hdot-r"/>
                    <span className="bs-hdot bs-hdot-y"/>
                    <span className="bs-hdot bs-hdot-g"/>
                    <span className="bs-hfile">business_scraper.jsx</span>
                </div>
                <div className="bs-header-content">
                    <div className="bs-wordmark">
                        <span className="bs-wm-deep">Deep</span>
                        <span className="bs-wm-dev" style={{ color: accent }}>Dev</span>
                        <span className="bs-wm-tool">/ Prospección</span>
                    </div>
                    <h1 className="bs-page-title">
                        Buscador de <span style={{ color: accent }}>Restaurantes</span>
                    </h1>
                    <p className="bs-page-sub">
                        Extraé contactos de negocios usando Google Maps Places API
                    </p>
                </div>
                <div className="bs-header-tag">
                    <span className="bs-tag-dot" style={{ background: accent }}/>
                    {mapsReady ? "Maps conectado" : "Cargando Maps..."}
                </div>
            </header>

            {/* ── SEARCH SECTION ── */}
            <section className="bs-search-section">
                <div className="bs-search-card">
                    <div className="bs-search-row">
                        {/* rubro */}
                        <div className="bs-sfield">
                            <label className="bs-slabel" style={{ color: accent }}>Rubro / Categoría</label>
                            <input className="bs-sinput"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                placeholder="restaurantes, dentistas, ferreterías..."
                                disabled={loading}
                            />
                        </div>
                        {/* zona */}
                        <div className="bs-sfield">
                            <label className="bs-slabel" style={{ color: accent }}>
                                Zona / Ciudad
                                {zonaCount > 1 && <span className="bs-zona-badge" style={{ background:`${accent}22`, color:accent }}>{zonaCount} zonas</span>}
                            </label>
                            <input className="bs-sinput"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                placeholder="Palermo, Belgrano, Caballito"
                                disabled={loading}
                            />
                            <span className="bs-shint">Separá múltiples zonas con coma</span>
                        </div>
                        {/* botón */}
                        <div className="bs-sfield bs-sfield-btn">
                            <button className="bs-sbtn"
                                style={{ background: accent, boxShadow:`0 0 20px ${accent}44` }}
                                onClick={handleSearch}
                                disabled={loading || !mapsReady}>
                                {loading ? (
                                    <><span className="bs-spinner" style={{ borderTopColor:"#fff" }}/> BUSCANDO…</>
                                ) : "BUSCAR →"}
                            </button>
                        </div>
                    </div>

                    {progress && (
                        <div className="bs-progress">
                            <span className="bs-spinner" style={{ borderTopColor: accent }}/>
                            <span>{progress}</span>
                        </div>
                    )}
                    {error && <div className="bs-error-bar" style={{ borderLeftColor: accent }}>⚠ {error}</div>}
                    {!emailScraperEndpoint && (
                        <p className="bs-hint-note">
                            💡 Para extraer emails conectá un backend con <code>emailScraperEndpoint</code>
                        </p>
                    )}
                </div>
            </section>

            {/* ── STATS ── */}
            {results.length > 0 && (
                <section className="bs-stats-section">
                    <StatCard label="TOTAL"    value={stats.total}            accent={accent} />
                    <StatCard label="TELÉFONO" value={stats.phone}            accent={accent} />
                    <StatCard label="EMAIL"    value={stats.email}            accent={accent} />
                    <StatCard label="CON WEB"  value={stats.web}              accent={accent} />
                    <StatCard label="SIN WEB"  value={stats.total - stats.web} accent={accent} />
                </section>
            )}

            {/* ── RESULTS ── */}
            {results.length > 0 && (
                <section className="bs-results-section">
                    {/* toolbar */}
                    <div className="bs-toolbar">
                        <div className="bs-filters">
                            {(["all","phone","email","web","noweb"] as FilterType[]).map(f => (
                                <button
                                    key={f}
                                    className={`bs-fbtn ${filter===f?"bs-fbtn-active":""}`}
                                    style={filter===f ? { background:accent, borderColor:accent } : {}}
                                    onClick={() => setFilter(f)}
                                >
                                    {FILTER_LABELS[f]}
                                </button>
                            ))}
                        </div>
                        <div className="bs-tactions">
                            {emailsInView.length > 0 && (
                                <button className="bs-btn-bulk"
                                    style={{ borderColor:`${accent}66`, color: accent }}
                                    onClick={() => { setBulkResult(null); setShowModal(true); }}>
                                    ✉ CAMPAÑA ({emailsInView.length})
                                </button>
                            )}
                            <button className="bs-btn-csv"
                                onClick={() => exportToCSV(filtered, `${category}-${location}.csv`)}>
                                ⬇ CSV ({filtered.length})
                            </button>
                        </div>
                    </div>

                    {/* list */}
                    <div className="bs-list">
                        {filtered.length === 0
                            ? <div className="bs-empty-list">SIN_RESULTADOS_PARA_ESTE_FILTRO</div>
                            : filtered.map(b => <BusinessCard key={b.id} biz={b} accent={accent} />)
                        }
                    </div>
                </section>
            )}

            {/* ── EMPTY STATE ── */}
            {!loading && results.length === 0 && !error && (
                <div className="bs-empty">
                    <span className="bs-empty-icon" style={{ color: accent }}>◈</span>
                    <span className="bs-empty-title">Ingresá un rubro y zona para empezar</span>
                    <span className="bs-empty-sub">
                        Ejemplo: <em>veterinarias</em> en <em>Palermo, Belgrano, Caballito</em>
                    </span>
                </div>
            )}
        </div>
    );
}

declare global { interface Window { google: typeof google; } }