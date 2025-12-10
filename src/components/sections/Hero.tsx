import Scene from "../three/Scene";

const Hero = () => {
    return (
        <section style={{ height: "100vh", position: "relative" }}>
            <Scene />

            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white" }}>
                <h1>DeepDev</h1>
            </div>
        </section>
    );
}

export default Hero;