import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import useTheme from "../../contexts/ThemeContext";

const Scene = ({ children }: any) => {
    const { theme } = useTheme()
    
    return (
        <Canvas gl={{ alpha: true }} style={{ background: theme === "dark" ? "black" : "#F0F4F8", position: "relative", zIndex: 2 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 2, 2]} />

            { children }

            <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
        </Canvas>
    );
}

export default Scene