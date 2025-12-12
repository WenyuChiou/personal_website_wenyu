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

  // 4. Init Effects
  if (typeof ParticleNetwork !== 'undefined') {
    new ParticleNetwork('hero-canvas');
  }
  if (typeof TypeWriter !== 'undefined') {
    // Delay slightly to ensure renderAll finished
    setTimeout(() => new TypeWriter('hero_tagline', false), 500);
  }
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

  // Info Cards (Deprecated - logic moved to static profile structure)
  // const cardsContainer = document.getElementById('info-cards');
  // ... removed legacy dynamic rendering
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
/**
 * Render Experience & Education as a Liquid Timeline
 */
function renderExperience(lang) {
  const container = document.getElementById('experience-sections');
  if (!container) return;

  const data = window.contentData.experience;

  // 1. Merge Professional and Education items into a single array
  const profItems = data.categories.find(c => c.id === 'professional')?.items || [];
  const eduItems = data.categories.find(c => c.id === 'education')?.items || [];

  // Add a 'type' flag to distinguishing visuals if needed, though uniform look is cleaner
  const mergedItems = [
    ...profItems.map(i => ({ ...i, type: 'work' })),
    ...eduItems.map(i => ({ ...i, type: 'edu' }))
  ];

  // 2. Sort by date (Newest First) - Simplistic parsing assumes year is relevant
  // For now, we manually ordered them in JSON or trust the merged order. 
  // Let's rely on manual ordering in JSON or simple interleaving if dates overlap.
  // A simple re-sort based on first 4 digits of date string:
  const getYear = (str) => parseInt(str.match(/\d{4}/)?.[0] || 0);
  mergedItems.sort((a, b) => getYear(b.date.en) - getYear(a.date.en));


  // 3. Render
  const html = `
    <div class="timeline" id="liquid-timeline">
      <div class="timeline-progress" id="timeline-progress"></div>
      ${mergedItems.map((item, index) => `
        <div class="timeline-item reveal-on-scroll">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <!-- Large Image Area -->
            ${item.image ? `
            <div class="timeline-img">
               <img src="${item.image}" alt="${item.title[lang]}">
            </div>
            ` : ''}
            
            <div class="timeline-info">
              <span class="timeline-date">${item.date[lang]}</span>
              <h3 class="timeline-title">${item.title[lang]}</h3>
              <div class="timeline-institution">${item.institution[lang]}</div>
              
              <div class="timeline-desc">
                 ${item.summary ? `<p style="margin-bottom:0.5rem; font-style:italic;">${item.summary[lang]}</p>` : ''}
                 <ul>
                    ${item.bullets[lang].slice(0, 3).map(b => `<li>${b}</li>`).join('')}
                 </ul>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;

  // 4. Initialize Liquid Scroll Effect
  initLiquidScroll();
}

