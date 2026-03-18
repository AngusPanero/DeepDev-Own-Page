import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/categoryManager.css';
import { UseTheme } from '../../contexts/ThemeContext';

const CategoryManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [nombre, setNombre] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para búsqueda
    const [loading, setLoading] = useState(false);
    const { theme } = UseTheme()

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            if (res.data && Array.isArray(res.data.categorias)) {
                setCategories(res.data.categorias);
            }
        } catch (err) {
            console.error("Error al traer categorias", err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = nombre.trim().toLowerCase();
        if (!cleanName) return;

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, 
                { nombre: cleanName }, 
                { withCredentials: true }
            );
            setNombre("");
            fetchCategories(); // Refrescamos la lista
        } catch (err: any) {
            alert(err.response?.data?.message || "ERROR_SISTEMA");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿ELIMINAR_TAG?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, { withCredentials: true });
            fetchCategories();
        } catch (error) {
            alert("ERROR_AL_ELIMINAR");
        }
    };

    // Filtrado en tiempo real desde el front
    const filteredCategories = categories.filter(cat => 
        cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`cm-container cm-container ${theme}`}>
            <header className="cm-header">
                <h2 className="cm-title">CATEGORY_<span>SYSTEM</span></h2>
                <div className="cm-search-box">
                    <input 
                        type="text" 
                        placeholder="FILTER_TAGS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="cm-input-search"
                    />
                </div>
            </header>

            <div className="cm-card">
                <form onSubmit={handleCreate} className="cm-form">
                    <input 
                        className="cm-input-add"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="NUEVA_CATEGORIA..."
                    />
                    <button type="submit" disabled={loading} className="cm-btn-add">
                        {loading ? "..." : "[ + ]"}
                    </button>
                </form>

                <div className="cm-divider">DATABASE_RECORDS</div>

                <div className="cm-tags-wrapper">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat: any) => (
                            <div key={cat._id} className="cm-tag">
                                <span className="cm-tag-name">{cat.nombre}</span>
                                <button 
                                    onClick={() => handleDelete(cat._id)} 
                                    className="cm-tag-remove"
                                    title="Eliminar"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="cm-empty">NO_CATEGORIES_FOUND</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;