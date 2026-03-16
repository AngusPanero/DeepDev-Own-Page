import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/sections/ProductCard";
import "../styles/productCard.css"
import { UseTheme } from "../contexts/ThemeContext";
import Loader from "../components/sections/Loader";
import Error from "../components/sections/Error";

const IndividualProduct = () => {
    const { theme } = UseTheme()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    
    // Estados de Paginación
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 20;

    useEffect(() => {
        handleFetch();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]); 

    const handleFetch = async () => {
        try {
            setError(null);
            setLoading(true);

            const offset = (page - 1) * limit;

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/products/limit?limit=${limit}&offset=${offset}`, 
                { withCredentials: true }
            );

            if (response.status === 200) {
                setProducts(response.data.products);
                setTotalProducts(response.data.total || 0);
            }
        } catch (error: any) {
            setError("ERROR_SYSTEM: FALLO_CONEXION_DB");
            console.error("Error al traer listado de productos! 🔴", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalProducts / limit);

    if(error) return <Error errorMessage="No hay productos disponibles" />

    return (
        <div className="products-view-wrapper" style={{ backgroundColor: theme === "dark" ? "#000000" : "#ffffff" }}>
            <div className="individualProduct-container">
                {loading ? (
                    <Loader />
                ) : Array.isArray(products) && products.length > 0 ? (
                    products.map((prod: any) => <ProductCard key={prod._id} product={prod} />)
                ) : (
                    <div className="terminal-loader">NO_RESULTS_FOUND</div>
                )}
            </div>

            {/* BOTONERA DE PAGINACIÓN */}
            {!loading && products.length > 0 && (
                <div className="pagination-controls">
                    <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}className="btn-pagination">
                        {"<< ANTERIOR"}
                    </button>

                    <span className="page-indicator">
                        {page} DE {totalPages || 1}
                    </span>

                    <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)} className="btn-pagination">
                        {"SIGUIENTE >>"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default IndividualProduct;