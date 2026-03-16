import { useEffect, useState } from "react";
import "../../styles/createProduct.css";
import { UseTheme } from "../../contexts/ThemeContext";
import { createProduct } from "../../redux/slice";
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch } from "../../redux/store";
import Loader from "./Loader";
import Error from "./Error";
import axios from "axios";

const CreateProduct = () => {
    const { theme } = UseTheme();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector((state: any) => state.productSelector);

    // Estado para controlar la subida a Cloudinary localmente
    const [ isUploading, setIsUploading ] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        marca: "No especificado",
        sku_padre: "",
        talle: "",
        color: "",
        stock_base: 0,
        descripcion: "",
        precio_base: 0,
        imagenes_generales: [] as any[], // Puede contener File u objetos de Cloudinary
        categorias: [] as string[],
        variantes: [] as any[],
        medidas_empaque: { peso: 0, ancho: 0, alto: 0, largo: 0 },
        estado: "activo",
        en_promocion: false,
        porcentaje_promo: 0
    });

    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error("Error al traer categorias", err);
            setCategories({ categorias: [] });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
            return;
        }

        if (name.startsWith("medida_")) {
            const field = name.replace("medida_", "");
            setFormData({ ...formData, medidas_empaque: { ...formData.medidas_empaque, [field]: Number(value) } });
        } else {
            setFormData({ ...formData, [name]: type === "number" ? Number(value) : value });
        }
    };

    const addVariante = () => {
        setFormData({
            ...formData,
            variantes: [...formData.variantes, { 
                sku_variante: "", talle: "", color: "", stock: 0, precio_adicional: 0 
            }]
        });
    };

    const handleVarianteChange = (index: number, field: string, value: any) => {
        const nuevasVariantes = [...formData.variantes];
        nuevasVariantes[index] = { ...nuevasVariantes[index], [field]: value };
        setFormData({ ...formData, variantes: nuevasVariantes });
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, categorias: values });
    };

    // --- LÓGICA DE IMÁGENES ---

    const processFiles = (files: File[]) => {
        if (formData.imagenes_generales.length + files.length > 10) {
            alert("Solo puedes subir hasta 10 imágenes");
            return;
        }
        setFormData((prev: any) => ({ 
            ...prev, 
            imagenes_generales: [...prev.imagenes_generales, ...files] 
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({ 
            ...prev, 
            imagenes_generales: prev.imagenes_generales.filter((_, i) => i !== index) 
        }));
    };

    // SUBIDA A CLOUDINARY
    const uploadImagesCloudinary = async (files: any[]) => {
        const urls = [];
        for (const file of files) {
            if (typeof file === "string") {
                urls.push(file);
                continue;
            }
            const imgData = new FormData();
            imgData.append("file", file);
            imgData.append("upload_preset", "product-images");

            const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, imgData);
            urls.push(response.data.secure_url);
        }
        return urls;
    };

    // SUBMIT FINAL
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        
        if (!window.confirm("¿Confirmar creación de producto?")) return;

        try {
            setIsUploading(true);
            
            const uploadedUrls = await uploadImagesCloudinary(formData.imagenes_generales);
            
            if (!uploadedUrls || uploadedUrls.length === 0) {
               alert("No se pudieron obtener las URLs de las imágenes.");
            }

            const finalData = { ...formData, imagenes_generales: uploadedUrls };

            await dispatch(createProduct(finalData)).unwrap();
            
            setIsUploading(false);
            alert("Producto creado con éxito ✅");

        } catch (err) {
            console.error("Error en el proceso de creación 🔴", err);
            alert("Error: No se pudo subir las imágenes o crear el producto. Inténtalo de nuevo.");
            setIsUploading(false);
        }
    };

    if (loading || isUploading) return <Loader />;
    if (error) return <Error errorMessage={"Error al crear producto"} />;

    return (
        <div className={`dd-dashboard ${theme}`}>
            <section className="dd-content">
                <div className="dd-terminal-card">
                    <div className="card-header">NUEVO_PRODUCTO_REGISTRY</div>
                    <form onSubmit={handleSubmit} className="product-form-clean">
                        
                        <div className="form-grid-2">
                            <div className="form-section">
                                <label>Nombre del Producto</label>
                                <input type="text" name="nombre" onChange={handleChange} value={formData.nombre} className="terminal-input" required />
                            </div>
                            <div className="form-section">
                                <label>Marca</label>
                                <input type="text" name="marca" onChange={handleChange} value={formData.marca} className="terminal-input" required />
                            </div>
                        </div>

                        <div className="form-section">
                            <label>STOCK GLOBAL / BASE</label>
                            <input 
                                type="number" 
                                name="stock_base" 
                                onChange={handleChange} 
                                value={formData.stock_base} 
                                className="terminal-input" 
                                min="0"
                                required 
                            />
                        </div>

                        <div className="form-grid-2">
                            <div className="form-section">
                                <label>SKU Padre (EAN)</label>
                                <input type="text" name="sku_padre" onChange={handleChange} value={formData.sku_padre} className="terminal-input" required />
                            </div>
                            <div className="form-section">
                                <label>Precio Base ($)</label>
                                <input type="number" name="precio_base" onChange={handleChange} value={formData.precio_base} className="terminal-input" required />
                            </div>
                        </div>

                        <header className="section-subtitle">OFERTAS Y PROMOCIONES</header>
                        <div className="form-grid-2 promo-box-create">
                            <div className="form-section checkbox-section">
                                <label>¿Activar Promoción?</label>
                                <input type="checkbox" name="en_promocion" onChange={handleChange} checked={formData.en_promocion} />
                            </div>
                            {formData.en_promocion && (
                                <div className="form-section">
                                    <label>Porcentaje de Descuento (%)</label>
                                    <input type="number" name="porcentaje_promo" onChange={handleChange} value={formData.porcentaje_promo} className="terminal-input" min="0" max="100" />
                                </div>
                            )}
                        </div>

                        <div className="form-section">
                            <label>Descripción</label>
                            <textarea name="descripcion" onChange={handleChange} value={formData.descripcion} className="terminal-input" rows={3} />
                        </div>

                        {/* SECCIÓN IMÁGENES */}
                        <div className="form-section">
                            <label>Galería de Imágenes (Máx 10)</label>   
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="terminal-file-input" /> 

                            <div className="dropzone" 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files);
                                    processFiles(files);
                                }}
                            >
                                <p>ARRÁSTRÁ Y SOLTÁ LAS IMÁGENES AQUÍ</p>
                            </div>

                            <div className="preview-container">
                                {formData.imagenes_generales.map((file, index) => (
                                    <div key={index} className="preview-item">
                                        <img
                                            src={typeof file === "string" ? file : URL.createObjectURL(file)}
                                            alt={`img-${index}`}
                                            className="preview-img"
                                        />
                                        <button type="button" onClick={() => handleRemoveImage(index)} className="btn-del-img">✖</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <header className="section-subtitle">DIMENSIONES LOGÍSTICAS</header>
                        <div className="form-grid-4">
                            {["peso", "ancho", "alto", "largo"].map((dim) => (
                                <div className="form-section" key={dim}>
                                    <label>{dim.charAt(0).toUpperCase() + dim.slice(1)} {dim === "peso" ? "(kg)" : "(cm)"}</label>
                                    <input type="number" name={`medida_${dim}`} onChange={handleChange} className="terminal-input" />
                                </div>
                            ))}
                        </div>

                        <header className="section-subtitle">VARIANTES Y STOCK ESPECÍFICO</header>
                        <div className="variantes-container">
                            {formData.variantes.map((v, index) => (
                                <div key={index} className="variante-item-create">
                                    <div className="var-input-group">
                                        <span>SKU / EAN</span>
                                        <input type="text" value={v.sku_variante} onChange={(e) => handleVarianteChange(index, "sku_variante", e.target.value)} required />
                                    </div>
                                    <div className="var-input-group">
                                        <span>Talle</span>
                                        <input type="text" value={v.talle} onChange={(e) => handleVarianteChange(index, "talle", e.target.value)} />
                                    </div>
                                    <div className="var-input-group">
                                        <span>Color</span>
                                        <input type="text" value={v.color} onChange={(e) => handleVarianteChange(index, "color", e.target.value)} />
                                    </div>
                                    <div className="var-input-group">
                                        <span className="stock-label-span">Stock</span>
                                        <input type="number" value={v.stock} onChange={(e) => handleVarianteChange(index, "stock", Number(e.target.value))} />
                                    </div>
                                    <div className="var-input-group">
                                        <span>Extra $</span>
                                        <input type="number" value={v.precio_adicional} onChange={(e) => handleVarianteChange(index, "precio_adicional", Number(e.target.value))} />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="btn-del-mini">✖</button>
                                </div>
                            ))}
                            <button type="button" onClick={addVariante} className="unban-btn" style={{marginTop: '10px'}}>+ AGREGAR VARIANTE</button>
                        </div>
                        
                        <div className="form-section">
                            <label>Categorías (CTRL + CLICK)</label>
                            <select multiple name="categorias" value={formData.categorias} onChange={handleMultiSelectChange} className="terminal-input" style={{ height: '120px' }}>
                                {categories.categorias?.map((cat: any) => (
                                    <option key={cat._id} value={cat.nombre}>{cat.nombre.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-footer">
                            <div className="form-section">
                                <label>Estado Inicial</label>
                                <select name="estado" value={formData.estado} onChange={handleChange} className="terminal-input">
                                    <option value="activo">ACTIVO</option>
                                    <option value="pausado">PAUSADO</option>
                                </select>
                            </div>
                            <button type="submit" className="ban-btn" disabled={isUploading}>
                                {isUploading ? "SUBIENDO..." : "EJECUTAR_CREACIÓN"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default CreateProduct;