import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, CuboidCollider } from "@react-three/rapier";
import { motion, useScroll, useSpring, AnimatePresence, cubicBezier } from "framer-motion";
import { easing } from "maath";
import "./lusionHtml.css";
import { UseTheme } from "../../contexts/ThemeContext";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PRODUCTS = [
    {
        id: "web", index: "01", tag: "WEB APPLICATIONS",
        title: ["Hacemos", "Aplicaciones", "Web."],
        accentDark: "#ffffff", accentLight: "#0062FF",
        text: "Desde landing pages de alto impacto hasta plataformas de eCommerce y sistemas web completamente personalizados. Un sitio bien construido convierte visitantes en clientes y permite que tu negocio crezca con control total.",
        stats: [{ n: "120+", label: "Proyectos" }, { n: "99%", label: "Uptime" }, { n: "4.9★", label: "Rating" }],
        icons: ["/logos/chrome.svg", "/logos/safari2.svg", "/logos/firefox.svg", "/logos/edge.svg"],
    },
    {
        id: "apps", index: "02", tag: "MOBILE APPS",
        title: ["Apps para", "iOS y", "Android."],
        accentDark: "#ffffff", accentLight: "#0041cb",
        text: "Diseñamos aplicaciones móviles desde MVPs hasta productos completos. Una app bien lograda entrega velocidad, rendimiento y experiencia fluida — una conexión directa entre tu producto y tu audiencia.",
        stats: [{ n: "iOS", label: "App Store" }, { n: "Android", label: "Play Store" }, { n: "React Native", label: "Cross-platform" }],
        icons: ["/logos/appstore.svg", "/logos/playstore.svg", "/logos/apple.svg", "/logos/android2.svg"],
    },
    {
        id: "software", index: "03", tag: "CUSTOM SOFTWARE",
        title: ["Software", "Completamente", "Customizado."],
        accentDark: "#ffffff", accentLight: "#1d6ffa",
        text: "Sistemas de gestión, plataformas internas y automatización de procesos a medida. El software custom permite centralizar información y obtener control absoluto sobre tus operaciones.",
        stats: [{ n: "Escalable", label: "Arquitectura" }, { n: "Seguro", label: "Infraestructura" }, { n: "A medida", label: "100%" }],
        icons: ["/logos/soft.svg", "/logos/graf.svg", "/logos/ingenieria.svg", "/logos/flow.svg"],
    },
    {
        id: "ai", index: "04", tag: "INTELIGENCIA ARTIFICIAL",
        title: ["IA", "Integrada", "en tu Producto."],
        accentDark: "#ffffff", accentLight: "#0080ff",
        text: "Chatbots personalizados, asistentes virtuales y flujos de decisión inteligentes. Una IA controlada, segura e integrada sin fricciones en tus sistemas y datos existentes.",
        stats: [{ n: "LLM", label: "Integración" }, { n: "24/7", label: "Disponible" }, { n: "Custom", label: "Training" }],
        icons: ["/logos/brain.svg", "/logos/cubo.svg", "/logos/platform.svg", "/logos/chat.svg"],
    },
    {
        id: "automation", index: "05", tag: "AUTOMATIZACIÓN",
        title: ["Flujos de", "Trabajo", "Automatizados."],
        accentDark: "#ffffff", accentLight: "#0062FF",
        text: "Conectamos CRMs, APIs y herramientas internas para que los datos fluyan solos. Respuestas más rápidas, menos errores y operaciones completamente consistentes en toda tu organización.",
        stats: [{ n: "n8n", label: "Workflows" }, { n: "Zapier", label: "Integraciones" }, { n: "0", label: "Errores manuales" }],
        icons: ["/logos/recycle.svg", "/logos/work.svg", "/logos/ingenieria.svg", "/logos/flow.svg"],
    },
];

