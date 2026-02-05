import React from 'react';
import { motion } from 'framer-motion';
import useTheme from '../../contexts/ThemeContext';
import "../../styles/sales.css"

interface Feature {
    text: string;
    included: boolean;
}

interface SalesCardProps {
    title: string;
    price: string;
    description: string;
    features: Feature[];
    buttonText: string;
    isFeatured?: boolean;
}

const SalesCard: React.FC<SalesCardProps> = ({ title, price, description, features, buttonText, isFeatured }) => {
    const { theme } = useTheme();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true }}
            className={`sales-card-isolated ${theme} ${isFeatured ? 'featured' : ''}`}
        >
            {/* Header estilo Mac OS */}
            <div className="sales-mac-header">
                <div className="mac-dots">
                    <span className="m-dot m-red"></span>
                    <span className="m-dot m-yellow"></span>
                    <span className="m-dot m-green"></span>
                </div>
                <p className="mac-filename">{title.toLowerCase()}.tsx</p>
            </div>

            <div className="sales-card-body">
                <h3 className="sales-plan-name">{title}</h3>
                <div className="sales-price-section">
                    <span className="sales-amount">${price},.</span>
                </div>
                <p className="sales-description">{description}</p>

                <div className="sales-features-list">
                    {features.map((item, index) => (
                        <div key={index} className={`sales-feature-row ${!item.included ? 'disabled' : ''}`}>
                            <span className="sales-icon">{item.included ? '⚡' : '×'}</span>
                            <span className="sales-text">{item.text}</span>
                        </div>
                    ))}
                </div>

                <button className="sales-action-btn">
                    {buttonText}
                </button>
            </div>
        </motion.div>
    );
};

export default SalesCard;