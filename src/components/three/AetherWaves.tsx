import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface AetherWavesProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

const AetherWaves = ({  position = [0.9, 0.6, 0], rotation = [3, 0.5, 0.3] }: AetherWavesProps) => {
    const pointsRef = useRef<THREE.Points>(null!);

    const texture = useLoader(THREE.TextureLoader, "../../textures/particle.png");

    const width = 150;   // cuántos puntos a lo ancho
    const depth = 180;   // cuántos puntos hacia el fondo
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
    
        // 🔥 ROTACIÓN INICIAL (props)
        pointsRef.current.rotation.x = rotation[0];
        pointsRef.current.rotation.y = rotation[1];
        pointsRef.current.rotation.z = rotation[2];
    
        // 🔥 ANIMACIÓN SUAVE (sumamos)
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
            color="#cde0ff"
            blending={THREE.AdditiveBlending}
        />
        </points>
    );
};

export default AetherWaves;