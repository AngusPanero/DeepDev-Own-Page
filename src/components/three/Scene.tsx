import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Scene = ({ children }: any) => {
    return (
        <Canvas gl={{ alpha: true }} style={{ background: "black", position: "relative", zIndex: 2 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 2, 2]} />

            { children }

            <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
        </Canvas>
    );
}

export default Scene