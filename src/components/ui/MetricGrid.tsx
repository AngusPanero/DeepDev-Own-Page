import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { UseTheme } from "../../contexts/ThemeContext";

interface MetricItem {
    id: string;
    value: string;
    suffix?: string;
    label: string;
}

interface MetricGridProps {
    items: MetricItem[];
    columns?: number;
}

// ── Animated counter ───────────────────────────────────────────
const Counter = ({ value, isInView }: { value: string; isInView: boolean }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) =>
        value.includes(".") ? v.toFixed(1) : Math.round(v).toString()
    );

    useEffect(() => {
        if (!isInView) return;
        const numeric = parseFloat(value);
        if (isNaN(numeric)) return;
        const ctrl = animate(count, numeric, {
            duration: 2.2,
            ease: [0.16, 1, 0.3, 1],
        });
        return ctrl.stop;
    }, [value, count, isInView]);

    // Non-numeric values (like "24/7") render as-is
    if (isNaN(parseFloat(value))) return <span>{value}</span>;
    return <motion.span>{rounded}</motion.span>;
};

// ── MetricGrid ─────────────────────────────────────────────────
export const MetricGrid: React.FC<MetricGridProps> = ({ items, columns = 3 }) => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    const accent = isDark ? "#8e2de2" : "#0062FF";

    return (
        <section
            ref={containerRef}
            className={`dd-metrics-section ${isDark ? "metrics-dark" : "metrics-light"}`}
        >
            <div
                className="dd-metrics-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        className={`dd-metric-card ${isDark ? "mcard-dark" : "mcard-light"}`}
                        initial={{ opacity: 0, y: 28 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* side accent bar */}
                        <motion.div
                            className="dd-metric-bar"
                            style={{ background: accent }}
                            initial={{ scaleY: 0 }}
                            animate={isInView ? { scaleY: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.13 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <span className="dd-metric-id">ID_{item.id}</span>

                        <h3 className="dd-metric-value">
                            <Counter value={item.value} isInView={isInView} />
                            {item.suffix && (
                                <span className="dd-metric-suffix" style={{ color: accent }}>
                                    {item.suffix}
                                </span>
                            )}
                        </h3>

                        <div className="dd-metric-info">
                            <span
                                className="dd-metric-dot"
                                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                            />
                            <p className="dd-metric-label">{item.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};