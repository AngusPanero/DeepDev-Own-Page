/* import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import animationData from "../../animations/render-grid.json";

type RenderGridLottieProps = { height?: number; loop?: boolean; speed?: number; };

export default function RenderGridLottie({
  height = 260,
  loop = true,
  speed = 1
}: RenderGridLottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    });

    animationRef.current.setSpeed(speed);

    return () => {
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [loop, speed]);

  return (
    <div
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
} */