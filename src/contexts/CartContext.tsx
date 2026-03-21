import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import axios from "axios";
import { UseSession } from "./SessionContext";

interface Coupon {
    code: string;
    discount: number; 
    type: 'single_use' | 'date_limited'; // Sigue siendo obligatorio según tu interfaz
    expiryDate?: Date;
    appliedAt?: Date; // <--- Añade esto
    isUsed?: boolean;
}

interface CartItem {
    id: string; 
    productId: string;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
    stockMax: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    
    totalAmount: number;    
    finalAmount: number;    
    totalItems: number;
    
    isLocked: boolean;
    setLock: (status: boolean) => void;
    
    appliedCoupon: Coupon | null;
    applyCoupon: (code: string) => Promise<string>; 
    handlePaymentSuccess: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = UseSession()
    const [ cart, setCart ] = useState<CartItem[]>([])
    const [ isLocked, setIsLocked ] = useState<boolean>(false)
    const [ appliedCoupon, setAppliedCoupon ] = useState<Coupon | null>(null)

    // CARGAR CARRITO
    useEffect(() => {
        const syncAndLoad = async () => {
            const localData = localStorage.getItem("terminal_cart");
            const localItems = localData ? JSON.parse(localData) : [];

            if (user) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, { email: user.email, items: localItems, merge: true }, { withCredentials: true });
                    
                    setCart(response.data.items);
                    if (response.data.appliedCoupon) {
                        setAppliedCoupon(response.data.appliedCoupon);
                    }
                    localStorage.removeItem("terminal_cart"); 
                } catch (error) {
                    console.error("Error al sincronizar/cargar", error);
                }
            } else {
                setCart(localItems);
            }
        };
        syncAndLoad();
    }, [user]);

    // PERSISTENCIA 
    useEffect(() => {
        if (isLocked || !cart) return;

        const persistData = async () => {
            if (user) {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, { 
                        email: user.email, 
                        items: cart, 
                        appliedCoupon, 
                        merge: false 
                    }, { withCredentials: true });
                } catch (error) {
                    console.error("Error en persistencia", error);
                }
            } else {
                localStorage.setItem("terminal_cart", JSON.stringify(cart));
                if (appliedCoupon) localStorage.setItem("terminal_coupon", JSON.stringify(appliedCoupon));
            }
        };

        const timeoutId = setTimeout(persistData, 1000);
        return () => clearTimeout(timeoutId);
    }, [cart, user, isLocked, appliedCoupon]);

    // SUMAR A CARRITO
    const addToCart = async (newItem: CartItem) => {
        if(isLocked) return

        setCart((prev: CartItem[]) => {
            const exist = prev.find((i: CartItem) => i.id === newItem.id)
            if(exist){
                return prev.map((i) => i.id === newItem.id ? { ...i, cantidad: Math.min(i.cantidad + newItem.cantidad, i.stockMax)} : i)
            }
            return [...prev, newItem]
        })
    } 

    // SUMAR CANTIDADES
    const updateQuantity = (id: string, qty: number) => {
        if(isLocked) return

        setCart(prev => prev.map(i => i.id === id ? { ...i, cantidad: Math.min(qty, i.stockMax) } : i));
    }

    // BORRAR DEL CARRITO
    const removeFromCart = (id: string) => {
        if(isLocked) return

        setCart(prev => prev.filter(i => i.id !== id));
    }

    // LIMPIAR CARRITO POST CHECKOUT
    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
        if (!user) {
            localStorage.removeItem("terminal_cart");
        }
    };

    // SISTEMA DE CUPONES
    const applyCoupon = async (code: string) => {
        if (!user) {
            return "Debes iniciar sesión para aplicar cupones 🔴";
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, { code, email: user.email }, { withCredentials: true });

            if (response.status === 200) {
                const couponData: Coupon = {
                    code: response.data.coupon.code,
                    discount: response.data.coupon.discount,
                    type: response.data.coupon.type, 
                    appliedAt: new Date() 
                };
                console.log("CUPON DATA", couponData);
                
                setAppliedCoupon(couponData);

                if (user) {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, { 
                        email: user.email, 
                        items: cart, 
                        appliedCoupon: couponData, 
                        merge: false 
                    }, { withCredentials: true });
                }
                return response.data.message;
            }
            return "Error inesperado";
        } catch (error: any) {
            const msg = error.response?.data?.message || "Error al validar cupón 🔴";
            setAppliedCoupon(null);
            return msg;
        }
    };

    // PRECIO FINAL
    const totalAmount = useMemo(() => cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0), [cart]);
    
    const finalAmount = useMemo(() => {
        if (!appliedCoupon) return totalAmount;
        return totalAmount * (1 - appliedCoupon.discount / 100);
    }, [totalAmount, appliedCoupon]);

    const totalItems = useMemo(() => cart.reduce((acc, i) => acc + i.cantidad, 0), [cart]);

    const handlePaymentSuccess = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/checkout/success`, { email: user.email, couponCode: appliedCoupon?.code || null, items: cart }, { withCredentials: true });
            clearCart(); 
        } catch (error: any) {
            console.error("Error al cerrar la orden", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart: () => setCart([]), totalAmount, finalAmount, totalItems, isLocked, setLock: setIsLocked, appliedCoupon, applyCoupon, handlePaymentSuccess, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const UseCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("UseCart debe usarse dentro de CartProvider");
    return context;
};