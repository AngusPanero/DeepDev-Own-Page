import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/categoryManager.css';

const CategoryManager = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
    const [ categories, setCategories ] = useState<any>([]);
    const [ nombre, setNombre ] = useState("");
    const [ loading, setLoading ] = useState<boolean | null>(false);
    const [ error, setError ] = useState<boolean | null>(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            const data = res.data
            console.log("DATA CAT", data);
            
            if (data && typeof data === 'object' && Array.isArray(data.categorias)) {
                setCategories(data.categorias);
            } else {
                setCategories([]);
            }
        } catch (err) { 
            console.error("Error al traer categorias", err);
            setCategories([]); 
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        setLoading(true);
        setError(null); 

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, 
                { nombre: nombre.trim() }, 
                { withCredentials: true }
            );
            
            setCategories((prev: any) => [...prev, res.data]);
            setNombre("");
            alert("REGISTRO_EXITOSO"); 
        } catch (err: any) {
            const msg = err.response?.data?.message || "ERROR_DESCONOCIDO";
            setError(msg);
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿BORRAR CATEGORÍA?")) return;
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { withCredentials: true });
            if(response.status === 200){
                setCategories(response.data.categoriasActualizadas);
                fetchCategories()
            }
        } catch (error) { 
            console.error("Error al eliminar categoría! 🔴", error)
            alert("Error"); 
        }
    };

   return (
        <div className={`dd-dashboard ${theme} category-page-container`}>
            <div className="category-card">
                <h2 className="section-subtitle">GESTION_CATEGORIAS</h2>
                
                <form onSubmit={handleCreate} className="form-grid-2">
                    <div className="form-section">
                        <label>NOMBRE_NUEVO</label>
                        <input 
                            className="terminal-input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Escribir aquí..."
                        />
                    </div>
                    <div className="form-section" style={{justifyContent: 'flex-end'}}>
                        <button type="submit" className="btn-submit-terminal">
                            [ + AGREGAR_REGISTRO ]
                        </button>
                    </div>
                </form>

                <div className="category-list-container">
                    <label>LISTADO_ACTUAL</label>
                    {Array.isArray(categories) && categories?.map((cat: any) => (
                        <div key={cat._id} className="category-row">
                            <span className="category-name-text">{`> ${cat.nombre}`}</span>
                            <button onClick={() => handleDelete(cat._id)} className="btn-delete-terminal">
                                ELIMINAR
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;