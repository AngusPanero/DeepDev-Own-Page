import React from 'react';
import "../../styles/productCard.css"
import { UseTheme } from '../../contexts/ThemeContext';

interface Variante {
    sku_variante: string;
    talle?: string;
    color?: string;
    stock: number;
    precio_adicional: number; // Suponiendo que sumas al base
    precio_unitario?: number; // O si cada una tiene su precio final
}

interface ProductProps {
    product: {
        _id: string;
        nombre: string;
        sku_padre: string;
        precio_base: number;
        imagenes_generales: string[];
        estado: 'activo' | 'pausado' | 'borrado';
        en_promocion?: boolean;
        porcentaje_promo?: number;
        variantes?: Variante[]; // Añadimos variantes a la interfaz
    };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
    const { theme } = UseTheme();

    const mainImage = product.imagenes_generales.length > 0 
        ? product.imagenes_generales[0] 
        : 'https://placehold.co/300x400/000000/a855f7?text=SIN_IMAGEN';

    // --- LÓGICA DE PRECIO DE VARIANTES ---
    
    // 1. Determinar el precio de referencia (el de las variantes o el base)
    let precioReferencia = product.precio_base;
    let tieneVariantes = product.variantes && product.variantes.length >= 2;

    if (tieneVariantes) {
        // Buscamos el precio más bajo entre las variantes para mostrar "Desde"
        // Si usas 'precio_unitario' directamente:
        const preciosVariantes = product.variantes!.map(v => v.precio_unitario || (product.precio_base + (v.precio_adicional || 0)));
        precioReferencia = Math.min(...preciosVariantes);
    }

    // 2. Cálculo del precio final con promoción aplicada al precio de referencia
    const tienePromo = product.en_promocion && (product.porcentaje_promo ?? 0) > 0;
    const precioFinal = tienePromo 
        ? precioReferencia * (1 - (product.porcentaje_promo ?? 0) / 100)
        : precioReferencia;


    return (
        <a href={`/product/${product._id}`}>
        <div className={`product-card-terminal ${theme} ${product.estado} ${tienePromo ? 'is-on-sale' : ''}`}>
            
            <div className="status-badge">
                {tienePromo ? `OFERTA: ${product.porcentaje_promo}% OFF` : product.estado.toUpperCase()}
            </div>
            
            <div className="product-card-image-wrapper">
                <img src={mainImage} alt={product.nombre} className="product-card-img" />
            </div>

            <div className="product-card-info">
                <span className="product-card-sku">SKU: {product.sku_padre}</span>
                
                <div className="product-card-title-row">
                    <h4 className="product-card-title">{product.nombre.toUpperCase()}</h4>
                </div>
                
                <div className="product-card-footer">
                    <div className="product-card-price-container">
                        {/* Si tiene variantes, podemos agregar un prefijo "Desde" */}
                        {tieneVariantes && <span className="price-prefix">DESDE </span>}

                        {tienePromo && (
                            <span className="product-card-old-price">
                                ${precioReferencia.toLocaleString('es-AR')}
                            </span>
                        )}
                        <span className={`product-card-price ${tienePromo ? 'price-sale' : ''}`}>
                            ${precioFinal.toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        </a>
    );
};

export default ProductCard;