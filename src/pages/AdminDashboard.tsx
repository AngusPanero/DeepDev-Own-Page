import { useEffect } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseTheme } from "../contexts/ThemeContext";
import "../styles/adminDashboard.css"

const AdminDashboard = () => {
    const { user } = UseSession();
    const { theme } = UseTheme();
    const { allTickets, getPurchased } = UseShopping()
/* 
    const handleUnban = async (uid: string) => {
        // Aquí iría tu lógica de Firebase para remover custom claims o setear banned: false
        console.log("Unbanning user:", uid);
    }; */

    useEffect(() => {
        if (user && user.email) {
            getPurchased(user.email);
            console.log(allTickets);
            
        }
    }, [user?.email, user])

    return (
        <div className={`dd-dashboard ${theme}`}>
            <div className="dd-grid-overlay"></div>
            
            <section className="dd-content">
                <header className="dd-header">
                    <div className="dd-user-badge">ADMIN_ACCESS: {user?.email?.split('@')[0].toUpperCase()}</div>
                    <h1 className="dd-title">ADMIN_<span>TERMINAL:</span></h1>
                </header>

                <div className="dd-main-grid">
                    {/* Stats rápidas */}
                    <div className="dd-terminal-card highlight">
                        <div className="card-header">TOTAL_REVENUE</div>
                        <div className="card-body">
                            {/* <span className="dd-big-number">
                                ${allSales.reduce((acc, curr) => acc + curr.amount, 0)}
                            </span> */}
                            <span className="dd-unit">NET_FUNDS_CAPTURED</span>
                        </div>
                    </div>

                    <div className="dd-terminal-card">
                        <div className="card-header">USER_BASE_METRICS</div>
                        <div className="card-body">
                            {/* <p>TOTAL_REGISTRATIONS: <span>{allUsers.length}</span></p> */}
                            <p>SYSTEM_HEALTH: <span>STABLE</span></p>
                            <div className="dd-progress-bar"><div className="fill"></div></div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUCTOS VENDIDOS */}
                    <div className="dd-logs-container section-sales">
                        <div className="card-header">SALES_DATABASE_LOGS</div>
                        <div className="dd-logs-wrapper">
                            {/* {allSales.length > 0 ? (
                                allSales.map((sale) => (
                                    <div key={sale._id} className="dd-log-entry sale-row">
                                        <span className="log-date">[{new Date(sale.createdAt).toLocaleDateString()}]</span>
                                        <span className="log-user">{sale.userEmail}</span>
                                        <span className="log-plan">{sale.plan}</span>
                                        <span className="log-amount">${sale.amount}</span>
                                    </div>
                                ))
                            ) : ( <div className="dd-empty">NO_SALES_RECORDED</div> )} */}
                        </div>
                    </div>

                    {/* GESTIÓN DE USUARIOS */}
                    <div className="dd-logs-container section-users">
                        <div className="card-header">USER_REGISTRY_MANAGEMENT</div>
                        <div className="dd-logs-wrapper">
                            {/* {allUsers.map((u) => (
                                <div key={u.uid} className={`dd-log-entry user-row ${u.isBanned ? 'is-banned' : ''}`}>
                                    <span className="log-id">ID: {u.uid.substring(0, 8)}...</span>
                                    <span className="log-user">{u.email}</span>
                                    <span className={`log-status ${u.isBanned ? 'status-red' : 'status-green'}`}>
                                        {u.isBanned ? 'RESTRICTED' : 'ACTIVE'}
                                    </span>
                                    {u.isBanned && (
                                        <button 
                                            className="dd-btn-unban"
                                            onClick={() => handleUnban(u.uid)}
                                        >
                                            RESTORE_ACCESS
                                        </button>
                                    )}
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard