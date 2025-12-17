import { useEffect, useRef } from "react";
import "../../styles/logoCarrousel.css"

const LogoCarrousel = () => {
    const logos = [
        "../../../public/logos/aftereffects.svg",
        "../../../public/logos/android.svg",
        "../../../public/logos/aws.svg",
        "../../../public/logos/azure.svg",
        "../../../public/logos/css.svg",
        "../../../public/logos/html.svg",
        "../../../public/logos/illustrator.svg",
        "../../../public/logos/ios.svg",
        "../../../public/logos/microsoft.svg",
        "../../../public/logos/mongo.svg",
        "../../../public/logos/photoshop.svg",
        "../../../public/logos/postman.svg",
        "../../../public/logos/premiere.svg",
        "../../../public/logos/python.svg",
        "../../../public/logos/typescript.svg",
    ]

    const trackRef = useRef<HTMLDivElement>(null);

    const posX = useRef(0);
    const velocity = useRef(1); // velocidad base
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const rafId = useRef<number | null>(null);

    // 🔁 Movimiento automático
    const animate = () => {
        if (!trackRef.current) return;

        if (!isDragging.current) {
        posX.current -= velocity.current;
        }

        const width = trackRef.current.scrollWidth / 2;

        if (Math.abs(posX.current) >= width) {
        posX.current = 0;
        }

        trackRef.current.style.transform = `translateX(${posX.current}px)`;
        rafId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        rafId.current = requestAnimationFrame(animate);
        return () => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // 🖱️ Drag
    const onPointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        lastX.current = e.clientX;
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientX - lastX.current;
        posX.current += delta;
        lastX.current = e.clientX;
    };

    const onPointerUp = () => {
        isDragging.current = false;
    };

    return (
        <div className="logo-carousel">

            <h1 style={{ color: "white", fontFamily: 'Montserrat', fontSize: "3rem", textAlign: "center"}}>
                We boost your design with the best tools
            </h1>

            <div className="logo-track" ref={trackRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
                {[...logos, ...logos].map((logo, i) => (
                <div className="logo-item" key={i}>
                    <img src={logo} alt="logo" />
                </div>
                ))}
            </div>
        </div>
    );
}

export default LogoCarrousel;
