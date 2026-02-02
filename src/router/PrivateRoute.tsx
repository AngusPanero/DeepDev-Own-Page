import { useEffect, useState } from "react"
import { auth } from "../firebase/firebase.js"
import Loader from "../components/sections/Loader.js"
import axios from "axios"
import useSession from "../contexts/SessionContext.js"
import Error from "../components/sections/Error.js"

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSession()
    const [ status, setStatus ] = useState<string>("loading")

    useEffect(() => {
        if(loading) return

        if(!user){
            setStatus("unauth")
            return
        }

        const checkSession = async () => {
            const idToken = await auth.currentUser.getIdToken()
            try {
                await axios.get(`${import.meta.env.VITE_API_URL}/me`, { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true })
                setStatus("ok")
            } catch (error) {
                if (error.response?.status === 403) {
                    setStatus("banned");
                    } else {
                    setStatus("unauth");
                }
            }
        }
        checkSession()
    }, [ user, loading ])

    if (loading || status === "loading") {
        return <Loader />;
    }

    if (status === "banned") {
        return <Error errorMessage={"Usuario Baneado, Contactate con DeepDev."} />;
    }

    /* if (status === "unauth" || !user) {
        setError("No Tienes Acceso!");
        return null;
    } */

    return status === "ok" ? children : null; // Devuelvo null para evitar el pantallazo por el async de verificar el usuario
}

export default PrivateRoute