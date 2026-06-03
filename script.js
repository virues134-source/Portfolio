/* =============================================
   SCRIPT — Víctor Ruiz Esteban Portfolio
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initHamburger();
    initTypingEffect();
    initScrollReveal();
    initTiltCards();
    initContactForm();
    initLanguageToggle();
    initCurrentYear();
});

/* =============================================
   PARTICLE SYSTEM
   ============================================= */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 120;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += dx * force * 0.02;
                    this.y += dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163, 117, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(PARTICLE_COUNT, Math.floor((width * height) / 20000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(163, 117, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }

            // Close mobile menu
            const navLinksContainer = document.getElementById('nav-links');
            const hamburger = document.getElementById('hamburger');
            navLinksContainer.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   HAMBURGER
   ============================================= */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on overlay click
    navLinks.addEventListener('click', (e) => {
        if (e.target === navLinks) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* =============================================
   TYPING EFFECT
   ============================================= */
function initTypingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const currentLang = localStorage.getItem('portfolio-lang') || 'es';
    const phrases = getTypingPhrases(currentLang);

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 80;

    function type() {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === current.length) {
                isDeleting = true;
                speed = 2000; // Pause at end
            } else {
                speed = 60 + Math.random() * 40;
            }
        } else {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 400;
            } else {
                speed = 30;
            }
        }

        setTimeout(type, speed);
    }

    type();
}

function getTypingPhrases(lang) {
    const phrases = {
        es: [
            'Desarrollador Full-Stack',
            'Especialista en Soluciones de IA',
            'Técnico Superior en DAM',
            'Apasionado por la tecnología'
        ],
        en: [
            'Full-Stack Developer',
            'AI Solutions Specialist',
            'Software Engineering Graduate',
            'Passionate about technology'
        ]
    };
    return phrases[lang] || phrases.es;
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}


/* =============================================
   TILT CARDS (3D effect)
   ============================================= */
function initTiltCards() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name');
        const email = document.getElementById('form-email');
        const message = document.getElementById('form-message');
        const status = document.getElementById('form-status');
        let valid = true;

        // Reset
        [name, email, message].forEach(field => {
            field.parentElement.classList.remove('error');
        });

        // Validate name
        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            valid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.parentElement.classList.add('error');
            valid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            message.parentElement.classList.add('error');
            valid = false;
        }

        if (valid) {
            const lang = localStorage.getItem('portfolio-lang') || 'es';
            status.className = 'form-status success';
            status.textContent = lang === 'es'
                ? '¡Mensaje enviado correctamente! (Demo)'
                : 'Message sent successfully! (Demo)';
            form.reset();

            setTimeout(() => {
                status.textContent = '';
                status.className = 'form-status';
            }, 5000);
        }
    });

    // Remove error on input
    ['form-name', 'form-email', 'form-message'].forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', () => {
                field.parentElement.classList.remove('error');
            });
        }
    });
}

/* =============================================
   LANGUAGE TOGGLE (i18n)
   ============================================= */

