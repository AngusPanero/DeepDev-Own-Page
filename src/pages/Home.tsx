import Banner from "../components/sections/Banner"
import Hero from "../components/sections/Hero"
import Scroll3DSection from "../components/sections/Scroll3DSection"
import AmbientOverlay from "../components/ui/AmbientOverlat"


const Home = () => {
    return(
        <>
        <AmbientOverlay />
        <Hero />
        <Scroll3DSection />
        <Banner />
        </>
    )
}

export default Home 