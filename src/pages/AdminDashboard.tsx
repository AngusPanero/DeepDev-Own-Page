import useSession from "../contexts/SessionContext";

const AdminDashboard = () => {
    const { AutoLogout } = useSession()
    AutoLogout()
    return(
        <h1 style={{ color: "white", marginTop: "10rem" }}>ADMIN DASHBOARD</h1>
    )
}

export default AdminDashboard;