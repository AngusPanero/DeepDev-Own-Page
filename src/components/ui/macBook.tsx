import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
        // Posición y escala del modelo 3D
        return <primitive object={model} scale={0.048} position={[0.9, 0.6, 0]} rotation={[0, 2, 0]} />;
    }

const FbxMacBook = () => {
    const textRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: textRef,
        offset: ["start 80%", "end 20%"]
    });

    // Entrada y salida del Texto
    const rawY = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], [100, 0, 0, -200]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    // Scroll Suavizado 
    const y = useSpring(rawY, { stiffness: 60, damping: 22, mass: 0.25 });
    const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 20 });

    return (
        <section style={{ display: "flex", flexDirection: "column" }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}
            style={{ cursor: "grab", width: "100%", height: "120vh", background: "black", pointerEvents: "auto", }}
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

        <motion.h1 ref={textRef} style={{ textAlignLast: "start", position: "relative", zIndex: 3, marginLeft: "4rem", marginTop: "-50vh", color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", fontFamily: "Inter, Poppins, sans-serif", opacity, y, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
            Real-Time 3D interaction
        </motion.h1>
        </section>
    );
};

export default FbxMacBook;