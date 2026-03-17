import React from 'react';
import "../../styles/productCard.css"
import { UseTheme } from '../../contexts/ThemeContext';

interface ProductProps {
    product: {
        _id: string;
        nombre: string;
        sku_padre: string;
        precio_base: number;
        imagenes_generales: string[];
        estado: 'activo' | 'pausado' | 'borrado';
        // Nuevos campos para la promo
        en_promocion?: boolean;
        porcentaje_promo?: number;
    };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
    const { theme } = UseTheme();

    const mainImage = product.imagenes_generales.length > 0 
        ? product.imagenes_generales[0] 
        : 'https://placehold.co/300x400/000000/a855f7?text=SIN_IMAGEN';

    // Cálculo del precio final
    const tienePromo = product.en_promocion && (product.porcentaje_promo ?? 0) > 0;
    const precioFinal = tienePromo 
        ? product.precio_base * (1 - (product.porcentaje_promo ?? 0) / 100)
        : product.precio_base;


    return (
        <div className={`product-card-terminal ${theme} ${product.estado} ${tienePromo ? 'is-on-sale' : ''}`}>
            {/* Badge de Estado o de Descuento */}
            <div className="status-badge">
                {tienePromo ? `OFERTA: ${product.porcentaje_promo}% OFF` : product.estado.toUpperCase()}
            </div>
            
            <div className="product-card-image-wrapper">
                <img src={mainImage} alt={product.nombre} className="product-card-img" />
                {tienePromo && <div className="sale-overlay">SALE</div>}
            </div>

            <div className="product-card-info">
                <span className="product-card-sku">SKU: {product.sku_padre}</span>
                
                <div className="product-card-title-row">
                    <h4 className="product-card-title">{product.nombre.toUpperCase()}</h4>
                </div>
                
                <div className="product-card-footer">
                    <div className="product-card-price-container">
                        {tienePromo && (
                            <span className="product-card-old-price">
                                ${product.precio_base.toLocaleString('es-AR')}
                            </span>
                        )}
                        <span className={`product-card-price ${tienePromo ? 'price-sale' : ''}`}>
                            ${precioFinal.toLocaleString('es-AR')}
                        </span>
                    </div>
                    
                    <a href={`/product/${product._id}`}><button className="btn-details-terminal">[ VER_MÁS ]</button></a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;