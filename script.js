
async function loadContent() {
  const response = await fetch('content/site.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudo cargar el contenido editable.');
  return response.json();
}

function qs(sel) { return document.querySelector(sel); }
function create(el, className, text) {
  const node = document.createElement(el);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const pageKey = document.body.dataset.page || 'home';
const pageFiles = { home: 'index.html', about: 'about.html', work: 'work.html', services: 'services.html', contact: 'contact.html' };

function getLanguage() {
  if (window.location.pathname.startsWith('/en')) return 'en';
  const saved = localStorage.getItem('site_lang');
  if (saved === 'en' || saved === 'es') return saved;
  return 'es';
}

function buildHref(page, lang) {
  const esPaths = { home: '/', about: '/sobre-mi', work: '/trabajo', services: '/servicios', contact: '/contacto' };
  const enPaths = { home: '/en', about: '/en/about', work: '/en/work', services: '/en/services', contact: '/en/contact' };
  return (lang === 'en' ? enPaths : esPaths)[page] || '/';
}

function altLanguage(lang) { return lang === 'es' ? 'en' : 'es'; }

function renderHeader(site, lang) {
  const nav = [
    ['about', site.nav.about],
    ['work', site.nav.work],
    ['services', site.nav.services],
    ['contact', site.nav.contact]
  ];

  const header = create('header', 'site-header');
  header.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="${buildHref('home', lang)}" aria-label="Home">${site.title}<small>${site.tagline}</small></a>
      <div class="header-actions">
        <button class="nav-toggle" type="button" aria-expanded="false">Menú</button>
        <a class="lang-switch" href="${buildHref(pageKey, altLanguage(lang))}" data-lang="${altLanguage(lang)}">${site.lang_switch}</a>
      </div>
      <nav class="site-nav" aria-label="Principal">
        <ul>
          ${nav.map(([page, label]) => `<li><a href="${buildHref(page, lang)}" class="${pageKey === page ? 'active' : ''}">${label}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  `;
  document.body.prepend(header);
  const toggle = header.querySelector('.nav-toggle');
  const siteNav = header.querySelector('.site-nav');
  toggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(siteNav.classList.contains('open')));
  });
  const langSwitch = header.querySelector('.lang-switch');
  langSwitch.addEventListener('click', () => {
    localStorage.setItem('site_lang', altLanguage(lang));
  });
}

