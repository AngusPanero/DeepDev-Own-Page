import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import useTheme from "../../contexts/ThemeContext";
import { useWidth } from "../../contexts/WidthContext";

const DomeShaderSource = {
    vertexShader: `
        varying vec3 vPos;
        varying vec2 vUv;
        uniform float uTime;

        float noise(vec3 p){
            return sin(p.x*1.5 + uTime*0.5) *
                   sin(p.y*1.3 + uTime*0.7) *
                   sin(p.z*1.8 + uTime*0.4);
        }

        void main() {
            vUv = uv;
            vPos = position;
            float ripple = noise(normalize(position) * 2.0) * 0.35;
            vec3 newPos = position + normal * ripple;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uOpacity;
        varying vec3 vPos;
        varying vec2 vUv;

        void main() {
            float heightMix = smoothstep(-1.0, 1.0, vPos.y);
            float radialMix = length(vUv - 0.5);
            vec3 color = mix(uColor1, uColor2, heightMix);
            color = mix(color, uColor3, radialMix * 0.7);
            float alpha = uOpacity * (1.0 - radialMix * 0.4);
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const NeuralWaveDome = () => {
    const { theme } = useTheme();
    const { width } = useWidth()
    const groupRef = useRef<THREE.Group>(null);
    const layers = 4;

    // Colores Blue Tech
    const colors = useMemo(() => ({
        dark: {
            c1: new THREE.Color("#9b5cff"), 
            c2: new THREE.Color("#ff00aa"), 
            c3: new THREE.Color("#00eaff"), 
            opacity: 0.6
        },
        light: {
            c1: new THREE.Color("#0062FF"), 
            c2: new THREE.Color("#70E4FF"), 
            c3: new THREE.Color("#F4F7FA"), 
            opacity: 0.25
        }
    }), []);

    const materials = useMemo(() => {
        return [...Array(layers)].map((_, i) => {
            return new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: colors.dark.c1 },
                    uColor2: { value: colors.dark.c2 },
                    uColor3: { value: colors.dark.c3 },
                    uOpacity: { value: 0.35 + i * 0.12 }
                },
                vertexShader: DomeShaderSource.vertexShader,
                fragmentShader: DomeShaderSource.fragmentShader,
                transparent: true,
                depthWrite: false,
                side: THREE.BackSide,
            });
        });
    }, [colors]);

    useEffect(() => {
        const config = theme === "dark" ? colors.dark : colors.light;
        materials.forEach((mat, i) => {
            mat.uniforms.uColor1.value = config.c1;
            mat.uniforms.uColor2.value = config.c2;
            mat.uniforms.uColor3.value = config.c3;
            mat.uniforms.uOpacity.value = (theme === "dark" ? 0.35 : 0.15) + i * 0.1;
            
            mat.blending = theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending;
        });
    }, [theme, materials, colors]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        materials.forEach((m, i) => {
            m.uniforms.uTime.value = t + i * 0.4;
        });
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={width >= 768 ? [-3, -1, 0] : [-1.5, 0, 0] }>
            {materials.map((mat, i) => (
                <mesh key={i} material={mat}>
                    <sphereGeometry args={width >= 768 ? [1.5 + i * 0.15, 64, 64] : [1.2 + i * 0.15, 64, 64] } /> 
                </mesh>
            ))}
        </group>
    );
};

export default NeuralWaveDome;