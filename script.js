/* =============================================
   SCRIPT — Víctor Ruiz Esteban Portfolio
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMenu();
    initActiveSection();
    initLanguageToggle();
    initCurrentYear();
});

/* =============================================
   HEADER (línea inferior al hacer scroll)
   ============================================= */
function initHeader() {
    const header = document.querySelector('.site-header');
    const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* =============================================
   MENÚ MÓVIL
   ============================================= */
function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('site-nav');

    const close = () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            close();
            toggle.focus();
        }
    });
}

/* =============================================
   SECCIÓN ACTIVA EN EL MENÚ
   ============================================= */
function initActiveSection() {
    const links = document.querySelectorAll('.nav-link');
    const sections = [...links].map(link => document.querySelector(link.getAttribute('href')));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => section && observer.observe(section));
}

/* =============================================
   IDIOMA (i18n)
   ============================================= */

const translations = {
    es: {
        skip: 'Saltar al contenido',
        nav_work: 'Proyectos',
        nav_path: 'Trayectoria',
        nav_skills: 'Habilidades',
        nav_contact: 'Contacto',
        menu: 'Menú',

        hero_role: 'Técnico en sistemas, desarrollo y automatización con IA',
        hero_lead: 'Titulado en DAM y SMR. Perfil técnico que une sistemas y redes, desarrollo de aplicaciones y automatización de procesos con IA. Experiencia con workflows de n8n, APIs REST y despliegue en cloud, además de soporte técnico y mantenimiento de redes.',
        cta_cv: 'Descargar CV',
        cta_mail: 'Escríbeme',

        area1_name: 'Sistemas y redes',
        area1_proof: 'Grado Medio en SMR y prácticas como técnico de sistemas en Abai: soporte, redes y mantenimiento.',
        area2_name: 'Desarrollo',
        area2_proof: 'Grado Superior en DAM: programación, bases de datos y desarrollo web y móvil, con PokéLab como proyecto final.',
        area3_name: 'Automatización e IA',
        area3_proof: 'Workflows de n8n con IA, APIs REST y despliegue en cloud en Valvia.',

        work_title: 'Proyectos',
        p0_meta: 'Ciberseguridad · Proyecto personal · 2026',
        p0_desc: 'Herramienta que analiza logs de SSH y de servidores web, detecta ataques como fuerza bruta, inyección SQL o XSS, y explica cada uno en lenguaje claro junto a su técnica de MITRE ATT&CK. Incluye panel en directo, informes, alertas con n8n y una demo que funciona en el navegador.',
        p0_demo: 'Probar la demo',
        p0_code: 'Ver el código',
        p1_meta: 'Proyecto final de DAM · 2026',
        p1_desc: 'Aplicación web con Pokédex, constructor de equipos, calculadora de daño y el minijuego Pokédle. Frontend en React y TypeScript sobre una API en Spring Boot con PostgreSQL.',
        p1_link: 'Ver el código en GitHub',
        p2_meta: 'Web corporativa · Valvia · 2026',
        p2_desc: 'Web de Valvia, empresa de automatización con IA. Diseño de la web y desarrollo de su asistente con IA, que responde las dudas de los visitantes.',
        p2_link: 'Visitar valvia.es',

        path_title: 'Trayectoria',
        e1_date: 'feb. 2026 – may. 2026',
        e1_type: 'Contrato de prácticas · En remoto',
        e1_desc: 'Automatización de procesos con workflows de n8n que integran modelos de IA, APIs REST y servicios cloud.',
        e2_date: 'sept. 2024 – jun. 2026',
        e2_title: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
        e2_desc: 'Programación, bases de datos, desarrollo web y móvil, metodologías ágiles. Proyecto final: PokéLab.',
        e3_date: 'abr. 2024 – jun. 2024',
        e3_title: 'Técnico de sistemas en prácticas',
        e3_type: 'Jornada completa · Madrid · Presencial',
        e3_desc: 'Soporte técnico, gestión de redes y mantenimiento de equipos, trabajando con perfiles senior y trato directo con cliente.',
        e4_date: 'sept. 2022 – jun. 2024',
        e4_title: 'Grado Medio en Sistemas Microinformáticos y Redes (SMR)',
        e4_desc: 'Hardware, redes, sistemas operativos y soporte técnico.',

        skills_title: 'Habilidades',
        sk_lang: 'Lenguajes',
        sk_fw: 'Frameworks',
        sk_auto: 'Automatización e IA',
        sk_db: 'Bases de datos',
        sk_sys: 'Sistemas',
        sk_tools: 'Herramientas',
        sk_langs: 'Idiomas',
        sk_api: 'APIs REST',
        sk_cloud: 'Despliegue en cloud',
        sk_sec: 'Ciberseguridad',
        sk_logs: 'Análisis de logs',
        sk_ids: 'Detección de intrusiones',
        sk_net: 'Redes',
        sk_support: 'Soporte técnico',
        lang_es: 'Español nativo',
        lang_en: 'Inglés B2',

        contact_title: '¿Hablamos?',
        contact_lead: 'Para cualquier consulta, escríbeme o descarga mi CV.',
        contact_phone: 'Teléfono',
        contact_cv: 'Descargar PDF',
        to_top: 'Volver arriba'
    },
    en: {
        skip: 'Skip to content',
        nav_work: 'Projects',
        nav_path: 'Background',
        nav_skills: 'Skills',
        nav_contact: 'Contact',
        menu: 'Menu',

        hero_role: 'Systems, development and AI automation technician',
        hero_lead: 'Qualified in Multiplatform App Development (DAM) and Computer Systems & Networks (SMR). A technical profile combining systems and networks, application development and AI process automation. Experience with n8n workflows, REST APIs and cloud deployment, as well as technical support and network maintenance.',
        cta_cv: 'Download CV',
        cta_mail: 'Email me',

        area1_name: 'Systems & networks',
        area1_proof: 'Vocational degree in SMR and a systems technician internship at Abai: support, networking and maintenance.',
        area2_name: 'Development',
        area2_proof: 'Higher vocational degree in DAM: programming, databases and web and mobile development, with PokéLab as the final project.',
        area3_name: 'Automation & AI',
        area3_proof: 'n8n workflows with AI, REST APIs and cloud deployment at Valvia.',

        work_title: 'Projects',
        p0_meta: 'Cybersecurity · Personal project · 2026',
        p0_desc: 'A tool that analyses SSH and web server logs, detects attacks such as brute force, SQL injection or XSS, and explains each one in plain language alongside its MITRE ATT&CK technique. Includes a live dashboard, reports, n8n alerts and a demo that runs in the browser.',
        p0_demo: 'Try the demo',
        p0_code: 'View the code',
        p1_meta: 'DAM final project · 2026',
        p1_desc: 'Web app with a Pokédex, team builder, damage calculator and the Pokédle mini-game. React and TypeScript frontend on a Spring Boot API with PostgreSQL.',
        p1_link: 'View the code on GitHub',
        p2_meta: 'Corporate website · Valvia · 2026',
        p2_desc: 'Website for Valvia, an AI automation company. Site design and development of its AI assistant, which answers visitors’ questions.',
        p2_link: 'Visit valvia.es',

        path_title: 'Background',
        e1_date: 'Feb 2026 – May 2026',
        e1_type: 'Internship contract · Remote',
        e1_desc: 'Process automation with n8n workflows integrating AI models, REST APIs and cloud services.',
        e2_date: 'Sep 2024 – Jun 2026',
        e2_title: 'Higher Vocational Degree in Multiplatform App Development (DAM)',
        e2_desc: 'Programming, databases, web and mobile development, agile methods. Final project: PokéLab.',
        e3_date: 'Apr 2024 – Jun 2024',
        e3_title: 'Systems technician intern',
        e3_type: 'Full-time · Madrid · On-site',
        e3_desc: 'Technical support, network management and equipment maintenance, working with senior staff and directly with clients.',
        e4_date: 'Sep 2022 – Jun 2024',
        e4_title: 'Vocational Degree in Computer Systems and Networks (SMR)',
        e4_desc: 'Hardware, networking, operating systems and technical support.',

        skills_title: 'Skills',
        sk_lang: 'Languages',
        sk_fw: 'Frameworks',
        sk_auto: 'Automation & AI',
        sk_db: 'Databases',
        sk_sys: 'Systems',
        sk_tools: 'Tools',
        sk_langs: 'Spoken languages',
        sk_api: 'REST APIs',
        sk_cloud: 'Cloud deployment',
        sk_sec: 'Cybersecurity',
        sk_logs: 'Log analysis',
        sk_ids: 'Intrusion detection',
        sk_net: 'Networking',
        sk_support: 'Technical support',
        lang_es: 'Spanish (native)',
        lang_en: 'English (B2)',

        contact_title: 'Let’s talk',
        contact_lead: 'For any enquiry, email me or download my CV.',
        contact_phone: 'Phone',
        contact_cv: 'Download PDF',
        to_top: 'Back to top'
    }
};

function initLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    let currentLang = 'es';
    try {
        currentLang = localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'es';
    } catch (e) { /* sin almacenamiento: se queda en español */ }

    applyLanguage(currentLang);

    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        try {
            localStorage.setItem('portfolio-lang', currentLang);
        } catch (e) { /* ignorar */ }
        applyLanguage(currentLang);
    });
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    const other = lang === 'es' ? 'en' : 'es';
    document.getElementById('lang-current').textContent = lang.toUpperCase();
    document.getElementById('lang-other').textContent = other.toUpperCase();
    document.getElementById('lang-toggle').setAttribute('aria-label',
        lang === 'es' ? 'Switch to English' : 'Cambiar a español');
}

/* =============================================
   AÑO ACTUAL
   ============================================= */
function initCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
