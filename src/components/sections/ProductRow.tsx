import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from "../../redux/store";
import { updateProduct, deleteProduct } from '../../redux/slice';
import "../../styles/productRow.css";
import axios from 'axios';

interface ProductRowProps {
    product: any;
    categoriesProp: any;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

const ProductRow = ({ categoriesProp, product, isSelected, onSelect }: ProductRowProps) => {
    const dispatch: AppDispatch = useDispatch();

    // Estado para las categorías globales del sistema
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Estado local con los datos del producto
    const [ localData, setLocalData ] = useState({ ...product });
    const [ hasChanges, setHasChanges ] = useState(false);
    const [ newImagesFiles, setNewImagesFiles ] = useState<File[]>([]);
    const [ newUrl, setNewUrl ] = useState<string | string[]>([])

    // Sincronizar si el producto padre cambia
    useEffect(() => {
        setLocalData({ ...product });
        setHasChanges(false);
    }, [product]);

    // --- MANEJADORES DE CAMBIO ---
    const handleFieldChange = (field: string, value: any) => {
        setLocalData((prev: any) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setLocalData((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
        setHasChanges(true);
    };

    // --- GESTIÓN DE CATEGORÍAS ---
    const handleCategoryToggle = (catNombre: string) => {
        // Aseguramos que trabajamos sobre el array actual del producto
        const currentCats = Array.isArray(localData.categorias) ? [...localData.categorias] : [];
        
        let updatedCats;
        if (currentCats.includes(catNombre)) {
            // Si ya la tiene, la filtramos para SACARLA
            updatedCats = currentCats.filter(c => c !== catNombre);
        } else {
            // Si no la tiene, la AGREGAMOS
            updatedCats = [...currentCats, catNombre];
        }
        
        handleFieldChange('categorias', updatedCats);
    };

    // --- VARIANTES ---
    const handleVariantChange = (index: number, field: string, value: any) => {
        const updatedVariants = [...localData.variantes];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        handleFieldChange('variantes', updatedVariants);
    };

    const addVariant = () => {
        const nuevoSufijo = (localData.variantes?.length || 0) + 1;
        const nuevaVar = {
            sku_variante: `${localData.sku_padre}-V${nuevoSufijo}`,
            talle: "", color: "", medida: "", stock: 0, precio_adicional: 0, foto_variante: ""
        };
        handleFieldChange('variantes', [...(localData.variantes || []), nuevaVar]);
    };

    const removeVariant = (index: number) => {
        if (window.confirm("¿QUITAR VARIANTE?")) {
            const updatedVariants = localData.variantes.filter((_: any, i: number) => i !== index);
            handleFieldChange('variantes', updatedVariants);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = localData.imagenes_generales.filter((_: any, i: number) => i !== index);
        handleFieldChange('imagenes_generales', updatedImages);
    };

    // --- GUARDADO DEFINITIVO EN DB ---
    const saveChanges = () => {
        if (localData.variantes && localData.variantes.length > 0 && localData.variantes.length < 2) {
            return alert("SISTEMA_ERROR: No se permite actualizar un producto con una sola variante. \n\nDebe tener al menos 2 variantes o ninguna (Producto Único).");
        }
        dispatch(updateProduct({ id: product._id, formData: localData }))
            .unwrap()
            .then(() => {
                setHasChanges(false);
                alert("SISTEMA: DATOS_SINCRONIZADOS_CON_EXITO");
            })
            .catch(err => alert("ERROR_AL_GUARDAR: " + err));
    };

    const precioConDescuento = localData.en_promocion ? localData.precio_base - (localData.precio_base * (localData.porcentaje_promo / 100)) : localData.precio_base;

    /* Sumar Imagenes */    
    const processFiles = (files: File[]) => {
    // Validar límite de 10
    if (newImagesFiles.length + files.length > 10) {
        alert("Solo puedes subir hasta 10 imágenes");
        return;
    }
        setNewImagesFiles((prev) => [...prev, ...files]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const uploadImagesCloudinary = async () => {
        if (newImagesFiles.length === 0) return;

        const urls: string[] = [];
        try {
            // 1. Subir archivos
            for (const file of newImagesFiles) {
                const imgData = new FormData();
                imgData.append("file", file);
                imgData.append("upload_preset", "product-images");

                const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, imgData);
                urls.push(response.data.secure_url);
            }

            setLocalData((prev: any) => ({
                ...prev,
                imagenes_generales: [...(prev.imagenes_generales || []), ...urls]
            }));

            setHasChanges(true);

            setNewImagesFiles([]);
            setNewUrl([]); 
            
            alert("SISTEMA: IMÁGENES_AÑADIDAS_A_LA_GALERÍA");

        } catch (error) {
            console.error("Error subiendo imagen a Cloudinary:", error);
            alert("ERROR_CLOUDINARY_UPLOAD");
        }
    };

    const setAsThumbnail = (index: number) => {
        if (index === 0) return; // Ya es la portada

        const updatedImages = [...localData.imagenes_generales];
        // Extraemos la imagen de su posición actual
        const [selectedImage] = updatedImages.splice(index, 1);
        // La insertamos en la posición 0
        updatedImages.unshift(selectedImage);

        handleFieldChange('imagenes_generales', updatedImages);
    };

    return (
        <div className={`row-master ${hasChanges ? 'modified' : ''} ${isExpanded ? 'is-open' : ''}`}>
            
            {/* --- LÍNEA PRINCIPAL --- */}
            <div className="main-horizontal-bar">
                <div className="bar-cell cell-check">
                    <input type="checkbox" checked={isSelected} onChange={() => onSelect(product._id)} />
                </div>

                <div className="bar-cell cell-img">
                    <img src={localData.imagenes_generales?.[0] || "https://via.placeholder.com/50"} alt="p" />
                    {localData.en_promocion && <span className="promo-badge">%{localData.porcentaje_promo}</span>}
                </div>

                <div className="bar-cell cell-name">
                    <span className="field-hint">PRODUCTO</span>
                    <input 
                        className="input-name-main white-text"
                        value={localData.nombre || ""} 
                        onChange={(e) => handleFieldChange('nombre', e.target.value)} 
                    />
                    <div className="sub-info-row">
                        <span className="tag-white">SKU: {localData.sku_padre}</span>
                        <span className="tag-white">MARCA: {localData.marca}</span>
                    </div>
                </div>

                <div className="bar-cell cell-price">
                    <span className="field-hint">PRECIO BASE</span>
                    <div className="input-group-dark">
                        <span className="unit">$</span>
                        <input 
                            type="number" 
                            className="white-text"
                            value={localData.precio_base || 0} 
                            onChange={(e) => handleFieldChange('precio_base', Number(e.target.value))} 
                            min={0}
                        />
                    </div>
                </div>

                <div className="bar-cell cell-status">
                    <span className="field-hint">ESTADO</span>
                    <select 
                        value={localData.estado} 
                        onChange={(e) => handleFieldChange('estado', e.target.value)}
                        className="select-status-white"
                    >
                        <option value="activo">ACTIVO</option>
                        <option value="pausado">PAUSADO</option>
                        <option value="borrado">BORRADO</option>
                    </select>
                </div>

                <div className="bar-cell cell-actions">
                    <button className={`btn-action-save ${hasChanges ? 'ready' : ''}`} onClick={saveChanges} disabled={!hasChanges}>
                        {hasChanges ? "GUARDAR" : "OK"}
                    </button>
                    <button className="btn-action-edit" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "CERRAR" : "EDITAR FULL"}
                    </button>
                </div>
            </div>

            {/* --- PANEL EXPANDIDO --- */}
            {isExpanded && (
                <div className="detail-drop-panel">
                    <div className="detail-grid">
                        
                        {/* SECCIÓN: GALERÍA */}
                        <div className="detail-section full-width">
                            <span className="section-title">GALERÍA DE IMÁGENES</span>
                            <div className="image-grid-preview">
                                {localData.imagenes_generales?.map((img: string, idx: number) => (
                                    <div key={idx} className={`image-thumb-wrapper ${idx === 0 ? 'is-thumbnail' : ''}`}>
                                        <img src={img} alt={`prod-${idx}`} />
                                        
                                        {/* Badge de Portada */}
                                        {idx === 0 && <div className="thumbnail-badge">PORTADA</div>}
                                        
                                        <div className="thumb-actions">
                                            {/* Botón para mover a portada (solo si no es la 0) */}
                                            {idx !== 0 && (
                                                <button 
                                                    className="btn-set-thumbnail" 
                                                    onClick={() => setAsThumbnail(idx)}
                                                    title="Usar como portada"
                                                >
                                                    ⭐
                                                </button>
                                            )}
                                            <button className="btn-remove-img" onClick={() => removeImage(idx)}>×</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <label>Añadir Imágenes</label>   
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="terminal-file-input" /> 
                            
                            <button onClick={uploadImagesCloudinary}>Obtener Url`s</button>
                            {Array.isArray(newUrl) && newUrl.length > 0 && newUrl.map((url: string) => <p>{url}</p> )}
                        </div>

                        {/* SECCIÓN: PROMO */}

                        <div className="bar-cell cell-promo">
                            <span className="field-hint">PROMOCIÓN</span>
                            <div className="promo-controls-row">
                                <input 
                                    type="checkbox" 
                                    checked={localData.en_promocion || false}
                                    onChange={(e) => handleFieldChange('en_promocion', e.target.checked)}
                                />
                                {localData.en_promocion && (
                                    <div className="input-group-dark small">
                                        <input 
                                            type="number" 
                                            className="white-text"
                                            placeholder="%"
                                            value={localData.porcentaje_promo || 0} 
                                            onChange={(e) => handleFieldChange('porcentaje_promo', Number(e.target.value))} 
                                            min={0}
                                        />
                                        <span className="unit">%</span>
                                    </div>
                                )}
                            </div>
                            {localData.en_promocion && (
                                <div className="final-price-preview">
                                    Final: ${precioConDescuento.toLocaleString()}
                                </div>
                            )}
                        </div>
                        
                        <div className="detail-section full-width">
                            <span className="section-title">ADMINISTRAR CATEGORÍAS</span>
   
                            <div className="categories-chip-container">
                                {categoriesProp.length > 0 ? (
                                    categoriesProp.map((cat: any) => {
                                        
                                        const isAssigned = localData.categorias.includes(cat.nombre);
                                        return (
                                            <button 
                                                key={cat._id}
                                                className={`category-chip ${isAssigned ? 'active' : ''}`}
                                                onClick={() => handleCategoryToggle(cat.nombre)}
                                                title={isAssigned ? "Click para quitar" : "Click para añadir"}
                                            >
                                                {cat.nombre.toUpperCase()} {isAssigned ? "✓" : "+"}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="white-text">No hay categorías cargadas en el sistema.</p>
                                )}
                            </div>
                        </div>

                        {/* SECCIÓN: DESCRIPCIÓN */}
                        <div className="detail-section full-width">
                            <span className="section-title">DESCRIPCIÓN DEL PRODUCTO</span>
                            <textarea 
                                className="description-textarea"
                                value={localData.descripcion || ""} 
                                onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                            />
                        </div>

                        {/* SECCIÓN: ATRIBUTOS */}
                        <div className="detail-section">
                            <span className="section-title">ATRIBUTOS</span>
                            <div className="logistics-inputs-grid">
                                <div className="input-with-label"><span>SKU PADRE</span><input value={localData.sku_padre || ""} onChange={(e) => handleFieldChange('sku_padre', e.target.value)} /></div>
                                <div className="input-with-label"><span>STOCK BASE</span><input type="number" min={0} value={localData.stock_base} onChange={(e) => handleFieldChange('stock_base', Number(e.target.value))} /></div>
                                <div className="input-with-label"><span>MARCA</span><input value={localData.marca} onChange={(e) => handleFieldChange('marca', e.target.value)} /></div>
                            </div>
                        </div>

                        {/* SECCIÓN: LOGÍSTICA */}
                        <div className="detail-section">
                            <span className="section-title">LOGÍSTICA / EMPAQUE</span>
                            <div className="logistics-inputs-grid">
                                <div className="input-with-label"><span>PESO</span><input type="number" min={0} value={localData.medidas_empaque?.peso || 0} onChange={(e) => handleNestedChange('medidas_empaque', 'peso', Number(e.target.value))} /></div>
                                <div className="input-with-label"><span>ANCHO</span><input type="number" min={0} value={localData.medidas_empaque?.ancho || 0} onChange={(e) => handleNestedChange('medidas_empaque', 'ancho', Number(e.target.value))} /></div>
                                <div className="input-with-label"><span>ALTO</span><input type="number" min={0} value={localData.medidas_empaque?.alto || 0} onChange={(e) => handleNestedChange('medidas_empaque', 'alto', Number(e.target.value))} /></div>
                                <div className="input-with-label"><span>LARGO</span><input type="number" min={0} value={localData.medidas_empaque?.largo || 0} onChange={(e) => handleNestedChange('medidas_empaque', 'largo', Number(e.target.value))} /></div>
                            </div>
                        </div>

                        {/* SECCIÓN: VARIANTES */}
                        <div className="detail-section full-width">
                            <div className="section-header-flex">
                                <span className="section-title">CONTROL DE VARIANTES</span>
                                <button className="btn-add-variant-pro" onClick={addVariant}>+ NUEVA VARIANTE</button>
                            </div>
                            <div className="variants-table-modern">
                                {localData.variantes?.map((v: any, index: number) => (
                                    <div key={index} className="variant-row-modern">
                                        <div className="v-cell"><span>SKU VAR</span><input value={v.sku_variante} onChange={(e) => handleVariantChange(index, 'sku_variante', e.target.value)} /></div>
                                        <div className="v-cell"><span>TALLE</span><input value={v.talle || ""} onChange={(e) => handleVariantChange(index, 'talle', e.target.value)} /></div>
                                        <div className="v-cell"><span>COLOR</span><input value={v.color || ""} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} /></div>
                                        <div className="v-cell"><span>STOCK</span><input type="number" min={0} value={v.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} /></div>
                                        <div className="v-cell"><span>EXTRA $</span><input type="number" min={0} value={v.precio_adicional} onChange={(e) => handleVariantChange(index, 'precio_adicional', Number(e.target.value))} /></div>
                                        <button className="btn-del-v" onClick={() => removeVariant(index)}>✖</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="danger-zone-footer">
                        <button onClick={() => window.confirm("¿ELIMINAR?") && dispatch(deleteProduct(product._id))} className="btn-destroy-pro">
                            ELIMINAR PRODUCTO PERMANENTEMENTE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRow;