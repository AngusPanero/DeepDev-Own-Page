import Banner from "../components/sections/Banner"
import Scroll3DSection from "../components/sections/Scroll3DSection"

const Home = () => {
    return(
        <div style={{ overflowX: "hidden" }}>
        <Scroll3DSection />
        <Banner />
        </div>
    )
}

export default Home 