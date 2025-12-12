/**
 * Personal Website - Main JavaScript
 * Handles dynamic content loading, navigation, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

let currentLang = localStorage.getItem('selectedLanguage') || 'en';

/**
 * Initialize Application
 */
function initApp() {
  // 1. Check for data
  if (typeof window.contentData === 'undefined') {
    console.error('contentData is undefined. Ensure content.js is loaded.');
    return;
  }

  // 2. Initial Render
  renderAll(currentLang);

  // 3. Setup Event Listeners
  setupNavigation();
  setupLanguageToggle();
  setupScrollAnimations();
}

/**
 * Render All Content Sections
 */
function renderAll(lang) {
  const data = window.contentData;
  if (!data) return;

  renderHero(lang);
  renderAbout(lang);
  renderSkills(lang);
  renderExperience(lang);
  renderProjects(lang);
  renderPublications(lang);
  renderCommonUI(lang);

  // Update Language Buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function renderCommonUI(lang) {
  const data = window.contentData;

  // Nav
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key.startsWith('nav_')) {
      const navKey = key.replace('nav_', '');
      if (data.navigation[navKey]) el.textContent = data.navigation[navKey][lang];
    } else if (key.startsWith('footer_')) {
      // Handle footer specifically if needed or generic
      if (key === 'footer_copyright') el.textContent = data.footer.copyright[lang];
      if (key === 'footer_back_to_top') el.textContent = data.footer.backToTop[lang];
    }
  });

  // Section Titles are handled within individual render functions or here if generic
  const titleMap = {
    'about_title': data.about.title,
    'skills_title': data.skills.title,
    'exp_title': data.experience.title,
    'projects_title': data.projects.title,
    'pubs_title': data.publications.title,
    'contact_title': data.contact.title,
    'contact_intro': data.contact.intro
  };

  for (const [key, valueObj] of Object.entries(titleMap)) {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el && valueObj) {
      el.textContent = valueObj[lang] || valueObj;
    }
  }

  // Buttons / CTAs
  const ctaMap = {
    'hero_cta_cv': data.ui.downloadCV,
    'hero_cta_contact': data.ui.contactMe
  };
  for (const [key, valueObj] of Object.entries(ctaMap)) {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el && valueObj) {
      el.textContent = valueObj[lang];
    }
  }
}

/**
 * Render Hero Section
 */
function renderHero(lang) {
  const hero = window.contentData.personal;

  // Text
  document.querySelector('.hero-content h1').textContent = hero.name[lang];
  document.querySelector('.hero-tagline').textContent = hero.tagline[lang];
  document.querySelector('.hero-description').textContent = hero.description[lang];

  // Image
  const avatar = document.querySelector('.hero-avatar img');
  if (avatar && hero.avatar) avatar.src = hero.avatar;

  // CV Link
  const cvBtn = document.querySelector('.btn-primary[download]');
  if (cvBtn && hero.cv[lang]) cvBtn.href = hero.cv[lang];
}

/**
 * Render About Section
 */
function renderAbout(lang) {
  const data = window.contentData.about;
  const container = document.getElementById('about-text');
  if (!container) return;

  container.innerHTML = data.paragraphs[lang]
    .map(p => `<p>${p}</p>`)
    .join('');

  // Info Cards
  const cardsContainer = document.getElementById('info-cards');
  if (!cardsContainer) return;

  // Convert infoCards object to array for easier mapping
  const infoCards = [
    data.infoCards.location,
    data.infoCards.fields,
    data.infoCards.status,
    data.infoCards.languages
  ];

  cardsContainer.innerHTML = infoCards.map(info => `
    <div class="info-card">
      <h4>${info.label[lang]}</h4>
      <p>${info.value[lang] || info.value}</p>
    </div>
  `).join('');
}

/**
 * Render Skills
 */
function renderSkills(lang) {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  container.innerHTML = window.contentData.skills.categories.map(cat => `
    <div class="skill-card">
      <h3>${cat.title[lang]}</h3>
      <p>${cat.description[lang]}</p>
      <ul>
        ${cat.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      ${cat.extra ? `<div class="skill-details"><p>${cat.extra[lang]}</p></div>` : ''}
    </div>
  `).join('');
}

/**
 * Render Experience & Education
 */
