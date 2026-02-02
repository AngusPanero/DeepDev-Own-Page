import useSession from "../contexts/SessionContext";

const Dashboard = () => {
    const { AutoLogout } = useSession()
    AutoLogout()
    return(
        <h1 style={{ color: "white", marginTop: "10rem" }}>DASHBOARD</h1>
    )
}

export default Dashboard;