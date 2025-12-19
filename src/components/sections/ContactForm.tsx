import { useState } from "react"
import "../../styles/contactForm.css"
import ParticleButton from "../ui/ParticleButton";

const ContactForm = () => {
    const [hoverParticles, setHoverParticles] = useState(false);
    const [ form, setForm ] = useState({
        name: "",
        lastName: "",
        companyName: "",
        contactRole: "",
        email: "",
        phone: "",
        projectOption: "",
        typeOfWork: "",
        currentUrl: "",
        description: "",
        projectGoal: "",
        budgetRange: "",
        availableTime: "",
        extraServices: [],
    })

    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return(
        <div className="contact-box">
            <form className="contact-form" onSubmit={handleSubmit}>

                <label htmlFor="name">Name:</label> 
                <input type="text" value={form.name} name="name" id="name" onChange={(e) => setForm({...form, name: e.target.value})} required/>

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" value={form.lastName} name="lastName" id="lastName" onChange={(e) => setForm({ ...form, lastName: e.target.value })} required/>

                <label htmlFor="companyName">Company Name:</label>
                <input type="text" value={form.companyName} name="companyName" id="companyName" onChange={(e) => setForm({ ...form, companyName: e.target.value })} required/>

                <label htmlFor="contactRole">Your Role on Company:</label>
                <input type="text" value={form.contactRole} name="contactRole" id="contactRole" onChange={(e) => setForm({ ...form, contactRole: e.target.value })} required/>

                <label htmlFor="email">Email:</label>
                <input type="email" value={form.email} name="email" id="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required/>

                <label htmlFor="phone">Phone/WhatsApp:</label>
                <input type="tel" value={form.phone} name="phone" id="phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required/>

                <label htmlFor="projectOption">Project option:</label>
                <select id="projectOption" name="projectOption" value={form.projectOption} onChange={(e) => setForm({ ...form, projectOption: e.target.value })} required>
                    <option value="" disabled>Select an option</option>
                    <option value="new">New project</option>
                    <option value="redesign">Redesign existing website</option>
                    <option value="improvement">Improve / scale existing website</option>
                </select>

                {form.projectOption && form.projectOption !== "new" && (
                <div className="input-animate">
                    <label htmlFor="currentUrl">Current Web/App:</label>
                    <input className="input-animate-field" type="url" name="currentUrl" id="currentUrl" value={form.currentUrl} placeholder="https://example.com" onChange={(e) => setForm({ ...form, currentUrl: e.target.value })} required/>
                </div>
                )}

                <label htmlFor="typeOfWork">Type of Web/App:</label>
                <select id="typeOfWork" name="typeOfWork" value={form.typeOfWork} onChange={(e) => setForm({ ...form, typeOfWork: e.target.value })} required>
                    <option value="" disabled>Select a type</option>
                    <option value="landing">Landing Page</option>
                    <option value="corporate">Corporate / Institutional Website</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="services">Services Website</option>
                    <option value="webapp">Web Application / Platform</option>
                    <option value="custom">Custom solution</option>
                    <option value="unsure">Not sure yet</option>
                </select>

                <label htmlFor="projectGoal">Project Goal:</label>
                <select id="projectGoal" name="projectGoal" value={form.projectGoal} onChange={(e) => setForm({ ...form, projectGoal: e.target.value })} required>
                    <option value="" disabled>Select a goal</option>
                    <option value="leads">Receive inquiries / leads</option>
                    <option value="sales">Sell products or services</option>
                    <option value="branding">Show and strengthen my brand</option>
                    <option value="automation">Automate processes</option>
                    <option value="other">Other</option>
                </select>

                <label htmlFor="budgetRange">Budget Range:</label>
                <select id="budgetRange" name="budgetRange" value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })} required>
                    <option value="" disabled>Select a range</option>
                    <option value="under-500">Less than U$S 500</option>
                    <option value="500-1000">U$S 500 – U$S 1,000</option>
                    <option value="1000-3000">U$S 1,000 – U$S 3,000</option>
                    <option value="3000-plus">More than U$S 3,000</option>
                    <option value="not-sure">Not sure yet</option>
                </select>

                <label htmlFor="availableTime">Avaliable Time:</label>
                <select id="availableTime" name="availableTime" value={form.availableTime} onChange={(e) => setForm({ ...form, availableTime: e.target.value })} required>
                    <option value="" disabled>Select a timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-2-months">1–2 months</option>
                    <option value="3-plus-months">3+ months</option>
                    <option value="flexible">Flexible</option>
                </select>

                <label htmlFor="description">Project Description:</label>
                <textarea value={form.description} name="description" id="description" onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Tell me more about your project or idea" />
                
                <button type="submit" className="send-button-wrapper" onMouseEnter={() => setHoverParticles(true)} onMouseLeave={() => setHoverParticles(false)}>
                    Send
                </button>
                <ParticleButton active={hoverParticles} />
            </form>
        </div>
    )
}

export default ContactForm