const PALETTES_DARK: Record<string, string[]> = {
    web: ["#8e2de2", "#ffffff", "#0a192f"], apps: ["#8e2de2", "#ffffff", "#0a192f"],
    software: ["#8e2de2", "#ffffff", "#0a192f"], ai: ["#8e2de2", "#ffffff", "#0a192f"],
    automation: ["#8e2de2", "#ffffff", "#0a192f"],
};
const PALETTES_LIGHT: Record<string, string[]> = {
    web: ["#0062FF", "#0a192f", "#e8e4ff"], apps: ["#0062FF", "#0a192f", "#e8e4ff"],
    software: ["#0062FF", "#0a192f", "#e8e4ff"], ai: ["#0062FF", "#0a192f", "#e8e4ff"],
    automation: ["#0062FF", "#0a192f", "#e8e4ff"],
};

// ─────────────────────────────────────────────
// GYROSCOPE HOOK
// Returns { x, y } gravity vector from device orientation.
// Requests permission on iOS 13+ automatically.
// ─────────────────────────────────────────────
type GyroState = { x: number; y: number; granted: boolean; supported: boolean };

function useGyroscope(enabled: boolean): GyroState & { request: () => void } {
    const [state, setState] = useState<GyroState>({
        x: 0, y: 0, granted: false, supported: false,
    });

    const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
        // gamma = left/right tilt (-90..90), beta = front/back tilt (-180..180)
        const gamma = e.gamma ?? 0; // left/right
        const beta  = e.beta  ?? 0; // front/back
        // Map to gravity-like forces clamped to [-1, 1]
        setState(s => ({
            ...s,
            granted: true,
            x: Math.max(-1, Math.min(1, gamma / 45)),
            y: Math.max(-1, Math.min(1, (beta - 45) / 45)), // -45 so neutral hold = no gravity
        }));
    }, []);

    const request = useCallback(async () => {
        if (!enabled) return;
        // iOS 13+ requires explicit permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                const res = await (DeviceOrientationEvent as any).requestPermission();
                if (res === "granted") {
                    setState(s => ({ ...s, supported: true }));
                    window.addEventListener("deviceorientation", handleOrientation, true);
                }
            } catch {
                // permission denied or unsupported
            }
        } else {
            // Android / non-iOS: no permission needed
            setState(s => ({ ...s, supported: true, granted: true }));
            window.addEventListener("deviceorientation", handleOrientation, true);
        }
    }, [enabled, handleOrientation]);

    useEffect(() => {
        if (!enabled) return;
        // Check if API exists
        if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
            setState(s => ({ ...s, supported: true }));
            // Android grants automatically — try attaching without permission prompt first
            if (typeof (DeviceOrientationEvent as any).requestPermission !== "function") {
                window.addEventListener("deviceorientation", handleOrientation, true);
                setState(s => ({ ...s, granted: true }));
            }
        }
        return () => window.removeEventListener("deviceorientation", handleOrientation, true);
    }, [enabled, handleOrientation]);

    return { ...state, request };
}

// ─────────────────────────────────────────────
// 3D — Connector model
// ─────────────────────────────────────────────
import React from "react";
const ConnectorModel = React.forwardRef<THREE.Mesh, { scale: number }>(({ scale }, ref) => {
    const { nodes } = useGLTF("/c-transformed.glb") as any;
    return (
        <mesh ref={ref} scale={scale} geometry={nodes.connector.geometry} castShadow receiveShadow>
            <meshStandardMaterial roughness={0.08} metalness={0.25} />
        </mesh>
    );
});
ConnectorModel.displayName = "ConnectorModel";

