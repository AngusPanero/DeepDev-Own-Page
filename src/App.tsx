import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import useLenis from "./hooks/useLenis"; 
import AppRouter from "./router/AppRouter";

const App = () => {
  useLenis()

  return(
    <LanguageProvider>
      <ThemeProvider>
        <AppRouter>
          
        </AppRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App