import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import axios from "axios";
import { UseSession } from "./SessionContext";

interface Coupon {
    code: string;
    discount: number; 
    type: 'single_use' | 'date_limited';
    expiryDate?: Date;
    isUsed?: boolean;
    appliedCoupon?: string | string[]
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
        const loadCart = async () => {
            if(user){
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/${user.email}`, { withCredentials: true });
                    
                    setCart(response.data.items);
                    
                    if (response.data.appliedCoupon) {
                        applyCoupon(response.data.appliedCoupon);
                    }
                } catch (error: any) {
                    console.error("Error al consultar carrito", error);
                }
            } else {
                const localData = localStorage.getItem("terminal_cart");
                if(localData) setCart(JSON.parse(localData));
            }
        };
        loadCart();
    }, [user]);
    
    // SINCRONIZAR CARRITO
    useEffect(() => {
        if(isLocked) return;

        const syncData = async () => {
            if (user) {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, { email: user.email, items: cart, appliedCoupon: appliedCoupon?.code || null }, { withCredentials: true });
                } catch (error) {
                    console.error("Error al sincronizar", error);
                }
            } else {
                localStorage.setItem("terminal_cart", JSON.stringify(cart));
            }
        };

        const timeoutId = setTimeout(syncData, 1000);
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
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
                code,
                email: user?.email || "guest" 
            });

            if (response.status === 200) {
                setAppliedCoupon(response.data.coupon);
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