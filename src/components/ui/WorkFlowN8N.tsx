import { useEffect, useMemo, useState } from "react";



const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function WorkflowN8NFlow({
    nodes = 4,
    durationMs = 3000,
    loop = true,
    }) {
    const [progress, setProgress] = useState(0);

    // Layout
    const W = 900;
    const H = 130;
    const padX = 2;
    const y = 65;

    const startX = padX;
    const endX = W - padX;

    const nodeSize = 65; // ⬅ cuadrados más grandes
    const gap = (endX - startX) / (nodes + 1.2);

    const nodeXs = useMemo(
        () => Array.from({ length: nodes }, (_, i) => startX + gap * (i + 1)),
        [nodes, gap, startX]
    );

    const lineLen = endX - startX;

    useEffect(() => {
        let raf: number;
        const start = performance.now();

        const animate = (time: number) => {
        const elapsed = time - start;
        const raw = elapsed / durationMs;
        const looped = loop ? raw % 1 : Math.min(raw, 1);

        setProgress(easeInOutCubic(looped));

        if (loop || raw < 1) {
            raf = requestAnimationFrame(animate);
        }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [durationMs, loop]);

    const activeIndex = Math.floor(progress * (nodes + 1));

    return (
        <div className="n8n-flow-wrap">
            <svg className="n8n-flow" viewBox={`0 0 ${W} ${H}`}>
                <defs>
                <filter id="softGlow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                </defs>

                {/* Línea base */}
                <line x1={startX} y1={y} x2={endX} y2={y} className="n8n-line-base" />

                {/* Línea animada */}
                <line x1={startX} y1={y} x2={endX} y2={y} className="n8n-line-progress"
                    style={{ strokeDasharray: lineLen, strokeDashoffset: lineLen * (1 - progress), }} filter="url(#softGlow)" 
                />

                {/* Punto inicial */}
                <circle cx={startX} cy={y} r="10" className="n8n-dot" />
                <circle cx={startX} cy={y} r="10" className="n8n-dot-active" style={{ opacity: progress > 0.02 ? 1 : 0 }} filter="url(#softGlow)" />

                {/* Nodos */}
                {nodeXs.map((x, i) => {
                const isActive = i < activeIndex;
                return (
                    <g key={i} transform={`translate(${x - nodeSize / 2}, ${ y - nodeSize / 2 })`} >
                        <rect width={nodeSize} height={nodeSize} rx="10" className="n8n-node" />
                        <rect width={nodeSize} height={nodeSize} rx="10" className="n8n-node-active"
                            style={{ opacity: isActive ? 1 : 0, transform: isActive ? "scale(1)" : "scale(0.85)", transformOrigin: "50% 50%", }}
                            filter="url(#softGlow)" />
                        <path d="M14 12 L28 24 L14 36 Z" className="n8n-node-icon" style={{ opacity: isActive ? 1 : 0.4 }} />
                    </g>
                );
                })}

                {/* Punto final */}
                <circle cx={endX} cy={y} r="10" className="n8n-dot" />
                <circle cx={endX} cy={y} r="10" className="n8n-dot-active" style={{ opacity: progress > 0.98 ? 1 : 0 }} filter="url(#softGlow)" />
            </svg>
        </div>
    );
}