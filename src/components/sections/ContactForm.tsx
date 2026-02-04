import { useState } from "react"
import "../../styles/contactForm.css"
import ParticleButton from "../ui/ParticleButton";
import useLanguage, { type LanguageContextType } from "../../contexts/LanguageContext";
import useTheme from "../../contexts/ThemeContext";
import Error from "./Error";
import axios from "axios";
import ProcessOk from "./processOk";
import Loader from "./Loader";

const ContactForm = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()

    const [ form, setForm ] = useState({ name: "", lastName: "", companyName: "", contactRole: "", email: "", phone: "", projectOption: "", typeOfWork: "", currentUrl: "", description: "", projectGoal: "", budgetRange: "", availableTime: "",})
    const [ hoverParticles, setHoverParticles ] = useState(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ process, setProcess ] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(false)
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, form)
            if(response.status === 201){
                await axios.post(`${import.meta.env.VITE_API_URL}/send-email`, form)
                setProcess("ok")
            }
        } catch (error) {
            setError(true)
            console.error("Error submitting the form:", error)
        } finally {
            setLoading(false)
            setError(false)
        }
    }

    if(loading) return <Loader />
    if(process === "ok") return <ProcessOk processMessage={"Contacto Enviado Exitosamente."} />
    if(error) return <Error errorMessage={"Error en el Envío, Intenta Nuevamente."} />

    return(
        <>
        <div className={`contact-box ${theme === "light" ? "theme-light" : "theme-dark"}`}>

            {/* <div className="footer-section">
                <ul className="footer-list">
                    <li><a href="mailto:contact@deepdev.dev">deepdevsolutions@gmail.com</a></li>
                    <li style={{ marginTop: "10px" }} className="footer-location"><strong>Argentina</strong> · {texts[language].footer.connect[0]}</li>
                    <li style={{ marginLeft: "10px" }} className="footer-location">{texts[language].footer.connect[1]}: +54 9 11-7118-7463</li>
                    
                    <li className="footer-location"><strong>Spain</strong> · {texts[language].footer.connect[0]}</li>
                    <li style={{ marginLeft: "10px" }} className="footer-location">{texts[language].footer.connect[1]}: +34 622-777-426</li>
                </ul>
            </div> */}

            <form className="contact-form" onSubmit={handleSubmit}>

                <label htmlFor="name">{texts[language].contact.name}</label> 
                <input type="text" value={form.name} name="name" id="name" onChange={(e) => setForm({...form, name: e.target.value})} required/>

                <label htmlFor="lastName">{texts[language].contact.lastName}</label>
                <input type="text" value={form.lastName} name="lastName" id="lastName" onChange={(e) => setForm({ ...form, lastName: e.target.value })} required/>

                <label htmlFor="companyName">{texts[language].contact.companyName}</label>
                <input type="text" value={form.companyName} name="companyName" id="companyName" onChange={(e) => setForm({ ...form, companyName: e.target.value })} required/>

                <label htmlFor="contactRole">{texts[language].contact.role}</label>
                <input type="text" value={form.contactRole} name="contactRole" id="contactRole" onChange={(e) => setForm({ ...form, contactRole: e.target.value })} required/>

                <label htmlFor="email">{texts[language].contact.email}</label>
                <input type="email" value={form.email} name="email" id="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required/>

                <label htmlFor="phone">{texts[language].contact.phone}</label>
                <input type="tel" value={form.phone} name="phone" id="phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required/>

                <label htmlFor="projectOption">{texts[language].contact.project}</label>
                <select id="projectOption" name="projectOption" value={form.projectOption} onChange={(e) => setForm({ ...form, projectOption: e.target.value })} required>
                    <option value="" disabled>{texts[language].contact.projectOption}</option>
                    <option value="new">{texts[language].contact.projectNew}</option>
                    <option value="redesign">{texts[language].contact.projectRedisign}</option>
                </select>

                {form.projectOption && form.projectOption !== "new" && (
                <div className="input-animate">
                    <label htmlFor="currentUrl">{texts[language].contact.current}</label>
                    <input className="input-animate-field" type="text" name="currentUrl" id="currentUrl" value={form.currentUrl} placeholder="https://example.com" onChange={(e) => setForm({ ...form, currentUrl: e.target.value })} required/>
                </div>
                )}

                <label htmlFor="typeOfWork">{texts[language].contact.type[0]}</label>
                <select id="typeOfWork" name="typeOfWork" value={form.typeOfWork} onChange={(e) => setForm({ ...form, typeOfWork: e.target.value })} required>
                    <option value="" disabled>{texts[language].contact.type[1]}</option>
                    <option value="landing">{texts[language].contact.type[2]}</option>
                    <option value="corporate">{texts[language].contact.type[3]}</option>
                    <option value="ecommerce">{texts[language].contact.type[4]}</option>
                    <option value="portfolio">{texts[language].contact.type[5]}</option>
                    <option value="services">{texts[language].contact.type[6]}</option>
                    <option value="webapp">{texts[language].contact.type[7]}</option>
                    <option value="custom">{texts[language].contact.type[8]}</option>
                    <option value="unsure">{texts[language].contact.type[9]}</option>
                </select>

                <label htmlFor="projectGoal">{texts[language].contact.projectGoal[0]}</label>
                <select id="projectGoal" name="projectGoal" value={form.projectGoal} onChange={(e) => setForm({ ...form, projectGoal: e.target.value })} required>
                    <option value="" disabled>{texts[language].contact.projectGoal[1]}</option>
                    <option value="leads">{texts[language].contact.projectGoal[2]}</option>
                    <option value="sales">{texts[language].contact.projectGoal[3]}</option>
                    <option value="branding">{texts[language].contact.projectGoal[4]}</option>
                    <option value="automation">{texts[language].contact.projectGoal[5]}</option>
                    <option value="other">{texts[language].contact.projectGoal[6]}</option>
                </select>

                <label htmlFor="budgetRange">{texts[language].contact.range[0]}</label>
                <select id="budgetRange" name="budgetRange" value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })} required>
                    <option value="" disabled>{texts[language].contact.range[1]}</option>
                    <option value="under-500">{texts[language].contact.range[2]}</option>
                    <option value="500-1000">{texts[language].contact.range[3]}</option>
                    <option value="1000-3000">{texts[language].contact.range[4]}</option>
                    <option value="3000-plus">{texts[language].contact.range[5]}</option>
                    <option value="not-sure">{texts[language].contact.range[6]}</option>
                </select>

                <label htmlFor="availableTime">{texts[language].contact.available[0]}</label>
                <select id="availableTime" name="availableTime" value={form.availableTime} onChange={(e) => setForm({ ...form, availableTime: e.target.value })} required>
                    <option value="" disabled>{texts[language].contact.available[1]}</option>
                    <option value="asap">{texts[language].contact.available[2]}</option>
                    <option value="1-2-months">{texts[language].contact.available[3]}</option>
                    <option value="3-plus-months">{texts[language].contact.available[4]}</option>
                    <option value="flexible">{texts[language].contact.available[5]}</option>
                </select>

                <label htmlFor="description">{texts[language].contact.descriptionPlace[0]}</label>
                <textarea value={form.description} name="description" id="description" onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder={texts[language].contact.descriptionPlace[1]} />
                
                <button type="submit" className="send-button-wrapper" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>
                    {texts[language].contact.button.toUpperCase()}
                </button>
                <ParticleButton active={hoverParticles} />
            </form>
        </div>
        </>
    )
}

export default ContactForm