import "../../styles/banner.css"
import WorkflowN8NFlow from "../ui/WorkFlowN8N"

const Banner = () => {
    return(
        <section className="banner-section">
            <div className="banner-carrousel">
                <WorkflowN8NFlow />
            </div>

            <div className="banner-click">
                Automate your work, click and you're done.
            </div>
        </section>
    )
}

export default Banner; 