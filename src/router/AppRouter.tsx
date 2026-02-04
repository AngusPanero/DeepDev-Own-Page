import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import Raffles from "../pages/Raffles";
import Company from "../pages/Company";
import NavBar from "../components/sections/NavBar";
import Footer from "../components/sections/Footer";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import PrivateRoute from "./PrivateRoute";
import { SessionProvider } from "../contexts/SessionContext";
import Error404 from "../pages/Error404";
import PoliticaCookies from "../pages/PoliticaCookies";
import Cookies from "../components/sections/Cookies";

const AppRouter = () => {
    return (
        <Router>
            <SessionProvider>
                <Cookies />
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/raffles" element={<Raffles />} />
                    <Route path="/company" element={<Company />} />
                    <Route path="/policy" element={<PoliticaCookies />} />
                    <Route path="/*" element={<Error404 errorMessage404={"404 - Página no encontrada."} />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    {/* Tiene Acceso solo el admin con la prop pasada */}
                    <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
                </Routes>
                <Footer />
            </SessionProvider>
        </Router>
    );  
}

export default AppRouter;   

