import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import ProductCard from "../components/sections/ProductCard";
import "../styles/productCard.css";
import { UseTheme } from "../contexts/ThemeContext";
import Loader from "../components/sections/Loader";
import Error from "../components/sections/Error";

const IndividualProduct = () => {
    const { theme } = UseTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    
    // --- NUEVO ESTADO PARA EL INPUT DE BÚSQUEDA ---
    const [searchTerm, setSearchTerm] = useState(""); 
    
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const limit = 20;

    const [filters, setFilters] = useState({
        search: "",
        marca: "",
        categoria: "",
        talle: "",
        minPrecio: "",
        maxPrecio: "",
        enPromocion: false,
        soloStock: false 
    });

    // 1. CARGA DE METADATOS
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [resCat, resBrands] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/products/brands`, { withCredentials: true })
                ]);

                const catData = resCat.data.categorias || resCat.data;
                setCategories(Array.isArray(catData) ? catData : []);

                const brandData = resBrands.data;
                setBrands(Array.isArray(brandData) ? brandData : []);
            } catch (err) {
                console.error("Error cargando metadatos:", err);
                setCategories([]);
                setBrands([]);
            }
        };
        fetchMetadata();
    }, []);

    // 2. CARGA DE PRODUCTOS (Se dispara cuando cambia la página o los filtros aplicados)
    useEffect(() => {
        handleFetch();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, filters]); 

    const handleFetch = async () => {
        try {
            setError(null);
            setLoading(true);
            const offset = (page - 1) * limit;

            const hasActiveFilters = 
                filters.search.trim() !== "" || 
                filters.marca !== "" || 
                filters.categoria !== "" || 
                filters.talle !== "" || 
                filters.minPrecio !== "" || 
                filters.maxPrecio !== "" || 
                filters.enPromocion === true ||
                filters.soloStock === true;

            const endpoint = hasActiveFilters 
                ? `${import.meta.env.VITE_API_URL}/api/products/filter`
                : `${import.meta.env.VITE_API_URL}/api/products/limit`;

            const params = {
                limit,
                offset,
                nombre: filters.search.trim() || undefined,
                marca: filters.marca || undefined,
                categoria: filters.categoria || undefined,
                talle: filters.talle || undefined,
                minPre: filters.minPrecio || undefined,
                maxPre: filters.maxPrecio || undefined,
                promo: filters.enPromocion ? "true" : undefined,
                stock: filters.soloStock ? "true" : undefined
            };

            const response = await axios.get(endpoint, { params, withCredentials: true });

            if (response.status === 200) {
                setProducts(Array.isArray(response.data.products) ? response.data.products : []);
                setTotalProducts(response.data.total || 0);
            }
        } catch (error: any) {
            console.error("ERROR_SYSTEM: FALLO_CONEXION_DB", error)
            setError("ERROR_SYSTEM: FALLO_CONEXION_DB");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Manejador para selects y checkboxes (disparan búsqueda inmediata)
    const handleFilterChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setPage(1); 
    };

    // --- FUNCIÓN PARA PROCESAR EL FORMULARIO DE BÚSQUEDA ---
    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm }));
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm(""); // Limpiamos el input visual
        setFilters({
            search: "", marca: "", categoria: "", talle: "", minPrecio: "", maxPrecio: "", enPromocion: false, soloStock: false
        });
        setPage(1);
    };

    const totalPages = Math.ceil(totalProducts / limit);

    return (
        <div className={`products-view-layout ${theme}`}>
            <aside className="filters-sidebar">
                <h3 className="sidebar-title">FILTRAR PRODUCTOS</h3>
                
                <div className="filter-group">
                    {/* El formulario ahora maneja el submit */}
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <label>BÚSQUEDA</label>
                        <div className="search-input-wrapper">
                            <input 
                                className="search-input"
                                type="text" 
                                name="search" 
                                placeholder="Nombre..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button type="submit" className="btn-search-icon">🔍</button>
                        </div>
                    </form>
                </div>

                <div className="filter-group">
                    <label>CATEGORÍA</label>
                    <select name="categoria" value={filters.categoria} onChange={handleFilterChange}>
                        <option value="">TODAS LAS CATEGORÍAS</option>
                        {categories.map((cat: any) => (
                            <option key={cat._id || cat} value={cat.nombre || cat}>
                                {(cat.nombre || cat).toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>MARCA</label>
                    <select name="marca" value={filters.marca} onChange={handleFilterChange}>
                        <option value="">TODAS LAS MARCAS</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>{brand.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>TALLE</label>
                    <select name="talle" value={filters.talle} onChange={handleFilterChange}>
                        <option value="">TODOS</option>
                        <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>RANGO PRECIO</label>
                    <div className="price-inputs">
                        <input type="number" name="minPrecio" placeholder="Min" value={filters.minPrecio} onChange={handleFilterChange} />
                        <input type="number" name="maxPrecio" placeholder="Max" value={filters.maxPrecio} onChange={handleFilterChange} />
                    </div>
                </div>

                <div className="checkbox-row">
                    <div className="filter-group checkbox">
                        <input type="checkbox" name="enPromocion" id="promo" checked={filters.enPromocion} onChange={handleFilterChange} />
                        <label htmlFor="promo">OFERTAS</label>
                    </div>

                    <div className="filter-group checkbox">
                        <input type="checkbox" name="soloStock" id="stock" checked={filters.soloStock} onChange={handleFilterChange} />
                        <label htmlFor="stock">DISPONIBLE</label>
                    </div>
                </div>

                <button className="btn-clear-filters" onClick={clearFilters}>
                    LIMPIAR_FILTROS
                </button>
            </aside>

            <main className="products-main-content">
                {error ? <Error errorMessage={error} /> : (
                    <div className="individualProduct-container">
                        {loading ? <Loader /> : (products.length > 0) ? (
                            products.map((prod: any) => <ProductCard key={prod._id} product={prod} />)
                        ) : (
                            <div className="terminal-loader">NO_RESULTS_FOUND</div>
                        )}
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="pagination-controls">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-pagination">{"<< ANTERIOR"}</button>
                        <span className="page-indicator">{page} DE {totalPages || 1}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-pagination">{"SIGUIENTE >>"}</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default IndividualProduct;