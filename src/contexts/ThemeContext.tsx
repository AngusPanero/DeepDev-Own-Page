import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = useState(localStorage.getItem("theme") || "dark")
    
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleTheme = (e: string) => {
        setTheme(e)
        localStorage.setItem("theme", theme)
        console.log("Theme: ", theme);
        
    }

    return(
        <ThemeContext.Provider value={{ theme, handleTheme }}>
            { children }
        </ThemeContext.Provider>
    )
}

const useTheme = () => useContext(ThemeContext)

export default useTheme

