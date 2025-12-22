import Footer from "../components/sections/Footer"
import NavBar from "../components/sections/NavBar"
import ProductsInfo from "../components/sections/ProductsInfo"
import AmbientOverlay from "../components/ui/AmbientOverlat"
import "../styles/products.css"

const Products = () => {
    return(
        <>
        <AmbientOverlay />
        <NavBar />
        <ProductsInfo />
        <Footer />
        </>
    )
}

export default Products