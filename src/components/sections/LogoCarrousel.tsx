import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { wrap } from '@motionone/utils';
import '../../styles/logoCarrousel.css';
import { UseTheme } from '../../contexts/ThemeContext';
import { UseLanguage } from '../../contexts/LanguageContext';

interface MarqueeProps { logos: string[]; baseVelocity: number; }

const MarqueeRow: React.FC<MarqueeProps> = ({ logos, baseVelocity }) => {
    const { theme } = UseTheme();
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { stiffness: 400, damping: 50 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const x = useTransform(baseX, v => `${wrap(-20, -45, v)}%`);
    const directionFactor = useRef<number>(1);

    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        if (velocityFactor.get() < 0) directionFactor.current = -1;
        else if (velocityFactor.get() > 0) directionFactor.current = 1;
        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="lc-marquee-overflow">
            <motion.div className="lc-marquee-inner" style={{ x }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`lc-marquee-set ${theme}`}>
                        {logos.map((logo, idx) => (
                            <div key={idx} className="lc-logo-card">
                                <img src={logo} alt="brand" className="lc-logo-img" />
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const LogoCarrousel: React.FC = () => {
    const { theme } = UseTheme();
    const { language, texts } = UseLanguage();
    const isDark = theme !== 'light';
    const accent = isDark ? '#8e2de2' : '#0062FF';

    const logos = [
        "/logos/android2.svg", "/logos/appstore.svg", "/logos/microsoft.svg",
        "/logos/openai.svg", "/logos/postman.svg", "/logos/premiere.svg",
        "/logos/react.svg", "/logos/safari.svg", "/logos/python.svg",
        "/logos/playstore.svg", "/logos/illustrator.svg", "/logos/chrome.svg",
        "/logos/css.svg", "/logos/firefox.svg", "/logos/aws.svg",
        "/logos/azure.svg", "/logos/aftereffects.svg", "/logos/appstore.svg",
    ];

    return (
        <section className={`lc-section ${isDark ? 'lc-dark' : 'lc-light'}`}>

         
            {/* header */}
            <motion.div
                className="lc-header"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="lc-eyebrow">
                    <span className="lc-eyebrow-dot" style={{ background: accent }} />
                    Stack tecnológico
                </span>

                <h2 className="lc-heading">
                    {texts[language].home.boost}
                </h2>

                <div className="lc-accent-bar" style={{ background: accent }} />
            </motion.div>

            {/* rows */}
            <div className="lc-rows">
                <MarqueeRow logos={logos} baseVelocity={0.37} />
                <MarqueeRow logos={logos} baseVelocity={-0.24} />
                <MarqueeRow logos={logos} baseVelocity={0.18} />
            </div>

            {/* bottom divider */}
            <div className="lc-divider" style={{ background: `linear-gradient(to right, transparent, ${accent}55, transparent)` }} />
        </section>
    );
};

export default LogoCarrousel;