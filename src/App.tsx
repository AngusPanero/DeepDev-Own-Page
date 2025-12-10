import useLenis from "./hooks/useLenis"; 
import AppRouter from "./router/AppRouter";

const App = () => {
  useLenis()

  return(
    <AppRouter>

    </AppRouter>
  )
}

export default App