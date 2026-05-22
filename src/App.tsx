import AmbientOverlay from "./components/ui/AmbientOverlat";
import LiquidOverlay from "./components/ui/LiquidOverlay";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ShoppingProvider } from "./contexts/ShoppingContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UsersProvider } from "./contexts/UsersContext";
import { WidthProvider } from "./contexts/WidthContext";
import useLenis from "./hooks/useLenis"; 
import AppRouter from "./router/AppRouter";
import "./styles/tubesCursor.css"

const App = () => {

  useLenis()

  return(
    <LanguageProvider>
      <WidthProvider>
        <ThemeProvider>
          <ShoppingProvider>
            <LiquidOverlay />
            <AmbientOverlay />
            <UsersProvider>
                <AppRouter>

                </AppRouter>
            </UsersProvider>
          </ShoppingProvider>
        </ThemeProvider>
      </WidthProvider>  
    </LanguageProvider>
  )
}

export default App