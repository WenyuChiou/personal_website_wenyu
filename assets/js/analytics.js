// ========== Google Analytics Integration ==========
// Handles GA4 tracking and event monitoring

// Load site configuration and initialize analytics
async function initAnalytics() {
  try {
    const response = await fetch('config/site.json');
    const config = await response.json();

    if (config.analytics && config.analytics.enabled && config.analytics.gaId) {
      loadGoogleAnalytics(config.analytics.gaId);
      // Wait a bit for GA to load before setting up tracking
      setTimeout(() => setupEventTracking(), 1000);
    } else {
      console.log('Google Analytics is disabled or not configured');
    }
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
    console.log('Continuing without analytics...');
  }
}

// Load GA4 tracking code
function loadGoogleAnalytics(gaId) {
  // Create and append gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', gaId);

  // Make gtag available globally
  window.gtag = gtag;

  console.log('Google Analytics initialized:', gaId);
}

// Setup event tracking for user interactions
function setupEventTracking() {
  // Check if gtag is available
  if (typeof window.gtag !== 'function') {
    console.warn('Google Analytics not loaded, skipping event tracking');
    return;
  }

  // CV Download Tracking
  document.querySelectorAll('a[href*="CV"]').forEach(link => {
    link.addEventListener('click', () => {
      const cvFile = link.getAttribute('href');
      const lang = localStorage.getItem('selectedLanguage') || 'en';

      gtag('event', 'cv_download', {
        'event_category': 'engagement',
        'event_label': cvFile,
        'language': lang
      });

      console.log('Event tracked: CV Download -', cvFile);
    });
  });

  // Project Link Click Tracking
  document.querySelectorAll('.project-links a').forEach(link => {
    link.addEventListener('click', () => {
      const linkUrl = link.getAttribute('href');
      const linkText = link.textContent;

      gtag('event', 'project_link_click', {
        'event_category': 'engagement',
        'event_label': linkUrl,
        'link_text': linkText
      });

      console.log('Event tracked: Project Link -', linkText);
    });
  });

  // Email Click Tracking
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      const email = link.getAttribute('href').replace('mailto:', '');

      gtag('event', 'email_click', {
        'event_category': 'contact',
        'event_label': email
      });

      console.log('Event tracked: Email Click');
    });
  });

  // Social Media Links Tracking
  ['github', 'linkedin', 'scholar', 'researchgate', 'orcid'].forEach(platform => {
    document.querySelectorAll(`a[href*="${platform}"]`).forEach(link => {
      link.addEventListener('click', () => {
        const linkUrl = link.getAttribute('href');

        gtag('event', 'social_click', {
          'event_category': 'social',
          'event_label': platform,
          'link_url': linkUrl
        });

        console.log('Event tracked: Social Link -', platform);
      });
    });
  });

  // Language Switch Tracking
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');

      gtag('event', 'language_switch', {
        'event_category': 'engagement',
        'event_label': lang
      });

      console.log('Event tracked: Language Switch -', lang);
    });
  });

  // Modal Open Tracking
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const detailsLink = card.querySelector('[data-i18n="proj_link_details"]');
    if (detailsLink) {
      detailsLink.addEventListener('click', () => {
        const projectTitle = card.querySelector('h3').textContent;

        gtag('event', 'modal_open', {
          'event_category': 'engagement',
          'event_label': 'project_details',
          'project_title': projectTitle
        });

        console.log('Event tracked: Modal Open -', projectTitle);
      });
    }
  });

  // Section Scroll Tracking (optional - tracks which sections users view)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        if (sectionId) {
          gtag('event', 'section_view', {
            'event_category': 'engagement',
            'event_label': sectionId
          });

          console.log('Event tracked: Section View -', sectionId);
        }
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of section is visible
  });

  // Observe all main sections
  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  console.log('Event tracking initialized');
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}
