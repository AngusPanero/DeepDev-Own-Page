import Banner from "../components/sections/Banner"
import Footer from "../components/sections/Footer"
import NavBar from "../components/sections/NavBar"
import Scroll3DSection from "../components/sections/Scroll3DSection"
import AmbientOverlay from "../components/ui/AmbientOverlat"

const Home = () => {
    return(
        <>
        <AmbientOverlay />
        <NavBar />
        <Scroll3DSection />
        <Banner />
        <Footer />
        </>
    )
}

export default Home 