function renderFooter(site) {
  const footer = create('footer', 'site-footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div>${site.copyright}</div>
      <div class="footer-links">
        <a href="mailto:${site.email}">${site.footer.email}</a>
        <a href="${site.instagram}" target="_blank" rel="noreferrer">${site.footer.instagram}</a>
        <a href="${site.brand}" target="_blank" rel="noreferrer">${site.brand_name}</a>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

function revealOnScroll() {
  const items = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => obs.observe(item));
}

function renderHome(data, lang) {
  const { site, home } = data;
  const main = qs('#app');
  main.innerHTML = `
    <section class="hero wrap">
      <div class="hero-grid">
        <div class="hero-copy fade-in">
          <div class="kicker">${site.hero_label}</div>
          <h1>${site.hero_title}</h1>
          <div class="hero-intro">${site.hero_intro}</div>
        </div>
        <aside class="hero-side fade-in">
          <div class="hero-side-inner">
            <p class="hero-side-kicker">${home.intro_kicker}</p>
            <p>${home.intro_text}</p>
            <div class="cta-row">
              <a class="button" href="${site.hero_cta_link}">${site.hero_cta_label}</a>
              <a class="button-secondary" href="${site.hero_secondary_link}">${site.hero_secondary_label}</a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section wrap fade-in home-featured">
      <div class="split home-intro-block">
        <div>
          <div class="kicker">${home.featured_title}</div>
          <h2 class="section-title">${home.featured_heading}</h2>
        </div>
        <div class="lead">${home.featured_text}</div>
      </div>
      <div class="card-grid featured-grid" style="margin-top: 34px;">
        ${home.featured_projects.map((item) => `
          <article class="card featured-card">
            <div class="meta">${item.meta}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAbout(data) {
  const { about } = data;
  const main = qs('#app');
  main.innerHTML = `
    <section class="page-hero wrap fade-in">
      <div class="kicker">${about.eyebrow}</div>
      <h1>${about.title}</h1>
      <div class="page-intro">${about.lead}</div>
    </section>
    <section class="section wrap">
      <div class="split">
        <div class="highlight-box fade-in">
          <div class="kicker">${about.highlight_title}</div>
          <ul>${about.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="stack fade-in">
          ${about.paragraphs.map((p) => `<p>${p}</p>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderWork(data) {
  const { work } = data;
  const main = qs('#app');
  main.innerHTML = `
    <section class="page-hero wrap fade-in">
      <div class="kicker">${work.eyebrow}</div>
      <h1>${work.title}</h1>
      <div class="page-intro">${work.intro}</div>
    </section>
    <section class="section wrap">
      <div class="project-list">
        ${work.projects.map((item) => `
          <article class="project-card fade-in">
            <div class="meta">${item.location} · ${item.year} · ${item.format}</div>
            <h3>${item.title}</h3>
            <p>${item.intro}</p>
            <p><strong>${work.labels.explores}:</strong> ${item.explores}</p>
            <p><strong>${work.labels.approach}:</strong> ${item.approach}</p>
            <p><strong>${work.labels.context}:</strong> ${item.context}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderServices(data) {
  const { services } = data;
  const main = qs('#app');
  const first = services.items[0];
  const rest = services.items.slice(1);
  main.innerHTML = `
    <section class="page-hero wrap fade-in services-hero">
      <div class="kicker">${services.eyebrow}</div>
      <h1>${services.title}</h1>
      <div class="page-intro">${services.intro}</div>
    </section>
    <section class="section wrap services-layout">
      <article class="service-feature fade-in">
        <div class="meta">${services.feature_meta}</div>
        <h2>${first.title}</h2>
        <p class="lead">${first.text}</p>
      </article>
      <div class="services-grid-advanced">
        ${rest.map((item, index) => `
          <article class="service-card service-card-premium fade-in ${index % 3 === 0 ? 'wide' : ''}">
            <div class="service-card-top">
              <span class="service-index">0${index + 2}</span>
              <div class="service-rule"></div>
            </div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderContact(data) {
  const { contact } = data;
  const main = qs('#app');
  const details = contact.contact_items.map((item) => {
    let value = item.value;
    if (item.type === 'email') value = `<a href="mailto:${item.value}">${item.value}</a>`;
    if (item.type === 'url') value = `<a href="${item.value}" target="_blank" rel="noreferrer">${item.value.replace('https://', '')}</a>`;
    return `<div><div class="contact-item-label">${item.label}</div><div class="contact-item-value">${value}</div></div>`;
  }).join('');

  main.innerHTML = `
    <section class="page-hero wrap fade-in">
      <div class="kicker">${contact.eyebrow}</div>
      <h1>${contact.title}</h1>
      <div class="page-intro">${contact.intro}</div>
    </section>
    <section class="section wrap">
      <div class="contact-grid">
        <div class="contact-list fade-in">
          ${details}
          <p>${contact.note}</p>
        </div>
        <form class="contact-form fade-in" name="contacto" method="POST" action="${contact.formspree_endpoint}">
          <div>
            <label for="name">${contact.form.name}</label>
            <input id="name" name="name" required>
          </div>
          <div>
            <label for="email">${contact.form.email}</label>
            <input id="email" name="email" type="email" required>
          </div>
          <div>
            <label for="project">${contact.form.project}</label>
            <select id="project" name="project">
              ${contact.form.options.map((option) => `<option>${option}</option>`).join('')}
            </select>
          </div>
          <div>
            <label for="message">${contact.form.message}</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button class="button" type="submit">${contact.form.send}</button>
        </form>
      </div>
    </section>
  `;
}

const renderers = { home: renderHome, about: renderAbout, work: renderWork, services: renderServices, contact: renderContact };

(async function init() {
  try {
    const allData = await loadContent();
    const lang = getLanguage();
    const data = {
      site: allData.site[lang],
      home: allData.home[lang],
      about: allData.about[lang],
      work: allData.work[lang],
      services: allData.services[lang],
      contact: allData.contact[lang]
    };
    document.documentElement.lang = lang;
    renderHeader(data.site, lang);
    const pageTitles = {
      es: { home: data.site.title, about: 'Sobre mí', work: 'Trabajo', services: 'Servicios', contact: 'Contacto' },
      en: { home: data.site.title, about: 'About', work: 'Work', services: 'Services', contact: 'Contact' }
    };
    document.title = `${data.site.title} — ${pageTitles[lang][pageKey] || data.site.tagline}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = data.site.seo_description;
    if (!renderers[pageKey]) throw new Error('Esta página ya no está disponible.');
    renderers[pageKey](data, lang);
    renderFooter(data.site);
    revealOnScroll();
  } catch (error) {
    qs('#app').innerHTML = `<section class="section wrap"><h1>Error</h1><p>${error.message}</p></section>`;
    console.error(error);
  }
})();
