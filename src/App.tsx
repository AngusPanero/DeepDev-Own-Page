import { LanguageProvider } from "./contexts/LanguageContext";
import useLenis from "./hooks/useLenis"; 
import AppRouter from "./router/AppRouter";

const App = () => {
  useLenis()

  return(
    <LanguageProvider>
      <AppRouter>
        
      </AppRouter>
    </LanguageProvider>
  )
}

export default App