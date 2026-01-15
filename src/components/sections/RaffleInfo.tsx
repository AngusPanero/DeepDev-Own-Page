import React from 'react';
import { motion } from 'framer-motion';
import "../../styles/raffleInfo.css"

const RaffleInfo: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="raffle-info-container"
    >
      <div className="badge-new">PREMIERE 2026</div>
      
      <h1 className="hero-title">
        We take your idea to the<br />
        <span>Next Level</span>
      </h1>
      <p className="hero-description">
        To celebrate the launch of <strong>DeepDev</strong>, we're giving away a complete Full Stack development project. We want your project to have the digital presence it deserves, with cutting-edge technology and high-impact design.
      </p>
      
      <div className="features-list">
        <div className="feature-item">
          <span className="icon">🚀</span>
          <div>
            <h3>Performance Pro</h3>
            <p>Optimized and ultra-fast websites.</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="icon">🎨</span>
          <div>
            <h3>Exclusive Design</h3>
            <p>UI/UX designed for your brand.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RaffleInfo;