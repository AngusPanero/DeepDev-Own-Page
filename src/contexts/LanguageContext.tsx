import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext()

export interface Translation {
    home: {
        reinventing: string;
        boost: string;
        real: string;
        ai: string;
        automate: string;
    };
    products: {
        webTitle: string;
        webText: string;
        appTitle: string;
        appText: string;
        customTitle: string;
        customText: string;
        AiTitle: string;
        AiText: string;
        automationTitle: string;
        automationText: string;
    };
    company: {
        dna: string;
        dnaTitle: string;
        dnaText: string;
        projects: string;
        uptime: string;
        support: string;
        title2022: string;
        text2022: string;
        title2024: string;
        text2024: string;
        title2026: string;
        text2026: string;
        global: string;
        globalTitle: string;
        globalText: string;
        flagSpain: string;
        flagArgentina: string;
        talk: string;
        talkButton: string;
    };
    raffles: {
        premiere: string;
        premiereTitle: string;
        premiereText: string;
        performance: string;
        performanceText: string;
        design: string;
        designText: string;
        raffleTitle: string;
        raffleText: string;
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
        name: string;
        email: string;
        project: string;
        conditions: object;
        error: string
        processing: string
        verify: string
        analyzing: string
        status: string
        registered: string,
        thanks: object,
        premio: string,
        buttonBack: string,
        button: string;
    };
    contact: {
        name: string;
        lastName: string;
        companyName: string;
        role: string;
        email: string;
        phone: string;
        project: string,
        projectOption: string,
        projectNew: string;
        projectRedisign: string;
        current: string;
        type: string[];
        projectGoal: string[];
        range: string[];
        available: string[];
        descriptionPlace: string[];
        button: string;
    };
    nav: {
        promo: string;
        products: string;
        company: string;
        raffles: string;
        contact: string;
        login: string;
    };
    login: {
        title: string;
        text: string;
        email: string;
        password: string;
        button: string;
        register: object;
    };
    footer: {
        deepdev: string[];
        navigation: string[];
        expertise: string[];
        connect: string[];
        rights: string;
        privacy: string;
        terms: string;
        navigationTitle: string,
        expertiseTitle: string,
        connectTitle: string,
    };
    language: string
}

export interface TextsConfig {
    [key: string]: Translation; 
}

