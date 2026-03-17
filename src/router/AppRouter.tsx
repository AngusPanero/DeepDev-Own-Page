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
import Sales from "../pages/Sales";
import RaffleTerms from "../pages/RaffleTerms";
import GTMHandler from "../utils/GTMHandler";
import IndividualProduct from "../pages/IndividualProduct";
import ParamsProduct from "../pages/ParamsProduct";
import { FavoritesProvider } from "../contexts/FavoritesContext";

const AppRouter = () => {
    return (
        <Router>
            <SessionProvider>
                <FavoritesProvider>
                    <Cookies />
                    <NavBar />
                    <GTMHandler />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/raffles" element={<Raffles />} />
                        <Route path="/company" element={<Company />} />
                        <Route path="/policy" element={<PoliticaCookies />} />
                        <Route path="/raffle-terms" element={<RaffleTerms />} />
                        <Route path="/testproducts" element={<IndividualProduct />} />
                        <Route path="/product/:id" element={<ParamsProduct />} />
                        <Route path="/*" element={<Error404 />} />
                        <Route path="/dashboard" element={<PrivateRoute adminOnly={false}><Dashboard /></PrivateRoute>} />
                        {/* Tiene Acceso solo el admin con la prop pasada */}
                        <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
                    </Routes>
                    <Footer />
                </FavoritesProvider>
            </SessionProvider>
        </Router>
    );  
}

export default AppRouter;   

