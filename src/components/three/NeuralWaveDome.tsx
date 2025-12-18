import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const DomeShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#9b5cff") },
        uColor2: { value: new THREE.Color("#ff00aa") },
        uColor3: { value: new THREE.Color("#00eaff") },
        uOpacity: { value: 0.6 }
    },

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
    const layers = 4
    const groupRef = useRef<THREE.Group>(null);

    const materials = useMemo(() => {
        return [...Array(layers)].map((_, i) => {
            const mat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(DomeShader.uniforms),
                vertexShader: DomeShader.vertexShader,
                fragmentShader: DomeShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.BackSide // clave para que la cúpula te envuelva
            });
        mat.uniforms.uOpacity.value = 0.35 + i * 0.12;
        return mat;
        });
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        materials.forEach((m, i) => {
        m.uniforms.uTime.value = t + i * 0.4;
        });

        if (groupRef.current) {
        groupRef.current.rotation.y = t * 0.05;
        groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[-3, -1, 0]} scale={[1, 1, 1]}>
            {materials.map((mat, i) => (
                <mesh key={i} material={mat}>
                    <sphereGeometry args={[1.5 + i * 0.15, 160, 160]} />
                </mesh>
            ))}
        </group>
    );
}

export default NeuralWaveDome;  
