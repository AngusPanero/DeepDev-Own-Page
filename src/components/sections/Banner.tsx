import { UseLanguage } from "../../contexts/LanguageContext"
import { UseTheme } from "../../contexts/ThemeContext"
import "../../styles/banner.css"
import WorkflowN8NFlow from "../ui/WorkFlowN8N"

const Banner = () => {
    const { language, texts } = UseLanguage()
    const { theme } = UseTheme()
    return(
        <section className={`banner-section ${theme === "light" ? "theme-light" : "theme-dark"}`}>
            <div className="banner-carrousel">
                <WorkflowN8NFlow />
            </div>

            <div className="banner-click" style={{ color: theme === "dark" ? "white" : "#0062FF" }}>
                {texts[language].home.automate}
            </div>
        </section>
    )
}

export default Banner; 