import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Contact from "../pages/Contact";
import Products from "../pages/Products";
import Raffles from "../pages/Raffles";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/raffles" element={<Raffles />} />
            </Routes>
        </Router>
    );  
}

export default AppRouter;   

