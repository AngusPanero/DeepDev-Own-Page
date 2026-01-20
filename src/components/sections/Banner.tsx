import useLanguage from "../../contexts/LanguageContext"
import "../../styles/banner.css"
import WorkflowN8NFlow from "../ui/WorkFlowN8N"

const Banner = () => {
    const { language, texts } = useLanguage()
    return(
        <section className="banner-section">
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