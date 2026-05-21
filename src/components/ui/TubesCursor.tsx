import React, { useEffect, useRef } from 'react';
import Tubes from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';
import "../../styles/tubesCursor.css";
import { UseWidth } from '../../contexts/WidthContext';
import { UseTheme } from '../../contexts/ThemeContext';

const TubesCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const { width } = UseWidth();
  const { theme } = UseTheme();
  const isDark = theme !== 'light';

  const tubeColors = isDark
    ? ['#8e2de2', '#a855f7', '#4a00e0']
    : ['#0062FF', '#0080ff', '#0041cb'];

  const lightColors = isDark
    ? ['#8e2de2', '#ffffff', '#4a00e0', '#a855f7']
    : ['#0062FF', '#0041cb', '#e8e4ff', '#0080ff'];

  useEffect(() => {
    if (canvasRef.current && !appRef.current) {
      appRef.current = Tubes(canvasRef.current, {
        tubes: {
          radius: 0.02,
          segments: 64,
          colors: tubeColors,
          lights: {
            intensity: 5,
            colors: lightColors,
          },
        },
      });
    }

    const handleClick = () => {
      if (appRef.current) {
        const pick = tubeColors[Math.floor(Math.random() * tubeColors.length)];
        appRef.current.tubes.setColors([pick]);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      if (appRef.current?.destroy) appRef.current.destroy();
    };
  }, []);

  // Solo desktop
  if (width <= 768) return null;

  return (
    <canvas id="tubes-cursor-canvas" ref={canvasRef} />
  );
};

export default TubesCursor;