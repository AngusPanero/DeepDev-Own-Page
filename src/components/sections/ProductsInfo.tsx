import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import "../../styles/products.css"
import FloatingIcon from "../ui/FloatingIcon"

const ProductsInfo = () => {
    // Configuración de suavizado
    const springConfig = { stiffness: 50, damping: 25, mass: 0.5 };

    // WEB APPS
    const textRef = useRef(null);
    const { scrollYProgress: scroll1 } = useScroll({
        target: textRef,
        offset: ["start end", "end start"]
    });
    const x = useSpring(useTransform(scroll1, [0, 0.5, 1], [-500, 0, 200]), springConfig);
    const opacity = useSpring(useTransform(scroll1, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // APPS
    const textRef2 = useRef(null);
    const { scrollYProgress: scroll2 } = useScroll({
        target: textRef2,
        offset: ["start end", "end start"]
    });
    const x2 = useSpring(useTransform(scroll2, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity2 = useSpring(useTransform(scroll2, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // CUSTOM SOFTWARE
    const textRef3 = useRef(null);
    const { scrollYProgress: scroll3 } = useScroll({
        target: textRef3,
        offset: ["start end", "end start"]
    });
    const x3 = useSpring(useTransform(scroll3, [0, 0.5, 1], [-500, 0, -150]), springConfig);
    const opacity3 = useSpring(useTransform(scroll3, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AI INTEGRATION
    const textRef4 = useRef(null);
    const { scrollYProgress: scroll4 } = useScroll({
        target: textRef4,
        offset: ["start end", "end start"]
    });
    const x4 = useSpring(useTransform(scroll4, [0, 0.5, 1], [600, 0, -150]), springConfig);
    const opacity4 = useSpring(useTransform(scroll4, [0, 0.15, 0.95, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // AUTOMATION
    const textRef5 = useRef(null);
    const { scrollYProgress: scroll5 } = useScroll({
        target: textRef5,
        offset: ["start end", "end start"]
    });
    const x5 = useSpring(useTransform(scroll5, [0, 0.5, 1], [-500, 0, -250]), springConfig);
    const opacity5 = useSpring(useTransform(scroll5, [0, 0.1, 0.9, 1], [0, 1, 1, 0]), { stiffness: 70, damping: 20 });

    // Estilo de gradiente animado reutilizable
    const gradientBase = {
        background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    const gradientAnim = {
        backgroundPosition: ["0% 50%", "100% 50%"],
        transition: { duration: 4, repeat: Infinity, ease: "backInOut" }
    };

    return (
        <div className="products-section">
            {/* WEB APPLICATIONS */}
            <div className="web-apps-section" ref={textRef}>
                <motion.h1 style={{ ...gradientBase, textAlignLast: "start", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity, x: x }} 
                    animate={gradientAnim}>
                    We Build Web Applications.
                </motion.h1>

                <div className="web-text-icons-section">
                    <motion.p style={{ ...gradientBase, margin: 0, width: "50rem", marginLeft: "3rem", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity, x: x }} 
                        animate={gradientAnim}>
                        Modern web solutions tailored to your goals from high-impact landing pages and corporate websites to eCommerce platforms and fully custom web systems.
                        <br /><br />
                        A web presence is often the first point of contact between your brand and your users. A well-built website not only communicates who you are, but also converts visitors into clients, centralizes your services, and allows your business to grow with flexibility and control.
                        <br /><br />
                        Whether you need to showcase your brand, sell products online or manage information and users through a custom platform, web applications provide a scalable and accessible solution available from any device.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "1rem" }}>
                        <FloatingIcon src="../../../public/logos/chrome.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/safari2.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/firefox.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/edge.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>

            {/* MOBILE APPS */}
            <div className="apps-section" ref={textRef2}>
                <motion.h1 style={{ ...gradientBase, marginTop: "3rem", textAlign: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity2, x: x2 }} 
                    animate={gradientAnim}>
                        iOS & Android Mobile Apps.
                </motion.h1>

                <div className="app-text-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/appstore.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/playstore.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/apple.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/android2.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ ...gradientBase, margin: 0, width: "50rem", marginRight: "3rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity2, x: x2 }} 
                        animate={gradientAnim}>
                        We design and build mobile applications for iOS and Android from focused business apps and MVPs to fully featured products ready for real users.<br/><br/>
                        Mobile apps allow your brand to be present where users spend most of their time. A well-crafted app delivers speed, performance and a seamless user experience, creating a direct and constant connection between your product and your audience.<br/><br/>
                        Whether you need to launch a new idea, extend your digital product to mobile or provide users with a dedicated experience, mobile applications offer a powerful, scalable and native-feeling solution across devices.
                    </motion.p>
                </div> 
            </div>

            {/* CUSTOM SOFTWARE */}
            <div className="custom-section" ref={textRef3}>
                <motion.h1 style={{ ...gradientBase, marginTop: "5rem", textAlign: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity3, x: x3 }} 
                    animate={gradientAnim}>
                        Custom Software Solutions.
                </motion.h1>

                <div className="custom-icons-section">
                    <motion.p style={{ ...gradientBase, margin: 0, width: "50rem", marginLeft: "10rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity3, x: x3 }} 
                        animate={gradientAnim}>
                        We design and develop fully customized software solutions tailored to your business needs. From management and control systems to internal platforms and process automation, we transform ideas into scalabledigital tools that empower your company.
                        <br/><br/>Every business has unique workflows, challenges, and goals. That’s why off-the-shelf solutions often fall short. Custom software allows you to centralize information, automate processes, improve decision-making, and gain full control over your operations.
                        <br/><br/>Whether you need a management system, a control panel, a custom dashboard, or a platform built around your specific idea, we create flexible and scalable solutions designed to grow with your business.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/soft.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/graf.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>     

            {/* AI INTEGRATION */}
            <div className="ai-section" ref={textRef4}>
                <motion.h1 style={{ ...gradientBase, marginTop: "3rem", textAlignLast: "end", position: "relative", zIndex: 3, fontSize: "6rem", fontWeight: "800", letterSpacing: "1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity4, x: x4 }} 
                    animate={gradientAnim}>
                        Artificial Intelligence Integration.
                </motion.h1>

                <div className="ai-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem" }}>
                        <FloatingIcon src="../../../public/logos/brain.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/cubo.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/platform.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/chat.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ ...gradientBase, margin: 0, width: "45rem", marginTop: "2rem", marginRight: "3rem", textAlign: "start", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity4, x: x4 }} 
                        animate={gradientAnim}>
                        We design and integrate AI-powered solutions tailored to real business needs. From custom chatbots and virtual assistants to intelligent decision flows, we help companies enhance their digital products with practical and reliable artificial intelligence.<br/><br/>
                        Our approach focuses on building AI that is controlled, secure, and seamlessly integrated into existing systems, data sources, and workflows. Instead of generic solutions, we create custom integrations that improve user experience, reduce operational workload, and enable smarter automation at scale.
                    </motion.p>
                </div> 
            </div>       

            {/* AUTOMATION */}
            <div className="automation-section" ref={textRef5}>
                <motion.h1 style={{ ...gradientBase, marginTop: "3rem", textAlignLast: "end", position: "relative", zIndex: 3, fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity: opacity5, x: x5 }} 
                    animate={gradientAnim}>
                        Automation & Workflows.
                </motion.h1>

                <div className="automation-icons-section">
                    <motion.p style={{ ...gradientBase, margin: 0, width: "50rem", marginLeft: "10rem", textAlignLast: "start", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity5, x: x5 }} 
                        animate={gradientAnim}>
                        We design and implement automated workflows that connect systems, streamline operations, and eliminate repetitive manual tasks.<br/>By integrating your website, applications, and internal tools, we help businesses improve efficiency and maintain full control over their processes.<br/><br/>
                        Our automation solutions connect different platforms—such as CRMs, emails, APIs, and internal systems—allowing data to flow seamlessly and actions to be triggered automatically. This results in faster response times, fewer errors, and more consistent operations across the organization.<br/><br/>
                        Whether you need to automate lead management, internal notifications, data synchronization, or complex multi-step processes, we build flexible and scalable workflows tailored to your business needs.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem"}}>
                        <FloatingIcon src="../../../public/logos/recycle.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/work.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>  
        </div>
    );
};

export default ProductsInfo;