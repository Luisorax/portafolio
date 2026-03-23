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

function renderHeader(site) {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const nav = [
    ['index.html', 'Inicio'],
    ['about.html', 'Sobre mí'],
    ['work.html', 'Trabajo'],
    ['services.html', 'Servicios'],
    ['philosophy.html', 'Filosofía'],
    ['contact.html', 'Contacto']
  ];

  const header = create('header', 'site-header');
  header.innerHTML = `
    <div class="header-inner">
      <a class="logo" href="index.html">${site.title}<small>${site.tagline}</small></a>
      <button class="nav-toggle" type="button" aria-expanded="false">Menú</button>
      <nav class="site-nav" aria-label="Principal">
        <ul>
          ${nav.map(([href, label]) => `<li><a href="${href}" class="${path === href ? 'active' : ''}">${label}</a></li>`).join('')}
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
}

function renderFooter(site) {
  const footer = create('footer', 'site-footer');
  footer.innerHTML = `
    <div class="footer-inner">
      <div>${site.copyright}</div>
      <div class="footer-links">
        <a href="mailto:${site.email}">Email</a>
        <a href="${site.instagram}" target="_blank" rel="noreferrer">Instagram</a>
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

function renderHome(data) {
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
        <div class="hero-side fade-in">
          <p>${home.intro_kicker}</p>
          <p style="margin-top: 14px;">${home.intro_text}</p>
          <div class="cta-row">
            <a class="button" href="${site.hero_cta_link}">${site.hero_cta_label}</a>
            <a class="button-secondary" href="${site.hero_secondary_link}">${site.hero_secondary_label}</a>
          </div>
          <div class="admin-note">Después podrás editar estos textos desde <strong>/admin</strong> sin tocar HTML.</div>
        </div>
      </div>
    </section>

    <section class="section wrap fade-in">
      <div class="split">
        <div>
          <div class="kicker">${home.featured_title}</div>
          <h2 class="section-title">Una portada más limpia, con más aire y más intención.</h2>
        </div>
        <div class="lead">${home.featured_text}</div>
      </div>
      <div class="card-grid" style="margin-top: 34px;">
        ${home.featured_projects.map((item) => `
          <article class="card">
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
            <p><strong>Explora:</strong> ${item.explores}</p>
            <p><strong>Enfoque:</strong> ${item.approach}</p>
            <p><strong>Contexto:</strong> ${item.context}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderServices(data) {
  const { services } = data;
  const main = qs('#app');
  main.innerHTML = `
    <section class="page-hero wrap fade-in">
      <div class="kicker">${services.eyebrow}</div>
      <h1>${services.title}</h1>
      <div class="page-intro">${services.intro}</div>
    </section>
    <section class="section wrap">
      <div class="card-grid">
        ${services.items.map((item) => `
          <article class="service-card fade-in">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderPhilosophy(data) {
  const { philosophy } = data;
  const main = qs('#app');
  main.innerHTML = `
    <section class="page-hero wrap fade-in">
      <div class="kicker">${philosophy.eyebrow}</div>
      <h1>${philosophy.title}</h1>
    </section>
    <section class="section wrap">
      <div class="philosophy-block fade-in">
        ${philosophy.paragraphs.map((p) => `<p class="lead" style="font-size:clamp(1.15rem, 2vw, 1.5rem);">${p}</p>`).join('')}
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
            <label for="name">Nombre</label>
            <input id="name" name="name" required>
          </div>
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required>
          </div>
          <div>
            <label for="project">Tipo de proyecto</label>
            <select id="project" name="project">
              <option>Documental</option>
              <option>Editorial</option>
              <option>Marca / travel narrative</option>
              <option>Expedición</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label for="message">Mensaje</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button class="button" type="submit">Enviar</button>
        </form>
      </div>
    </section>
  `;
}

const renderers = {
  home: renderHome,
  about: renderAbout,
  work: renderWork,
  services: renderServices,
  philosophy: renderPhilosophy,
  contact: renderContact
};

(async function init() {
  try {
    const data = await loadContent();
    renderHeader(data.site);
    const page = document.body.dataset.page || 'home';
    document.title = `${data.site.title} — ${page === 'home' ? data.site.tagline : page.charAt(0).toUpperCase() + page.slice(1)}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = data.site.seo_description;
    renderers[page](data);
    renderFooter(data.site);
    revealOnScroll();
  } catch (error) {
    qs('#app').innerHTML = `<section class="section wrap"><h1>Error</h1><p>${error.message}</p></section>`;
    console.error(error);
  }
})();
