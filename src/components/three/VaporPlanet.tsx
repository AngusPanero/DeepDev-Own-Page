import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface VaporPlanetProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
}

const VaporPlanet = ({position = [-5, 0, -3],rotation = [0, 0, 0], scale = [1, 1, 0.4]}: VaporPlanetProps) => {
    const vaporRef = useRef<THREE.Points>(null!);
    const sphereRef = useRef<THREE.Mesh>(null!);

    // 🔹 Textura circular para las partículas
    const texture = useLoader(THREE.TextureLoader, "/textures/particle.png");

    const count = 60500;

    // =============================
    // ☁️ GENERAR POSICIONES DEL VAPOR
    // =============================
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const radius = 1.45 + Math.random() * 0.4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i3]     = Math.sin(phi) * Math.cos(theta) * radius;
            positions[i3 + 1] = Math.cos(phi) * radius;
            positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

            velocities[i3]     = positions[i3] * 0.003;
            velocities[i3 + 1] = positions[i3 + 1] * 0.003;
            velocities[i3 + 2] = positions[i3 + 2] * 0.003;
        }

        return { positions, velocities };
    }, []);

    // =============================
    // 🔥 ANIMACIÓN POR FRAME
    // =============================
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const pos = vaporRef.current.geometry.attributes.position.array as Float32Array;

        // ⭐ ANIMACIÓN DEL COLOR DE LA ESFERA
        const mat = sphereRef.current.material as THREE.MeshPhysicalMaterial;
        const tone = (Math.sin(t * 0.7) + 1) / 2;

        const bright = new THREE.Color("#cde0ff");
        const mid = new THREE.Color("#cde0ff");
        const dark = new THREE.Color("#cde0ff");

        const final =
            tone < 0.5
                ? bright.clone().lerp(mid, tone * 2)
                : mid.clone().lerp(dark, (tone - 0.5) * 2);

        mat.color.copy(final);
        mat.emissive.copy(final).multiplyScalar(0.12 + tone * 0.15);
        mat.transmission = 0.12 + tone * 0.1;

        // ☁️ ANIMAR EL VAPOR
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            pos[i3] += velocities[i3] * 1;
            pos[i3 + 1] += velocities[i3 + 1] * 1 + Math.sin(t + i * 0.2) * 0.002;
            pos[i3 + 2] += velocities[i3 + 2] * 1;

            const dist = Math.hypot(pos[i3], pos[i3 + 1], pos[i3 + 2]);

            if (dist > 5) {
                const radius = 1.45 + Math.random() * 1.5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;

                pos[i3]     = Math.sin(phi) * Math.cos(theta) * radius;
                pos[i3 + 1] = Math.cos(phi) * radius;
                pos[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
            }
        }

        vaporRef.current.rotation.y = t * 0.1;
        vaporRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* 🔵 ESFERA ANIMADA */}
            <mesh ref={sphereRef}>
                <sphereGeometry args={[1.25, 64, 64]} />
                <meshPhysicalMaterial roughness={0.45} metalness={0} clearcoat={1} />
            </mesh>

            {/* ☁️ VAPOR REDONDO */}
            <points ref={vaporRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                </bufferGeometry>

                <pointsMaterial
                    map={texture}
                    size={0.06}
                    transparent
                    opacity={0.3}
                    alphaTest={0.1}
                    depthWrite={false}
                    color="#cde0ff"
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

export default VaporPlanet;