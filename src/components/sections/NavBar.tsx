import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../../public/images/DeepDev Logo.jpg"
import "../../styles/navBar.css"
import Login from "./Login";

// z-Index 999
const NavBar = () => {
    const [ loginOpen, setLoginOpen ] = useState(false);    
    const [ showPromo, setShowPromo ] = useState(true); 

    const lastScrollY = useRef(0);  

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            
            if( currentScroll > lastScrollY.current && currentScroll > 20){
                setShowPromo(false);
            } else {
                setShowPromo(true); 
            }
            lastScrollY.current = currentScroll
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (
        <>
        <section className={"nav-wrapper"}>
            <div className={`nav-promo ${showPromo ? "open" : "closed"}`}>
                🔥 -- Take advantage of a 20% OFF for a limited time -- 🔥
            </div>

            <header className="hero-header" style={{ height: "5.5rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div className="left-actions" style={{ marginLeft: "2rem" }}>
                    <Link to="/"><img className="img-logo" src={logo} alt="logo" width={165} /></Link>
                </div>
                <nav>
                    <ul style={{ display: "flex", gap: "5rem"}}>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/quotes">Quotes</a></li>
                        <li><a href="/company">Company</a></li>

                        <li><a href="/raffles">Raffles</a></li>
                        <li><a href="/recruiters">Recruiters</a></li>
                    </ul>   
                </nav>

                <div className="right-actions" style={{ marginRight: "2rem", display: "flex", gap: "1rem" }}>
                    <Link to="/contact" className="nav-buttons">Contact</Link>
                    <button onClick={() => setLoginOpen(true)} className="nav-buttons">Login</button>
                </div>
            </header>
        </section>
        { loginOpen && <Login closeLogin={() => setLoginOpen(false)} /> }
        </>
    );
}

export default NavBar;