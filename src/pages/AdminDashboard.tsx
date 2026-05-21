import { useEffect } from "react";
import { UseSession } from "../contexts/SessionContext";
import { UseShopping } from "../contexts/ShoppingContext";
import { UseUsers } from "../contexts/UsersContext";
import "../styles/adminDashboard.css"
/* import CreateProduct from "../components/sections/CreateProduct";
import CategoryManager from "../components/sections/CategoryManage";
import ProductAdminManager from "../components/sections/ProductAdminManager"; */
/* import UsersRegistered from "../components/sections/UsersRegistered";
import SalesHistory from "../components/sections/SalesHistory";
import Charts from "../components/sections/Charts"; */
import { UseTheme } from "../contexts/ThemeContext";
import BusinessScraper from "../businessScrapper/BussinesScrapper";
import BusinessScraperRest from "../businessScrapperRest/BussinesScrapperRest";
/* import CouponCreator from "../components/sections/CouponCreator"; */

const AdminDashboard = () => {
    const { user,/*  handleUnbanUser, handleBanUser */ } = UseSession();
    const { /* allTickets, */ getAllTickets } = UseShopping();
    const { /* users, */ getUsers } = UseUsers();
    const { theme } = UseTheme()

    useEffect(() => {
        if (user.isAdmin === true) {
            getAllTickets();
            getUsers();
        }
    }, [user]);

    return (
        <div className={`dd-dashboard ${theme}`}>
            <BusinessScraper googleApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY || ""} emailScraperEndpoint={`${import.meta.env.VITE_API_URL}/api/scrape-email`} maxResults={60} />
            <BusinessScraperRest googleApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY || ""} emailScraperEndpoint={`${import.meta.env.VITE_API_URL}/api/scrape-email`} maxResults={60} />
            {/* <Charts allTickets={allTickets} /> */}
            {/* <CreateProduct />
            <ProductAdminManager /> */}
            {/* <SalesHistory allTickets={allTickets} />
            <UsersRegistered users={users} handleBanUser={handleBanUser} handleUnbanUser={handleUnbanUser} /> */}
            {/* <CategoryManager />
            <CouponCreator /> */}
        </div>
    );
};

export default AdminDashboard;