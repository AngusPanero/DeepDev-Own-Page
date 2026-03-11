import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface IVariante {
    sku_variante: string;
    talle: string;
    color: string;
    stock: number;
    precio_adicional?: number;
}

export interface IMedidas {
    peso: number;
    ancho: number;
    alto: number;
    largo: number;
}

export interface IProduct {
    _id?: string;
    nombre: string;
    sku_padre: string;
    descripcion: string;
    precio_base: number;
    imagenes_generales: string[];
    categorias?: string[];
    medidas_empaque: IMedidas;
    variantes: IVariante[];
    estado: string;
    createdAt?: string;
}

interface ProductState {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    productDetails: IProduct | null;
}

interface CreateProductPayload {
    product: IProduct;
    message: string;
}

interface ReadOnePayload {
    message: string;
    product: IProduct;
}

interface ReadAllPayload {
    message: string;
    products: IProduct[]; 
}

interface UpdatePayload {
    message: string;
    product: IProduct;
}

interface UpdateProductInput {
    id: string;
    formData: any;
}

interface UpdateVariantInput {
    variantId: string;
    formData: any; 
}

interface BulkUpdateInput {
    ids: string[];
    cambios: {
        estado?: "activo" | "pausado" | "borrado";
        porcentaje_precio?: number;
        stock_a_sumar?: number;
    };
}

interface BulkUpdatePayload {
    message: string;
    detalles: {
        total_seleccionados: number;
        total_modificados: number;
    };
    // Pasamos los datos originales para saber qué actualizar en el estado
    idsEnviados: string[];
    cambiosEnviados: any;
}

// CREATE PRODUCT
export const createProduct = createAsyncThunk<CreateProductPayload, IProduct>("createProduct",
    async(formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/product/create`, { formData }, { withCredentials: true })
                    
            return response.data
        } catch (error: any) {
            console.error("Internal server error creating product! 🔴", error)
            return rejectWithValue(error.response?.data?.message || "Internal server error creating product! 🔴")
        }
    }
)

// READ INDIVIDUAL
export const readOneProduct = createAsyncThunk<ReadOnePayload, string>("readOneProduct",
    async(id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${id}`, { withCredentials: true })

            return response.data
        } catch (error: any) {
            console.error("Internal server error reading ond product! 🔴", error)
            return rejectWithValue(error.response?.data?.message || "Internal server error reading ond product! 🔴")
        }
    }
)

// READ ALL
export const readAllProduct = createAsyncThunk<ReadAllPayload, void>("readAllProduct",
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { withCredentials: true })

            return response.data
        } catch (error: any) {
            console.error("Internal server error reading ond product! 🔴", error)
            return rejectWithValue(error.response?.data?.message || "Internal server error reading ond product! 🔴")
        }
    }
)

// UPDATE PRODUCT
export const updateProduct = createAsyncThunk<UpdatePayload, UpdateProductInput>("updateProduct",
    async({id, formData}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/product/update/${id}`, { formData }, { withCredentials: true })

            return response.data
        } catch (error: any) {
            console.error("Internal server error reading ond product! 🔴", error)
            return rejectWithValue(error.response?.data?.message || "Internal server error reading ond product! 🔴")
        }
    }
)

// UPDATE VARIANT
export const updateVariant = createAsyncThunk<UpdatePayload, UpdateVariantInput>("updateVariant",
    async({ variantId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/product/update-variant/${variantId}`, { formData }, { withCredentials: true })

            return response.data
        } catch (error: any) {
            console.error("Internal server error reading ond product! 🔴", error)
            return rejectWithValue(error.response?.data?.message || "Internal server error reading ond product! 🔴")
        }
    }
)

// BULK UPDATE
export const bulkUpdateProducts = createAsyncThunk<BulkUpdatePayload, BulkUpdateInput>("products/bulkUpdate",
    async ({ ids, cambios }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/bulk-update`, { ids, cambios }, { withCredentials: true });
            
            return { ...response.data, idsEnviados: ids, cambiosEnviados: cambios };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error en actualización masiva 🔴");
        }
    }
);

// DELETE ONE
export const deleteProduct = createAsyncThunk<{ message: string; id: string }, string>("deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/delete/${id}`, { withCredentials: true });
            return { message: response.data.message, id };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error al eliminar producto 🔴");
        }
    }
);

