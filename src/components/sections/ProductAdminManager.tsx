import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { type AppDispatch } from "../../redux/store";
import { readAllProduct, exportProductsCSV, importProductsCSV, bulkDeleteProducts, bulkUpdateProducts } from '../../redux/slice';
import ProductRow from './ProductRow';
import "../../styles/adminInventory.css";
import { UseTheme } from '../../contexts/ThemeContext';

const AdminInventory = () => {
    const dispatch: AppDispatch = useDispatch();
    const { theme } = UseTheme()
    
    const { loading, error, products } = useSelector((state: any) => state.productSelector);

    const [ categories, setCategories ] = useState<any[]>([]);
    const [ search, setSearch ] = useState("");
    const [ categoryFilter, setCategoryFilter ] = useState("all");
    const [ statusFilter, setStatusFilter ] = useState("todos");
    const [ selectedIds, setSelectedIds ] = useState<string[]>([]);
    
    // --- ESTADOS DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    // Estados para cambios masivos
    const [ bulkPriceChange, setBulkPriceChange ] = useState<number>(0);
    const [ bulkPromoPercent, setBulkPromoPercent ] = useState<number>(0);

    useEffect(() => {
        dispatch(readAllProduct());
        fetchCategories();
    }, [dispatch]);

    // Resetear a la página 1 cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryFilter, statusFilter]);

    // --- SCROLL TO TOP AL CAMBIAR DE PÁGINA ---
    /* useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]); */

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, { withCredentials: true });
            if (res.data && res.data.categorias) {
                console.log(res.data.categorias);
                
                setCategories(res.data.categorias);
            } else {
                setCategories([]); // Fallback para evitar undefined
            }
        } catch (err) { 
            console.error(err); 
            setCategories([]);
        }
    };

    // --- 1. ESTADÍSTICAS ---
    const stats = {
        total: products?.length || 0,
        activos: products?.filter((p: any) => p.estado === 'activo').length || 0,
        enPromo: products?.filter((p: any) => p.en_promocion).length || 0,
        pausados: products?.filter((p: any) => p.estado === 'pausado').length || 0,
    };

    // --- 2. FILTRADO INTELIGENTE ---
    const filteredProducts = products?.filter((p: any) => {
        const matchesName = p.nombre?.toLowerCase().includes(search.toLowerCase()) || 
                            p.marca?.toLowerCase().includes(search.toLowerCase()) || 
                           p.sku_padre?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.categories?.includes(categoryFilter);
        
        let matchesStatus = true;
        if (statusFilter === "promo") {
            matchesStatus = p.en_promocion;
        } else if (statusFilter !== "todos") {
            matchesStatus = p.estado === statusFilter;
        }
        
        return matchesName && matchesCategory && matchesStatus;
    }) || [];

    // --- LÓGICA DE PAGINACIÓN ---
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // --- 3. GESTIÓN DE SELECCIÓN ---
    const handleSelectAll = () => {
        const allFilteredIds = filteredProducts.map((p: any) => p._id);
        const areAllVisibleSelected = allFilteredIds.length > 0 && 
            allFilteredIds.every((id: string) => selectedIds.includes(id));

        if (areAllVisibleSelected) {
            setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
        }
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // --- 4. ACCIONES MASIVAS ---
    const handleBulkUpdate = (cambios: any) => {
        if (window.confirm(`¿APLICAR_CAMBIOS_A_${selectedIds.length}_PRODUCTOS?`)) {
            dispatch(bulkUpdateProducts({ ids: selectedIds, cambios }));
            setSelectedIds([]);
        }
    };

    const isMasterChecked = filteredProducts.length > 0 && 
        filteredProducts.every((p: any) => selectedIds.includes(p._id));

    return (
        <div className={`admin-inventory-wrapper ${theme}`}>
            {error && <div className="terminal-error">SYSTEM_FAILURE_🔴: {error}</div>}

            {/* DASHBOARD DE ESTADOS */}
            <div className="admin-stats-bar">
                <div className={`stat-card ${statusFilter === 'todos' ? 'active' : ''}`} onClick={() => setStatusFilter('todos')}>
                    <span className="stat-label">TOTAL_DB</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className={`stat-card stat-promo ${statusFilter === 'promo' ? 'active' : ''}`} onClick={() => setStatusFilter('promo')}>
                    <span className="stat-label">OFERTAS_HOT</span>
                    <span className="stat-value">{stats.enPromo}</span>
                </div>
                <div className={`stat-card status-active ${statusFilter === 'activo' ? 'active' : ''}`} onClick={() => setStatusFilter('activo')}>
                    <span className="stat-label">ACTIVOS</span>
                    <span className="stat-value">{stats.activos}</span>
                </div>
                <div className={`stat-card status-paused ${statusFilter === 'pausado' ? 'active' : ''}`} onClick={() => setStatusFilter('pausado')}>
                    <span className="stat-label">PAUSADOS</span>
                    <span className="stat-value">{stats.pausados}</span>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="filter-group">
                    <input 
                        type="text" 
                        placeholder="BUSCAR_SISTEMA..." 
                        className="terminal-input search-admin"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                        className="terminal-select category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">CATEGORÍAS</option>
                        {categories.map((cat: any) => (
                            <option key={cat._id} value={cat.nombre}>{cat.nombre.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                
                <div className="admin-actions-right">
                    <button className="btn-csv" onClick={() => dispatch(exportProductsCSV())}>EXPORTAR</button>
                    <label className="btn-csv" style={{ cursor: 'pointer' }}>
                        IMPORTAR
                        <input type="file" hidden onChange={(e) => e.target.files && dispatch(importProductsCSV(e.target.files[0]))} />
                    </label>
                </div>
            </div>

            {/* PANEL DE ACCIONES MASIVAS */}
            <div className={`bulk-actions-panel ${selectedIds.length > 0 ? 'active' : ''}`}>
                <div className="bulk-header">
                    <span className="blink">●</span> MODO_EDICIÓN_MASIVA: {selectedIds.length}_ITEMS
                </div>
                <div className="bulk-controls">
                    <div className="bulk-section promo-mass">
                        <input 
                            type="number" 
                            placeholder="%_PROMO" 
                            value={bulkPromoPercent || ""}
                            onChange={(e) => setBulkPromoPercent(Number(e.target.value))}
                        />
                        <button className="btn-apply-promo" onClick={() => handleBulkUpdate({ en_promocion: true, porcentaje_promo: bulkPromoPercent })}>
                            PONER_EN_PROMO
                        </button>
                        <button className="btn-clear-promo" onClick={() => handleBulkUpdate({ en_promocion: false, porcentaje_promo: 0 })}>
                            QUITAR_PROMO
                        </button>
                    </div>

                    <div className="bulk-separator"></div>

                    <div className="bulk-section">
                        <button onClick={() => handleBulkUpdate({ estado: 'activo' })}>ACTIVAR</button>
                        <button onClick={() => handleBulkUpdate({ estado: 'pausado' })}>PAUSAR</button>
                    </div>
                    
                    <div className="bulk-section price-adjust">
                        <input 
                            type="number" 
                            placeholder="+/- %_PRECIO" 
                            value={bulkPriceChange || ""}
                            onChange={(e) => setBulkPriceChange(Number(e.target.value))}
                        />
                        <button onClick={() => handleBulkUpdate({ porcentaje_precio: bulkPriceChange })}>
                            ACTUALIZAR_BASE
                        </button>
                    </div>

                    <button className="btn-bulk-delete" onClick={() => {
                        if(window.confirm("¿ELIMINAR_SELECCION?")) dispatch(bulkDeleteProducts(selectedIds));
                    }}>BORRAR</button>
                </div>
            </div>

            {/* TABLA */}
            <div className="inventory-list-container">
                <div className="list-header">
                    <span className="col-check">
                        <input type="checkbox" onChange={handleSelectAll} checked={isMasterChecked} />
                    </span>
                    <span className="col-img">IMG</span>
                    <span className="col-data">PRODUCTO / SKU</span>
                    <span className="col-price">PRECIO_BASE</span>
                    <span className="col-status">ESTADO</span>
                    <span className="col-actions">CONTROL</span>
                </div>

                <div className="list-body">
                    {loading ? (
                        <div className="terminal-loader">CARGANDO_DATOS...</div>
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((prod: any) => (
                            <ProductRow categoriesProp={categories}
                                key={prod._id} 
                                product={prod} 
                                isSelected={selectedIds.includes(prod._id!)}
                                onSelect={handleSelect}
                            />
                        ))
                    ) : (
                        <div className="no-results">SIN_COINCIDENCIAS</div>
                    )}
                </div>
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {filteredProducts.length > itemsPerPage && (
                <div className="sh-pagination">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => p - 1)} 
                        className="sh-pag-btn"
                    >
                        PREV
                    </button>
                    <span className="sh-pag-info">
                        PAGINA {currentPage} / {totalPages} (TOTAL: {filteredProducts.length})
                    </span>
                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(p => p + 1)} 
                        className="sh-pag-btn"
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;