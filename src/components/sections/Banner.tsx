import { useEffect, useRef, useState, useCallback } from "react";
import { UseTheme } from "../../contexts/ThemeContext";
import "../../styles/banner.css";

const TREE = {
    id: "trigger", label: "Un Click", icon: "⚡",
    children: [
        {
            id: "data", label: "Datos", icon: "◈",
            children: [
                { id: "sheets",   label: "Google",  icon: "▦", children: [] },
                { id: "db",       label: "Data Base",  icon: "◉", children: [] },
            ],
        },
        {
            id: "notify", label: "Notificar", icon: "◆",
            children: [
                { id: "email",    label: "Email",          icon: "✉", children: [] },
                { id: "slack",    label: "Slack",          icon: "◑", children: [] },
                { id: "whatsapp", label: "WhatsApp",       icon: "◎", children: [] },
            ],
        },
        {
            id: "actions", label: "Acciones", icon: "⟳",
            children: [
                { id: "crm",      label: "CRM",            icon: "◍", children: [] },
                { id: "webhook",  label: "Webhook",        icon: "⇌", children: [] },
            ],
        },
    ],
};

type NodeDef = {
    id: string; label: string; icon: string;
    parentId: string | null; level: number;
    indexInLevel: number; totalInLevel: number;
};

function flattenTree(
    node: typeof TREE,
    parentId: string | null = null,
    level = 0,
    result: NodeDef[] = [],
    levelCounts: Record<number, number> = {}
): NodeDef[] {
    if (!levelCounts[level]) levelCounts[level] = 0;
    const idx = levelCounts[level]++;
    result.push({ id: node.id, label: node.label, icon: node.icon, parentId, level, indexInLevel: idx, totalInLevel: 0 });
    (node.children as typeof TREE[]).forEach(c => flattenTree(c, node.id, level + 1, result, levelCounts));
    const maxL = Math.max(...result.map(n => n.level));
    for (let l = 0; l <= maxL; l++) {
        const count = result.filter(n => n.level === l).length;
        result.filter(n => n.level === l).forEach(n => (n.totalInLevel = count));
    }
    return result;
}

const ALL_NODES = flattenTree(TREE);
const MAX_LEVEL = Math.max(...ALL_NODES.map(n => n.level));

// ─── Desktop SVG layout ───────────────────────────────────────────────────────
const SVG_W  = 1200;
const SVG_H  = 420;
const NODE_H = 54;
const RADIUS = 13;

// level 2 has 7 nodes — give them all same width, spread evenly
const NODE_W_BY_LEVEL: Record<number, number> = { 0: 164, 1: 152, 2: 148 };

const LEVEL_Y: Record<number, number> = { 0: 20, 1: 174, 2: 328 };

function getNodeW(node: NodeDef) { return NODE_W_BY_LEVEL[node.level] ?? 148; }

function getNodeX(node: NodeDef): number {
    const nw     = getNodeW(node);
    const pad    = 16;                       // tight pad so 7 nodes fit at 1200px
    const usable = SVG_W - pad * 2;
    const slot   = usable / node.totalInLevel;
    return pad + slot * node.indexInLevel + slot / 2 - nw / 2;
}

function getNodeCX(node: NodeDef) { return getNodeX(node) + getNodeW(node) / 2; }

// ─── Mobile layout (rendered as HTML divs, not SVG) ──────────────────────────
// Shows 3 columns: branch → children, stacked vertically
type Branch = { branch: typeof TREE.children[0]; accent: string; accentSoft: string; active: Set<string>; pulse: string | null };

