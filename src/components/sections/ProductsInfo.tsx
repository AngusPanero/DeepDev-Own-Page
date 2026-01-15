import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import "../../styles/products.css"
import FloatingIcon from "../ui/FloatingIcon"

const ProductsInfo = () => {
    // WEB APPS
    const textRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: textRef,
        offset: ["start 80%", "end 20%"]
    });
    
    const rawX = useTransform(scrollYProgress, [0, 0.5, 1], [-500, 0, 200]);
    const rawOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 2, 0]);

    const x = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 20 });

    // APPS
    const textRef2 = useRef(null);
    const { scrollYProgress: scroll2 } = useScroll({
        target: textRef2,
        offset: ["start 70%", "end 30%"]
    });
    const x2Raw = useTransform(scroll2, [0, 0.5, 1], [600, 0, -150]);
    const opacity2Raw = useTransform(scroll2, [0, 0.1, 0.9, 1], [0, 1, 2, 0]);

    const x2 = useSpring(x2Raw, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity2 = useSpring(opacity2Raw, { stiffness: 70, damping: 20 });

    // CUSTOM SOFTWARE
    const textRef3 = useRef(null);
    const { scrollYProgress: scroll3 } = useScroll({
        target: textRef3,
        offset: ["start 80%", "end 20%"]
    });

    const rawX3 = useTransform(scroll3, [0, 0.5, 1], [-500, 0, -150]);
    const rawOpacity3 = useTransform(scroll3, [0, 0.1, 0.9, 1], [0, 1, 2, 0]);

    const x3 = useSpring(rawX3, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity3 = useSpring(rawOpacity3, { stiffness: 70, damping: 20 });

    // AI INTEGRATION
    const textRef4 = useRef(null);
    const { scrollYProgress: scroll4 } = useScroll({
        target: textRef4,
        offset: ["start 70%", "end 30%"]
    });
    const x4Raw = useTransform(scroll4, [0, 0.5, 1], [600, 0, -150]);
    const opacity4Raw = useTransform(scroll4, [0, 0.1, 0.9, 1], [0, 1, 2, 0]);

    const x4 = useSpring(x4Raw, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity4 = useSpring(opacity4Raw, { stiffness: 70, damping: 20 });

    // AUTOMATION
    const textRef5 = useRef(null);
    const { scrollYProgress: scroll5 } = useScroll({
        target: textRef5,
        offset: ["start 80%", "end 20%"]
    });
    const x5Raw = useTransform(scroll5, [0, 0.5, 1], [-500, 0, -250]);
    const opacity5Raw = useTransform(scroll5, [0, 0.1, 0.9, 1], [0, 1, 2, 0]);

    const x5 = useSpring(x5Raw, { stiffness: 50, damping: 20, mass: 0.2 });
    const opacity5 = useSpring(opacity5Raw, { stiffness: 70, damping: 20 });

    return(
        // WEB APLICATIONS:
        <div className="products-section">
            <div className="web-apps-section">
                <motion.h1 ref={textRef} style={{ textAlignLast: "start", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", opacity, x, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                    We Build Web Applications.
                </motion.h1>

                <div className="web-text-icons-section">
                    <motion.p style={{ margin: 0, width: "50rem", marginLeft: "3rem", color: "#ffffff", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity, x, background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        Modern web solutions tailored to your goals from high-impact landing pages and corporate websites to eCommerce platforms and fully custom web systems.
                        <br />
                        <br />
                        A web presence is often the first point of contact between your brand and your users. A well-built website not only communicates who you are, but also converts visitors into clients, centralizes your services, and allows your business to grow with flexibility and control.
                        <br />
                        <br />
                        Whether you need to showcase your brand, sell products online or manage information and users through a custom platform, web applications provide a scalable and accessible solution available from any device.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "1rem", opacity, x }}>
                        <FloatingIcon src="../../../public/logos/chrome.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/safari2.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/firefox.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/edge.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>

            {/* MOBILE APPS*/}
            <div className="apps-section">
                <motion.h1 ref={textRef2} style={{ marginTop: "3rem", textAlign: "end", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "-1px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)", opacity: opacity2, x: x2,
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        iOS & Android Mobile Apps.
                </motion.h1>

                <div className="app-text-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem", opacity: opacity2, x: x2 }}>
                        <FloatingIcon src="../../../public/logos/appstore.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/playstore.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/apple.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/android2.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ margin: 0, width: "50rem", marginRight: "3rem", textAlign: "end", color: "#ffffff", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity2, x: x2,
                        background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        We design and build mobile applications for iOS and Android from focused business apps and MVPs to fully featured products ready for real users.<br/><br/>

                        Mobile apps allow your brand to be present where users spend most of their time. A well-crafted app delivers speed, performance and a seamless user experience, creating a direct and constant connection between your product and your audience.<br></br><br></br>

                        Whether you need to launch a new idea, extend your digital product to mobile or provide users with a dedicated experience, mobile applications offer a powerful, scalable and native-feeling solution across devices.
                    </motion.p>
                </div> 
            </div>

            {/* CUSTOM SOFTWARE: */}
            <div className="custom-section">
                <motion.h1 ref={textRef3} style={{ marginTop: "5rem", textAlign: "end", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", fontFamily: "Montserrat, Inter, Poppins, sans-serif", background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)", opacity: opacity3, x: x3,
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        Custom Software Solutions.
                </motion.h1>

                <div className="custom-icons-section">
                    <motion.p style={{ margin: 0, width: "50rem", marginLeft: "10rem", textAlign: "start", color: "#ffffff", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity3, x: x3,
                        background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        We design and develop fully customized software solutions tailored to your business needs. From management and control systems to internal platforms and process automation, we transform ideas into scalabledigital tools that empower your company.

                        Every business has unique workflows, challenges, and goals.<br></br><br></br>That’s why off-the-shelf solutions often fall short. Custom software allows you to centralize information, automate processes, improve decision-making, and gain full control over your operations.

                        Whether you need a management system, a control panel, a custom dashboard, or a platform built around your specific idea, we create flexible and scalable solutions designed to grow with your business.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem", opacity: opacity3, x: x3 }}>
                        <FloatingIcon src="../../../public/logos/soft.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/graf.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>     

            {/* AI INTEGRATION*/}
            <div className="ai-section">
                <motion.h1 ref={textRef4} style={{ marginTop: "3rem", textAlignLast: "end", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "6rem", fontWeight: "800", letterSpacing: "1px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)", opacity: opacity4, x: x4,
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        Artificial Intelligence Integration.
                </motion.h1>

                <div className="ai-icons-section">
                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem", opacity: opacity4, x: x4 }}>
                        <FloatingIcon src="../../../public/logos/brain.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/cubo.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/platform.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/chat.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>

                    <motion.p style={{ margin: 0, width: "45rem", marginTop: "2rem", marginRight: "3rem", textAlign: "end", color: "#ffffff", fontSize: "25px", fontWeight: "300", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity4, x: x4,
                        background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        We design and integrate AI-powered solutions tailored to real business needs. From custom chatbots and virtual assistants to intelligent decision flows, we help companies enhance their digital products with practical and reliable artificial intelligence.<br></br><br></br>

                        Our approach focuses on building AI that is controlled, secure, and seamlessly integrated into existing systems, data sources, and workflows. Instead of generic solutions, we create custom integrations that improve user experience, reduce operational workload, and enable smarter automation at scale.
                    </motion.p>
                </div> 
            </div>       
            {/* AUTOMATION: */}
            <div className="automation-section">
                <motion.h1 ref={textRef5} style={{ marginTop: "5rem", textAlignLast: "end", position: "relative", zIndex: 3, color: "#ffffff", fontSize: "7rem", fontWeight: "800", letterSpacing: "2px", textAlign: "center", fontFamily: "Montserrat, Inter, Poppins, sans-serif", background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)", opacity: opacity5, x: x5,
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        Automation & Workflows.
                </motion.h1>

                <div className="automation-icons-section">
                    <motion.p style={{ margin: 0, width: "50rem", marginLeft: "10rem", textAlignLast: "start", color: "#ffffff", fontSize: "25px", fontWeight: "300", textAlign: "start", fontFamily: "Inter, Poppins, sans-serif", opacity: opacity5, x: x5,
                        background: "linear-gradient(90deg, #38BDF8, #8B5CF6, #38BDF8)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent", }} animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "backInOut" }}>
                        We design and implement automated workflows that connect systems, streamline operations, and eliminate repetitive manual tasks.<br></br>By integrating your website, applications, and internal tools, we help businesses improve efficiency and maintain full control over their processes.<br></br><br></br>

                        Our automation solutions connect different platforms—such as CRMs, emails, APIs, and internal systems—allowing data to flow seamlessly and actions to be triggered automatically. This results in faster response times, fewer errors, and more consistent operations across the organization.<br></br><br></br>

                        Whether you need to automate lead management, internal notifications, data synchronization, or complex multi-step processes, we build flexible and scalable workflows tailored to your business needs.
                    </motion.p>

                    <motion.div className="web-apps-icons" style={{ marginTop: "2rem", opacity: opacity5, x: x5 }}>
                        <FloatingIcon src="../../../public/logos/soft.svg" delay={0} translateX={20} translateY={50}  />
                        <FloatingIcon src="../../../public/logos/graf.svg" delay={1.2} translateX={20} translateY={240} />
                        <FloatingIcon src="../../../public/logos/ingenieria.svg" delay={0.6} translateX={-60} translateY={-50} />
                        <FloatingIcon src="../../../public/logos/flow.svg" delay={1.8} translateX={-50} translateY={120} />
                    </motion.div>
                </div> 
            </div>  
        </div>
    )
}

export default ProductsInfo