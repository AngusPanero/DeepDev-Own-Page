import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth } from "../firebase/firebase.js"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
    const navigate = useNavigate()

    const [ error, setError ] = useState<string | boolean | null | number>(false)
    const [ loading, setLoading ] = useState<string | boolean | null | number>(false)
    const [ user, setUser ] = useState<unknown>(null)

    // Register
    const handleRegister = async (email: string, password: string, loginOpen: React.Dispatch<React.SetStateAction<boolean>>, registerOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            setError(null)
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, password })
            if(response.status === 201){
                console.log(`User created successfully! 🟢`);
                
                registerOpen(false)
                loginOpen(true)
            }
        } catch (error) {
            if(error.response?.status === 409){
                setError(true)
                return
            }
            setError(true)
            console.error("Internal error creating user! 🔴", error)
        } finally {
            setLoading(false)
        }
    }

    // Login
    const handleLogin = async ( email: string, password: string, ) => {
        try {
            setLoading(true)
            setError(null)
            
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredentials.user)
        
            const idToken = await userCredentials.user.getIdToken(true) // El true obliga a buscar siempre tokens nuevas no antiguas que no hayan expirado

            {/* CUSTOM CLAIMS */}
            const customClaims = await userCredentials.user.getIdTokenResult();

            if(customClaims.claims.banned){
                await auth.signOut(); 
                setUser(null);
                setError("Usuario baneado. Contactate con DeepDev.");    
                return
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { idToken }, { withCredentials: true })
            if(response.status === 200){
                navigate("/admin")
                return true
            }
        } catch (error) {
                if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential"){
                    try {
                        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/login-failed`,{ email });
                        
                        if (data.banned) {
                            setError("Tu cuenta fue bloqueada por demasiados intentos fallidos.");
                            return;
                        }
                        if (data.attempts < 5) {
                            setError(`Credenciales inválidas. Te quedan ${5 - data.attempts} intento(s).`);
                        } else {
                            setError("Credenciales inválidas.");
                        }

                    } catch (error){
                        setError("Credenciales inválidas.");
                        console.error("Login error:", error);
                    }
                    return;
                }
            console.error("Login error:", error);
            setError("Error al iniciar sesión. Intentá más tarde.");
        } finally {
            setLoading(false)
        }
    }
    // Logout
    const handleLogout = async () => {
        try {
            setError(false)
            setLoading(true);
            const idToken = await auth.currentUser.getIdToken();

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { idToken }, { withCredentials: true });

            if (response.status === 200) {
                await auth.signOut()
                setUser(null)
                navigate("/");
            }
        } catch (error) {
            setError("Error al cerrar sesión");
            console.error("Error logging out session 🔴", error);
        } finally {
            setLoading(false)
        }
    }
    // Refresh
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if(firebaseUser){
                console.log("refresh:", firebaseUser);
                
                setUser(firebaseUser)
                await firebaseUser.getIdToken()
                
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return () => unSubscribe()
    }, [])

    // Inactivity Context 15 min
    const AutoLogout = (timeout: number = 15 * 60 * 1000) => {
        const timeRef = useRef<unknown>(null)

        const resetTimer = () => {
            if(timeRef.current) clearTimeout(timeRef.current)
            
             timeRef.current = setTimeout(async () => {
                await auth.signOut()
                setUser(null)
                navigate("/");
             }, timeout)   
        }

        useEffect(() => {
            if (!user) return;

            resetTimer();

            const events = [ "mousemove", "mousedown", "keydown", "scroll", "touchstart" ];

            events.forEach((event) =>
                window.addEventListener(event, resetTimer)
            );

            return () => {
                events.forEach((event) =>
                    window.removeEventListener(event, resetTimer)
                );
                if (timeRef.current) clearTimeout(timeRef.current);
            };
        }, [user, timeout]);
    }

    return(
        <SessionContext.Provider value={{ handleRegister , handleLogin, handleLogout, AutoLogout, error, setError, loading, setLoading, user, setUser }}>
            { children }
        </SessionContext.Provider>
    )
}

const useSession = () => useContext(SessionContext)

export default useSession

