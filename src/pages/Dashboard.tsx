import { useEffect } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseTheme } from "../contexts/ThemeContext";
import "../styles/dashboard.css"

const Dashboard = () => {
    const { user, loading } = UseSession()
    const { purchased, getPurchased } = UseShopping()
    const { theme } = UseTheme(); 

    useEffect(() => {
        if (user) {
            console.log(user);
            
            getPurchased(user.email);
        }
    }, [user])

    return(
        <div className={`dd-dashboard ${theme}`}>
            <div className="dd-grid-overlay"></div> {/* Efecto de malla de fondo */}
            
            <section className="dd-content">
                <header className="dd-header">
                    <div className="dd-user-badge">SYSTEM_USER: {user?.email?.split('@')[0].toUpperCase()}</div>
                    <h1 className="dd-title">DASHBOARD_<span>PRIVADO:</span></h1>
                </header>

                <div className="dd-main-grid">
                    {/* Status Card */}
                    <div className="dd-terminal-card">
                        <div className="card-header">CORE_STATUS</div>
                        <div className="card-body">
                            <p>ACCESS_LEVEL: <span>{purchased?.length > 0 ? "CLIENT_USER" : "GUEST_USER"}</span></p>
                            <p>ENCRYPTION: <span>ACTIVE</span></p>
                            <div className="dd-progress-bar"><div className="fill"></div></div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="dd-terminal-card highlight">
                        <div className="card-header">DATA_INDEX</div>
                        <div className="card-body">
                            <span className="dd-big-number">{purchased?.length || 0}</span>
                            <span className="dd-unit">TICKETS_FOUND</span>
                        </div>
                    </div>

                    {/* Transactions (Cero tablas, estilo Logs) */}
                    <div className="dd-logs-container">
                        <div className="card-header">TRANSACTION_LOGS</div>
                        <div className="dd-logs-wrapper">
                            {loading ? (
                                <div className="dd-loading-text">FETCHING_DATA...</div>
                            ) : (Array.isArray(purchased) && purchased.filter(pur => pur.email === user.email).length > 0) ? (
                                purchased
                                    .filter((pur: any) => pur.email === user.email)
                                    .map((item: any) => (
                                        <div key={item._id} className="dd-log-entry">
                                            <span className="log-date">[{new Date(item.createdAt).toLocaleDateString()}]</span>
                                            <span className="log-plan">{item.plan}</span>
                                            <span className="log-status">SUCCESS</span>
                                            <span className="log-amount">${item.amount}</span>
                                        </div>
                                    ))
                            ) : (
                                <div className="dd-empty">NO_DATA_LOGGED_UNITS</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Dashboard;