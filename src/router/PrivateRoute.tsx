import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import useSession from "../contexts/SessionContext"
import Loader from "../components/sections/Loader"
import Error from "../components/sections/Error"

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useSession()
    const [ isVerified, setIsVerified ] = useState(false)
    const [ isBanned, setIsBanned ] = useState(false)

    useEffect(() => {
        const checkClaims = async () => {
            if (!user) return
            const idTokenResult = await user.getIdTokenResult()
            
            if (idTokenResult.claims.banned) {
                setIsBanned(true)
            }
            setIsVerified(true)
        }

        if (!loading) {
            checkClaims()
        }
    }, [user, loading])

    if (loading || (!isVerified && user)) {
        return <Loader />
    }

    if (!user) {
        return <Navigate to="/" />
    }

    if (isBanned) {
        return <Error errorMessage="Tu cuenta ha sido baneada. Contactate con DeepDev." />  
    }

    return isVerified ? children : null
}

export default PrivateRoute

/* import { useEffect, useState } from "react"
import { auth } from "../firebase/firebase.js"
import Loader from "../components/sections/Loader.js"
import axios from "axios"
import useSession from "../contexts/SessionContext.js"
import Error from "../components/sections/Error.js"

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSession()
    const [ status, setStatus ] = useState<string>("loading")

    useEffect(() => {
        if (loading) return

        if (!user) {
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
                    setStatus("banned")
                } else {
                    setStatus("unauth")
                }
            }
        }
        checkSession()

    }, [ user, loading ])

    /* if (loading || status === "loading") {
        return <Loader />;
    } */

    /* if (status === "banned") {
        return <Error errorMessage={"Usuario Baneado, Contactate con DeepDev."} />;
    } */

    /*if (status === "unauth" || !user) {
        <Error errorMessage={"No autorizado, por favor logueate."} />
        return null;
    } 

    return status === "ok" ? children : null // Devuelvo null para evitar el pantallazo por el async de verificar el usuario
}

export default PrivateRoute */