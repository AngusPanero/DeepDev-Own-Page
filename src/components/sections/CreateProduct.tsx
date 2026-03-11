import { useEffect, useState } from "react";
import "../../styles/createProduct.css"
import { UseTheme } from "../../contexts/ThemeContext";
import { createProduct } from "../../redux/slice";
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch } from "../../redux/store"
import Loader from "./Loader";
import Error from "./Error";
import axios from "axios";

const CreateProduct = () => {
    const { theme } = UseTheme()
    const dispatch: AppDispatch = useDispatch();
    const { loading, error, /* successMessage, products */ } = useSelector((state: any) => state.productSelector);

    const [formData, setFormData] = useState({ nombre: "", sku_padre: "", descripcion: "", precio_base: 0, imagenes_generales: [] as string[], categorias: [] as string[], variantes: [] as any[], medidas_empaque: { peso: 0, ancho: 0, alto: 0, largo: 0 }, estado: "activo"});
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            const data = res.data
        
            setCategories(data);
        } catch (err) { 
            console.error("Error al traer categorias", err);
            setCategories([]); 
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("medida_")) {
            const field = name.replace("medida_", "");
            setFormData({ ...formData, medidas_empaque: { ...formData.medidas_empaque, [field]: Number(value) }});
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addVariante = () => {
        setFormData({ ...formData, variantes: [...formData.variantes, { sku_variante: "", talle: "", color: "", stock: 0, precio_adicional: 0 }]});
    };

    const handleVarianteChange = (index: number, field: string, value: any) => {
        const nuevasVariantes = [...formData.variantes];
        nuevasVariantes[index] = { ...nuevasVariantes[index], [field]: value };

        setFormData({ ...formData, variantes: nuevasVariantes });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (window.confirm("¿Estás seguro de crear este producto?")) {
            e.preventDefault();
            dispatch(createProduct(formData));
        }
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, categorias: values });
    };

if(loading) return <Loader />
if(error) return <Error errorMessage={error} />

return (
        <div className={`dd-dashboard ${theme}`}>
            <section className="dd-content">
                <div className="dd-terminal-card">
                    <div className="card-header">NUEVO_PRODUCTO_REGISTRY</div>
                    <form onSubmit={handleSubmit} className="product-form-clean">
                        
                        <div className="form-section">
                            <label>Nombre del Producto</label>
                            <input type="text" name="nombre" onChange={handleChange} value={formData.nombre} className="terminal-input" />
                        </div>

                        <div className="form-grid-2">
                            <div className="form-section">
                                <label>SKU Padre</label>
                                <input type="text" name="sku_padre" onChange={handleChange} value={formData.sku_padre} className="terminal-input" />
                            </div>
                            <div className="form-section">
                                <label>Precio Base</label>
                                <input type="number" name="precio_base" onChange={handleChange} value={formData.precio_base} className="terminal-input" />
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Descripción</label>
                            <textarea name="descripcion" onChange={handleChange} value={formData.descripcion} className="terminal-input" rows={3} />
                        </div>

                        <div className="form-section">
                            <label>Imágenes (URLs separadas por coma)</label>
                            <input type="text" onChange={(e) => setFormData({...formData, imagenes_generales: e.target.value.split(",")})} className="terminal-input" />
                        </div>

                        <header className="section-subtitle">MEDIDAS DE EMPAQUE</header>
                        <div className="form-grid-4">
                            <div className="form-section">
                                <label>Peso (kg)</label>
                                <input type="number" name="medida_peso" onChange={handleChange} className="terminal-input" />
                            </div>
                            <div className="form-section">
                                <label>Ancho (cm)</label>
                                <input type="number" name="medida_ancho" onChange={handleChange} className="terminal-input" />
                            </div>
                            <div className="form-section">
                                <label>Alto (cm)</label>
                                <input type="number" name="medida_alto" onChange={handleChange} className="terminal-input" />
                            </div>
                            <div className="form-section">
                                <label>Largo (cm)</label>
                                <input type="number" name="medida_largo" onChange={handleChange} className="terminal-input" />
                            </div>
                        </div>

                        <header className="section-subtitle">VARIANTES - STOCK</header>
                        <div className="variantes-container">
                            {formData.variantes.map((v, index) => (
                                <div key={index} className="variante-item">
                                    <input type="text" placeholder="SKU" value={v.sku_variante} onChange={(e) => handleVarianteChange(index, "sku_variante", e.target.value)} />
                                    <input type="text" placeholder="Talle" value={v.talle} onChange={(e) => handleVarianteChange(index, "talle", e.target.value)} />
                                    <input type="text" placeholder="Color" value={v.color} onChange={(e) => handleVarianteChange(index, "color", e.target.value)} />
                                    <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVarianteChange(index, "stock", Number(e.target.value))} />
                                </div>
                            ))}
                            <button type="button" onClick={addVariante} className="unban-btn" style={{marginTop: '10px'}}>+ AGREGAR VARIANTE</button>
                        </div>
                        
                        {/* CATEGORIAS */}
                        <div className="form-section">
                            <label>Categoría (CTRL + CLICK)</label>
                            <select 
                                multiple 
                                name="categorias" 
                                value={formData.categorias} 
                                onChange={handleMultiSelectChange} 
                                className="terminal-input"
                                style={{ height: '120px' }}
                            >
                                {Array.isArray(categories.categorias) && categories.categorias?.map((cat: any) => (
                                    <option key={cat._id} value={cat.nombre}>
                                        {cat.nombre.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-footer">
                            <div className="form-section">
                                <label>Estado del Sistema</label>
                                <select name="estado" value={formData.estado} onChange={handleChange} className="terminal-input">
                                    <option value="activo">ACTIVO</option>
                                    <option value="pausado">PAUSADO</option>
                                    <option value="borrado">BORRADO</option>
                                </select>
                            </div>
                            <button type="submit" className="ban-btn" style={{padding: '10px 40px'}}>CREAR_PRODUCTO</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default CreateProduct;