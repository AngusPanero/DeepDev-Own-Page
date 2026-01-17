import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import "../../styles/company.css";

const Company: React.FC = () => {
  const milestones = [
    {
      year: "2022",
      title: "The Origin",
      description: "Founded in Argentina with the vision of transforming complex ideas into high-performance digital products."
    },
    {
      year: "2024",
      title: "European Expansion & AI",
      description: "Established our base in Spain and integrated AI models into our developments, raising the standard for automation."
    },
    {
      year: "2026",
      title: "Today: DeepDev Global",
      description: "Consolidated as an international boutique studio, specializing in custom software and scalable digital ecosystems."
    }
  ];

  return (
    <section className="company-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="company-header">
        <div className="badge-new">OUR DNA</div>
        <h2 className="hero-title">Commitment to<br></br><span>Excellence</span></h2>
        <p className="hero-description">
          At <strong>DeepDev</strong>, we don't just write code; we build the foundation for your next success. Our journey is defined by technical precision and the confidence of delivering world-class products.
        </p>
      </motion.div>

      <div className="company-content">
        {/* Metrics / Numbers */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-number">+70</span>
            <span className="metric-label">Projects Delivered</span>
          </div>
          <div className="metric-card">
            <span className="metric-number">99%</span>
            <span className="metric-label">Guaranteed Uptime</span>
          </div>
          <div className="metric-card">
            <span className="metric-number">24/7</span>
            <span className="metric-label">Technical Support</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="timeline-container">
          {milestones.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="timeline-item"
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Presence */}
        <div className="presence-container">
          <div className="presence-content">
            <div className="badge-new">GLOBAL PRESENCE</div>
            <h3>Talent Without Borders</h3>
            <p>
              We operate strategically from <strong>Spain</strong> and <strong>Argentina</strong>, combining European innovation with the ingenuity and resilience of Latin American talent. This duality allows us to offer exceptional time-zone coverage and a global market perspective.
            </p>
            
            <div className="location-tags">
              <div className="location-tag">
                <span className="flag">🇪🇸</span>
                <span>Spain</span>
              </div>
              <div className="location-tag">
                <span className="flag">🇦🇷</span>
                <span>Argentina</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div className="company-cta">
        <p>Ready to start your transformation?</p>
        <Link to="/contact" className="cta-button">Let's talk about your project</Link>
      </motion.div>
    </section>
  );
};

export default Company;