// BULK DELETE
export const bulkDeleteProducts = createAsyncThunk<{ message: string; ids: string[] }, string[]>("bulkDeleteProducts",
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/bulk-delete`, { data: { ids }, withCredentials: true });
            return { message: response.data.message, ids };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error en borrado masivo 🔴");
        }
    }
);

// EXPORT CSV
export const exportProductsCSV = createAsyncThunk("products/exportCSV",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/export-csv`, {
                withCredentials: true,
                responseType: 'blob', // IMPORTANTE: Para manejar archivos
            });

            // Crear un link temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `productos_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            
            // Limpieza
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            return "Exportación exitosa 🟢";
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error al exportar el archivo CSV! 🔴");
        }
    }
);

// IMPORT CSV
export const importProductsCSV = createAsyncThunk<string, File>("products/importCSV",
    async (file, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData();
            formData.append("archivo", file);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/bulk-import`,formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,}
            );

            dispatch(readAllProduct()); 

            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error al importar el archivo CSV 🔴");
        }
    }
);

// SLICE
const productSlice = createSlice({
    name: "productSlice",
    initialState: {
        products: [],
        loading: false,
        error: null,
        successMessage: null,
        productDetails: null,
    } as ProductState,
    reducers: {},
    extraReducers: (builder) => {
        builder


        // CREATE
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })      
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false 
            state.products.push(action.payload.product)
            state.successMessage = action.payload.message
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as any
        }) 



        // READ INDIVIDUAL
        .addCase(readOneProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.productDetails = null;
        })
        .addCase(readOneProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.productDetails = action.payload.product;
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(readOneProduct.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as any
        })



        // READ ALL
        .addCase(readAllProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.productDetails = null;
        })
        .addCase(readAllProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(readAllProduct.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as any
        })



        // UPDATE INDIVIDUAL
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            
            const index = state.products.findIndex(p => p._id === action.payload.product._id);
            
            if (index !== -1) {
                state.products[index] = action.payload.product;
            }
            state.productDetails = action.payload.product;
            
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as any
        })



        // UPDATE VARIANT
        .addCase(updateVariant.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateVariant.fulfilled, (state, action) => {
            state.loading = false;
            
            const index = state.products.findIndex(p => p._id === action.payload.product._id);
            
            if (index !== -1) {
                state.products[index] = action.payload.product;
            }
            state.productDetails = action.payload.product;
            
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(updateVariant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as any
        })



        // BULK UPDATE
        .addCase(bulkUpdateProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(bulkUpdateProducts.fulfilled, (state, action) => {
            state.loading = false;
            const { idsEnviados, cambiosEnviados } = action.payload;

            // Actualizamos cada producto que esté en la lista de IDs seleccionados
            state.products = state.products.map(product => {
                if (idsEnviados.includes(product._id!)) {
                    const updatedProduct = { ...product };

                    // 1. Si cambió el estado
                    if (cambiosEnviados.estado) {
                        updatedProduct.estado = cambiosEnviados.estado;
                    }

                    // 2. Si cambió el precio (multiplicamos el actual por el factor)
                    if (cambiosEnviados.porcentaje_precio) {
                        const factor = 1 + (cambiosEnviados.porcentaje_precio / 100);
                        updatedProduct.precio_base = updatedProduct.precio_base * factor;
                    }

                    // 3. Si cambió el stock de todas las variantes
                    if (typeof cambiosEnviados.stock_a_sumar === 'number') {
                        updatedProduct.variantes = updatedProduct.variantes.map(v => ({
                            ...v,
                            stock: v.stock + cambiosEnviados.stock_a_sumar
                        }));
                    }

                    return updatedProduct;
                }
                return product;
            });

            state.successMessage = action.payload.message;
        })



        // DELETE ONE
        .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter(p => p._id !== action.payload.id);
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as any;
        })



        // BULK DELETE
        .addCase(bulkDeleteProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
            state.loading = false;
            // Filtramos para quitar todos los IDs que fueron eliminados
            state.products = state.products.filter(p => !action.payload.ids.includes(p._id!));
            state.successMessage = action.payload.message;
            state.error = null;
        })
        .addCase(bulkDeleteProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as any;
        })



        // EXPORT CSV
        .addCase(exportProductsCSV.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(exportProductsCSV.fulfilled, (state) => {
            state.loading = false;
            state.successMessage = "Archivo CSV generado correctamente ✅";
        })
        .addCase(exportProductsCSV.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })



        // IMPORT CSV
        .addCase(importProductsCSV.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(importProductsCSV.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload; 
            state.error = null;
        })
        .addCase(importProductsCSV.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})

export default productSlice.reducer