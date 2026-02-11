import { useEffect, useState, type ReactNode } from "react"
import { auth } from "../firebase/firebase.ts"
import Loader from "../components/sections/Loader.js"
import axios from "axios"
import { UseSession } from "../contexts/SessionContext.js"
import Error from "../components/sections/Error.js"

interface PrivateRouteProps{
    children: ReactNode;
    adminOnly: boolean
}

const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
    const { user, loading } = UseSession()
    const [ status, setStatus ] = useState<string>("loading")

    useEffect(() => {
        if (loading) return

        if (!user) {
            setStatus("unauth")
            return
        }

        const checkSession = async () => {
            const idToken = await auth.currentUser.getIdToken()

            const customClaims = await auth.currentUser.getIdTokenResult();
            {/* Doble negación forza a undefined y null a ser falsos, para solo trabajar con booleanos */}
            const admin = !!customClaims.claims.admin; // Esto es TRUE como si no tuviera los signos de exclamación
            
            if (adminOnly && !admin){
                    setStatus("no-admin")
                    return
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/me`, { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true })
                if(response.status === 200){
                    setStatus("ok")
                }
            }
            catch (error: any) {
                if (error.response?.status === 403) {
                    setStatus("banned")
                } else {
                    setStatus("unauth")
                }
            }
        }
        checkSession()

    }, [ user, loading, adminOnly ])

     if (loading || status === "loading") {
        return <Loader />;
    }

    if (status === "no-admin") {
        return <Error errorMessage={"Acceso Restringido: Se requieren permisos de Administrador."} />;
    }

    if (status === "banned") {
        return <Error errorMessage={"Usuario Baneado, Contactate con DeepDev."} />;
    }

    if (status === "unauth" || !user) {
        return <Error errorMessage={"No autorizado, por favor logueate."} />
    } 

    return status === "ok" ? children : null // Devuelvo null para evitar el pantallazo por el async de verificar el usuario
}

export default PrivateRoute