function initLiquidScroll() {
  const timeline = document.getElementById('liquid-timeline');
  const progressLine = document.getElementById('timeline-progress');
  if (!timeline || !progressLine) return;

  const handleScroll = () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const center = windowHeight / 2;

    // Calculate how much of the timeline has passed the center of the screen
    let start = rect.top;
    let end = rect.height;

    // Simple logic: Progress fills from top of timeline to center of screen
    let scrollPos = (center - start);

    // Clamp values
    if (scrollPos < 0) scrollPos = 0;
    if (scrollPos > end) scrollPos = end;

    progressLine.style.height = `${scrollPos}px`;
  };

  window.removeEventListener('scroll', handleScroll); // cleanup prevent dupe
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // initial call
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
function renderProjects(lang, filterCategory = 'all') {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const projects = window.contentData.projects.items.filter(proj =>
    filterCategory === 'all' || proj.category === filterCategory
  );

  container.innerHTML = projects.map(proj => `
    <div class="project-card" data-category="${proj.category || 'research'}" onclick="openProjectModal('${proj.id}')">
      ${proj.image ? `<div class="project-thumbnail" style="margin-bottom: 1rem; border-radius: 8px; overflow: hidden; width: 100%;">
        <img src="${proj.image}" alt="${proj.name[lang]}" style="width: 100%; height: auto; object-fit: contain; display: block;">
      </div>` : ''}
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

// Filter Projects by category
window.filterProjects = function (category, btn) {
  // Update active button
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Re-render with filter
  renderProjects(currentLang, category);
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
  // Section visibility observer
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
  });

  // Timeline item reveal observer
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    item.classList.add('reveal');
    timelineObserver.observe(item);
  });

  // Project card reveal observer
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.classList.add('reveal');
    card.classList.add(`stagger-${(index % 5) + 1}`);
    timelineObserver.observe(card);
  });

  // Back to Top button
  setupBackToTop();
}

/**
 * Back to Top Button Functionality
 */
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Project Drawer Functionality
 * Handles bookmark tabs and off-canvas drawer panel
 */
function setupProjectDrawer() {
  const drawer = document.getElementById('projectDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerContent = document.getElementById('drawerContent');
  const bookmarkTabs = document.querySelectorAll('.bookmark-tab');

  if (!drawer || !backdrop || !bookmarkTabs.length) return;

  const data = window.contentData;
  if (!data || !data.projects) return;

  // Category titles
  const categoryTitles = {
    research: { en: 'Research Projects', zh: '研究專案' },
    side: { en: 'Side Projects', zh: '副專案' }
  };

  // Open drawer
  function openDrawer(category) {
    const lang = currentLang;

    // Set title - Always show "Projects & Research"
    const title = lang === 'zh' ? '專案與研究' : 'Projects & Research';
    drawerTitle.textContent = title;

    // Filter and render projects - Show ALL projects but exclude 'intern' tag if needed
    // Assuming we want to show everything that ISN'T explicitly an intern report if that's the goal,
    // Or just show everything since we merged them.
    // User requested "Research就不要放interm 的部分".
    // So we filter out items with 'Intern' tag or keyword if present, or rely on manual data pruning.
    // For now, I will modify it to show ALL items since we will clean up the data in content.js.
    const projects = data.projects.items;

    drawerContent.innerHTML = projects.map(project => `
      <div class="drawer-project-card reveal">
        ${project.image ? `
          <div class="project-image">
            <img src="${project.image}" alt="${project.name[lang]}" loading="lazy">
          </div>
        ` : ''}
        <div class="project-info">
          <h4 class="project-title">${project.name[lang]}</h4>
          <p class="project-desc">${project.fullDescription?.[lang] || project.description[lang]}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.links?.github ? `<a href="${project.links.github}" target="_blank">🔗 GitHub</a>` : ''}
            ${project.links?.demo ? `<a href="${project.links.demo}" target="_blank">🌐 Demo</a>` : ''}
            ${project.links?.poster ? `<a href="${project.links.poster}" target="_blank">📄 Poster</a>` : ''}
            ${project.links?.paper ? `<a href="${project.links.paper}" target="_blank">📑 Paper</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Activate drawer and backdrop
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Mark active tab
    bookmarkTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === category);
    });

    // Trigger reveal animations
    setTimeout(() => {
      drawerContent.querySelectorAll('.reveal').forEach(card => {
        card.classList.add('revealed');
      });
    }, 100);
  }

  // Close drawer
  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    bookmarkTabs.forEach(tab => tab.classList.remove('active'));
  }

  // Event listeners
  bookmarkTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      openDrawer(tab.dataset.category);
    });
  });

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

// Initialize drawer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Give slight delay to ensure content.js is loaded
  setTimeout(setupProjectDrawer, 100);
  setTimeout(setupTimelineNavigation, 150);
});

/**
 * Timeline Navigation - Show experience details when clicked
 */
function setupTimelineNavigation() {
  const timelineItems = document.querySelectorAll('.timeline-nav-item');
  const detailPanel = document.getElementById('experienceDetail');
  const closeBtn = document.getElementById('experienceDetailClose');
  const expImage = document.getElementById('expImage');
  const expInfo = document.getElementById('expInfo');

  if (!timelineItems.length || !detailPanel) return;

  const data = window.contentData;
  if (!data) return;

  // Experience data mapping (id -> experience details)
  const experienceData = {
    'ncu_ra': {
      title: { en: 'Research Assistant', zh: '研究助理' },
      institution: { en: 'National Central University', zh: '國立中央大學' },
      date: { en: 'Jan 2024 – Jun 2024', zh: '2024年1月 – 2024年6月' },
      image: 'assets/images/文昱_GM20230816.jpg',
      bullets: {
        en: [
          'Developed 3D groundwater flow simulation models for coastal aquifer systems',
          'Established Nature-Based Solutions (NBS) assessment indicators and evaluation framework',
          'Integrated hydrogeological modeling with sustainability assessment metrics'
        ],
        zh: [
          '開發沿海含水層系統的 3D 地下水流模擬模型',
          '建立自然解方（NBS）評估指標與評估架構',
          '整合水文地質模擬與永續性評估指標'
        ]
      }
    },
    'ies_intern': {
      title: { en: 'Research Intern', zh: '研究實習生' },
      institution: { en: 'Academia Sinica - Institute of Earth Sciences', zh: '中央研究院地球科學研究所' },
      date: { en: 'Jul 2023 – Aug 2023', zh: '2023年7月 – 2023年8月' },
      image: 'assets/images/projects/ies/cover.jpg',
      bullets: {
        en: [
          'Conducted water isotope analysis for hydrological research',
          'Processed and analyzed stable isotope data',
          'Collaborated with senior researchers on groundwater studies'
        ],
        zh: [
          '進行水同位素分析用於水文研究',
          '處理和分析穩定同位素數據',
          '與資深研究員合作進行地下水研究'
        ]
      }
    },
    'ncdr_intern': {
      title: { en: 'Research Intern', zh: '研究實習生' },
      institution: { en: 'National Science and Technology Center for Disaster Reduction', zh: '國家災害防救科技中心' },
      date: { en: 'Jul 2022 – Aug 2022', zh: '2022年7月 – 2022年8月' },
      image: 'assets/images/projects/ncdr/cover.jpg',
      bullets: {
        en: [
          'Analyzed climate and disaster data for risk assessment',
          'Developed data visualization dashboards',
          'Contributed to disaster prevention research projects'
        ],
        zh: [
          '分析氣候與災害數據進行風險評估',
          '開發數據可視化儀表板',
          '參與災害防救研究專案'
        ]
      }
    }
  };

  function showExperience(expId) {
    const exp = experienceData[expId];
    if (!exp) return;

    const lang = currentLang || 'en';

    // Set image
    expImage.innerHTML = exp.image ? `<img src="${exp.image}" alt="${exp.title[lang]}">` : '';

    // Set info
    expInfo.innerHTML = `
      <h2>${exp.title[lang]}</h2>
      <p class="institution">${exp.institution[lang]}</p>
      <p class="date">${exp.date[lang]}</p>
      <ul>
        ${exp.bullets[lang].map(b => `<li>${b}</li>`).join('')}
      </ul>
    `;

    // Show panel
    detailPanel.classList.add('active');

    // Mark active
    timelineItems.forEach(item => {
      item.classList.toggle('active', item.dataset.expId === expId);
    });
  }

  function hideExperience() {
    detailPanel.classList.remove('active');
  }

  // Event listeners
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const expId = item.dataset.expId;
      if (experienceData[expId]) {
        showExperience(expId);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', hideExperience);
  }
}