function renderExperience(lang) {
  const container = document.getElementById('experience-sections');
  if (!container) return;

  const data = window.contentData.experience;

  const renderTimeline = (items) => `
    <div class="timeline">
      ${items.map(item => `
        <div class="timeline-item">
          <div class="exp-header">
            <div>
              <div class="exp-title">${item.title[lang]}</div>
              <div class="exp-institution">${item.institution[lang]}</div>
            </div>
            <div class="exp-date">${item.date[lang]}</div>
          </div>
           <span class="toggle-details" onclick="toggleDetails(this)">${window.contentData.ui.showDetails[lang]}</span>
          <div class="exp-details">
            <ul>
              ${item.bullets[lang].map(d => `<li>${d}</li>`).join('')}
            </ul>
             ${item.summary ? `<p class="exp-summary">${item.summary[lang]}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // We explicitly know the structure of categories from JSON
  const profExp = data.categories.find(c => c.id === 'professional');
  const eduExp = data.categories.find(c => c.id === 'education');

  let html = '';
  if (profExp) {
    html += `
        <div class="exp-category">
            <h3>${profExp.title[lang]}</h3>
            ${renderTimeline(profExp.items)}
        </div>`;
  }
  if (eduExp) {
    html += `
        <div class="exp-category">
            <h3>${eduExp.title[lang]}</h3>
            ${renderTimeline(eduExp.items)}
        </div>`;
  }

  container.innerHTML = html;
}

// Global scope for onclick
window.toggleDetails = function (btn) {
  const details = btn.nextElementSibling;
  const isVisible = details.style.display === 'block';
  details.style.display = isVisible ? 'none' : 'block';

  const lang = currentLang;
  btn.textContent = isVisible ? window.contentData.ui.showDetails[lang] : window.contentData.ui.hideDetails[lang];
  btn.classList.toggle('active');
}


/**
 * Render Projects
 */
function renderProjects(lang) {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = window.contentData.projects.items.map(proj => `
    <div class="project-card" onclick="openProjectModal('${proj.id}')">
      <div class="project-header">
        <h3>${proj.name[lang]}</h3>
      </div>
      <div class="project-body">
        <p class="project-description">${proj.description[lang]}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="project-links">
          <span class="btn-text">${window.contentData.ui.moreDetails[lang]} &rarr;</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Publications
 */
function renderPublications(lang) {
  const container = document.getElementById('publications-list');
  if (!container) return;

  container.innerHTML = window.contentData.publications.items.map(pub => `
    <div class="pub-item ${pub.highlight ? 'highlight' : ''}">
      <span class="pub-type">${pub.type[lang]}</span>
      <div class="pub-title">${pub.title[lang]}</div>
      <div class="pub-authors">${pub.authors}</div>
      ${pub.venue ? `<div class="pub-venue">${pub.venue}</div>` : ''}
      <p class="pub-description">${pub.description[lang]}</p>
      ${renderPubLinks(pub.links)}
    </div>
  `).join('');
}

function renderPubLinks(links) {
  if (!links || Object.keys(links).length === 0) return '';
  return `<div class="pub-links">` +
    Object.entries(links).map(([key, url]) =>
      `<a href="${url}" class="pub-link" target="_blank">[${key.toUpperCase()}]</a>`
    ).join(' ') +
    `</div>`;
}

/**
 * Interactions: Project Modal
 */
window.openProjectModal = function (id) {
  const proj = window.contentData.projects.items.find(p => p.id === id);
  if (!proj) return;
  const lang = currentLang;

  const modal = document.getElementById('projectModal');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDescription');

  // Populate
  title.textContent = proj.name[lang];

  // Build detailed HTML
  let contentHtml = `<p><strong>${proj.description[lang]}</strong></p>`;
  contentHtml += `<div class="modal-tags" style="margin: 1rem 0;">${proj.tags.map(t => `<span class="tag" style="margin-right:0.5rem; display:inline-block; font-size:0.85rem; padding:0.2rem 0.6rem; background:var(--color-bg); border-radius:4px;">${t}</span>`).join('')}</div>`;
  contentHtml += `<p style="line-height:1.6;">${proj.fullDescription ? proj.fullDescription[lang] : ''}</p>`;

  if (proj.image) {
    // Check if image exists (fallback logic could go here)
    contentHtml += `<img src="${proj.image}" alt="${proj.name[lang]}" style="width:100%; height:auto; border-radius:8px; margin-top:1.5rem; box-shadow:var(--shadow-sm);">`;
  }

  if (proj.links) {
    contentHtml += `<div class="modal-links" style="margin-top:1.5rem; display:flex; gap:1rem;">
       ${Object.entries(proj.links).map(([k, v]) => v ? `<a href="${v}" class="btn btn-primary" target="_blank" style="padding:0.5rem 1rem; font-size:0.9rem;">${k.toUpperCase()}</a>` : '').join('')}
     </div>`;
  }

  desc.innerHTML = contentHtml;

  // Show
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);
}

// Close Modal logic
document.addEventListener('click', (e) => {
  const modal = document.getElementById('projectModal');
  if (e.target === modal || e.target.classList.contains('modal-close')) {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
  }
});

/**
 * Interactions: Language Toggle
 */
function setupLanguageToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      currentLang = lang;
      localStorage.setItem('selectedLanguage', lang);
      renderAll(lang);
    });
  });
}

/**
 * Interactions: Mobile Navigation
 */
function setupNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }
}

/**
 * Animations: Scroll Observer
 */
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}
