import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export function MacBookModel() {
    const model = useFBX("/3dmodels/MacBook.fbx");

    useEffect(() => {
        model.traverse((child: any) => {
            if (child.isMesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
    
            // 🔧 Corrección GLOBAL del material
            mat.color.set("#2a2a2a");        // oscurece el conjunto
            mat.envMapIntensity = 0.5;      // quita reflejo azulado
            mat.metalness = 0.35;            // menos metal = menos color raro
            mat.roughness = 0.65;            // más rough = menos brillo
            mat.emissiveIntensity = 0;       // evita glow falso
    
            mat.needsUpdate = true;
            }
        });
        }, [model]);
    
        return <primitive object={model} scale={0.055} position={[0, 0.2, 0]} rotation={[0, 2, 0]} />;
    }

const FbxMacBook = () => {
    return (
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}
            style={{ width: "100%", height: "110vh", background: "radial-gradient(circle at center, #2b2b2b 15%, #111111 25%, #000000 100%)", pointerEvents: "auto", }}
            gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 6, }}>
            
            <Environment preset="studio" />

            <ambientLight intensity={0.9} />

            {/* Arriba */}
            <directionalLight position={[-1, 5, -6]} intensity={0.7} />

            {/* Abajo (muy suave) */}
            <directionalLight position={[0, -5, 0]} intensity={0.15} />

            {/* Derecha */}
            <directionalLight position={[5, 2, 0]} intensity={0.4} />

            {/* Izquierda */}
            <directionalLight position={[-5, 2, 0]} intensity={0.4} />

            <MacBookModel />

            <OrbitControls enableRotate enableZoom={false} enablePan={false} />
        </Canvas>
    );
};

export default FbxMacBook;