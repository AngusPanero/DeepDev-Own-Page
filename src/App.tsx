import AmbientOverlay from "./components/ui/AmbientOverlat";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import useLenis from "./hooks/useLenis"; 
import AppRouter from "./router/AppRouter";
import "./styles/tubesCursor.css"

const App = () => {
  useLenis()

  return(
    <LanguageProvider>
      <ThemeProvider>
        <AmbientOverlay />
        <AppRouter>
    
        </AppRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App