export interface LanguageContextType {
    language: string;
    texts: any; 
    setLanguage: (lang: string) => void;
}
export const LanguageProvider = ({ children }) => {
    const [ language, setLanguage ] = useState(localStorage.getItem("userLanguage") || "es");

    useEffect(() => {
        localStorage.setItem('userLanguage', language);
    }, [language]);

    const handleLanguage = (e: string) => {
        setLanguage(e)
        localStorage.setItem("userLanguage", language)
    }
    const texts: TextsConfig = {
    en: {
        home: {
            reinventing: `DeepDev Reinventing Digital
             Experiences.`,
            boost: `We boost your design with the best tools`,
            real: `Real-Time 3D interaction`,
            ai: `AI-Enhanced 
            User experiences`,
            automate: `Automate your work, click and you're done.`,
        },
        products: {
            webTitle: `We Build Web Applications.`,
            webText: `Modern web solutions tailored to your goals from high-impact landing pages and corporate websites to eCommerce platforms and fully custom web systems.

             A web presence is often the first point of contact between your brand and your users. A well-built website not only communicates who you are, but also converts visitors into clients, centralizes your services, and allows your business to grow with flexibility and control. 

             Whether you need to showcase your brand, sell products online or manage information and users through a custom platform, web applications provide a scalable and accessible solution available from any device.`,
            appTitle: `iOS & Android Mobile Apps.`,
            appText: `We design and build mobile applications for iOS and Android from focused business apps and MVPs to fully featured products ready for real users. 
            
            Mobile apps allow your brand to be present where users spend most of their time. A well-crafted app delivers speed, performance and a seamless user experience, creating a direct and constant connection between your product and your audience. 
            
            Whether you need to launch a new idea, extend your digital product to mobile or provide users with a dedicated experience, mobile applications offer a powerful, scalable and native-feeling solution across devices.`,
            customTitle: `Custom Software Solutions.`,
            customText: `We design and develop fully customized software solutions tailored to your business needs. From management and control systems to internal platforms and process automation, we transform ideas into scalable digital tools that empower your company. 
            
            Every business has unique workflows, challenges, and goals. That’s why off-the-shelf solutions often fall short. Custom software allows you to centralize information, automate processes, improve decision-making, and gain full control over your operations. 
            
            Whether you need a management system, a control panel, a custom dashboard, or a platform built around your specific idea, we create flexible and scalable solutions designed to grow with your business.`,
            AiTitle: `Artificial Intelligence Integration.`,
            AiText: `We design and integrate AI-powered solutions tailored to real business needs. From custom chatbots and virtual assistants to intelligent decision flows, we help companies enhance their digital products with practical and reliable artificial intelligence. 
            
            Our approach focuses on building AI that is controlled, secure, and seamlessly integrated into existing systems, data sources, and workflows. 
            
            Instead of generic solutions, we create custom integrations that improve user experience, reduce operational workload, and enable smarter automation at scale.`,
            automationTitle: `Automation & Workflows.`,
            automationText: `We design and implement automated workflows that connect systems, streamline operations, and eliminate repetitive manual tasks. By integrating your website, applications, and internal tools, we help businesses improve efficiency and maintain full control over their processes. 
            
            Our automation solutions connect different platforms—such as CRMs, emails, APIs, and internal systems—allowing data to flow seamlessly and actions to be triggered automatically. This results in faster response times, fewer errors, and more consistent operations across the organization. 
            
            Whether you need to automate lead management, internal notifications, data synchronization, or complex multi-step processes, we build flexible and scalable workflows tailored to your business needs.`,
        },
        company: {
            dna: `Our DNA`,
            dnaTitle: `Commitment 
            to Excellence`,
            dnaText: `At DeepDev, we don't just write code; we build the foundation for your next success. Our journey is defined by technical precision and the confidence of delivering world-class products.`,
            projects: `Projects Delivered`,
            uptime: `Guaranteed Uptime`,
            support: `24/7 Support`,
            title2022: `The Origin`,
            text2022: `Founded in Argentina with the vision of transforming complex ideas into high-performance digital products.`,
            title2024: `European Expansion & AI Focus`,
            text2024: `Established our base in Spain and integrated AI models into our developments, raising the standard for automation.`,
            title2026: `Today: DeepDev Global`,
            text2026: `Consolidated as an international boutique studio, specializing in custom software and scalable digital ecosystems.`,
            global: `GLOBAL PRESENCE`,
            globalTitle: `Talent Without Borders`,
            globalText: `We operate strategically from Spain and Argentina, combining European innovation with the ingenuity and resilience of Latin American talent. This duality allows us to offer exceptional time-zone coverage and a global market perspective.`,
            flagSpain: `🇪🇸 Spain`,
            flagArgentina: `🇦🇷 Argentina`,
            talk: `Ready to start your transformation?`,
            talkButton: `Let's talk about your project`
        },
        raffles: {
            premiere: `2026 Raffle`,
            premiereTitle: `We take your idea to the Next Level`,
            premiereText: `To celebrate the launch of DeepDev, we're giving away a complete Full Stack development project. We want your project to have the digital presence it deserves, with cutting-edge technology and high-impact design.`,
            performance: `Pro Performance`,
            performanceText: `Optimized and ultra-fast websites.`,
            design: `Exclusive Design`,
            designText: `User interface and user experience designed for your brand.`,
            raffleTitle: `FullStack_Raffle`,
            raffleText: `Enter for a chance to win a complete professional website built by DeepDev.`,
            days: `DAYS`,
            hours: `HOURS`,
            minutes: `MIN`,
            seconds: `SEC`,
            name: `Your Full Name`,
            email: `Your Email`,
            project: `What website would you like to develop?`,
            conditions: {
                before: `I agree to the `,
                link: `terms and conditions`,
                after: ` of the raffle.`
            },
            error: `You must accept the terms and conditions to continue.`,
            processing: `Generating ticket...`,
            verify: `Verifying email...`,
            analyzing: `Analyzing request...`,
            status: `Status: Processing...`,
            registered: `Ticket Registered!`,
            thanks: {
                before: `Thank you. `,
                after: `Your entry has been saved. Good luck!`
            },
            premio: `Prize at Stake: Professional Web Development`,
            buttonBack: `Back`,
            button: `GENERATE RAFFLE TICKET`
        },
        contact: {
            name: `Name:`,
            lastName: `Last Name:`,
            companyName: `Company Name:`,
            role: `Role in the company:`,
            email: `Email:`,
            phone: `Phone / WhatsApp:`,
            project: `Project Type:`,
            projectOption: `Select an option`,
            projectNew: `New Project`,
            projectRedisign: `Redesign existing website`,
            current: `Current Web/App:`,
            type: [`Web/App Type:`, `Select an option`, `Landing Page`, `Corporate / Institutional Website`, `E-commerce`, `Portfolio`, `Services Website`, `Web Application / Platform`, `Custom System`, `Not sure yet`],
            projectGoal: [`Project Goal:`, `Select a goal`, `Receive inquiries / Leads`, `Sell products or services`, `Show and strengthen my brand`, `Automate processes`, `Other`],
            range: [`Budget Range:`, `Select a range`, `Less than U$S 500`, `U$S 500 - U$S 1000`, `U$S 1000 - U$S 3000`, `More than U$S 3000`, `Not sure yet`],
            available: [`Time Availability:`, `Select a deadline`, `As soon as possible`, `1-2 months`, `+3 months`, `Flexible`],
            descriptionPlace: [`Project Description:`, `Tell us more about your project or idea`],
            button: `Send`,
        },
        nav: {
            promo: `🔥 -- Check out our sweepstakes section to participate in prize draws and get great discounts on our products. -- 🔥`,
            products: `Products`,
            company: `Company`,
            raffles: `Raffles`,
            contact: `Contact`,
            login: `Login`
        },
        login: {
            title: `Welcome Back`,
            text: `Access your DeepDev account`,
            email: `Email`,
            password: `Password`,
            button: `Sign In`,
            register: {
                before: `New to DeepDev? `,
                after: `Create an account`
            },
        },
        footer: {
            deepdev: [`Reinventing Digital Experiences`, `Engineering immersive interfaces where design, motion and intelligence converge.`],
            navigationTitle: `NAVIGATION`,
            expertiseTitle: `EXPERTISE`,
            connectTitle: `CONNECT`,
            navigation: [`Home`, `Products`, `Company`, `Raffles`, `Contact`],
            expertise: [`Frontend Engineering`, `3D Web Experiences`, `AI Integrations`, `Backend Systems`],
            connect: [`Global Remote`, `Phone`],
            rights: `All rights reserved.`,
            privacy: `Privacy Policy`,
            terms: `Terms`
        },
        language: `Lan`
    },
    es: {
        home: {
            reinventing: `DeepDev Reinventando
             Experiencias Digitales.`,
            boost: `Potenciamos tu diseño con las mejores herramientas.`,
            real: `Interacción 3D en tiempo real.`,
            ai: `Experiencias de usuario
             mejoradas con IA.`,
            automate: `Automatiza tu trabajo, un clic y listo.`,
        },
        products: {
            webTitle: `Hacemos Aplicaciones Web.`,
            webText: `Soluciones web modernas adaptadas a tus objetivos, desde landing pages de alto impacto y sitios corporativos hasta plataformas de eCommerce y sistemas web totalmente personalizados. La presencia web es a menudo el primer punto de contacto entre tu marca y tus usuarios.
            
            Un sitio bien construido no solo comunica quién eres, sino que también convierte visitantes en clientes, centraliza tus servicios y permite que tu negocio crezca con flexibilidad y control. Ya sea que necesites mostrar tu marca, vender productos en línea o gestionar información y usuarios a través de una plataforma a medida, las aplicaciones web proporcionan una solución escalable y accesible desde cualquier dispositivo.`,
            
            appTitle: `Apps para iOS y Android.`,
            appText: `Diseñamos y construimos aplicaciones móviles para iOS y Android, desde apps de negocios enfocadas y MVPs hasta productos completos listos para usuarios reales.
            
            Las aplicaciones móviles permiten que tu marca esté presente donde los usuarios pasan la mayor parte de su tiempo. Una app bien lograda ofrece velocidad, rendimiento y una experiencia de usuario fluida, creando una conexión directa y constante entre tu producto y tu audiencia.
            
            Ya sea que necesites lanzar una nueva idea, extender tu producto digital al móvil o brindar a los usuarios una experiencia dedicada, las aplicaciones móviles ofrecen una solución potente, escalable y con una sensación nativa en todos los dispositivos.`,
            customTitle: `Software Web Customizado.`,
            customText: `Diseñamos y desarrollamos soluciones de software completamente personalizadas y adaptadas a las necesidades de tu negocio. Desde sistemas de gestión y control hasta plataformas internas y automatización de procesos, transformamos ideas en herramientas digitales escalables que potencian a tu empresa. 
            
            Cada negocio tiene flujos de trabajo, desafíos y objetivos únicos. Es por eso que las soluciones genéricas a menudo se quedan cortas. El software a medida te permite centralizar la información, automatizar procesos, mejorar la toma de decisiones y obtener un control total sobre tus operaciones. 
            
            Ya sea que necesites un sistema de gestión, un panel de control o un dashboard personalizado, creamos soluciones flexibles diseñadas para crecer con tu negocio.`,
            
            AiTitle: `Inteligencia Artificial Integrada.`,
            AiText: `Diseñamos e integramos soluciones impulsadas por IA adaptadas a necesidades comerciales reales. Desde chatbots personalizados y asistentes virtuales hasta flujos de decisión inteligentes, ayudamos a las empresas a mejorar sus productos digitales con inteligencia artificial práctica y confiable. 
            
            Nuestro enfoque se centra en construir una IA controlada, segura e integrada sin problemas en los sistemas, fuentes de datos y flujos de trabajo existentes. 
            
            En lugar de soluciones genéricas, creamos integraciones personalizadas que mejoran la experiencia del usuario, reducen la carga de trabajo operativa y permiten una automatización más inteligente a escala.`,

            automationTitle: `Automatización de Flujos.`,
            automationText: `Diseñamos e implementamos flujos de trabajo automatizados que conectan sistemas, agilizan las operaciones y eliminan tareas manuales repetitivas.
            
            Al integrar tu sitio web, aplicaciones y herramientas internas, ayudamos a las empresas a mejorar la eficiencia y mantener el control total sobre sus procesos. 
            
            Nuestras soluciones de automatización conectan diferentes plataformas —como CRMs, correos electrónicos, APIs y sistemas internos— permitiendo que los datos fluyan sin problemas y las acciones se activen automáticamente. 
            
            Esto resulta en tiempos de respuesta más rápidos, menos errores y operaciones más consistentes en toda la organización.`,
        },
        company: {
            dna: `Nuestro ADN`,
            dnaTitle: `Compromiso 
            con la Excelencia`,
            dnaText: `En DeepDev, no solo escribimos código, construimos los cimientos de tu próximo éxito. Nuestro camino se define por la precisión técnica y la confianza de entregar productos de clase mundial.`,
            projects: `Proyectos Entregados`,
            uptime: `Disponibilidad Garantizada`,
            support: `Soporte 24/7`,
            title2022: `El Origen`,
            text2022: `Fundada en Argentina con la visión de transformar ideas complejas en productos digitales de alto rendimiento.`,
            title2024: `Expansión Europea y Enfoque en IA`,
            text2024: `Establecimos nuestra base en España e integramos modelos de IA en nuestros desarrollos, elevando el estándar de automatización.`,
            title2026: `Hoy: DeepDev Global`,
            text2026: `Consolidado como un estudio boutique internacional, especializado en software a medida y ecosistemas digitales escalables.`,
            global: `PRESENCIA GLOBAL`,
            globalTitle: `Talento sin Fronteras`,
            globalText: `Operamos estratégicamente desde España y Argentina, combinando la innovación europea con el ingenio y la resiliencia del talento latinoamericano. Esta dualidad nos permite ofrecer una cobertura excepcional de zona horaria y una perspectiva de mercado global.`,
            flagSpain: `🇪🇸 España`,
            flagArgentina: `🇦🇷 Argentina`,
            talk: `¿Listo para empezar tu transformación?`,
            talkButton: `Hablemos de tu proyecto`
        },
        raffles: {
            premiere: `Sorteo 2026`,
            premiereTitle: `Llevamos tu idea al Siguiente Nivel`,
            premiereText: `Para celebrar el lanzamiento de DeepDev, estamos sorteando un proyecto completo de desarrollo Full Stack. Queremos que tu proyecto tenga la presencia digital que merece, con tecnología de vanguardia y diseño de alto impacto.`,
            performance: `Rendimiento Pro`,
            performanceText: `Sitios web optimizados y ultrarrápidos.`,
            design: `Diseño Exclusivo`,
            designText: `Interfaz y experiencia de usuario diseñada para tu marca.`,
            raffleTitle: `Sorteo_FullStack`,
            raffleText: `Participa por la oportunidad de ganar un sitio web profesional completo construido por DeepDev.`,
            days: `DÍAS`,
            hours: `HORAS`,
            minutes: `MIN`,
            seconds: `SEG`,
            name: `Nombre Completo`,
            email: `Correo Electrónico`,
            project: `¿Qué sitio web te gustaría desarrollar?`,
            conditions: {
                before: `Acepto los `,
                link: `términos y condiciones`,
                after: ` del sorteo.`
            },
            error: `Debes aceptar los términos y condiciones para continuar.`,
            processing: `Generando ticket...`,
            verify: `Verificando email`,
            analyzing: `Analizando solicitud...`,
            status: `Estado: Procesando...`,
            registered: `¡Ticket Registrado!`,
            thanks: {
                before: `Gracias`,
                after: `Tu entrada ha sido guardada. 
                ¡Buena suerte!`
            },
            premio: `Premio en Juego: Desarrollo Web Profesional`,
            buttonBack: `Regresar`,
            button: `GENERAR TICKET DE SORTEO`
        },
        contact: {
            name: `Nombre:`,
            lastName: `Apellido:`,
            companyName: `Nombre de la Empresa:`,
            role: `Cargo en la empresa:`,
            email: `Email:`,
            phone: `Teléfono / WhatsApp:`,
            project: `Tipo de trabajo:`,
            projectOption: `Selecciona una opción`,
            projectNew: `Nuevo Proyecto`,
            projectRedisign: `Rediseño de sitio existente`,
            current: `Web/App actual:`,
            type: [`Tipo de Web/App:`, `Selecciona una opción`, `Landing Page`, `Sitio Web Corporativo / Institucional`, `E-commerce`, `Portfolio`, `Sitio de Servicios`, `Aplicación Web / Plataforma`, `Sistema Customizado`, `No estoy seguro todavía`],
            projectGoal: [ `Objetivo del Proyecto:`, `Selecciona un objetivo`, `Recibir consultas / Leads`, `Vender productos o servicios`, `Mostrar y fortalecer mi marca`, `Automatizar procesos`, `Otro`],
            range: [ `Rango de Presupuesto:`, `Selecciona un rango`,  `Menos de U$S 500`, `U$S 500 - U$S 1000`, `U$S 1000 - U$S 3000`, `Más de U$S 3000`, `No estoy seguro todavía`],
            available: [ `Tiempo Disponible:`, `Selecciona un plazo de entrega`, `Lo antes posible`, `1-2 meses`, `+3 meses`, `Flexible`],
            descriptionPlace: [ `Descripción del Proyecto:`, `Cuéntanos más sobre tu proyecto o idea` ],
            button: `Enviar`,
        },
        nav: {
            promo: `🔥 -- Visita nuestra sección de sorteos para participar por premios y obtener grandes descuentos en nuestros productos. -- 🔥`,
            products: `Productos`,
            company: `Compañía`,
            raffles: `Sorteos`,
            contact: `Contacto`,
            login: `Iniciar Sesión`
        },
        login: {
            title: `Bienvenido de nuevo`,
            text: `Accede a tu cuenta DeepDev`,
            email: `Email:`,
            password: `Contraseña:`,
            button: `Ingresar`,
            register: {
                before: `¿Eres nuevo en DeepDev?
                `,
                after: `Crea una cuenta`
            },
        },
        footer: {
            deepdev: [`Reinventando Experiencias Digitales`, `Ingeniería de interfaces inmersivas donde convergen el diseño, el movimiento y la inteligencia.`],
            navigationTitle: `NAVEGACIÓN`,
            expertiseTitle: `EXPERTIZ`,
            connectTitle: `CONTACTO`,
            navigation: [`Inicio`, `Productos`, `Compañía`, `Sorteos`, `Contacto`],
            expertise: [`Ingeniería Frontend`, `Experiencias Web 3D`, `Integraciones de IA`, `Sistemas Backend`],
            connect: [`Remoto Global`, `Teléfono`],
            rights: `Todos los derechos reservados.`,
            privacy: `Política de Privacidad`,
            terms: `Términos y Condiciones`
        },
        language: `Len`
    },
    it: {
        home: {
            reinventing: `DeepDev: Reinventando le 
            Esperienze Digitali.`,
            boost: `Potenziamo il tuo design con i migliori strumenti.`,
            real: `Interazione 3D in tempo reale.`,
            ai: `Esperienze utente 
            potenziate dall'IA.`,
            automate: `Automatizza il tuo lavoro, un clic e il gioco è fatto.`,
        },
        products: {
            webTitle: `Sviluppiamo Applicazioni Web`,
            webText: `Offriamo soluzioni web moderne progettate per i tuoi obiettivi. Dalle landing page ai sistemi eCommerce e piattaforme personalizzate, trasformiamo ogni tua idea in uno strumento digitale potente, funzionale e pronto a scalare.

            La presenza online è il primo contatto tra brand e utenti. Un sito web ben costruito comunica la tua identità e lavora per convertire i visitatori in clienti, centralizzando i servizi e permettendo al tuo business di crescere con controllo.

            Sviluppiamo infrastrutture sicure e veloci utilizzando le tecnologie più avanzate. Garantiamo un'esperienza utente impeccabile su ogni dispositivo, ottimizzando i processi digitali per mantenere il tuo business sempre un passo avanti rispetto alla concorrenza.`,

            appTitle: `App Mobile iOS e Android.`,
            appText: `Progettiamo applicazioni mobili per iOS e Android adattate alle tue esigenze. Dai prodotti MVP per validare la tua idea fino ad app aziendali complesse, creiamo strumenti digitali pronti a offrire prestazioni eccellenti e scalabili per utenti reali in tutto il mondo.

            Le app permettono al tuo brand di essere presente dove gli utenti trascorrono la maggior parte del tempo. Un software ben progettato rafforza la fedeltà del cliente, offrendo accesso immediato ai tuoi servizi e migliorando l'autorità del tuo business nel mercato digitale.

            Creiamo interfacce intuitive che garantiscono un'interazione fluida e naturale. Utilizziamo tecnologie moderne per assicurare che la tua applicazione sia veloce e sicura, trasformando ogni tocco sullo schermo in un'opportunità strategica di crescita per la tua azienda.`,

            customTitle: `Soluzioni Software su Misura.`,
            customText: `Sviluppiamo soluzioni software personalizzate in base alle esigenze specifiche della tua azienda. Dai sistemi gestionali all'automazione dei processi, trasformiamo le tue idee in strumenti digitali scalabili che potenziano l'efficienza operativa e la crescita della tua impresa.

            Ogni business ha obiettivi unici per i quali i software standard non bastano. Una soluzione su misura offre la flessibilità necessaria per adattarsi ai tuoi processi interni, eliminando i limiti dei sistemi generici e fornendo un vantaggio competitivo reale nel tuo settore.

            Creiamo architetture solide e sicure progettate per integrarsi con le tue tecnologie attuali. Ci assicuriamo che ogni software sia intuitivo e pronto a evolversi, trasformando la complessità tecnica in strumenti semplici che ottimizzano le prestazioni e il ritorno sull'investimento.`,

            AiTitle: `Integrazione di Intelligenza 
            Artificiale.`,
            AiText: `Progettiamo soluzioni di intelligenza artificiale adattate alle reali esigenze della tua azienda. Dai chatbot agli assistenti virtuali e sistemi decisionali, aiutiamo le imprese a potenziare i prodotti digitali con un'IA pratica, affidabile e orientata ai risultati.

            L'integrazione dell'IA ottimizza tempo e risorse automatizzando compiti complessi e analizzando dati in tempo reale. Implementiamo algoritmi avanzati per offrire precisione operativa, permettendo al tuo team di concentrarsi su attività ad alto valore strategico.

            Creiamo strumenti sicuri e scalabili che si evolvono con il tuo business trasformando i dati in intuizioni chiare. Il nostro approccio garantisce un'IA facile da usare che migliora l'esperienza utente e porta l'efficienza della tua impresa a un livello superiore.`,
            
            automationTitle: `Automazione dei flussi`,
            automationText: `Progettiamo e implementiamo flussi di lavoro automatizzati che connettono i tuoi sistemi, ottimizzano le operazioni ed eliminano le attività manuali ripetitive. Trasformiamo i processi frammentati in ecosistemi fluidi, riducendo gli errori e i costi operativi della tua azienda.

Integrando il tuo sito web e i tuoi strumenti interni, aiutiamo le imprese a migliorare l'efficienza e a mantenere il pieno controllo sui processi. Creiamo soluzioni che liberano tempo prezioso, permettendo al tuo team di concentrarsi sulle attività che generano vero valore.

Il nostro approccio assicura che ogni informazione arrivi nel posto giusto al momento giusto. Automatizzare significa costruire una struttura digitale agile e reattiva, capace di adattarsi alle sfide del mercato e di massimizzare la produttività complessiva del tuo business.`,
        },
        company: {
            dna: `Il Nostro DNA`,
            dnaTitle: `Impegno per l'Eccellenza`,
            dnaText: `In DeepDev non scriviamo solo codice; costruiamo le fondamenta per il tuo prossimo successo. Il nostro percorso è definito dalla precisione tecnica e dalla fiducia nel consegnare prodotti di classe mondiale.`,
            projects: `Progetti Consegnati`,
            uptime: `Uptime Garantito`,
            support: `Supporto 24/7`,
            title2022: `L'Origine`,
            text2022: `Fondata in Argentina con la visione di trasformare idee complesse in prodotti digitali ad alte prestazioni.`,
            title2024: `Espansione Europea e Focus sull'IA`,
            text2024: `Sede stabilita in Spagna e integrazione di modelli di IA nei nostri sviluppi, elevando lo standard dell'automazione.`,
            title2026: `Oggi: DeepDev Global`,
            text2026: `Consolidato come studio boutique internazionale, specializzato in software personalizzato ed ecosistemi digitali scalabili.`,
            global: `PRESENZA GLOBALE`,
            globalTitle: `Talento Senza Confini`,
            globalText: `Operiamo strategicamente da Spagna e Argentina, unendo l'innovazione europea con l'ingegno e la resilienza del talento latinoamericano.`,
            flagSpain: `🇪🇸 Spagna`,
            flagArgentina: `🇦🇷 Argentina`,
            talk: `Pronto a iniziare la tua trasformazione?`,
            talkButton: `Parliamo del tuo progetto`
        },
        raffles: {
            premiere: `Sorteggio 2026`,
            premiereTitle: `Portiamo la tua idea al Livello Successivo`,
            premiereText: `Per celebrare il lancio di DeepDev, mettiamo in palio un progetto completo di sviluppo Full Stack. Vogliamo che il tuo progetto abbia la presenza digitale che merita, con tecnologia all'avanguardia e design ad alto impatto.`,
            performance: `Prestazioni Pro`,
            performanceText: `Siti web ottimizzati e ultra-veloci.`,
            design: `Design Esclusivo`,
            designText: `Interfaccia e esperienza utente progettate per il tuo brand.`,
            raffleTitle: `Sorteggio_FullStack`,
            raffleText: `Partecipa per avere la possibilità di vincere un sito web professionale completo realizzato da DeepDev.`,
            days: `GIORNI`,
            hours: `ORE`,
            minutes: `MIN`,
            seconds: `SEC`,
            name: `Nome Completo`,
            email: `Email`,
            project: `Quale sito web ti piacerebbe sviluppare?`,
            conditions: {
                before: `Accetto i `,
                link: `termini e le condizioni`,
                after: ` del sorteggio.`
            },
            error: `Devi accettare i termini e le condizioni per continuare.`,
            processing: `Generazione del ticket...`,
            verify: `Verifica e-mail...`,
            analyzing: `Analisi della richiesta...`,
            status: `Stato: In elaborazione...`,
            registered: `Ticket Registrato!`,
            thanks: {
                before: `Grazie. `,
                after: `La tua iscrizione è stata salvata. Buona fortuna!`
            },
            premio: `Premio in Palio: Sviluppo Web Professionale`,
            buttonBack: `Indietro`,
            button: `GENERA BIGLIETTO DEL SORTEGGIO`
        },
        contact: {
            name: `Nome:`,
            lastName: `Cognome:`,
            companyName: `Nome Azienda:`,
            role: `Ruolo in azienda:`,
            email: `Email:`,
            phone: `Telefono / WhatsApp:`,
            project: `Tipo di progetto:`,
            projectOption: `Seleziona un'opzione`,
            projectNew: `Nuovo Progetto`,
            projectRedisign: `Restyling sito esistente`,
            current: `Sito Web/App attuale:`,
            type: [`Tipo di Web/App:`, `Seleziona un'opzione`, `Landing Page`, `Sito Aziendale / Istituzionale`, `E-commerce`, `Portfolio`, `Sito di Servizi`, `Applicazione Web / Piattaforma`, `Sistema Personalizzato`, `Non sono ancora sicuro`],
            projectGoal: [`Obiettivo del Progetto:`, `Seleziona un obiettivo`, `Ricevere richieste / Lead`, `Vendere prodotti o servizi`, `Mostrare e rafforzare il brand`, `Automatizzare i processi`, `Altro`],
            range: [`Budget stimato:`, `Seleziona un range`, `Meno di U$S 500`, `U$S 500 - U$S 1000`, `U$S 1000 - U$S 3000`, `Più di U$S 3000`, `Non sono ancora sicuro`],
            available: [`Disponibilità di tempo:`, `Seleziona una scadenza`, `Il prima possibile`, `1-2 mesi`, `+3 mesi`, `Flessibile`],
            descriptionPlace: [`Descrizione del Progetto:`, `Raccontaci di più sul tuo progetto o idea`],
            button: `Invia Messaggio`,
        },
        nav: {
            promo: `🔥 -- Visita la nostra sezione sorteggi per partecipare all'estrazione di premi e ottenere grandi sconti sui nostri prodotti. -- 🔥`,
            products: `Prodotti`,
            company: `Azienda`,
            raffles: `Sorteggi`,
            contact: `Contatti`,
            login: `Accedi`
        },
        login: {
            title: `Bentornato`,
            text: `Accedi al tuo account DeepDev`,
            email: `Email`,
            password: `Password`,
            button: `Accedi`,
            register: {
                before: `Nuovo in DeepDev? `,
                after: `Crea un account`
            },
        },
        footer: {
            deepdev: [`Reinventando le Esperienze Digitali`, `Ingegneria di interfacce immersive dove convergono design, movimento e intelligenza.`],
            navigationTitle: `NAVIGAZIONE`,
            expertiseTitle: `COMPETENZE`,
            connectTitle: `CONTATTI`,
            navigation: [`Home`, `Prodotti`, `Azienda`, `Sorteggi`, `Contatti`],
            expertise: [`Ingegneria Frontend`, `Esperienze Web 3D`, `Integrazioni IA`, `Sistemas Backend`],
            connect: [`Remoto Globale`, `Telefono`],
            rights: `Tutti i diritti riservati.`,
            privacy: `Informativa sulla Privacy`,
            terms: `Termini e Condizioni`
        },
        language: `Lin`
    },
    fr: {
        home: {
            reinventing: `DeepDev : Réinventer les 
            Expériences Numériques.`,
            boost: `Boostez votre design avec les meilleurs outils.`,
            real: `Interaction 3D en temps réel.`,
            ai: `Expériences utilisateur 
            optimisées par l'IA.`,
            automate: `Automatisez votre travail, un clic et c'est fait.`,
        },
        products: {
            webTitle: `Développement d'apps web`,
            webText: `Des solutions adaptées à vos objectifs : des landing pages à fort impact aux sites institutionnels, en passant par l’e-commerce et les systèmes web sur mesure. Votre présence en ligne est souvent le premier point de contact avec vos clients.

            Un site bien conçu ne se contente pas de présenter votre marque ; il convertit vos visiteurs, centralise vos services et soutient votre croissance avec flexibilité. Que vous souhaitiez vendre en ligne, promouvoir votre image ou gérer des données via une plateforme dédiée, nos applications web offrent une solution évolutive et accessible sur tous les supports.`,
            appTitle: `Apps Mobiles iOS & Android.`,
            appText: `Nous concevons et développons des applications mobiles pour iOS et Android, des MVP ciblés aux produits complets prêts pour le marché.

            Une application mobile permet à votre marque d'être présente là où vos utilisateurs passent le plus clair de leur temps. Une application performante offre rapidité, efficacité et une expérience utilisateur fluide, créant ainsi un lien direct et constant entre votre produit et votre audience.

            Que vous souhaitiez lancer une nouvelle idée, adapter votre produit au format mobile ou offrir une expérience dédiée, nos solutions mobiles sont puissantes, évolutives et offrent un ressenti natif sur tous les appareils.`,

            customTitle: `Software sur mesure.`,
            customText: `Nous concevons des solutions logicielles adaptées à vos besoins : des systèmes de gestion à l'automatización de processus. Nous transformons vos idées en outils numériques évolutifs pour renforcer votre entreprise.

            Les solutions génériques sont souvent limitées face à vos défis uniques. Le logiciel sur mesure permet de centraliser vos données, d'automatiser vos tâches et de garder le contrôle total sur vos opérations.

            Qu'il s'agisse d'un système de gestion ou d'un tableau de bord personnalisé, nous créons des solutions flexibles conçues para accompagner votre croissance.`,

            AiTitle: `Intégration d'IA`,
            AiText: `Nous concevons et intégrons des solutions d'IA adaptées aux besoins réels de votre entreprise. Des chatbots personnalisés aux flux de décision intelligents, nous renforçons vos produits avec une intelligence artificielle pratique et fiable.

            Notre approche repose sur une IA contrôlée, sécurisée et parfaitement intégrée à vos systèmes, données et flux de travail existants.

            Plutôt que des solutions génériques, nous créons des intégrations sur mesure qui améliorent l'expérience utilisateur, réduisent la charge opérationnelle et permettent une automatisation intelligente à grande échelle.`,

            automationTitle: `Automatisation Process`,
            automationText: `Nous concevons et implémentons des flux de travail automatisés qui connectent intelligemment vos systèmes, simplifient vos opérations quotidiennes et éliminent les tâches manuelles répétitives. En intégrant votre site web, vos applications et vos outils internes, nous aidons votre entreprise à gagner en efficacité tout en conservant un contrôle total sur chaque processus.

            Nos solutions d'automatisation permettent de relier des plateformes hétérogènes — telles que vos CRM, services de messagerie, API et systèmes propriétaires — pour assurer une circulation fluide des données et le déclenchement automatique d'actions stratégiques.

            Cette architecture se traduit par une réactivité accrue, une réduction drastique des erreurs humaines et une cohérence opérationnelle parfaite sur l'ensemble de votre organisation. Qu'il s'agisse de synchronisation de données ou de processus multi-étapes complexes, nous bâtissons des workflows évolutifs adaptés à vos besoins spécifiques.`,
        },
        company: {
            dna: `Notre ADN`,
            dnaTitle: `Engagement vers l'Excellence`,
            dnaText: `Chez DeepDev, nous n'écrivons pas seulement du code ; nous bâtissons les fondations de votre futur succès. Notre parcours se définit par la précision technique et la confiance de livrer des produits de classe mondiale.`,
            projects: `Projets Livrés`,
            uptime: `Disponibilité Garantie`,
            support: `Support 24/7`,
            title2022: `L'Origine`,
            text2022: `Fondée en Argentine avec la vision de transformer des idées complexes en produits numériques de haute performance.`,
            title2024: `Expansion Européenne & Focus IA`,
            text2024: `Établissement de notre base en Espagne et intégration de modèles d'IA dans nos développements, élevant les standards de l'automatisation.`,
            title2026: `Aujourd'hui : DeepDev Global`,
            text2026: `Consolidé comme un studio boutique international, spécialisé dans les logiciels sur mesure et les écosystèmes numériques évolutifs.`,
            global: `PRÉSENCE GLOBALE`,
            globalTitle: `Le Talent sans Frontières`,
            globalText: `Nous opérons stratégiquement depuis l'Espagne et l'Argentine, alliant l'innovation européenne à l'ingéniosité et la résilience du talent latino-américain.`,
            flagSpain: `🇪🇸 Espagne`,
            flagArgentina: `🇦🇷 Argentine`,
            talk: `Prêt à commencer votre transformation ?`,
            talkButton: `Parlons de votre projet`
        },
        raffles: {
            premiere: `Tirage au sort 2026`,
            premiereTitle: `Propulsez votre idée au Niveau Supérieur`,
            premiereText: `Pour célébrer le lancement de DeepDev, nous offrons un projet de développement Full Stack complet. Nous voulons que votre projet ait la présence numérique qu'il mérite.`,
            performance: `Performance Pro`,
            performanceText: `Sites web optimisés et ultra-rapides.`,
            design: `Design Exclusif`,
            designText: `Interface et expérience utilisateur conçues pour votre marque.`,
            raffleTitle: `Tirage_FullStack`,
            raffleText: `Participez pour tenter de gagner un site web professionnel complet conçu par DeepDev.`,
            days: `JOURS`,
            hours: `HEURES`,
            minutes: `MIN`,
            seconds: `SEC`,
            name: `Nom Complet`,
            email: `E-mail`,
            project: `Quel site web aimeriez-vous développer ?`,
            conditions: {
                before: `J'accepte les `,
                link: `termes et conditions`,
                after: ` du tirage au sort.`
            },
            error: `Vous devez accepter les termes et conditions pour continuer.`,
            processing: `Génération du ticket...`,
            verify: `Vérification de l'e-mail...`,
            analyzing: `Analyse de la demande...`,
            status: `État : En cours...`,
            registered: `Ticket Enregistré !`,
            thanks: {
                before: `Merci. `,
                after: `Votre participation a été enregistrée. Bonne chance !`
            },
            premio: `Prix en Jeu : Développement Web Professionnel`,
            buttonBack: `Retour`,
            button: `GÉNÉRER MON TICKET`
        },
        contact: {
            name: `Nom :`,
            lastName: `Prénom :`,
            companyName: `Nom de l'entreprise :`,
            role: `Poste dans l'entreprise :`,
            email: `E-mail :`,
            phone: `Téléphone / WhatsApp :`,
            project: `Type de projet :`,
            projectOption: `Sélectionnez une option`,
            projectNew: `Nouveau Projet`,
            projectRedisign: `Refonte d'un site existant`,
            current: `Site Web/App actuel :`,
            type: [`Type de Web/App :`, `Sélectionnez une option`, `Landing Page`, `Site Institutionnel`, `E-commerce`, `Portfolio`, `Site de Services`, `Application Web / Plateforme`, `Système personnalisé`, `Pas encore sûr`],
            projectGoal: [`Objectif du projet :`, `Sélectionnez un objectif`, `Recevoir des demandes / Leads`, `Vendre des produits ou services`, `Renforcer mon image de marque`, `Automatiser des processus`, `Autre`],
            range: [`Budget prévu :`, `Sélectionnez une fourchette`, `Moins de 500 U$S`, `500 - 1000 U$S`, `1000 - 3000 U$S`, `Plus de 3000 U$S`, `Pas encore sûr`],
            available: [`Délai souhaité :`, `Sélectionnez un délai`, `Dès que possible`, `1-2 mois`, `+3 mois`, `Flexible`],
            descriptionPlace: [`Description du projet :`, `Dites-nous en plus sur votre projet ou votre idée`],
            button: `Envoyer le Message`,
        },
        nav: {
            promo: `🔥 -- Consultez notre section concours pour participer aux tirages au sort et obtenir des réductions. -- 🔥`,
            products: `Produits`,
            company: `Entreprise`,
            raffles: `Concours`,
            contact: `Contact`,
            login: `Connexion`
        },
        login: {
            title: `Bon retour`,
            text: `Accédez à votre compte DeepDev`,
            email: `E-mail`,
            password: `Mot de passe`,
            button: `Se connecter`,
            register: {
                before: `Nouveau chez DeepDev ? 
                `,
                after: `Créer un compte`
            },
        },
        footer: {
            deepdev: [`Réinventer les Expériences Numériques`, `Ingénierie d'interfaces inmersives où convergent design, mouvement et intelligence.`],
            navigationTitle: `NAVIGATION`,
            expertiseTitle: `EXPERTISE`,
            connectTitle: `CONTACT`,
            navigation: [`Accueil`, `Produits`, `Entreprise`, `Concours`, `Contact`],
            expertise: [`Ingénierie Frontend`, `Expériences Web 3D`, `Intégrations IA`, `Systèmes Backend`],
            connect: [`Remote Global`, `Téléphone`],
            rights: `Tous droits réservés.`,
            privacy: `Politique de Confidentialité`,
            terms: `Conditions Générales`
        },
        language: `Lan`
    },
    de: {
        home: {
            reinventing: `DeepDev: Digitale Erlebnisse 
            neu definiert.`,
            boost: `Wir optimieren Ihr Design mit den besten Tools.`,
            real: `3D-Interaktion in Echtzeit.`,
            ai: `KI-gestützte 
            Benutzererlebnisse.`,
            automate: `Automatisieren Sie Ihre Arbeit – ein Klick genügt.`,
        },
        products: {
            webTitle: `Wir bauen Webanwendungen.`,
            webText: `Wir entwickeln moderne Weblösungen, die strategisch auf Ihre Ziele zugeschnitten sind. Von Landingpages bis zu E-Commerce-Plattformen verwandeln wir Ihre Ideen in leistungsstarke digitale Werkzeuge, die flexibel mit Ihrem Unternehmen mitwachsen.

            Ihre Website ist der zentrale Kontaktpunkt zu Ihren Kunden. Ein gut strukturiertes System kommuniziert Ihre Identität, konvertiert Besucher effektiv und ermöglicht Ihnen die volle Kontrolle über Ihr digitales Wachstum.

            Wir setzen auf modernste Technologien für maximale Leistung und Sicherheit. Dies garantiert eine einwandfreie Benutzererfahrung auf allen Geräten und optimiert Ihre Prozesse, damit Sie dem Wettbewerb immer einen Schritt voraus bleiben.`,
            appTitle: `Mobile Apps für iOS & Android.`,
            appText: `Wir entwickeln fortschrittliche Apps für iOS und Android, passgenau für Ihre Bedürfnisse. Von MVPs bis zu komplexen Business-Lösungen schaffen wir digitale Werkzeuge, die durch exzellente Leistung und weltweite Skalierbarkeit überzeugen.

            Apps stärken Ihre Markenpräsenz dort, wo Ihre Kunden sind. Als direkter Kommunikationskanal verbessern sie die Kundenbindung, bieten sofortigen Zugang zu Ihren Diensten und erhöhen Ihre Autorität im digitalen Markt.

            Unser Fokus liegt auf intuitiven Interfaces für eine flüssige User Experience. Mit moderner Technologie stellen wir sicher, dass Ihre Anwendung schnell und sicher bleibt – so wird jede Interaktion zu einer strategischen Wachstumschance.`,

            customTitle: `Maßgeschneiderte Softwarelösungen.`,
            customText: `Wir entwickeln maßgeschneiderte Softwarelösungen, die exakt auf Ihre Anforderungen zugeschnitten sind. Von Managementsystemen bis zur Prozessautomatisierung schaffen wir skalierbare digitale Werkzeuge, die Ihre betriebliche Effizienz und das Wachstum Ihres Unternehmens nachhaltig steigern.

            Da Standardsoftware oft an ihre Grenzen stößt, bietet Individualsoftware die nötige Flexibilität für Ihre einzigartigen Abläufe. So eliminieren Sie die Einschränkungen generischer Systeme und gewinnen einen echten Wettbewerbsvorteil in Ihrer Branche.

            Wir setzen auf sichere Architekturen, die sich nahtlos in Ihre Infrastruktur integrieren. Unsere intuitiven Lösungen wachsen mit Ihrem Unternehmen und verwandeln technische Komplexität in einfache Werkzeuge, die Ihre Leistung und Ihren Erfolg maximieren.`,

            AiTitle: `KI-Systemintegration.`,
            AiText: `Wir konzipieren maßgeschneiderte KI-Lösungen von Chatbots bis zu Entscheidungssystemen. So optimieren wir Ihre digitalen Produkte mit einer praktischen und zuverlässigen KI, die echten geschäftlichen Mehrwert bietet.

            Die Integration automatisiert komplexe Aufgaben und analysiert Daten in Echtzeit. Das spart wertvolle Ressourcen und ermöglicht es Ihrem Team, sich auf strategische Aktivitäten mit hoher Priorität zu konzentrieren.

            Unsere skalierbaren KI-Tools verwandeln Informationen in klare Erkenntnisse. Wir schaffen intuitive Systeme, die das Nutzererlebnis verbessern und die Effizienz Ihres Unternehmens nachhaltig auf ein neues Niveau heben.`,
            automationTitle: `Prozess-Automation.`,
            automationText: `Wir implementieren automatisierte Workflows, die Ihre Systeme nahtlos verbinden, Abläufe rationalisieren und repetitive manuelle Aufgaben eliminieren. So schaffen wir effiziente digitale Prozesse, die menschliche Fehler reduzieren und die Betriebskosten senken.

Durch die Integration Ihrer Tools helfen wir Ihrem Unternehmen, die Effizienz zu steigern und die volle Kontrolle über alle Arbeitsabläufe zu behalten. Das Ergebnis ist eine agile Struktur, die wertvolle Zeit für strategische Aufgaben freisetzt und Ihr Wachstum beschleunigt.`,
        },
        company: {
            dna: `Unsere DNA`,
            dnaTitle: `Verpflichtung 
            zu Exzellenz`,
            dnaText: `Bei DeepDev schreiben wir nicht nur Code; wir bauen das Fundament für Ihren nächsten Erfolg. Unser Weg ist geprägt von technischer Präzision und dem Vertrauen, erstklassige Produkte zu liefern.`,
            projects: `Abgeschlossene Projekte`,
            uptime: `Garantierte Verfügbarkeit`,
            support: `24/7 Support`,
            title2022: `Der Ursprung`,
            text2022: `Gegründet in Argentinien mit der Vision, komplexe Ideen in leistungsstarke digitale Produkte zu verwandeln.`,
            title2024: `Europäische Expansion & KI-Fokus`,
            text2024: `Gründung unseres Standorts in Spanien und Integration von KI-Modellen, um neue Standards in der Automatisierung zu setzen.`,
            title2026: `Heute: DeepDev Global`,
            text2026: `Konsolidiert als internationales Boutique-Studio, spezialisiert auf Individualsoftware und skalierbare digitale Ökosysteme.`,
            global: `GLOBALE PRÄSENZ`,
            globalTitle: `Talent ohne Grenzen`,
            globalText: `Wir agieren strategisch von Spanien und Argentinien aus und kombinieren europäische Innovation mit dem Scharfsinn und der Resilienz lateinamerikanischer Talente.`,
            flagSpain: `🇪🇸 Spanien`,
            flagArgentina: `🇦🇷 Argentinien`,
            talk: `Bereit für Ihre Transformation?`,
            talkButton: `Lassen Sie uns über Ihr Projekt sprechen`
        },
        raffles: {
            premiere: `Gewinnspiel 2026`,
            premiereTitle: `Wir bringen Ihre Idee auf das nächste`,
            premiereText: `Zur Feier des Launchs von DeepDev verlosen wir ein komplettes Full-Stack-Entwicklungsprojekt. Wir möchten, dass Ihr Projekt die digitale Präsenz erhält, die es verdient.`,
            performance: `Pro Performance`,
            performanceText: `Optimierte und ultraschnelle Websites.`,
            design: `Exklusives Design`,
            designText: `Benutzeroberfläche und UX, maßgeschneidert für Ihre Marke.`,
            raffleTitle: `FullStack_Gewinnspiel`,
            raffleText: `Nehmen Sie teil und gewinnen Sie eine professionelle Website von DeepDev.`,
            days: `TAGE`,
            hours: `STD`,
            minutes: `MIN`,
            seconds: `SEK`,
            name: `Vollständiger Name`,
            email: `E-Mail`,
            project: `Welches Webprojekt möchten Sie entwickeln?`,
            conditions: {
                before: `Ich akzeptiere die `,
                link: `Teilnahmebedingungen`,
                after: ` des Gewinnspiels.`
            },
            error: `Sie müssen die Teilnahmebedingungen akzeptieren, um fortzufahren.`,
            processing: `Ticket wird generiert...`,
            verify: `E-Mail wird verifiziert...`,
            analyzing: `Anfrage wird analysiert...`,
            status: `Status: In Bearbeitung...`,
            registered: `Ticket Registriert!`,
            thanks: {
                before: `Danke. `,
                after: `Dein Eintrag wurde gespeichert. Viel Glück!`
            },
            premio: `Gewinnspiel-Preis: Professionelle Webentwicklung`,
            buttonBack: `Zurück`,
            button: `GEWINNSPIEL-TICKET GENERIEREN`
        },
        contact: {
            name: `Vorname:`,
            lastName: `Nachname:`,
            companyName: `Firmenname:`,
            role: `Position im Unternehmen:`,
            email: `E-Mail:`,
            phone: `Telefon / WhatsApp:`,
            project: `Projekttyp:`,
            projectOption: `Wählen Sie eine Option`,
            projectNew: `Neues Projekt`,
            projectRedisign: `Redesign einer bestehenden Website`,
            current: `Aktuelle Web/App:`,
            type: [`Web/App Typ:`, `Wählen Sie eine Option`, `Landingpage`, `Unternehmenswebsite`, `E-Commerce`, `Portfolio`, `Service-Website`, `Web-Anwendung / Plattform`, `Individuelles System`, `Noch nicht sicher`],
            projectGoal: [`Projektziel:`, `Wählen Sie ein Ziel`, `Anfragen generieren / Leads`, `Produkte oder Dienstleistungen verkaufen`, `Marke stärken`, `Prozesse automatisieren`, `Sonstiges`],
            range: [`Budgetrahmen:`, `Wählen Sie einen Bereich`, `Weniger als 500 U$S`, `500 - 1000 U$S`, `1000 - 3000 U$S`, `Mehr als 3000 U$S`, `Noch nicht sicher`],
            available: [`Zeitrahmen:`, `Wählen Sie eine Frist`, `So schnell wie möglich`, `1-2 Monate`, `+3 Monate`, `Flexibel`],
            descriptionPlace: [`Projektbeschreibung:`, `Erzählen Sie uns mehr über Ihr Projekt oder Ihre Idee`],
            button: `Nachricht Senden`,
        },
        nav: {
            promo: `🔥 -- Besuchen Sie unseren Gewinnspiel-Bereich und gewinnen Sie tolle Preise oder Rabatte auf unsere Produkte. -- 🔥`,
            products: `Produkte`,
            company: `Unternehmen`,
            raffles: `Gewinnspiele`,
            contact: `Kontakt`,
            login: `Login`
        },
        login: {
            title: `Willkommen zurück`,
            text: `Melden Sie sich bei Ihrem DeepDev-Konto an`,
            email: `E-mail`,
            password: `Passwort`,
            button: `Anmelden`,
            register: {
                before: `Neu bei DeepDev? `,
                after: `Konto erstellen`
            },
        },
        footer: {
            deepdev: [`Digitale Erlebnisse neu definiert`, `Engineering von immersiven Interfaces, in denen Design, Motion und Intelligenz verschmelzen.`],
            navigationTitle: `NAVIGATION`,
            expertiseTitle: `EXPERTISE`,
            connectTitle: `KONTAKT`,
            navigation: [`Home`, `Produkte`, `Unternehmen`, `Gewinnspiele`, `Kontakt`],
            expertise: [`Frontend Engineering`, `3D Web Experiences`, `KI-Integration`, `Backend Systeme`],
            connect: [`Global Remote`, `Telefon`],
            rights: `Alle Rechte vorbehalten.`,
            privacy: `Datenschutzerklärung`,
            terms: `AGB`
        },
        language: `Spr`
    },
    ru: {
        home: {
            reinventing: `DeepDev: Переосмысление 
            цифрового опыта.`,
            boost: `Мы улучшаем ваш дизайн с помощью лучших инструментов.`,
            real: `3D-взаимодействие в реальном времени.`,
            ai: `Пользовательский опыт 
            на базе ИИ.`,
            automate: `Автоматизируйте свою работу — один клик, и готово.`,
        },
        products: {
            webTitle: `Разработка веб-систем`,
            webText: `От высокоэффективных лендингов и корпоративных сайтов до eCommerce-платформ и сложных заказных систем.

            Веб-ресурс — это зачастую первый контакт бренда с пользователем. Качественный сайт не только рассказывает о вас, но и превращает посетителей в клиентов, централизует сервисы и позволяет вашему бизнесу гибко расти под полным контролем.

            Нужно ли вам представить бренд, продавать товары онлайн или управлять данными через уникальную платформу — веб-приложения станут масштабируемым и доступным решением на любом устройстве.`,
            appTitle: `Мобильные приложения для iOS и Android.`,
            appText: `От целевых бизнес-приложений и MVP до полнофункциональных продуктов, готовых к выходу на рынок.

            Мобильные приложения позволяют вашему бренду присутствовать там, где пользователи проводят больше всего времени. Качественное приложение обеспечивает скорость, производительность и безупречный пользовательский опыт, создавая прямую и постоянную связь между вашим продуктом и аудиторией.

            Хотите ли вы запустить новую идею, расширить цифровой продукт или предложить пользователям выделенный сервис — мобильные приложения станут мощным и масштабируемым решением с нативным интерфейсом для любого устройства.`,
            customTitle: `Индивидуальные программные решения.`,
            customText: `Мы создаем программные решения под ваши задачи: от систем управления до автоматизации процессов. Превращаем ваши идеи в масштабируемые инструменты для развития компании.

            Готовых решений часто недостаточно для уникальных процессов. Заказное ПО помогает централизовать данные, автоматизировать задачи и получить полный контроль над операциями.

            Нужна ли вам панель управления или сложная платформа — мы создаем гибкие решения, которые будут расти вместе с вашим бизнесом.`,
            AiTitle: `Интеграция ИИ.`,
            AiText: `Мы внедряем ИИ, адаптированный под ваши задачи: от умных чат-ботов до систем принятия решений. Помогаем компаниям усилить их продукты с помощью надежного и практичного искусственного интеллекта.

            Наш приоритет — создание безопасного ИИ, который легко интегрируется в ваши текущие системы, данные и рабочие процессы.

            Вместо шаблонов мы предлагаем решения, которые улучшают опыт пользователей, снижают нагрузку на персонал и обеспечивают умную автоматизацию любого масштаба.`,
            automationTitle: `Поток задач.`,
            automationText: `Мы создаем автоматизированные рабочие процессы, которые объединяют системы и устраняют рутину. Интеграция сайтов, приложений и внутренних инструментов повышает эффективность и обеспечивает полный контроль над бизнесом.

            Наши решения связывают CRM, почту и API, обеспечивая бесшовный обмен данными. Это ускоряет работу, минимизирует ошибки и делает бизнес-процессы стабильными.

            Нужна ли вам синхронизация данных или сложные многоступенчатые сценарии — мы строим масштабируемые процессы, адаптированные под ваши задачи.`,
        },
        company: {
            dna: `Наш ДНК`,
            dnaTitle: `Стремление к совершенству`,
            dnaText: `В DeepDev мы не просто пишем код; мы строим фундамент для вашего следующего успеха. Наш путь определяется технической точностью и уверенностью в предоставлении продуктов мирового уровня.`,
            projects: `Проектов реализовано`,
            uptime: `Гарантированная доступность`,
            support: `Поддержка 24/7`,
            title2022: `Истоки`,
            text2022: `Основана в Аргентине с видением превращения сложных идей в высокопроизводительные цифровые продукты.`,
            title2024: `Европейская экспансия и фокус на ИИ`,
            text2024: `Открытие базы в Испании и интеграция моделей ИИ в наши разработки, устанавливающая новые стандарты автоматизации.`,
            title2026: `Сегодня: DeepDev Global`,
            text2026: `Международная бутик-студия, специализирующаяся на заказном ПО и масштабируемых цифровых экосистемах.`,
            global: `ГЛОБАЛЬНОЕ ПРИСУТСТВИЕ`,
            globalTitle: `Талант без границ`,
            globalText: `Мы работаем из Испании и Аргентины, сочетая европейские инновации с изобретательностью и стойкостью латиноамериканских талантов.`,
            flagSpain: `🇪🇸 Испания`,
            flagArgentina: `🇦🇷 Аргентина`,
            talk: `Готовы начать трансформацию?`,
            talkButton: `Обсудить ваш проект`
        },
        raffles: {
            premiere: `Розыгрыш 2026`,
            premiereTitle: `Выводим вашу идею на новый уровень`,
            premiereText: `В честь запуска DeepDev мы разыгрываем проект по разработке Full Stack. Мы хотим, чтобы ваш проект получил достойное цифровое присутствие.`,
            performance: `Pro производительность`,
            performanceText: `Оптимизированные и сверхбыстрые сайты.`,
            design: `Эксклюзивный дизайн`,
            designText: `Интерфейс и пользовательский опыт, разработанные специально для вашего бренда.`,
            raffleTitle: `FullStack_Розыгрыш`,
            raffleText: `Участвуйте и получите шанс выиграть профессиональный сайт от DeepDev.`,
            days: `ДНЕЙ`,
            hours: `ЧАСОВ`,
            minutes: `МИН`,
            seconds: `СЕК`,
            name: `Полное имя`,
            email: `Email`,
            project: `Какой сайт вы хотите разработать?`,
            conditions: {
                before: `Я принимаю `,
                link: `условия и положения`,
                after: ` розыгрыша.`
            },
            error: `Вы должны принять условия и положения, чтобы продолжить.`,
            processing: `Генерация билета...`,
            verify: `Проверка email...`,
            analyzing: `Анализ запроса...`,
            status: `Статус: В процессе...`,
            registered: `Билет зарегистрирован!`,
            thanks: {
                before: `Спасибо. `,
                after: `Ваша заявка сохранена. Удачи!`
            },
            premio: `Приз в игре: Профессиональная веб-разработка`,
            buttonBack: `Назад`,
            button: `ПОЛУЧИТЬ БИЛЕТ УЧАСТНИКА`
        },
        contact: {
            name: `Имя:`,
            lastName: `Фамилия:`,
            companyName: `Название компании:`,
            role: `Должность в компании:`,
            email: `Email:`,
            phone: `Телефон / WhatsApp:`,
            project: `Тип проекта:`,
            projectOption: `Выберите вариант`,
            projectNew: `Новый проект`,
            projectRedisign: `Редизайн существующего сайта`,
            current: `Текущий сайт/приложение:`,
            type: [`Тип сайта/приложения:`, `Выберите вариант`, `Лендинг`, `Корпоративный сайт`, `E-commerce`, `Портфолио`, `Сайт услуг`, `Веб-платформа`, `Индивидуальная система`, `Пока не уверен`],
            projectGoal: [`Цель проекта:`, `Выберите цель`, `Получение заявок / Лидов`, `Продажа товаров или услуг`, `Укрепление бренда`, `Автоматизация процессов`, `Другое`],
            range: [`Бюджет:`, `Выберите диапазон`, `Меньше U$S 500`, `U$S 500 - U$S 1000`, `U$S 1000 - U$S 3000`, `Больше U$S 3000`, `Пока не уверен`],
            available: [`Сроки:`, `Выберите срок`, `Как можно скорее`, `1-2 месяца`, `+3 месяца`, `Гибкие сроки`],
            descriptionPlace: [`Описание проекта:`, `Расскажите подробнее о вашем проекте или идее`],
            button: `Отправить сообщение`,
        },
        nav: {
            promo: `🔥 -- Загляните в раздел розыгрышей, чтобы выиграть призы и получить скидки. -- 🔥`,
            products: `Продукты`,
            company: `Компания`,
            raffles: `Розыгрыши`,
            contact: `Контакты`,
            login: `Вход`
        },
        login: {
            title: `С возвращением`,
            text: `Войдите в свой аккаунт DeepDev`,
            email: `Email`,
            password: `Пароль`,
            button: `Войти`,
            register: {
                before: `Впервые в DeepDev? 
                `,
                after: `Создать аккаунт`
            }
        },
        footer: {
            deepdev: [`Переосмысление цифрового опыта`, `Инженерия иммерсивных интерфейсов: дизайн, движение и интеллект.`],
            navigationTitle: `НАВИГАЦИЯ`,
            expertiseTitle: `ЭКСПЕРТИЗА`,
            connectTitle: `СВЯЗЬ`,
            navigation: [`Главная`, `Продукты`, `Компания`, `Розыгрыши`, `Контакты`],
            expertise: [`Frontend-инженерия`, `3D Web-опыт`, `Интеграция ИИ`, `Backend-системы`],
            connect: [`Удаленно по всему миру`, `Телефон`],
            rights: `Все права защищены.`,
            privacy: `Политика конфиденциальности`,
            terms: `Условия использования`
        },
        language: `Язы`
    }
};
    return(
        <LanguageContext.Provider value={{ texts, language, handleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

const useLanguage = () => useContext(LanguageContext);

export default useLanguage;