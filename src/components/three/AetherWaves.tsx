import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { UseTheme } from "../../contexts/ThemeContext";

interface AetherWavesProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

const AetherWaves = ({ position = [1, 1, 0],rotation = [2, 1, 4]}: AetherWavesProps) => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";
    const { viewport } = useThree();

    const pointsRef  = useRef<THREE.Points>(null!);
    const pointsRef2 = useRef<THREE.Points>(null!);

    // mouse position in world space (smoothed)
    const mouse      = useRef(new THREE.Vector2(0, 0));
    const mouseLerp  = useRef(new THREE.Vector2(0, 0));

    const texture = useLoader(THREE.TextureLoader, "../../textures/particle.png");

    // ── Rings ─────────────────────────────────────────────────
    const RINGS    = 48;
    const PER_RING = 180;
    const count1   = RINGS * PER_RING;

    // store base XZ so we can compute distance to mouse
    const baseXZ1 = useMemo(() => {
        const arr = new Float32Array(count1 * 2);
        let i = 0;
        for (let r = 0; r < RINGS; r++) {
            const radius = (r / RINGS) * 5.5 + 0.3;
            for (let p = 0; p < PER_RING; p++) {
                const angle = (p / PER_RING) * Math.PI * 2;
                arr[i * 2]     = Math.cos(angle) * radius;
                arr[i * 2 + 1] = Math.sin(angle) * radius;
                i++;
            }
        }
        return arr;
    }, []);

    const positions1 = useMemo(() => {
        const pos = new Float32Array(count1 * 3);
        for (let i = 0; i < count1; i++) {
            pos[i * 3]     = baseXZ1[i * 2];
            pos[i * 3 + 1] = 0;
            pos[i * 3 + 2] = baseXZ1[i * 2 + 1];
        }
        return pos;
    }, [baseXZ1]);

    // ── Galaxy cloud ──────────────────────────────────────────
    const COUNT2 = 3200;

    const baseXZ2 = useMemo(() => {
        const arr = new Float32Array(COUNT2 * 2);
        for (let i = 0; i < COUNT2; i++) {
            const r     = Math.pow(Math.random(), 0.55) * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi   = (Math.random() - 0.5) * 0.35;
            arr[i * 2]     = Math.cos(theta) * r * Math.cos(phi);
            arr[i * 2 + 1] = Math.sin(theta) * r * Math.cos(phi);
        }
        return arr;
    }, []);

    const positions2 = useMemo(() => {
        const pos = new Float32Array(COUNT2 * 3);
        for (let i = 0; i < COUNT2; i++) {
            const r     = Math.pow(Math.random(), 0.55) * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi   = (Math.random() - 0.5) * 0.35;
            pos[i * 3]     = Math.cos(theta) * r * Math.cos(phi);
            pos[i * 3 + 1] = Math.sin(phi) * r * 0.5;
            pos[i * 3 + 2] = Math.sin(theta) * r * Math.cos(phi);
        }
        return pos;
    }, []);

    // ── Mouse listener ────────────────────────────────────────
    useMemo(() => {
        const onMove = (e: MouseEvent) => {
            // normalize to [-1, 1] then scale to world units
            mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * viewport.width;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * viewport.height;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [viewport]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // smooth mouse
        mouseLerp.current.lerp(mouse.current, 0.06);
        const mx = mouseLerp.current.x;
        const my = mouseLerp.current.y; // y in world = z in 3D plane

        // ── Rings ─────────────────────────────────────────────
        if (pointsRef.current) {
            const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < count1; i++) {
                const px = baseXZ1[i * 2];
                const pz = baseXZ1[i * 2 + 1];

                const radius = Math.sqrt(px * px + pz * pz);

                // distance from smoothed mouse position (mouse Y → world Z)
                const dx   = px - mx;
                const dz   = pz - my;
                const dist = Math.sqrt(dx * dx + dz * dz);

                // mouse ripple — faster decay with distance
                const mouseWave = Math.sin(dist * 2.5 - t * 3.5) * Math.exp(-dist * 0.55) * 0.45;

                // background ambient waves
                const ambient  = Math.sin(radius * 1.6 - t * 2.2) * 0.18;
                const twist    = Math.cos((px * 0.3 + pz * 0.3) + t * 0.8) * 0.06;

                pos[i * 3 + 1] = ambient + twist + mouseWave;
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.rotation.x = rotation[0] + Math.sin(t * 0.12) * 0.08;
            pointsRef.current.rotation.y = t * 0.06;
            pointsRef.current.rotation.z = rotation[2] + Math.cos(t * 0.09) * 0.04;
        }

        // ── Galaxy cloud ──────────────────────────────────────
        if (pointsRef2.current) {
            const pos2 = pointsRef2.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < COUNT2; i++) {
                const px = baseXZ2[i * 2];
                const pz = baseXZ2[i * 2 + 1];

                const dx   = px - mx;
                const dz   = pz - my;
                const dist = Math.sqrt(dx * dx + dz * dz);

                // subtle mouse influence on cloud — softer, slower
                const mouseWave = Math.sin(dist * 1.8 - t * 2.5) * Math.exp(-dist * 0.4) * 0.2;
                const pulse     = Math.sin(Math.sqrt(px*px + pz*pz) * 1.2 + t * 1.4 + i * 0.01) * 0.015;

                pos2[i * 3 + 1] += (pulse + mouseWave * 0.003 - pos2[i * 3 + 1]) * 0.05;
            }

            pointsRef2.current.geometry.attributes.position.needsUpdate = true;
            pointsRef2.current.rotation.x = rotation[0] * 0.6 + Math.sin(t * 0.1) * 0.04;
            pointsRef2.current.rotation.y = -t * 0.03;
        }
    });

    const accentColor = isDark ? "#8e2de2" : "#0062FF";
    const cloudColor  = isDark ? "#a855f7" : "#3b82f6";

    return (
        <group position={position}>
            {/* rings with mouse ripple */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions1, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    size={0.028}
                    transparent
                    opacity={isDark ? 0.75 : 0.6}
                    alphaTest={0.08}
                    depthWrite={false}
                    color={accentColor}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>

            {/* galaxy cloud */}
            <points ref={pointsRef2}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions2, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    size={0.018}
                    transparent
                    opacity={isDark ? 0.35 : 0.25}
                    alphaTest={0.05}
                    depthWrite={false}
                    color={cloudColor}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

export default AetherWaves;

/* import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { UseTheme } from "../../contexts/ThemeContext";

interface AetherWavesProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

const AetherWaves = ({
    position = [1, 2, 0],
    rotation = [2, 1, 4],
}: AetherWavesProps) => {
    const { theme } = UseTheme();
    const isDark = theme !== "light";

    const pointsRef  = useRef<THREE.Points>(null!);
    const pointsRef2 = useRef<THREE.Points>(null!);

    const texture = useLoader(THREE.TextureLoader, "../../textures/particle.png");

    const RINGS   = 48;
    const PER_RING = 180;
    const count1   = RINGS * PER_RING;

    const positions1 = useMemo(() => {
        const pos = new Float32Array(count1 * 3);
        let i = 0;
        for (let r = 0; r < RINGS; r++) {
            const radius = (r / RINGS) * 5.5 + 0.3;
            for (let p = 0; p < PER_RING; p++) {
                const angle = (p / PER_RING) * Math.PI * 2;
                pos[i * 3]     = Math.cos(angle) * radius;
                pos[i * 3 + 1] = 0;
                pos[i * 3 + 2] = Math.sin(angle) * radius;
                i++;
            }
        }
        return pos;
    }, []);

    const COUNT2 = 3200;
    const positions2 = useMemo(() => {
        const pos = new Float32Array(COUNT2 * 3);
        for (let i = 0; i < COUNT2; i++) {
            const r     = Math.pow(Math.random(), 0.55) * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi   = (Math.random() - 0.5) * 0.35;
            pos[i * 3]     = Math.cos(theta) * r * Math.cos(phi);
            pos[i * 3 + 1] = Math.sin(phi) * r * 0.5;
            pos[i * 3 + 2] = Math.sin(theta) * r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (pointsRef.current) {
            const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
            let i = 0;
            for (let r = 0; r < RINGS; r++) {
                const radius = (r / RINGS) * 5.5 + 0.3;
                for (let p = 0; p < PER_RING; p++) {
                    const angle = (p / PER_RING) * Math.PI * 2;
                    const ripple = Math.sin(radius * 1.6 - t * 2.2) * 0.22;
                    const twist  = Math.cos(angle * 3 + t * 0.8 + radius * 0.5) * 0.08;
                    pos[i * 3 + 1] = ripple + twist;
                    i++;
                }
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;

            pointsRef.current.rotation.x = rotation[0] + Math.sin(t * 0.12) * 0.08;
            pointsRef.current.rotation.y = t * 0.06;
            pointsRef.current.rotation.z = rotation[2] + Math.cos(t * 0.09) * 0.04;
        }

        if (pointsRef2.current) {
            const pos2 = pointsRef2.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < COUNT2; i++) {
                const ox = pos2[i * 3];
                const oz = pos2[i * 3 + 2];
                const r  = Math.sqrt(ox * ox + oz * oz);
                pos2[i * 3 + 1] += Math.sin(r * 1.2 + t * 1.4 + i * 0.01) * 0.0006;
            }
            pointsRef2.current.geometry.attributes.position.needsUpdate = true;

            pointsRef2.current.rotation.x = rotation[0] * 0.6 + Math.sin(t * 0.1) * 0.04;
            pointsRef2.current.rotation.y = -t * 0.03;
        }
    });

    const accentColor  = isDark ? "#8e2de2" : "#0062FF";
    const cloudColor   = isDark ? "#a855f7" : "#3b82f6";

    return (
        <group position={position}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions1, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    size={0.028}
                    transparent
                    opacity={isDark ? 0.75 : 0.6}
                    alphaTest={0.08}
                    depthWrite={false}
                    color={accentColor}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>

            <points ref={pointsRef2}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions2, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    map={texture}
                    size={0.018}
                    transparent
                    opacity={isDark ? 0.35 : 0.25}
                    alphaTest={0.05}
                    depthWrite={false}
                    color={cloudColor}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

export default AetherWaves; */

/* import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { UseTheme } from "../../contexts/ThemeContext";

interface AetherWavesProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

const AetherWaves = ({  position = [0.6, 0.8, 0], rotation = [3, 0.5, 0.3] }: AetherWavesProps) => {
    const { theme } = UseTheme()
    const pointsRef = useRef<THREE.Points>(null!);

    const texture = useLoader(THREE.TextureLoader, "../../textures/particle.png");

    const width = 120;   // cuántos puntos a lo ancho
    const depth = 120;   // cuántos puntos hacia el fondo
    const count = width * depth;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);

        let i = 0;
        for (let z = 0; z < depth; z++) {
        for (let x = 0; x < width; x++) {
            const i3 = i * 3;

            // distribuimos en una grilla
            pos[i3]     = (x - width / 2) * 0.07;
            pos[i3 + 1] = 0; // altura inicial
            pos[i3 + 2] = (z - depth / 2) * 0.07;

            i++;
        }
        }

        return pos;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
        let i = 0;
        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                const i3 = i * 3;
    
                const wave1 = Math.sin((x * 0.12 + t * 1.2)) * 0.12;
                const wave2 = Math.cos((z * 0.15 + t * 0.9)) * 0.12;
                const wave3 = Math.sin((x * 0.08 + z * 0.08 + t * 0.7)) * 0.15;
    
                pos[i3 + 1] = wave1 + wave2 + wave3;
    
                i++;
            }
        }
    
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
        // ROTACIÓN INICIAL (props)
        pointsRef.current.rotation.x = rotation[0];
        pointsRef.current.rotation.y = rotation[1];
        pointsRef.current.rotation.z = rotation[2];
    
        // ANIMACIÓN SUAVE (sumamos)
        pointsRef.current.rotation.x += Math.sin(t * 0.2) * 0.05;
        pointsRef.current.rotation.y += Math.sin(t * 0.15) * 0.05;
        pointsRef.current.rotation.z += Math.sin(t * 0.1) * 0.05;
    });

    return (
        <points ref={pointsRef} position={position} rotation={rotation}>
            
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>

        <pointsMaterial
            map={texture}
            size={0.03}
            transparent
            opacity={0.65}
            alphaTest={0.1}
            depthWrite={false}
            color={theme === "dark" ? "#cde0ff" : "#306ac8"}
            blending={THREE.AdditiveBlending}
        />
        </points>
    );
};

export default AetherWaves; */