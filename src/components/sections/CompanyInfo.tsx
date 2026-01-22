import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import "../../styles/company.css";
import useLanguage, { type LanguageContextType } from '../../contexts/LanguageContext';
import useTheme from '../../contexts/ThemeContext';

const Company: React.FC = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()
  const milestones = [
    {
      year: "2022",
      title: texts[language].company.title2022,
      description: texts[language].company.text2022
    },
    {
      year: "2024",
      title: texts[language].company.title2024,
      description: texts[language].company.text2024
    },
    {
      year: "2026",
      title: texts[language].company.title2024,
      description: texts[language].company.text2024
    }
  ];

  return (
    <section style={{ background: theme === "dark" ? "black" : "#f4f2ff" }} className="company-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="company-header">
        <div className="badge-new">{texts[language].company.dna}</div>
        <h2 style={{ whiteSpace: "pre-line" }} className="hero-title"><span>{texts[language].company.dnaTitle}</span></h2>
        <p style={{ whiteSpace: "pre-line" }} className="hero-description">
          {texts[language].company.dnaText}
        </p>
      </motion.div>

      <div className="company-content">
        {/* Metrics / Numbers */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-number">+70</span>
            <span className="metric-label">{texts[language].company.projects}</span>
          </div>
          <div className="metric-card">
            <span className="metric-number">99%</span>
            <span className="metric-label">{texts[language].company.uptime}</span>
          </div>
          <div className="metric-card">
            <span className="metric-number">24/7</span>
            <span className="metric-label">{texts[language].company.support}</span>
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
            <div className="badge-new">{texts[language].company.global}</div>
            <h3>{texts[language].company.globalTitle}</h3>
            <p>
              {texts[language].company.globalText}
            </p>
            
            <div className="location-tags">
              <div className="location-tag">
                <span>{texts[language].company.flagSpain}</span>
              </div>
              <div className="location-tag">
                <span>{texts[language].company.flagArgentina}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div className="company-cta">
        <p>{texts[language].company.talk}</p>
        <Link to="/contact" className="cta-button">{texts[language].company.talkButton}</Link>
      </motion.div>
    </section>
  );
};

export default Company;