function MobileBranch({ branch, accent, accentSoft, active, pulse }: Branch) {
    const isBActive = active.has(branch.id);
    const isBPulse  = pulse === branch.id;
    return (
        <div className="ab-m-branch">
            {/* branch node */}
            <div
                className={`ab-m-node ab-m-branch-node ${isBActive ? "ab-m-active" : ""} ${isBPulse ? "ab-m-pulse" : ""}`}
                style={{
                    borderColor: isBActive ? accent : undefined,
                    background:  isBActive ? `${accent}22` : undefined,
                }}
            >
                <span className="ab-m-icon">{branch.icon}</span>
                <span className="ab-m-label" style={{ color: isBActive ? "#fff" : undefined }}>
                    {branch.label}
                </span>
            </div>

            {/* connector line down */}
            <div className="ab-m-connector" style={{ background: isBActive ? accent : undefined }} />

            {/* leaf nodes */}
            <div className="ab-m-leaves">
                {branch.children.map((leaf, i) => {
                    const isLActive = active.has(leaf.id);
                    const isLPulse  = pulse === leaf.id;
                    return (
                        <div
                            key={leaf.id}
                            className={`ab-m-node ab-m-leaf-node ${isLActive ? "ab-m-active" : ""} ${isLPulse ? "ab-m-pulse" : ""}`}
                            style={{
                                borderColor: isLActive ? accentSoft : undefined,
                                background:  isLActive ? `${accentSoft}20` : undefined,
                                animationDelay: `${i * 0.08}s`,
                            }}
                        >
                            <span className="ab-m-icon">{leaf.icon}</span>
                            <span className="ab-m-label" style={{ color: isLActive ? "#fff" : undefined }}>
                                {leaf.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Banner = () => {
    const { theme }  = UseTheme();
    const isDark     = theme !== "light";
    const accent     = isDark ? "#8e2de2" : "#0062FF";
    const accentSoft = isDark ? "#a855f7" : "#3b82f6";

    const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
    const [pulseId,   setPulseId]   = useState<string | null>(null);
    const [isMobile,  setIsMobile]  = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const runAnimation = useCallback(() => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setActiveIds(new Set());
        setPulseId(null);

        const levels = Array.from({ length: MAX_LEVEL + 1 }, (_, i) =>
            ALL_NODES.filter(n => n.level === i)
        );

        let delay = 400;
        levels.forEach(nodes => {
            nodes.forEach(node => {
                const t1 = setTimeout(() => {
                    setActiveIds(prev => new Set([...prev, node.id]));
                    setPulseId(node.id);
                }, delay);
                const t2 = setTimeout(() => setPulseId(p => p === node.id ? null : p), delay + 600);
                timers.current.push(t1, t2);
                delay += 200;
            });
            delay += 200;
        });

        const loop = setTimeout(runAnimation, delay + 2000);
        timers.current.push(loop);
    }, []);

    useEffect(() => {
        runAnimation();
        return () => timers.current.forEach(clearTimeout);
    }, [runAnimation]);

    const nodeMap = Object.fromEntries(ALL_NODES.map(n => [n.id, n]));

    const edges = ALL_NODES
        .filter(n => n.parentId !== null)
        .map(n => ({
            from:   nodeMap[n.parentId!],
            to:     n,
            active: activeIds.has(n.parentId!) && activeIds.has(n.id),
        }));

    const isTriggerActive = activeIds.has("trigger");

    return (
        <section className={`ab-section ${isDark ? "ab-dark" : "ab-light"}`}>
            <div className={`dd-grid-overlay ${theme}`} aria-hidden="true" />

            {/* header */}
            <div className="ab-header">
                <span className="ab-eyebrow">
                    <span className="ab-eyebrow-dot" style={{ background: accent }} />
                    Automatización inteligente
                </span>
                <h2 className="ab-heading">
                    <span>Automatizá</span>
                    <span className="ab-heading-outline" style={{ WebkitTextStrokeColor: accent }}>
                        Miles de Acciones
                    </span>
                    <span>Un solo Click</span>
                </h2>
                <p className="ab-desc">
                    Conectamos tus herramientas y construimos flujos que trabajan solos — mientras vos te enfocás en lo que importa.
                </p>
            </div>

            {/* ── DESKTOP: SVG tree ── */}
            {!isMobile && (
                <div className="ab-viz">
                    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="ab-svg">
                        {edges.map(({ from, to, active }) => {
                            const x1 = getNodeCX(from);
                            const y1 = LEVEL_Y[from.level] + NODE_H;
                            const x2 = getNodeCX(to);
                            const y2 = LEVEL_Y[to.level];
                            const my = (y1 + y2) / 2;
                            return (
                                <path
                                    key={`${from.id}-${to.id}`}
                                    d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
                                    fill="none"
                                    stroke={active ? accent : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,98,255,0.1)"}
                                    strokeWidth={active ? 1.5 : 1}
                                    strokeDasharray={active ? undefined : "5 4"}
                                    style={{ transition: "stroke 0.45s ease, stroke-width 0.45s ease" }}
                                />
                            );
                        })}

                        {ALL_NODES.map(node => {
                            const nw       = getNodeW(node);
                            const nx       = getNodeX(node);
                            const ny       = LEVEL_Y[node.level];
                            const isActive = activeIds.has(node.id);
                            const isPulse  = pulseId === node.id;
                            const fs       = node.level === 0 ? 20 : node.level === 1 ? 17 : 15;

                            return (
                                <g key={node.id}>
                                    {isPulse && (
                                        <rect
                                            x={nx - 7} y={ny - 7}
                                            width={nw + 14} height={NODE_H + 14}
                                            rx={RADIUS + 5}
                                            fill="none" stroke={accent} strokeWidth="1.5"
                                            className="ab-pulse-ring"
                                        />
                                    )}
                                    <rect
                                        x={nx} y={ny} width={nw} height={NODE_H} rx={RADIUS}
                                        fill={isActive
                                            ? isDark ? "rgba(142,45,226,0.18)" : "rgba(0,98,255,0.1)"
                                            : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)"
                                        }
                                        stroke={isActive ? accent : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,98,255,0.15)"}
                                        strokeWidth={isActive ? 1.5 : 1}
                                        style={{ transition: "fill 0.45s ease, stroke 0.45s ease", width: "150px" }}
                                    />
                                    <text
                                        x={nx + 18} y={ny + NODE_H / 2}
                                        dominantBaseline="central" fontSize="16"
                                        opacity={isActive ? 1 : 0.28}
                                        style={{ transition: "opacity 0.45s ease" }}
                                    >{node.icon}</text>
                                    <text
                                        x={nx + 40} y={ny + NODE_H / 2}
                                        dominantBaseline="central"
                                        fontFamily="'Montserrat', sans-serif"
                                        fontSize={fs} fontWeight="700" letterSpacing="0.02em"
                                        fill={isActive
                                            ? isDark ? "#fff" : "#0a192f"
                                            : isDark ? "rgba(255,255,255,0.22)" : "rgba(10,25,47,0.28)"
                                        }
                                        style={{ transition: "fill 0.45s ease" }}
                                    >{node.label}</text>
                                    {isActive && (
                                        <circle
                                            cx={nx + nw - 14} cy={ny + NODE_H / 2}
                                            r={3.5} fill={accentSoft} opacity="0.9"
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}

            {/* ── MOBILE: HTML tree ── */}
            {isMobile && (
                <div className="ab-mobile-tree">
                    {/* trigger */}
                    <div
                        className={`ab-m-trigger ${isTriggerActive ? "ab-m-active ab-m-trigger-active" : ""} ${pulseId === "trigger" ? "ab-m-pulse" : ""}`}
                        style={{ borderColor: isTriggerActive ? accent : undefined, background: isTriggerActive ? `${accent}22` : undefined }}
                    >
                        <span className="ab-m-icon">⚡</span>
                        <span className="ab-m-label-lg" style={{ color: isTriggerActive ? "#fff" : undefined }}>
                            Trigger
                        </span>
                    </div>

                    {/* connector from trigger */}
                    <div className="ab-m-connector-v" style={{ background: isTriggerActive ? accent : undefined }} />

                    {/* 3 branches side by side */}
                    <div className="ab-m-branches">
                        {TREE.children.map(branch => (
                            <MobileBranch
                                key={branch.id}
                                branch={branch}
                                accent={accent}
                                accentSoft={accentSoft}
                                active={activeIds}
                                pulse={pulseId}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Banner;