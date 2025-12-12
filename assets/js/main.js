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
 * Render Experience & Education as a Gantt Chart Timeline/**
 * Render Experience & Education
 */
/**
 * Render Experience & Education
 */
/**
 * Render Experience & Education as Refined Vertical Timeline
 * Parallel Rows with Flex Width Control
 */
function renderExperience(lang) {
  const container = document.getElementById('experience-sections');
  if (!container) return;

  const data = window.contentData.experience;

  // Configuration for Rows (Parallel Grouping)
  // flex: Relative width weight (e.g. 2 vs 1)
  const rows = [
    {
      id: 'row_phd',
      items: [
        { id: 'lehigh_phd', flex: 1, type: 'edu', color: '#3b82f6' }
      ]
    },
    {
      id: 'row_ms',
      items: [
        { id: 'ncu_ms', flex: 1.4, type: 'edu', color: '#10b981' }, // Main
        { id: 'ncu_gra', flex: 1, type: 'work', color: '#06b6d4' }, // Parallel GRA
        { id: 'ncdr_intern', flex: 0.8, type: 'intern', color: '#ef4444' } // Parallel Intern
      ]
    },
    {
      id: 'row_bs',
      items: [
        { id: 'ncu_undergrad', flex: 1.4, type: 'edu', color: '#8b5cf6' }, // Main
        { id: 'ies_intern', flex: 1, type: 'intern', color: '#f59e0b' } // Parallel Intern
      ]
    }
  ];

  // Helper to get content, identifying and merging manual overrides if needed
  const getContent = (id, type) => {
    // 1. Try to find in standard data
    let catId = type === 'edu' ? 'education' : 'professional';
    // Fallback search in all categories just in case
    let cat = data.categories.find(c => c.items.some(i => i.id === id));
    let item = cat ? cat.items.find(i => i.id === id) : null;

    // 2. Manual Data Injection for GRA if missing or to ensure specific text matches user request
    if (id === 'ncu_ra') {
      // Renaming/Ensuring Title if needed, but existing is likely "Research Assistant"
    }
    if (id === 'ncu_gra' && !item) {
      // Create if missing
      item = {
        id: 'ncu_gra',
        title: { en: 'Graduate Research Assistant', zh: '兼任研究助理' },
        institution: { en: 'National Central University', zh: '國立中央大學' },
        date: { en: 'Sep 2021 – Jul 2023', zh: '2021年9月 - 2023年7月' }, // Explicit User Request
        summary: { en: 'Research Assistant during Master\'s studies.', zh: '碩士期間擔任研究助理' },
        bullets: { en: [], zh: [] }
      };
    } else if (id === 'ncu_gra' && item) {
      // Override Title to match user request exactly if needed
      item = { ...item }; // Copy
      item.title = { en: 'Graduate Research Assistant', zh: '兼任研究助理' };
      item.date = { en: 'Sep 2021 – Jul 2023', zh: '2021年9月 - 2023年7月' };
    }

    return item;
  };

  const html = `
    <div class="timeline" id="liquid-timeline">
      ${rows.map(row => {
    // Expand items with content
    const rowItems = row.items.map(conf => ({
      conf,
      content: getContent(conf.id, conf.type)
    })).filter(x => x.content); // Only render if content exists

    if (rowItems.length === 0) return '';

    // Use the date of the first item (Primary) for the timeline axis
    const mainItem = rowItems[0];

    return `
        <div class="timeline-item reveal-on-scroll">
          <!-- Left: Date -->
          <div class="timeline-left">
             <span class="timeline-date-label">${mainItem.content.date[lang]}</span>
          </div>

          <!-- Middle: Dot -->
          <div class="timeline-dot" style="border-color: ${mainItem.conf.color};"></div>

          <!-- Right: Content Row (Side-by-Side Flex) -->
          <div class="timeline-content-row">
            ${rowItems.map(ri => `
              <div class="timeline-content" style="flex: ${ri.conf.flex}; min-width: 200px;">
                <div class="timeline-header">
                  <h3 class="timeline-title" style="font-size: 1.1rem;">${ri.content.title[lang]}</h3>
                  <span class="timeline-role-type" style="color:${ri.conf.color}; border-color:${ri.conf.color}20; background:${ri.conf.color}10;">
                    ${ri.conf.type === 'edu' ? (lang === 'en' ? 'Education' : '學歷') : (ri.conf.type === 'intern' ? (lang === 'en' ? 'Internship' : '實習') : (lang === 'en' ? 'Work' : '工作'))}
                  </span>
                </div>
                
                ${/* Show date for side items if distinct? Or just hide to keep clean? User asked for parallel. 
                     Maybe show date subtitle for *all* to be clear on duration, since they might differ slightly within the row. */ ''}
                <span class="timeline-date-sub" style="color:${ri.conf.color}; opacity:0.8;">${ri.content.date[lang]}</span>

                <span class="timeline-institution">${ri.content.institution[lang]}</span>
                
                <div class="timeline-desc" style="font-size: 0.85rem;">
                   ${ri.content.summary ? `<p style="margin-bottom:0.3rem;">${ri.content.summary[lang]}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        `;
  }).join('')}
    </div>
  `;

  container.innerHTML = html;

  // Re-init scroll
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
  console.log('[Drawer] Setting up project drawer...');

  const drawer = document.getElementById('projectDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerContent = document.getElementById('drawerContent');
  const bookmarkTabs = document.querySelectorAll('.bookmark-tab');

  console.log('[Drawer] Elements found:', {
    drawer: !!drawer,
    backdrop: !!backdrop,
    closeBtn: !!closeBtn,
    drawerTitle: !!drawerTitle,
    drawerContent: !!drawerContent,
    bookmarkTabs: bookmarkTabs.length
  });

  if (!drawer || !backdrop || !bookmarkTabs.length) {
    console.warn('[Drawer] Missing required elements, aborting setup');
    return;
  }

  const data = window.contentData;
  console.log('[Drawer] Content data loaded:', !!data, !!data?.projects);
  if (!data || !data.projects) {
    console.warn('[Drawer] No content data found, aborting setup');
    return;
  }

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
