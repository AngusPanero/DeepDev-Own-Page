import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { auth } from "../firebase/firebase.ts"
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { UseLanguage } from "./LanguageContext.tsx";

const SessionContext = createContext<SessionContextType | null>(null);

interface ProviderProps {
  children: ReactNode;
}

interface SessionContextType {
    handleRegister: (email: string, password: string, loginOpen: any, registerOpen: any) => Promise<void>;
    handleLogin: (email: string, password: string) => Promise<boolean | undefined>;
    handleLogout: () => Promise<void>;
    handleResetPassword: (email: string) => Promise<void>;
    error: string | boolean | null | number;
    setError: React.Dispatch<React.SetStateAction<string | boolean | null | number>>;
    loading: string | boolean | null | number;
    setLoading: React.Dispatch<React.SetStateAction<string | boolean | null | number>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const SessionProvider = ({ children }: ProviderProps) => {
    const navigate = useNavigate()
    const timeRef = useRef<any>(null);
    const { texts, language } = UseLanguage()

    const [ error, setError ] = useState<string | boolean | null | number>(false)
    const [ loading, setLoading ] = useState<string | boolean | null | number>(false)
    const [ user, setUser ] = useState<unknown>(null)

    // Auto Logout
    useEffect(() => {
        if (!user) return;

        const timeout = 15 * 60 * 1000; // 15 minutos

        const resetTimer = () => {
            if (timeRef.current) clearTimeout(timeRef.current);
            timeRef.current = setTimeout(async () => {
                await auth.signOut();
                setUser(null);
                navigate("/");
            }, timeout);
        };
        resetTimer();

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (timeRef.current) clearTimeout(timeRef.current);
        };
    }, [user, navigate]);

    // Register
    const handleRegister = async (email: string, password: string, loginOpen: React.Dispatch<React.SetStateAction<boolean>>, registerOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
        try {
            setError(null)
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, password })
            if(response.status === 201){
                /* console.log(`User created successfully! 🟢`); */
                
                registerOpen(false)
                loginOpen(true)
            }
        } catch (error: any) {
            if(error.response?.status === 409){
                setError(true)
                return
            }
            setError(true)
            /* console.error("Internal error creating user! 🔴", error) */
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
            console.log("Admin: ", customClaims.claims.admin);
            
            if(customClaims.claims.banned){
                await auth.signOut(); 
                setUser(null);
                
                setError(texts[language].sessionErrors.loginBanned); // Usuario Banneado    
                return
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { idToken }, { withCredentials: true })
            if(response.status === 200){
                if(customClaims.claims.admin === true){
                    navigate("/admin")
                    return true
                } else {
                    navigate("/dashboard")
                    return true
                }
            }

        } catch (error: any) {
                if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential"){
                    try {
                        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/login-failed`,{ email });
                        
                        if (data.banned) {
                            setError(texts[language].sessionErrors.loginTooManyAttempts); // Demasiados intentos
                            return;
                        }
                        if (data.attempts < 5) {
                            setError(texts[language].sessionErrors.loginAttemptsLeft); // Restantes
                        } else {
                            setError(texts[language].sessionErrors.loginInvalidCredentials); // Credenciales Invalidas);
                        }

                    } catch (error){
                        setError(texts[language].sessionErrors.loginInvalidCredentials); // Credenciales Invalidas
                        console.error("Login error:", error);
                    }
                    return;
                }
            console.error("Login error:", error);
            setError(texts[language].sessionErrors.loginGeneralError); // Intenta más tarde
        } finally {
            setLoading(false)
        }
    }
    // Logout
    const handleLogout = async () => {
        try {
            setError(false)
            setLoading(true);
            const idToken = await auth.currentUser?.getIdToken();

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { idToken }, { withCredentials: true });

            if (response.status === 200) {
                await auth.signOut()
                setUser(null)
                navigate("/");
            }
        } catch (error: any) {
            setError(texts[language].sessionErrors.logoutError); // Error al cerrar
            console.error("Error logging out session 🔴", error);
        } finally {
            setLoading(false)
        }
    }

    // Reset Password
    const handleResetPassword = async (email: string) => {
        try {
            if(!email){
                alert(texts[language].sessionErrors.resetEmailRequired); // Ingresá mail
                return;
            } else {
                await sendPasswordResetEmail(auth, email);
                alert(texts[language].sessionErrors.resetEmailSent); // Mail enviado
            }
            
        } catch (error: any) {
            console.error("Error al enviar el email:", error.code);

            switch (error.code) {
                case "auth/user-not-found":
                    alert(texts[language].sessionErrors.resetUserNotFound); // No Existe usuario
                    break;
                case "auth/invalid-email":
                    alert(texts[language].sessionErrors.resetInvalidEmail); // Formato mail invalido
                    break;
                case "auth/too-many-requests":
                    alert(texts[language].sessionErrors.resetTooManyRequests); // Demasiados Intentos
                    break;
                default:
                    alert("Default Error.");
            }
        }
    }

    // Refresh
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if(firebaseUser){
                
                setUser(firebaseUser)
                await firebaseUser.getIdToken()
                
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return () => unSubscribe()
    }, [])

    /* // Inactivity Context 15 min
    const AutoLogout = (timeout: number = 15 * 60 * 1000) => {
        const timeRef = useRef<any>(null)

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
    } */

    return(
        <SessionContext.Provider value={{ handleRegister , handleLogin, handleLogout, handleResetPassword, error, setError, loading, setLoading, user, setUser }}>
            { children }
        </SessionContext.Provider>
    )
}

export const UseSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession debe ser usado dentro de un SessionProvider");
  }
  return context; 
};

