import { useEffect, useMemo, useState } from "react";

const WorkflowN8NFlow = ({ nodes = 4, durationMs = 3000, loop = true,}) => {
    const [progress, setProgress] = useState(0);

  // Layout
    const W = 900;
    const H = 130;
    const padX = 2;
    const y = 65;

    const startX = padX;
    const endX = W - padX;
    const nodeSize = 65;

    const gap = (endX - startX) / (nodes + 1.2);
    const nodeXs = useMemo(
        () => Array.from({ length: nodes }, (_, i) => startX + gap * (i + 1)),
        [nodes, gap, startX]
    );

    const lineLen = endX - startX;

    useEffect(() => {
        const stepMs = 30;
        const step = stepMs / durationMs;

        const interval = setInterval(() => {
        setProgress((p) => {
            const next = p + step;
            if (next >= 1) return loop ? 0 : 1;
            return next;
        });
        }, stepMs);

        return () => clearInterval(interval);
    }, [durationMs, loop]);

  const activeIndex = Math.floor(progress * (nodes + 1));

    return (
        <div className="n8n-flow-wrap">
        <svg className="n8n-flow" viewBox={`0 0 ${W} ${H}`}>
            {/* Línea base */}
            <line x1={startX} y1={y} x2={endX} y2={y} className="n8n-line-base" />

            {/* Línea animada */}
            <line x1={startX} y1={y} x2={endX} y2={y} className="n8n-line-progress"
            style={{ strokeDasharray: lineLen, strokeDashoffset: lineLen * (1 - progress),}}/>

            {/* Nodos */}
            {nodeXs.map((x, i) => {
            const isActive = i < activeIndex;
            return (
                <g key={i} transform={`translate(${x - nodeSize / 2}, ${y - nodeSize / 2})`}>
                <rect width={nodeSize} height={nodeSize} rx="10" className="n8n-node" />
                {isActive && (
                    <rect width={nodeSize} height={nodeSize} rx="10" className="n8n-node-active" />
                )}
                <path d="M14 12 L28 24 L14 36 Z" className="n8n-node-icon" />
                </g>
            );
            })}
        </svg>
        </div>
    );
}

export default WorkflowN8NFlow;