import { useEffect, useState, useMemo } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseTheme } from "../contexts/ThemeContext";
import { UseUsers } from "../contexts/UsersContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import "../styles/adminDashboard.css"
import CreateProduct from "../components/sections/CreateProduct";
import CategoryManager from "../components/sections/CategoryManage";
import ProductAdminManager from "../components/sections/ProductAdminManager";

const AdminDashboard = () => {
    const { user, handleUnbanUser, handleBanUser } = UseSession();
    const { theme } = UseTheme();
    const { allTickets, getAllTickets } = UseShopping();
    const { users, getUsers } = UseUsers();

    // ESTADOS PARA FILTROS
    const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year' | 'custom'>('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- LÓGICA DE FILTRADO Y PROCESAMIENTO ---
    const filteredTickets = useMemo(() => {
        if (!Array.isArray(allTickets)) return [];
        const now = new Date();
        
        return allTickets.filter(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            
            if (timeRange === 'day') {
                return ticketDate.toDateString() === now.toDateString();
            }
            if (timeRange === 'month') {
                return ticketDate.getMonth() === now.getMonth() && ticketDate.getFullYear() === now.getFullYear();
            }
            if (timeRange === 'year') {
                return ticketDate.getFullYear() === now.getFullYear();
            }
            if (timeRange === 'custom' && startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59);
                return ticketDate >= start && ticketDate <= end;
            }
            return true;
        });
    }, [allTickets, timeRange, startDate, endDate]);

    const chartData = useMemo(() => {
        const dataMap: any = {};
        
        filteredTickets.forEach(ticket => {
            const date = new Date(ticket.createdAt);
            let label = "";
            
            if (timeRange === 'day') label = `${date.getHours()}:00hs`;
            else if (timeRange === 'month' || timeRange === 'custom') label = date.toLocaleDateString([], {day: '2-digit', month: 'short'});
            else label = date.toLocaleDateString([], {month: 'long'});

            if (!dataMap[label]) dataMap[label] = { name: label, total: 0 };
            dataMap[label].total += ticket.amount;
        });

        return Object.values(dataMap);
    }, [filteredTickets, timeRange]);

    // Cálculos financieros basados en el filtro
    const totalGross = filteredTickets.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const commission = totalGross * 0.30;
    const netProfit = totalGross - commission;

    const pieData = [
        { name: "NET_PROFIT", value: netProfit, color: "#10b981" },
        { name: "ML_FEES", value: commission, color: "#ef4444" }
    ];

    useEffect(() => {
        if (user) {
            getAllTickets();
            getUsers();
        }
    }, [user]);

    return (
        <>
        <div className={`dd-dashboard ${theme}`}>
            <div className="dd-grid-overlay"></div>
            
            <section className="dd-content">
                <header className="dd-header">
                    <div className="dd-header-left">
                        <div className="dd-user-badge">ADMIN_ACCESS: {user?.email?.split('@')[0].toUpperCase()}</div>
                        <h1 className="dd-title">ADMIN_<span>TERMINAL:</span></h1>
                    </div>

                    {/* --- SELECTORES DE TIEMPO --- */}
                    <div className="dd-terminal-controls">
                        <div className="control-group">
                            <span className="control-label">FILTER_BY:</span>
                            <button className={timeRange === 'day' ? 'active' : ''} onClick={() => setTimeRange('day')}>HOY</button>
                            <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>MES</button>
                            <button className={timeRange === 'year' ? 'active' : ''} onClick={() => setTimeRange('year')}>AÑO</button>
                            <button className={timeRange === 'custom' ? 'active' : ''} onClick={() => setTimeRange('custom')}>RANGO</button>
                        </div>

                        {timeRange === 'custom' && (
                            <div className="control-group date-inputs animate-fade">
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                <span className="arrow">→</span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        )}
                    </div>
                </header>

                <div className="dd-main-grid">
                    <div className="dd-terminal-card highlight">
                        <div className="card-header">TOTAL_REVENUE_BY_PERIOD</div>
                        <div className="card-body">
                            <span className="dd-big-number">${totalGross.toLocaleString()}</span>
                            <h1>Total Facturado ({timeRange.toUpperCase()})</h1>
                            <span className="dd-unit">NET_FUNDS_CAPTURED</span>
                        </div>
                    </div>

                    <div className="dd-terminal-card dd-chart-card">
                        <div className="card-header">REVENUE_STREAM_LOG</div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #a855f7', color: '#fff' }}
                                        itemStyle={{ color: '#a855f7' }}
                                    />
                                    <Bar dataKey="total" fill={theme === 'dark' ? '#a855f7' : '#0062FF'} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="dd-terminal-card dd-chart-card">
                    <div className="card-header">FUNDS_DISTRIBUTION</div>
                    
                        {/* Contenedor flexible para que todo quepa dentro de la card */}
                        <div className="dd-chart-container-pie" style={{ height: '320px' }}>
                            
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    
                                    {/* Tooltip con contenido personalizado para máxima legibilidad */}
                                    <Tooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="dd-custom-tooltip">
                                                        <span className="label">{payload[0].name}</span>
                                                        <span className="value">${payload[0].value.toLocaleString()}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Leyenda ahora integrada en el flujo vertical */}
                            <div className="dd-pie-legend">
                                <p>
                                    <span className="dot net"></span> 
                                    NETO: <span style={{color: '#fff', marginLeft: '5px'}}>${netProfit.toLocaleString()}</span>
                                </p>
                                <p>
                                    <span className="dot comm"></span> 
                                    FEES: <span style={{color: '#fff', marginLeft: '5px'}}>${commission.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dd-terminal-card">
                        <div className="card-header">SYSTEM_METRICS</div>
                        <div className="card-body">
                            <p>STABILITY_STATUS: <span className="green-glow">OPTIMAL</span></p>
                            <p>ENCRYPTION_LAYER: <span>ACTIVE</span></p>
                            <div className="dd-progress-bar"><div className="fill" style={{width: '90%'}}></div></div>
                        </div>
                    </div>

                    <div className="dd-logs-container section-sales full-width-grid">
                        <h2>Ventas Realizadas ({filteredTickets.length}):</h2>
                        <div className="card-header">SALES_DATABASE_LOGS</div>
                        <div className="dd-logs-wrapper">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((sale: any) => (
                                    <div key={sale._id} className="dd-log-entry sale-row">
                                        <span className="log-date">[{new Date(sale.createdAt).toLocaleDateString()}]</span>
                                        <span className="log-user">{sale.email}</span>
                                        <span className="log-status">{sale.status?.toUpperCase()}</span>
                                        <span className="log-plan">{sale.plan}</span>
                                        <span className="log-amount">${sale.amount?.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="dd-empty">NO_SALES_RECORDED_IN_THIS_PERIOD</div>
                            )}
                        </div>
                    </div>

                    <div className="dd-logs-container section-sales full-width-grid">
                        <h2>Usuarios Registrados:</h2>
                        <div className="card-header">USER_DATABASE</div>
                        <div className="dd-logs-wrapper">
                        {(Array.isArray(users) ? users : []).map((user: any) => (
                            <div key={user.email || user.uid} className="dd-log-entry user-row">
                                <span className="log-date">
                                    [{user.metadata?.creationTime 
                                        ? new Date(user.metadata.creationTime).toLocaleDateString() 
                                        : 'N/A'}]
                                </span>
                                <span className={user.isAdmin ? `log-status` : `log-banned`}>
                                    Admin: {user.isAdmin ? "True" : "False"}
                                </span>
                                <span className="log-user">{user.email}</span>
                                {user.isBanned && <span className="log-banned">BANNED</span>}
                                <div className="btn-group">
                                    {user.isBanned ? (
                                        <button onClick={() => handleUnbanUser(user.uid)} className="unban-btn">Unban</button>
                                    ) : (
                                        <button onClick={() => handleBanUser(user.email)} className="ban-btn">Ban</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!users || users.length === 0) && <div className="dd-empty">NO_USERS_FOUND</div>}
                    </div>
                    </div>
                </div>
            </section>
        </div>
        <CategoryManager />
        <CreateProduct />
        <ProductAdminManager />
        </>
    );
};

export default AdminDashboard;