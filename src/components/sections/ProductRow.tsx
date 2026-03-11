import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from "../../redux/store";
import { updateProduct, deleteProduct } from '../../redux/slice';

const ProductRow = ({ product, isSelected, onSelect }: any) => {
    const dispatch: AppDispatch = useDispatch();
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [localData, setLocalData] = useState({ ...product });
    const [hasChanges, setHasChanges] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");

    // --- MANEJADORES DE CAMBIO ---
    const handleFieldChange = (field: string, value: any) => {
        setLocalData({ ...localData, [field]: value });
        setHasChanges(true);
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setLocalData({
            ...localData,
            [parent]: { ...localData[parent], [field]: value }
        });
        setHasChanges(true);
    };

    // --- GESTIÓN DE IMÁGENES (ORDENAMIENTO Y CARGA) ---
    const addImage = () => {
        if (newImageUrl.trim() !== "") {
            setLocalData({
                ...localData,
                imagenes_generales: [...localData.imagenes_generales, newImageUrl.trim()]
            });
            setNewImageUrl("");
            setHasChanges(true);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = localData.imagenes_generales.filter((_: any, i: number) => i !== index);
        setLocalData({ ...localData, imagenes_generales: updatedImages });
        setHasChanges(true);
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const updatedImages = [...localData.imagenes_generales];
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= updatedImages.length) return;
        const temp = updatedImages[index];
        updatedImages[index] = updatedImages[newIndex];
        updatedImages[newIndex] = temp;
        setLocalData({ ...localData, imagenes_generales: updatedImages });
        setHasChanges(true);
    };

    // --- GESTIÓN DE VARIANTES ---
    const handleVariantChange = (index: number, field: string, value: any) => {
        const updatedVariants = [...localData.variantes];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setLocalData({ ...localData, variantes: updatedVariants });
        setHasChanges(true);
    };

    const addVariant = () => {
        const nuevoSufijo = localData.variantes.length + 1;
        const nuevaVar = {
            sku_variante: `${localData.sku_padre}-V${nuevoSufijo}`,
            talle: "", color: "", medida: "", stock: 0, precio_adicional: 0, foto_variante: ""
        };
        setLocalData({ ...localData, variantes: [...localData.variantes, nuevaVar] });
        setHasChanges(true);
    };

    const removeVariant = (index: number) => {
        if (window.confirm("¿QUITAR_ESTA_VARIANTE?")) {
            const updatedVariants = localData.variantes.filter((_: any, i: number) => i !== index);
            setLocalData({ ...localData, variantes: updatedVariants });
            setHasChanges(true);
        }
    };

    // --- GUARDADO ---
    const saveChanges = () => {
        dispatch(updateProduct({ id: product._id, formData: localData }))
            .unwrap()
            .then(() => setHasChanges(false));
    };

    // Cálculo de precio en oferta para visualización
    const precioConDescuento = localData.en_promocion 
        ? localData.precio_base - (localData.precio_base * (localData.porcentaje_promo / 100))
        : localData.precio_base;

    return (
        <div className={`admin-row-container ${hasChanges ? 'is-modified' : ''} ${localData.en_promocion ? 'is-promo-row' : ''}`}>
            {/* FILA PRINCIPAL */}
            <div className="main-row">
                <input type="checkbox" checked={isSelected} onChange={() => onSelect(product._id)} />
                <div className="img-container-main">
                    <img src={localData.imagenes_generales[0]} className="admin-row-img" alt="portada" />
                    {localData.en_promocion && <span className="promo-tag-mini">-{localData.porcentaje_promo}%</span>}
                </div>
                
                <div className="admin-col-info">
                    <input 
                        className="invisible-input name-input"
                        value={localData.nombre} 
                        onChange={(e) => handleFieldChange('nombre', e.target.value)} 
                    />
                    <span className="sku-tag">{product.sku_padre}</span>
                </div>

                <div className="admin-col-price">
                    <div className="price-display-wrapper">
                        <input 
                            type="number" 
                            value={localData.precio_base} 
                            onChange={(e) => handleFieldChange('precio_base', Number(e.target.value))} 
                        />
                        {localData.en_promocion && (
                            <span className="promo-price-preview">OFERTA: ${precioConDescuento.toFixed(0)}</span>
                        )}
                    </div>
                </div>

                <select 
                    className="admin-status-select"
                    value={localData.estado} 
                    onChange={(e) => handleFieldChange('estado', e.target.value)}
                >
                    <option value="activo">ACTIVO</option>
                    <option value="pausado">PAUSADO</option>
                    <option value="borrado">BORRADO</option>
                </select>

                <div className="admin-col-btns">
                    <button className="btn-expand" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "[ CERRAR ]" : `[ EDITAR_FULL ]`}
                    </button>
                    <button 
                        className={`btn-save-row ${hasChanges ? 'ready' : ''}`} 
                        disabled={!hasChanges} 
                        onClick={saveChanges}
                    >
                        GUARDAR
                    </button>
                </div>
            </div>

            {/* PANEL EXPANDIDO */}
            {isExpanded && (
                <div className="admin-full-edit-panel">
                    
                    {/* SECCIÓN DE PROMOCIÓN */}
                    <div className="edit-section-promo">
                        <label className="section-label">OFERTAS_Y_DESCUENTOS</label>
                        <div className="promo-editor-box">
                            <button 
                                className={`btn-promo-toggle ${localData.en_promocion ? 'on' : ''}`}
                                onClick={() => handleFieldChange('en_promocion', !localData.en_promocion)}
                            >
                                {localData.en_promocion ? "OFERTA_ACTIVA" : "ACTIVAR_OFERTA"}
                            </button>
                            {localData.en_promocion && (
                                <div className="promo-input-group">
                                    <input 
                                        type="number" 
                                        value={localData.porcentaje_promo} 
                                        onChange={(e) => handleFieldChange('porcentaje_promo', Number(e.target.value))}
                                        max="100"
                                        min="0"
                                    />
                                    <span>%_OFF</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GALERÍA CON ORDENAMIENTO */}
                    <div className="edit-section-images">
                        <label className="section-label">GALERÍA_DE_IMÁGENES (ORDENAR_CON_FLECHAS)</label>
                        <div className="images-grid">
                            {localData.imagenes_generales.map((img: string, idx: number) => (
                                <div key={idx} className={`image-manage-card ${idx === 0 ? 'is-main-cover' : ''}`}>
                                    {/* {idx === 0 && <span className="cover-badge">PORTADA</span>} */}
                                    <img src={img} className='img-preview' alt="preview" onError={(e) => {(e.target as HTMLImageElement).src = "https://placehold.co/100x100/000000/a855f7?text=URL_INVALIDA" }} />
                                    <div className="image-controls-overlay">
                                        <button onClick={() => moveImage(idx, 'left')} disabled={idx === 0}>◀</button>
                                        <button onClick={() => removeImage(idx)} className="btn-del-mini">✖</button>
                                        <button onClick={() => moveImage(idx, 'right')} disabled={idx === localData.imagenes_generales.length - 1}>▶</button>
                                    </div>
                                </div>
                            ))}
                            <div className="image-add-card">
                                <div className="input-with-label-stack">
                                    <label>NUEVA_URL_IMAGEN</label>
                                    <input 
                                        type="text"
                                        placeholder="https://..." 
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="input-url-new"
                                    />
                                <button onClick={addImage} className="btn-add-img-confirm">AGREGAR</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="edit-section-grid">
                        <div className="edit-box">
                            <label>DESCRIPCIÓN_SISTEMA</label>
                            <textarea 
                                value={localData.descripcion} 
                                onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                            />
                        </div>

                        <div className="edit-box">
                            <label>LOGÍSTICA_EMPAQUE (Kg / Ancho / Alto / Largo)</label>
                            <div className="medidas-inputs">
                                <input type="number" placeholder="Kg" value={localData.medidas_empaque.peso} onChange={(e) => handleNestedChange('medidas_empaque', 'peso', Number(e.target.value))} />
                                <input type="number" placeholder="An" value={localData.medidas_empaque.ancho} onChange={(e) => handleNestedChange('medidas_empaque', 'ancho', Number(e.target.value))} />
                                <input type="number" placeholder="Al" value={localData.medidas_empaque.alto} onChange={(e) => handleNestedChange('medidas_empaque', 'alto', Number(e.target.value))} />
                                <input type="number" placeholder="La" value={localData.medidas_empaque.largo} onChange={(e) => handleNestedChange('medidas_empaque', 'largo', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    {/* VARIANTES */}
                    <div className="admin-variants-section">
                        <div className="section-header-row">
                            <label className="section-label">VARIANTES_Y_STOCK</label>
                            <button className="btn-add-var" onClick={addVariant}>+ NUEVA_VARIANTE</button>
                        </div>
                        <div className="variant-list">
                            {localData.variantes.map((v: any, index: number) => (
                                <div key={index} className="variant-edit-row-detailed">
                                    <input value={v.sku_variante} onChange={(e) => handleVariantChange(index, 'sku_variante', e.target.value)} className="sku-var-input" />
                                    <input value={v.talle || ""} placeholder="Talle" onChange={(e) => handleVariantChange(index, 'talle', e.target.value)} />
                                    <input value={v.color || ""} placeholder="Color" onChange={(e) => handleVariantChange(index, 'color', e.target.value)} />
                                    <input value={v.medida || ""} placeholder="Medida" onChange={(e) => handleVariantChange(index, 'medida', e.target.value)} />
                                    <label htmlFor="stock-var">Stock:</label>
                                    <input type="number" id="stock-var" value={v.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} />
                                    <label htmlFor="precio-var">Precio Ad:</label>
                                    <input type="number"  id="precio-var" value={v.precio_adicional} onChange={(e) => handleVariantChange(index, 'precio_adicional', Number(e.target.value))} />
                                    <button className="btn-remove-var" onClick={() => removeVariant(index)}>✖</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="danger-zone-row">
                        <button onClick={() => window.confirm("¿ELIMINAR_DB?") && dispatch(deleteProduct(product._id))} className="btn-delete-full">
                            ELIMINAR_REGISTRO_COMPLETO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRow;