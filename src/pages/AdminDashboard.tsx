import { useEffect } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseTheme } from "../contexts/ThemeContext";
import { UseUsers } from "../contexts/UsersContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "../styles/adminDashboard.css"

const AdminDashboard = () => {
    const { user, handleUnbanUser, handleBanUser } = UseSession();
    const { theme } = UseTheme();
    const { allTickets, getAllTickets } = UseShopping();
    const { users, getUsers } = UseUsers()

    // 1. Definición de la función procesadora
    const processChartData = (tickets: any[]) => {
        if (!Array.isArray(tickets)) return [];
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlyData: any = {};

        tickets.forEach(ticket => {
            const date = new Date(ticket.createdAt);
            const monthName = months[date.getMonth()];
            
            if (!monthlyData[monthName]) {
                monthlyData[monthName] = { name: monthName, total: 0 };
            }
            monthlyData[monthName].total += ticket.amount;
        });

        return Object.values(monthlyData);
    };

    // 2. Ejecución de la data procesada (Esto faltaba definirlo)
    const chartData = processChartData(allTickets || []);

    // 3. Cálculos financieros
    const totalGross = Array.isArray(allTickets) 
        ? allTickets.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0) 
        : 0;

    const commission = totalGross * 0.30;
    const netProfit = totalGross - commission;

    const pieData = [
        { name: "NET_PROFIT", value: netProfit, color: "#10b981" },
        { name: "ML_FEES", value: commission, color: "#ef4444" }
    ];

    useEffect(() => {
        if (user) {
            getAllTickets();
            getUsers()
        }
    }, [user]);

    return (
        <div className={`dd-dashboard ${theme}`}>
            <div className="dd-grid-overlay"></div>
            
            <section className="dd-content">
                <header className="dd-header">
                    <div className="dd-user-badge">ADMIN_ACCESS: {user?.email?.split('@')[0].toUpperCase()}</div>
                    <h1 className="dd-title">ADMIN_<span>TERMINAL:</span></h1>
                </header>

                <div className="dd-main-grid">
                    {/* STAT: Total Bruto */}
                    <div className="dd-terminal-card highlight">
                        <div className="card-header">TOTAL_REVENUE</div>
                        <div className="card-body">
                            <span className="dd-big-number">
                                ${totalGross.toLocaleString()}
                            </span>
                            <h1>Total Facturado</h1>
                            <span className="dd-unit">NET_FUNDS_CAPTURED</span>
                        </div>
                    </div>

                    {/* GRÁFICO DE BARRAS: Facturación Mensual */}
                    <div className="dd-terminal-card dd-chart-card">
                        <div className="card-header">MONTHLY_REVENUE_LOG</div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #a855f7', color: '#fff' }}
                                        itemStyle={{ color: '#a855f7' }}
                                    />
                                    <Bar dataKey="total" fill={theme === 'dark' ? '#a855f7' : '#0062FF'} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* GRÁFICO CIRCULAR: Neto vs Comisión */}
                    <div className="dd-terminal-card dd-chart-card">
                        <div className="card-header">FUNDS_DISTRIBUTION_ANALYTICS</div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="dd-pie-legend">
                                <p><span className="dot net"></span> NETO COBRADO: ${netProfit.toLocaleString()}</p>
                                <p><span className="dot comm"></span> MP_FEES (30%): ${commission.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="dd-terminal-card">
                        <div className="card-header">SYSTEM_METRICS</div>
                        <div className="card-body">
                            <p>STABILITY_STATUS: <span>OPTIMAL</span></p>
                            <p>ENCRYPTION_LAYER: <span>ACTIVE</span></p>
                            <div className="dd-progress-bar"><div className="fill"></div></div>
                        </div>
                    </div>

                    {/* LISTA DE VENTAS */}
                    <div className="dd-logs-container section-sales">
                        <h2>Ventas Realizadas:</h2>
                        <div className="card-header">SALES_DATABASE_LOGS</div>
                        <div className="dd-logs-wrapper">
                            {Array.isArray(allTickets) && allTickets.length > 0 ? (
                                allTickets.map((sale: any) => (
                                    <div key={sale._id} className="dd-log-entry sale-row">
                                        <span className="log-date">[{new Date(sale.createdAt).toLocaleDateString()}]</span>
                                        <span className="log-user">{sale.email}</span>
                                        <span className="log-status">{sale.status?.toUpperCase()}</span>
                                        <span className="log-plan">{sale.plan}</span>
                                        <span className="log-amount">${sale.amount?.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="dd-empty">NO_SALES_RECORDED</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Usuarios */}
                    <div className="dd-logs-container section-sales">
                        <h2>Usuarios Registrados:</h2>
                        <div className="card-header">USER_DATABASE</div>
                        <div className="dd-logs-wrapper">
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user: any) => (
                                    <div key={user.email} className="dd-log-entry user-row">
                                        <span className="log-date">[{new Date(user.metadata.creationTime).toLocaleDateString()}]</span>
                                        <span className={user.isAdmin === true ? `log-status` : `log-banned`}>Admin: {user.isAdmin === false ? "False" : "True"}</span>
                                        <span className="log-user">{user.email}</span>
                                        <span className="log-banned">{user.isBanned === true && "BANNED"}</span>
                                        {user.isBanned === true && <button onClick={() => handleUnbanUser(user.uid)} className="unban-btn">Unban</button>}
                                        {user.isBanned === false && <button onClick={() => handleBanUser(user.email)} className="ban-btn">Bannear</button>}
                                    </div>
                                ))
                            ) : (
                                <div className="dd-empty">NO_USERS_RECORDED</div>
                            )}
                        </div>
                    </div>
            </section>
        </div>
    );
};

export default AdminDashboard;