// ─────────────────────────────────────────────
// 3D — Physics connector
// ─────────────────────────────────────────────
function PhysicsConnector({ position, rotation, color, scrollVelocity, isMobile }: {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
    scrollVelocity: number;
    isMobile: boolean;
    gyro: { x: number; y: number };
}) {
    const api  = useRef<any>(null!);
    const mesh = useRef<THREE.Mesh>(null!);
    const scale = isMobile ? 5 : 9;
    const col:  [number,number,number] = isMobile ? [0.2,  0.65, 0.2]  : [0.35, 1.15, 0.35];
    const colL: [number,number,number] = isMobile ? [0.65, 0.2,  0.2]  : [1.15, 0.35, 0.35];
    const colD: [number,number,number] = isMobile ? [0.2,  0.2,  0.65] : [0.35, 0.35, 1.15];

    useFrame((_s, delta) => {
        if (!api.current || !mesh.current) return;

        // Desktop only: scroll impulse
        if (!isMobile && Math.abs(scrollVelocity) > 1) {
            api.current.applyImpulse({ x: 0, y: -scrollVelocity * 0.11, z: 0 }, true);
            api.current.applyTorqueImpulse({
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015,
            }, true);
        }

        // @ts-ignore
        easing.dampC(mesh.current.material.color, new THREE.Color(color), 0.18, delta);
    });

    return (
        <RigidBody
            ref={api}
            position={position}
            rotation={rotation}
            colliders={false}
            linearDamping={isMobile ? 0.15 : 0.72}
            angularDamping={isMobile ? 0.2 : 0.5}
            restitution={isMobile ? 0.6 : 0.55}
        >
            <CuboidCollider args={col} />
            <CuboidCollider args={colL} />
            <CuboidCollider args={colD} />
            <ConnectorModel ref={mesh} scale={scale} />
        </RigidBody>
    );
}

// ─────────────────────────────────────────────
// 3D — Cage
// ─────────────────────────────────────────────
function GlassCage({ isMobile }: { isMobile: boolean }) {
    const { viewport } = useThree();
    const t = 2;
    return (
        <RigidBody type="fixed" colliders="cuboid" restitution={1} friction={0.1}>
            <CuboidCollider args={[viewport.width, t, 10]} position={[0, -viewport.height / 2 - t, 0]} />
            <CuboidCollider args={[viewport.width, t, 10]} position={[0,  viewport.height / 2 + 15, 0]} />
            <CuboidCollider args={[t, viewport.height * 2, 10]} position={[-viewport.width / 2 - t, 0, 0]} />
            <CuboidCollider args={[t, viewport.height * 2, 10]} position={[ viewport.width / 2 + t, 0, 0]} />
            <CuboidCollider args={[viewport.width, viewport.height, t]} position={[0, 0, isMobile ? -3 : -5]} />
            <CuboidCollider args={[viewport.width, viewport.height, t]} position={[0, 0, isMobile ? 3 :  5]} />
        </RigidBody>
    );
}

// ─────────────────────────────────────────────
// 3D — Mouse striker (desktop only)
// ─────────────────────────────────────────────
function MouseStriker() {
    const ref = useRef<any>(null!);
    const vec = new THREE.Vector3();
    useFrame(({ mouse, viewport }) => {
        vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0);
        if (ref.current) ref.current.setNextKinematicTranslation(vec);
    });
    return (
        <RigidBody ref={ref} type="kinematicPosition" colliders={false}>
            <BallCollider args={[2.2]} />
        </RigidBody>
    );
}

// ─────────────────────────────────────────────
// 3D — Scene
// ─────────────────────────────────────────────
function Scene({ palette, isMobile, scrollVelocity, bgColor, gyro }: {
    palette: string[];
    isMobile: boolean;
    scrollVelocity: number;
    bgColor: string;
    gyro: { x: number; y: number };
}) {
    const { viewport } = useThree();
    const TOTAL = isMobile ? 22 : 48;

    const items = useMemo(
        () => Array.from({ length: TOTAL }, (_, i) => ({
            id: i,
            position: [
                THREE.MathUtils.randFloatSpread(viewport.width * (isMobile ? 0.7 : 0.8)),
                isMobile
                    ? THREE.MathUtils.randFloatSpread(viewport.height * 0.7)
                    : THREE.MathUtils.randFloat(viewport.height / 2, viewport.height),
                THREE.MathUtils.randFloatSpread(isMobile ? 1.5 : 4),
            ] as [number, number, number],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
            colorIndex: i % palette.length,
        })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [viewport.width, viewport.height, palette.join(","), isMobile]
    );

    return (
        <>
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.06} />
            <pointLight position={[10, 10, 10]} intensity={isMobile ? 0.5 : 1} />
            {/* Mobile: gyro x/y become gravity X/Y — natural tilt physics */}
            <Physics
                gravity={isMobile
                    ? [gyro.x * 20, -gyro.y * 20, 0]
                    : [0, -14, 0]}
                colliders={false}
            >
                {!isMobile && <MouseStriker />}
                <GlassCage isMobile={isMobile} />
                {items.map(d => (
                    <PhysicsConnector
                        key={d.id}
                        position={d.position}
                        rotation={d.rotation}
                        color={palette[d.colorIndex]}
                        scrollVelocity={scrollVelocity}
                        isMobile={isMobile}
                        gyro={gyro}
                    />
                ))}
            </Physics>
            <Environment resolution={isMobile ? 64 : 256} preset="apartment">
                <Lightformer form="rect" intensity={2} position={[2, 5, -10]} scale={[10, 1, 1]} />
            </Environment>
        </>
    );
}

// ─────────────────────────────────────────────
// Framer variants
// ─────────────────────────────────────────────
const ease = cubicBezier(0.22, 1, 0.36, 1);
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const itemV  = { hidden: { opacity: 0, y: 28 },  show: { opacity: 1, y: 0,  transition: { duration: 0.55, ease } } };
const slideL = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0,  transition: { duration: 0.6,  ease } } };
const slideR = { hidden: { opacity: 0, x:  60 }, show: { opacity: 1, x: 0,  transition: { duration: 0.6,  ease } } };

// ─────────────────────────────────────────────
// Product panel
// ─────────────────────────────────────────────
function ProductPanel({ product, isActive, theme }: {
    product: typeof PRODUCTS[0]; isActive: boolean; theme: string;
}) {
    const isDark = theme !== "light";
    const accent = isDark ? product.accentDark : product.accentLight;

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div key={product.id} className="pp-panel"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div className="pp-inner" variants={containerV} initial="hidden" animate="show">
                        <div className="pp-left">
                            <motion.div className="pp-index" variants={itemV}>
                                {product.index} <span className="pp-separator">/</span> 05
                            </motion.div>
                            <motion.p className="pp-tag" variants={itemV}>{product.tag}</motion.p>
                            <motion.h2 className="pp-title" variants={slideL}>
                                {product.title.map((line, i) => (
                                    <span key={i} className="pp-title-line"
                                        style={i === product.title.length - 1
                                            ? { WebkitTextStroke: `2px ${accent}`, color: "transparent" }
                                            : undefined}>
                                        {line}
                                    </span>
                                ))}
                            </motion.h2>
                            <motion.p className="pp-text" variants={itemV}>{product.text}</motion.p>
                            <motion.div className="pp-stats" variants={containerV}>
                                {product.stats.map(s => (
                                    <motion.div key={s.label} className="pp-stat" variants={itemV}>
                                        <span className="pp-stat-n" style={{ color: accent }}>{s.n}</span>
                                        <span className="pp-stat-label">{s.label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                        <motion.div className="pp-right" variants={slideR}>
                            <div className="pp-big-num" style={{ color: accent }}>{product.index}</div>
                            <div className="pp-icon-grid">
                                {product.icons.map(src => (
                                    <motion.div key={src} className="pp-icon-card" variants={itemV}
                                        whileHover={{ scale: 1.08, y: -4 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{ borderColor: `${accent}33` }}>
                                        <img src={src} alt="" width={48} height={48}
                                            style={{ opacity: isDark ? 0.9 : 0.85 }} />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div className="pp-pill" variants={itemV}
                                style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}>
                                <span className="pp-pill-dot" style={{ background: accent }} />
                                Disponible ahora
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    <div className="pp-progress-bar">
                        <motion.div className="pp-progress-fill" style={{ background: accent }}
                            initial={{ width: "0%" }} animate={{ width: "100%" }}
                            transition={{ duration: 1.4, ease: "linear" }} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
const ProductsInfoLusion = () => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef(0);
    const [scrollVelocity, setScrollVelocity] = useState(0);

    // WebGL context loss recovery — key: remount Canvas on loss
    const [canvasKey, setCanvasKey] = useState(0);

    // Gyroscope
    const gyro = useGyroscope(isMobile);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // On mobile, try auto-requesting gyro (works on Android immediately)
    useEffect(() => {
        if (isMobile) gyro.request();
    }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const fn = () => {
            const v = window.scrollY - scrollRef.current;
            setScrollVelocity(v);
            scrollRef.current = window.scrollY;
            const t = setTimeout(() => setScrollVelocity(0), 120);
            return () => clearTimeout(t);
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    // WebGL context loss: listen at canvas level, remount after 1s
    const handleContextLost = useCallback(() => {
        console.warn("WebGL context lost — recovering...");
        setTimeout(() => setCanvasKey(k => k + 1), 1000);
    }, []);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

    useEffect(() => {
        const unsub = smooth.on("change", v => {
            setActiveIndex(Math.min(PRODUCTS.length - 1, Math.floor(v * PRODUCTS.length)));
        });
        return unsub;
    }, [smooth]);

    const activeProduct = PRODUCTS[activeIndex];
    const palette = isDark ? PALETTES_DARK[activeProduct.id] : PALETTES_LIGHT[activeProduct.id];
    const bgColor = isDark ? "#000000" : "#f4f2ff";
    const gyroVec = { x: gyro.x, y: gyro.y };

    return (
        <div
            ref={containerRef}
            className={`products-wrapper ${isDark ? "theme-dark" : "theme-light"}`}
            style={{ height: `${PRODUCTS.length * 100}vh` }}
        >
            <div className="products-sticky">

                {/* 3D canvas */}
                <div className="pp-canvas-bg">
                    <Canvas
                        key={canvasKey}                      // remounts on context loss
                        shadows={!isMobile}
                        dpr={[1, isMobile ? 1.5 : 2]}
                        camera={{ position: [0, 0, 25], fov: isMobile ? 45 : 35 }}
                        onCreated={({ gl }) => {
                            // Attach context lost handler to the actual canvas element
                            gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
                        }}
                        gl={{
                            powerPreference: "high-performance",
                            antialias: !isMobile,
                            // Preserve drawing buffer prevents some context loss scenarios
                            preserveDrawingBuffer: false,
                            failIfMajorPerformanceCaveat: false,
                        }}
                    >
                        <Scene
                            palette={palette}
                            isMobile={isMobile}
                            scrollVelocity={scrollVelocity}
                            bgColor={bgColor}
                            gyro={gyroVec}
                        />
                    </Canvas>
                </div>

                {/* iOS gyro permission button — only shown if supported but not yet granted */}
                {isMobile && gyro.supported && !gyro.granted && (
                    <motion.button
                        className="pp-gyro-btn"
                        onClick={gyro.request}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <span className="pp-gyro-icon">📱</span>
                        Activar giroscopio
                    </motion.button>
                )}

                {/* side nav dots */}
                <nav className="pp-side-nav" aria-label="Secciones de productos">
                    {PRODUCTS.map((p, i) => {
                        const acc = isDark ? p.accentDark : p.accentLight;
                        return (
                            <button
                                key={p.id}
                                className={`pp-nav-dot ${i === activeIndex ? "active" : ""}`}
                                style={i === activeIndex ? { background: acc, boxShadow: `0 0 10px ${acc}88` } : {}}
                                onClick={() => {
                                    const el = containerRef.current;
                                    if (!el) return;
                                    window.scrollTo({
                                        top: el.offsetTop + (i / PRODUCTS.length) * el.offsetHeight + 10,
                                        behavior: "smooth",
                                    });
                                }}
                                aria-label={p.tag}
                            />
                        );
                    })}
                </nav>

                {/* bottom label */}
                <div className="pp-scroll-hint">
                    <span style={{ color: isDark ? activeProduct.accentDark : activeProduct.accentLight }}>
                        {activeProduct.index}
                    </span>
                    <span className="pp-scroll-label">{activeProduct.tag}</span>
                </div>

                {/* product panels */}
                {PRODUCTS.map((p, i) => (
                    <ProductPanel key={p.id} product={p} isActive={i === activeIndex} theme={theme} />
                ))}
            </div>
        </div>
    );
};

export default ProductsInfoLusion;
useGLTF.preload("/c-transformed.glb");