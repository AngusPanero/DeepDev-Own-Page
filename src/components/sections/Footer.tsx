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
                    <li><a href="/about">About</a></li>
                    <li><a href="/work">Work</a></li>
                    <li><a href="/contact">Contact</a></li>
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
                        <li><a href="mailto:contact@deepdev.dev">contact@deepdev.dev</a></li>
                        <li><a href="https://github.com/deepdev" target="_blank">GitHub</a></li>
                        <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
                        <li className="footer-location">Argentina · Remote</li>
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