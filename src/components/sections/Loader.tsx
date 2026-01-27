import { useState, useEffect } from "react";
import "../../styles/Loader.css"; 
import useTheme from "../../contexts/ThemeContext";

const Loader = ({ onComplete }) => {
    const { theme } = useTheme()
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress < 100) {
            const timer = setTimeout(() => setProgress(prev => prev + 1), 20);
            return () => clearTimeout(timer);
        } else {
            const delay = setTimeout(() => onComplete?.(), 500); 
            return () => clearTimeout(delay);
        }
    }, [progress, onComplete]);

    return (
        <>
        <div className={`deepdev-loader ${theme}`}>
            <h1 className={`deepdev-title ${theme}`}>DeepDev</h1>
            <div className={`loader-bar ${theme}`}>
                <div className={`loader-fill ${theme}`} style={{ width: `${progress}%` }} />
            </div>
            <p className={`loader-percent ${theme}`}>{progress}%</p>
        </div>
        </>
    );
};

export default Loader;