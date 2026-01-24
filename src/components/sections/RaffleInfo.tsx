import React from 'react';
import { motion } from 'framer-motion';
import "../../styles/raffleInfo.css"
import useLanguage, { type LanguageContextType } from '../../contexts/LanguageContext';
import useTheme from '../../contexts/ThemeContext';

const RaffleInfo: React.FC = () => {
    const { language, texts } = useLanguage() as LanguageContextType
    const { theme } = useTheme()
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="raffle-info-container"
    >
      <div className="badge-new">{texts[language].raffles.premiere.toUpperCase()}</div>
      <h1 data-theme={theme} className="hero-title"><span>{texts[language].raffles.premiereTitle}</span></h1>
      <p className="hero-description">
        {texts[language].raffles.premiereText}
      </p>
      
      <div className="features-list">
        <div className="feature-item">
          <span className="icon">🚀</span>
          <div>
            <h3>{texts[language].raffles.performance}</h3>
            <p>{texts[language].raffles.performanceText}</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="icon">🎨</span>
          <div>
            <h3>{texts[language].raffles.design}</h3>
            <p>{texts[language].raffles.designText}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleInfo;