import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseTheme } from "../contexts/ThemeContext";
import Error from "../components/sections/Error";
import Loader from "../components/sections/Loader";
import "../styles/productParams.css";
import { UseFavorites } from "../contexts/FavoritesContext";
import { UseSession } from "../contexts/SessionContext";
import { UseReseñas } from "../contexts/ReseñasContext";
import { UseCart } from "../contexts/CartContext";

// --- COMPONENTES DE ICONOS ---
const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ffcc00" : "none"} stroke={filled ? "#ffcc00" : "#ffffff"} strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const HeartIcon = ({ setFav, filled }: { setFav: (e: React.MouseEvent) => void, filled: boolean }) => (
    <svg 
        onClick={setFav} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill={filled ? "red" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const LoadingIcon = () => (
    <svg className="spinner-icon" width="18" height="18" viewBox="0 0 50 50" style={{ marginRight: '8px' }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" style={{ opacity: 0.3 }}></circle>
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" style={{ animation: 'rotate 1s linear infinite' }}></circle>
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// --- INTERFACES ---
interface Variant {
    _id: string;
    sku_variante?: string;
    precio_adicional?: number;
    foto_variante?: string;
    stock?: number;
    talle?: string;
    color?: string;
    medida?: string;
}

interface Product {
    _id: string;
    nombre?: string;
    marca?: string;
    sku_padre?: string;
    precio_base?: number;
    en_promocion?: boolean;
    porcentaje_promo?: number;
    descripcion?: string;
    imagenes_generales?: string[];
    variantes?: Variant[];
    categorias?: string[];
    stock_base?: number;
    medidas_empaque?: {
        largo: number;
        ancho: number;
        alto: number;
        peso: number;
    };
}

const ParamsProduct = () => {
    const { id } = useParams();
    const { theme } = UseTheme();
    const { user } = UseSession();
    const { addToCart } = UseCart();
    const { reseñas, createProductReview, fetchReseñas } = UseReseñas();
    const { isFavorite, toggleFavorite } = UseFavorites();
    
    const [ data, setData ] = useState<Product | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);

    const [ selectedImg, setSelectedImg ] = useState(0);
    const [ quantity, setQuantity ] = useState(1);
    const [ selectedVariant, setSelectedVariant ] = useState<Variant | null>(null);
    const [ rating, setRating ] = useState(0);
    const [ reseña, setReseña ] = useState<string>("");
    const [ currentPage, setCurrentPage ] = useState(1);

    // Estado para la animación del botón de carrito
    const [ cartStatus, setCartStatus ] = useState<'idle' | 'loading' | 'success'>('idle');

    useEffect(() => {
        getProduct();
        fetchReseñas();
    }, [id]);

    const getProduct = async () => {
        try {
            setError(false);
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
            if (response.status === 200) {
                const product = response.data.product || response.data;
                setData(product);
                if (product.variantes && product.variantes.length > 0) {
                    setSelectedVariant(product.variantes[0]);
                }
            }
        } catch (error) {
            setError(true);
            console.error("Error al conseguir información! 🔴", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!data || cartStatus !== 'idle') return;

        setCartStatus('loading');
        
        try {
            await addToCart({
                id: selectedVariant ? selectedVariant._id : data._id, 
                productId: data._id,  
                nombre: `${data.nombre} ${selectedVariant?.talle || selectedVariant?.color || ""}`.trim(),
                precio: finalPrice, 
                imagen: selectedVariant?.foto_variante || data.imagenes_generales?.[0] || "",
                cantidad: quantity, 
                stockMax: currentStock
            });

            setCartStatus('success');
            setTimeout(() => setCartStatus('idle'), 2000);
        } catch (err) {
            console.error("Error al añadir", err);
            setCartStatus('idle');
        }
    };

    if (loading) return <Loader />;
    if (error || !data) return <Error errorMessage="Error al encontrar producto" />;

    const fullOriginalPrice = (data.precio_base || 0) + (selectedVariant?.precio_adicional || 0);
    const hasPromo = data.en_promocion && (data.porcentaje_promo || 0) > 0;
    const finalPrice = hasPromo 
        ? fullOriginalPrice * (1 - (data.porcentaje_promo || 0) / 100) 
        : fullOriginalPrice;

    const allImages = [...(data.imagenes_generales || [])];
    const currentStock: any = selectedVariant ? selectedVariant.stock : data.stock_base;

    const reviewsPerPage = 10;
    const productReviews = reseñas.filter(r => r.productId === id);
    const totalPages = Math.ceil(productReviews.length / reviewsPerPage);
    const currentReviews = productReviews
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

    return (
        <section className={`product-detail-section ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
            <div className={`dd-grid-overlay ${theme}`}></div>

            <div className="product-wrapper">
                {/* GALERÍA */}
                <div className="product-visuals">
                    <div className="main-display-container">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedVariant?.foto_variante || selectedImg}
                                src={selectedVariant?.foto_variante || allImages[selectedImg]}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="product-hero-image"
                                alt={data.nombre}
                            />
                        </AnimatePresence>
                    </div>
                    
                    <div className="thumbnail-strip">
                        {allImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedImg(idx)}
                                className={`thumb-item ${selectedImg === idx ? "active" : ""}`}
                            >
                                <img src={img} alt={`${data.nombre}-${idx}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* INFO */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="product-content"
                >
                    <div className="product-header">
                        <div className="header-top-row">
                            <div className="badge-new">SKU: {selectedVariant?.sku_variante || data.sku_padre}</div>
                            <button className="btn-wishlist-icon" title="Agregar a favoritos">
                                <HeartIcon 
                                    filled={data?._id ? isFavorite(data._id) : false} 
                                    setFav={(e) => { e.preventDefault(); 
                                        if (data?._id && data?.nombre) {
                                            toggleFavorite(data._id, data.nombre);
                                        }
                                    }}
                                />
                            </button>
                        </div>
                        <span className="brand-tag">{data.marca}</span>
                        <h1 className="product-title">{data.nombre}</h1>
                        
                        <div className="price-tag">
                            {hasPromo && (
                                <div className="promo-container">
                                    <span className="old-price">${fullOriginalPrice.toLocaleString()}</span>
                                    <span className="discount-percentage">-{data.porcentaje_promo}% OFF</span>
                                </div>
                            )}
                            <div className="current-price">
                                <span className="currency">$</span>
                                <span className="amount">{finalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="product-specs-box">
                        <span className="section-label">Especificaciones de Tamaño</span>
                        <div className="specs-grid">
                            <div className="spec-item"><span className="spec-label">Largo</span><span className="spec-value">{data.medidas_empaque?.largo || "0"} CM</span></div>
                            <div className="spec-item"><span className="spec-label">Ancho</span><span className="spec-value">{data.medidas_empaque?.ancho || "0"} CM</span></div>
                            <div className="spec-item"><span className="spec-label">Alto</span><span className="spec-value">{data.medidas_empaque?.alto || "0"} CM</span></div>
                            <div className="spec-item"><span className="spec-label">Peso</span><span className="spec-value">{data.medidas_empaque?.peso || "0"} GR</span></div>
                        </div>
                    </div>

                    <p className="product-description">{data.descripcion}</p>

                    {/* VARIANTES */}
                    {data.variantes && data.variantes.length > 0 && (
                        <div className="product-variants-box">
                            <span className="section-label">Opciones Disponibles</span>
                            <div className="variants-grid">
                                {data.variantes.map((v, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                                        className={`variant-pill ${selectedVariant?.sku_variante === v.sku_variante ? "active" : ""}`}
                                    >
                                        {v.color && <span className="v-color-dot" style={{background: v.color}}></span>}
                                        {v.talle?.toUpperCase() || v.medida?.toUpperCase() || v.color?.toUpperCase() || `Opción ${i + 1}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COMPRA */}
                    <div className="purchase-actions-container">
                        <div className="qty-wrapper">
                            <div className="qty-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span className="qty-value">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                                    disabled={quantity >= currentStock}
                                >+</button>
                            </div>
                            <motion.div key={selectedVariant?.sku_variante} className={`stock-indicator ${currentStock < 5 ? 'stock-low' : ''}`}>
                                <span className="stock-dot"></span>
                                <span className="stock-text">{currentStock > 0 ? `${currentStock} disponibles` : "Sin stock"}</span>
                            </motion.div>
                        </div>

                        <div className="main-btns">
                            <motion.button 
                                onClick={handleAddToCart}
                                whileTap={{ scale: 0.97 }} 
                                className={`btn-secondary-glass cart-btn-animated ${cartStatus}`}
                                disabled={currentStock <= 0 || cartStatus !== 'idle'}
                            >
                                <AnimatePresence mode="wait">
                                    {cartStatus === 'idle' && (
                                        <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            Añadir al Carrito
                                        </motion.span>
                                    )}
                                    {cartStatus === 'loading' && (
                                        <motion.span key="loading" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} style={{ display: 'flex', alignItems: 'center' }}>
                                            <LoadingIcon /> Procesando...
                                        </motion.span>
                                    )}
                                    {cartStatus === 'success' && (
                                        <motion.span key="success" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
                                            <CheckIcon /> ¡Añadido!
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                            
                            {currentStock > 0 && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-primary-glow">
                                    Comprar Ahora
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* SECCIÓN RESEÑAS */}
            <div className="reviews-section">
                <div className="reviews-container">
                    <h2 className="section-title">Valoraciones de Clientes</h2>
                    <div className="review-form-box">
                        <p>¿Qué te pareció este producto?</p>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => setRating(s)} className="star-btn">
                                    <StarIcon filled={s <= rating} />
                                </button>
                            ))}
                        </div>
                        <textarea className="review-textarea" value={reseña} placeholder="Escribe tu opinión aquí..." onChange={(e) => setReseña(e.target.value)} maxLength={500}></textarea>
                        <button onClick={() => { if (!user) return alert("Debes iniciar sesión"); createProductReview(reseña, rating, user?.email || "", id || ""); }} className="btn-submit-review" disabled={!reseña || rating === 0}>
                            Publicar Reseña
                        </button>
                    </div>

                    <div className={`reviews-list ${theme}`}>
                        {currentReviews.length > 0 ? (
                            <>
                                {currentReviews.map((r, idx) => (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={r._id || idx} className={`review-item-card ${theme}`}>
                                        <div className="review-item-header">
                                            <div className="user-info">
                                                <div className={`user-avatar-mini ${theme}`}>{r.userEmail.charAt(0).toUpperCase()}</div>
                                                <div className="user-meta-data">
                                                    <span className={`user-email-text ${theme}`}>{r.userEmail}</span>
                                                    <span className={`review-date ${theme}`}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Reciente'}</span>
                                                </div>
                                            </div>
                                            <div className="review-stars-display">
                                                {[1, 2, 3, 4, 5].map((star) => (<StarIcon key={star} filled={star <= r.rating} />))}
                                            </div>
                                        </div>
                                        <div className="review-body"><p className={`review-text-content ${theme}`}>"{r.reseña}"</p></div>
                                    </motion.div>
                                ))}
                                {totalPages > 1 && (
                                    <div className={`pagination-controls ${theme}`}>
                                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="btn-pagination">&lt; ANTERIOR</button>
                                        <span className="page-indicator">PÁGINA {currentPage} DE {totalPages}</span>
                                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="btn-pagination">SIGUIENTE &gt;</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={`empty-reviews-state ${theme}`}><p>Aún no hay valoraciones para este producto.</p></div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ParamsProduct;