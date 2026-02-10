import axios from "axios";
import { createContext, useContext, useState } from "react";

const ShoppingContext = createContext()

export const ShoppingProvider = ({ children }) => {
    const [ purchased, setPurchased ] = useState("")
    const [ error, setError ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)

    const getPurchased = async (user) => {
        try {
            setError(false)
            setLoading(true)

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/tickets`, { email: user })
            if(response.status === 200){
                setPurchased(response.data)
            }
        } catch (error) {
            setError(true)
            console.error("Error al conseguir tickets! 🔴")
        } finally {
            setLoading(false)
        }
    }

    return(
        <ShoppingContext.Provider value={{ purchased, error, loading, getPurchased }}>
            { children }
        </ShoppingContext.Provider>
    )
}

const useShopping = () => useContext(ShoppingContext)

export default useShopping