const translations = {
    es: {
        // Nav
        nav_about: 'Sobre mí',
        nav_skills: 'Habilidades',
        nav_languages: 'Idiomas',
        nav_projects: 'Proyectos',
        nav_resume: 'Trayectoria',
        nav_contact: 'Contacto',

        // Hero
        hero_greeting: 'Hola, soy',
        hero_description: 'Desarrollador de soluciones de IA, especializado en sistemas informáticos y gestión de redes. Apasionado por la tecnología y el aprendizaje continuo.',
        hero_cta_contact: '<i class="ph ph-paper-plane-tilt"></i> Contactar',
        hero_cta_projects: '<i class="ph ph-code"></i> Ver proyectos',
        hero_cta_cv: '<i class="ph ph-download-simple"></i> Descargar CV',

        // About
        about_title: 'Sobre mí',
        about_card_title: '<i class="ph ph-identification-badge"></i> Perfil',
        about_p1: 'Soy un desarrollador de software titulado en Desarrollo de Aplicaciones Multiplataforma (DAM) y Sistemas Microinformáticos y Redes (SMR) en La Inmaculada - Padres Escolapios. Apasionado por la tecnología, la inteligencia artificial y el desarrollo de soluciones innovadoras, siempre en búsqueda de nuevos retos para poner a prueba mis habilidades y expandir mis conocimientos.',
        about_p2: 'Mi experiencia más reciente fue como AI Solutions Developer en Valvia, donde desarrollé e implementé soluciones de IA y Machine Learning, automatización de procesos con n8n y creación de workflows integrando APIs y servicios cloud. En esta etapa adquirí sólidas habilidades en arquitecturas modernas y escalables. También realicé prácticas en Abai en el área de sistemas informáticos, donde afiancé mi conocimiento sobre redes y soporte IT.',
        about_p3: 'Busco oportunidades donde pueda aportar mi energía, mis ganas de aprender y mi conocimiento técnico para crecer profesionalmente en un entorno dinámico. Me considero una persona resolutiva, con facilidad para el trabajo en equipo y una gran capacidad de adaptación ante los cambios tecnológicos.',
        about_soft_title: '<i class="ph ph-sparkle"></i> Soft Skills',
        soft_proactive: 'Proactividad',
        soft_teamwork: 'Trabajo en equipo',
        soft_creativity: 'Creatividad',
        soft_problem_solving: 'Resolución de problemas',
        soft_learning: 'Aprendizaje continuo',
        soft_adaptability: 'Adaptabilidad',

        // Skills
        skills_title: 'Habilidades técnicas',
        skills_languages: 'Lenguajes de programación',
        skills_frameworks: 'Frameworks & Librerías',
        skills_tools: 'Herramientas & DevOps',
        skills_databases: 'Bases de Datos',

        // Languages
        languages_title: 'Idiomas',
        lang_es_level: 'Nativo',
        lang_en: 'Inglés',
        lang_en_level: 'B2 - Intermedio Alto',

        // Projects
        projects_title: 'Proyectos',
        projects_subtitle: 'Aquí encontrarás algunos de los proyectos en los que he trabajado.',
        project1_title: 'PokéLab (TFG)',
        project1_desc: 'Tu nexo definitivo con el mundo Pokémon. Pokédex avanzada, constructor de equipos, calculadora de daño, Pokédle y mucho más. Trabajo de Fin de Grado.',
        project2_title: 'Valvia.es',
        project2_desc: 'Web corporativa de Valvia, empresa de automatización inteligente con IA para empresas. Diseño moderno con SEO optimizado y rendimiento premium.',
        project3_title: 'Próximo proyecto',
        project3_desc: 'Descripción del proyecto próximamente. Este espacio está reservado para futuras adiciones.',

        // Resume (Experience & Education)
        resume_title: 'Experiencia y Formación',
        experience_title: 'Experiencia',
        exp1_date: 'feb. 2026 — may. 2026',
        exp1_title: 'AI Solutions Developer',
        exp1_type: 'Contrato de prácticas · En remoto',
        exp1_desc: 'Desarrollo e implementación de soluciones de Inteligencia Artificial y Machine Learning. Automatización de procesos y creación de workflows con n8n, integrando APIs y servicios cloud.',
        education_title: 'Formación',
        edu1_date: 'sept. 2024 — jun. 2026',
        edu1_title: 'Grado Superior en DAM',
        edu1_desc: 'Desarrollo de Aplicaciones Multiplataforma. Formación en programación, bases de datos, desarrollo web y móvil, y metodologías ágiles.',
        exp2_date: 'abr. 2024 — jun. 2024',
        exp2_title: 'Becario — Sistemas Informáticos',
        exp2_type: 'Jornada completa · Madrid · Presencial',
        exp2_desc: 'Prácticas de Grado Medio en Sistemas Microinformáticos y Redes. Soporte técnico, gestión de redes y mantenimiento de sistemas informáticos.',
        edu2_date: 'sept. 2022 — jun. 2024',
        edu2_title: 'Grado Medio en SMR',
        edu2_desc: 'Sistemas Microinformáticos y Redes. Formación en hardware, redes, sistemas operativos y soporte técnico.',

        // Contact
        contact_title: 'Contacto',
        contact_subtitle: '¿Tienes un proyecto en mente o quieres charlar? ¡No dudes en contactarme!',
        contact_email_label: 'Email',
        contact_phone_label: 'Teléfono',
        contact_location_label: 'Ubicación',
        contact_location: 'España',
        form_name: 'Nombre',
        form_email: 'Email',
        form_message: 'Mensaje',
        form_send: 'Enviar mensaje',
        form_name_error: 'Por favor, introduce tu nombre',
        form_email_error: 'Por favor, introduce un email válido',
        form_message_error: 'Por favor, escribe un mensaje',

        // Footer
        footer_rights: 'Todos los derechos reservados.'
    },
    en: {
        // Nav
        nav_about: 'About me',
        nav_skills: 'Skills',
        nav_languages: 'Languages',
        nav_projects: 'Projects',
        nav_resume: 'Career Path',
        nav_contact: 'Contact',

        // Hero
        hero_greeting: "Hi, I'm",
        hero_description: 'AI Solutions Developer, specialized in computer systems and network management. Passionate about technology and continuous learning.',
        hero_cta_contact: '<i class="ph ph-paper-plane-tilt"></i> Contact me',
        hero_cta_projects: '<i class="ph ph-code"></i> View projects',
        hero_cta_cv: '<i class="ph ph-download-simple"></i> Download CV',

        // About
        about_title: 'About me',
        about_card_title: '<i class="ph ph-identification-badge"></i> Profile',
        about_p1: "I'm a software developer with degrees in Multi-platform Application Development (DAM) and Computer Systems & Networks (SMR) from La Inmaculada - Padres Escolapios. Passionate about technology, artificial intelligence, and developing innovative solutions, always looking for new challenges to test my skills and expand my knowledge.",
        about_p2: 'My most recent experience was as an AI Solutions Developer at Valvia, where I developed and implemented AI and Machine Learning solutions, automated processes with n8n, and created workflows integrating APIs and cloud services. During this stage I acquired solid skills in modern and scalable architectures. I also completed an internship at Abai in computer systems, where I strengthened my knowledge of networking and IT support.',
        about_p3: "I'm looking for opportunities where I can contribute my energy, eagerness to learn, and technical knowledge to grow professionally in a dynamic environment. I consider myself a proactive person, with a talent for teamwork and a great ability to adapt to technological changes.",
        about_soft_title: '<i class="ph ph-sparkle"></i> Soft Skills',
        soft_proactive: 'Proactivity',
        soft_teamwork: 'Teamwork',
        soft_creativity: 'Creativity',
        soft_problem_solving: 'Problem Solving',
        soft_learning: 'Continuous Learning',
        soft_adaptability: 'Adaptability',

        // Skills
        skills_title: 'Technical Skills',
        skills_languages: 'Programming Languages',
        skills_frameworks: 'Frameworks & Libraries',
        skills_tools: 'Tools & DevOps',
        skills_databases: 'Databases',

        // Languages
        languages_title: 'Languages',
        lang_es_level: 'Native',
        lang_en: 'English',
        lang_en_level: 'B2 - Upper Intermediate',

        // Projects
        projects_title: 'Projects',
        projects_subtitle: "Here you'll find some of the projects I've worked on.",
        project1_title: 'PokéLab (Final Project)',
        project1_desc: 'Your ultimate connection to the Pokémon world. Advanced Pokédex, team builder, damage calculator, Pokédle and much more. Final Degree Project.',
        project2_title: 'Valvia.es',
        project2_desc: 'Corporate website for Valvia, an AI-powered intelligent automation company for businesses. Modern design with optimized SEO and premium performance.',
        project3_title: 'Coming soon',
        project3_desc: 'Project description coming soon. This space is reserved for future additions.',

        // Resume (Experience & Education)
        resume_title: 'Experience & Education',
        experience_title: 'Experience',
        exp1_date: 'Feb 2026 — May 2026',
        exp1_title: 'AI Solutions Developer',
        exp1_type: 'Internship · Remote',
        exp1_desc: 'Development and implementation of AI and Machine Learning solutions. Process automation and workflow creation with n8n, integrating APIs and cloud services.',
        education_title: 'Education',
        edu1_date: 'Sept 2024 — Jun 2026',
        edu1_title: 'Higher Degree in DAM',
        edu1_desc: 'Multi-platform Application Development. Training in programming, databases, web and mobile development, and agile methodologies.',
        exp2_date: 'Apr 2024 — Jun 2024',
        exp2_title: 'Intern — Computer Systems',
        exp2_type: 'Full-time · Madrid · On-site',
        exp2_desc: 'Internship in Computer Systems and Networks. Technical support, network management, and computer systems maintenance.',
        edu2_date: 'Sept 2022 — Jun 2024',
        edu2_title: 'Associate Degree in SMR',
        edu2_desc: 'Computer Systems and Networks. Training in hardware, networking, operating systems, and technical support.',

        // Contact
        contact_title: 'Contact',
        contact_subtitle: 'Have a project in mind or want to chat? Feel free to reach out!',
        contact_email_label: 'Email',
        contact_phone_label: 'Phone',
        contact_location_label: 'Location',
        contact_location: 'Spain',
        form_name: 'Name',
        form_email: 'Email',
        form_message: 'Message',
        form_send: 'Send message',
        form_name_error: 'Please enter your name',
        form_email_error: 'Please enter a valid email',
        form_message_error: 'Please write a message',

        // Footer
        footer_rights: 'All rights reserved.'
    }
};

function initLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');
    let currentLang = localStorage.getItem('portfolio-lang') || 'es';

    // Apply saved language
    if (currentLang === 'en') {
        applyLanguage('en');
        label.textContent = 'ES';
    }

    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('portfolio-lang', currentLang);
        label.textContent = currentLang === 'es' ? 'EN' : 'ES';
        applyLanguage(currentLang);

        // Update typing effect
        const typingEl = document.getElementById('typing-text');
        if (typingEl) typingEl.textContent = '';
    });
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.documentElement.lang = lang === 'es' ? 'es' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            // Check if translation contains HTML (icons)
            if (t[key].includes('<i ')) {
                el.innerHTML = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
}

/* =============================================
   CURRENT YEAR
   ============================================= */
function initCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
