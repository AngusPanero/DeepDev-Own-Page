import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import Raffles from "../pages/Raffles";
import Company from "../pages/Company";
import NavBar from "../components/sections/NavBar";
import Footer from "../components/sections/Footer";
import Error from "../components/sections/Error";
import Loader from "../components/sections/Loader";

const AppRouter = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/raffles" element={<Raffles />} />
                <Route path="/company" element={<Company />} />
                <Route path="/error" element={<Error errorMessage="Error en el Servidor"/>} />
                <Route path="/loader" element={<Loader />} />
            </Routes>
            <Footer />
        </Router>
    );  
}

export default AppRouter;   

