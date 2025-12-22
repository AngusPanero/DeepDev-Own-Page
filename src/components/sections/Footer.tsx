import "../../styles/footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-grid">

                <div className="footer-brand">
                    <h3 className="footer-logo">DeepDev</h3>
                    <p className="footer-tagline">Reinventing Digital Experiences</p>
                    <p className="footer-description"> Engineering immersive interfaces where design, motion and intelligence converge.</p>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">Navigation</h4>
                    <ul className="footer-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/quotes">Quotes</a></li>
                    <li><a href="/raffles">Raffles</a></li>
                    <li><a href="/recruiters">Recruiters</a></li>
                    </ul>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">Expertise</h4>
                    <ul className="footer-list">
                        <li>Frontend Engineering</li>
                        <li>3D Web Experiences</li>
                        <li>AI Integrations</li>
                        <li>Backend Systems</li>
                    </ul>
                </div>
        
                <div className="footer-section">
                    <h4 className="footer-title">Connect</h4>
                    <ul className="footer-list">
                        <li><a href="mailto:contact@deepdev.dev">deepdevsolutions@gmail.com</a></li>
                        <li><a href="https://www.linkedin.com/in/agustin-panero-41b91b31a/" target="_blank">LinkedIn</a></li>
                        <li className="footer-location"><strong>Argentina</strong> · Global Remote</li>
                        <li className="footer-location">Phone: +54 9 11-7118-7463</li>
                        
                        <li className="footer-location"><strong>Spain</strong> · Global Remote</li>
                        <li className="footer-location">Phone: +34 622-777-426</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© 2025 DeepDev. All rights reserved.</span>
                <div className="footer-legal">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;