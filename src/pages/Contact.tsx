import ContactForm from "../components/sections/ContactForm"
import Footer from "../components/sections/Footer"
import NavBar from "../components/sections/NavBar"
import AmbientOverlay from "../components/ui/AmbientOverlat"
import "../styles/contactForm.css"

const Contact = () => {
    return(
        <>
            <AmbientOverlay />
            <NavBar />
            <ContactForm />
            <Footer />
        </>
    )
}

export default Contact