import useLanguage from "../../contexts/LanguageContext"
import useTheme from "../../contexts/ThemeContext"
import "../../styles/banner.css"
import WorkflowN8NFlow from "../ui/WorkFlowN8N"

const Banner = () => {
    const { language, texts } = useLanguage()
    const { theme } = useTheme()
    return(
        <section className="banner-section" style={{ background: theme === "dark" ? "black" : "#f4f2ff" }}>
            <div className="banner-carrousel">
                <WorkflowN8NFlow />
            </div>

            <div className="banner-click">
                {texts[language].home.automate}
            </div>
        </section>
    )
}

export default Banner; 