import { useEffect } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseUsers } from "../contexts/UsersContext";
import "../styles/adminDashboard.css"
import CreateProduct from "../components/sections/CreateProduct";
import CategoryManager from "../components/sections/CategoryManage";
import ProductAdminManager from "../components/sections/ProductAdminManager";
import UsersRegistered from "../components/sections/UsersRegistered";
import SalesHistory from "../components/sections/SalesHistory";
import Charts from "../components/sections/Charts";
import { UseTheme } from "../contexts/ThemeContext";

const AdminDashboard = () => {
    const { user, handleUnbanUser, handleBanUser } = UseSession();
    const { allTickets, getAllTickets } = UseShopping();
    const { users, getUsers } = UseUsers();
    const { theme } = UseTheme()

    useEffect(() => {
        if (user) {
            getAllTickets();
            getUsers();
        }
    }, [user]);

    return (
        // CAMBIO: Envolver en un div con el tema para que las secciones ocupen todo
        <div className={`dd-dashboard ${theme}`}>
            <Charts allTickets={allTickets} />
            <SalesHistory allTickets={allTickets} />
            <UsersRegistered users={users} handleBanUser={handleBanUser} handleUnbanUser={handleUnbanUser} />
            <CategoryManager />
            <CreateProduct />
            <ProductAdminManager />
        </div>
    );
};

export default AdminDashboard;