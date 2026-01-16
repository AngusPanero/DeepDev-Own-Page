import CompanyInfo from "../components/sections/CompanyInfo";
import Footer from "../components/sections/Footer";
import NavBar from "../components/sections/NavBar";
import AmbientOverlay from "../components/ui/AmbientOverlat";

const Company = () => {
  return(
    <>
      <AmbientOverlay />
      <NavBar />
      <CompanyInfo />
      <Footer />
    </>
  )
}

export default Company;