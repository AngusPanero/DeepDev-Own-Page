import { createContext, useContext, useEffect, useState } from "react";

const WidthContext = createContext();

export const WidthProvider = ({ children }) => {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;

    return (
        <WidthContext.Provider value={{ width, isMobile }}>
            {children}
        </WidthContext.Provider>
    );
};

export const useWidth = () => {
    const context = useContext(WidthContext);
    if (!context) {
        throw new Error("useWidth debe usarse dentro de un WidthProvider");
    }
    return context;
};