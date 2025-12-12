# Wenyu Chiou - Personal Portfolio

A professional, modular single-page portfolio website showcasing research work, projects, and academic background with bilingual support (English/Traditional Chinese).

## Features

- Modern, clean, light-colored professional design
- Bilingual support with smooth language switching (EN/中文)
- Fully responsive (mobile, tablet, desktop)
- Interactive UI elements (smooth scroll, hover effects, modals, animations)
- Google Analytics 4 integration with comprehensive event tracking
- Modular architecture for easy maintenance
- JSON-based content management
- SEO optimized with Open Graph tags

## Project Structure

```
Personal website/
├── index.html                 # Main HTML file (modular, references external files)
├── README.md                  # This file
├── .gitignore                 # Git ignore configuration
│
├── assets/
│   ├── css/
│   │   └── style.css         # All styles (extracted from HTML)
│   │
│   ├── js/
│   │   ├── i18n.js           # Language system & content loader
│   │   ├── main.js           # Main interactive logic
│   │   └── analytics.js      # Google Analytics event tracking
│   │
│   ├── images/
│   │   ├── profile/
│   │   │   └── avatar.jpg    # Profile photo (circular avatar)
│   │   ├── projects/         # Project screenshots (to be added)
│   │   └── icons/
│   │       └── favicon.ico   # Site favicon
│   │
│   └── documents/
│       ├── CV_Wenyu_Chiou_EN.pdf     # English CV
│       ├── CV_Wenyu_Chiou_ZH.pdf     # Chinese CV
│       └── publications/              # Publication PDFs
│
├── data/
│   └── content.json          # All bilingual text content
│
└── config/
    └── site.json             # Site configuration (GA ID, theme, SEO)
```

## Quick Start

### 1. Local Testing

**IMPORTANT**: Due to the use of `fetch()` API to load JSON files, you MUST use an HTTP server. You cannot simply double-click `index.html` to open it (CORS policy will block JSON loading).

**Using Python (Recommended)**:
```bash
# Navigate to project directory
cd "c:\Users\wenyu\OneDrive - Lehigh University\Personal website"

# Start HTTP server (Python 3)
python -m http.server 8000

# Open browser and visit
# http://localhost:8000
```

**Using Node.js** (if installed):
```bash
npx http-server -p 8000
```

### 2. Add Your Resources

Before deploying, add these files:

- **Profile Photo**: Place your photo at `assets/images/profile/avatar.jpg`
  - Recommended: 500x500px square, JPG/PNG format, < 200KB

- **CV Files**:
  - `assets/documents/CV_Wenyu_Chiou_EN.pdf` (English version)
  - `assets/documents/CV_Wenyu_Chiou_ZH.pdf` (Chinese version)

- **Favicon**: Generate at [favicon.io](https://favicon.io/) and place at `assets/images/icons/favicon.ico`

- **Project Screenshots** (optional for now):
  - Create folders under `assets/images/projects/`
  - Update `data/content.json` with image paths

## Content Management

### Updating Personal Information

Edit `data/content.json` → `personal` section:

```json
{
  "personal": {
    "name": { "en": "Your Name", "zh": "你的名字" },
    "title": { "en": "Your Title", "zh": "你的職稱" },
    "description": { "en": "Your description", "zh": "你的描述" }
  }
}
```

### Adding a New Project

Edit `data/content.json` → `projects` array:

```json
{
  "id": "project-id",
  "name": { "en": "Project Name", "zh": "專案名稱" },
  "description": { "en": "Short description", "zh": "簡短描述" },
  "fullDescription": { "en": "Detailed description", "zh": "詳細描述" },
  "image": "assets/images/projects/project-id/cover.jpg",
  "tags": ["Python", "Research"],
  "links": {
    "github": "https://github.com/...",
    "demo": "https://...",
    "paper": "assets/documents/publications/..."
  }
}
```

### Adding Work Experience

Edit `data/content.json` → `experience` → `professional` array:

```json
{
  "title": { "en": "Position Title", "zh": "職位名稱" },
  "institution": { "en": "Company/Institution", "zh": "公司/機構" },
  "date": { "en": "Jan 2024 – Present", "zh": "2024年1月 – 至今" },
  "bullets": {
    "en": [
      "Responsibility 1",
      "Responsibility 2"
    ],
    "zh": [
      "職責 1",
      "職責 2"
    ]
  }
}
```

### Updating CV

Simply replace the PDF files:
- `assets/documents/CV_Wenyu_Chiou_EN.pdf`
- `assets/documents/CV_Wenyu_Chiou_ZH.pdf`

The language system will automatically serve the correct version based on user's selected language.

## Google Analytics Setup

### 1. Create GA4 Property

1. Visit [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Obtain your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Update Configuration

Edit `config/site.json`:

```json
{
  "analytics": {
    "gaId": "G-XXXXXXXXXX",  // Replace with your actual Measurement ID
    "enabled": true
  }
}
```

### 3. Tracked Events

The following user interactions are automatically tracked:

- Page views
- CV downloads (EN/ZH tracked separately)
- Project link clicks
- Email contact clicks
- Social media link clicks (GitHub, LinkedIn, ORCID, etc.)
- Language switching
- Modal opens (project details)
- Section views (scroll-based)

View all analytics in your GA4 dashboard at [analytics.google.com](https://analytics.google.com/).

## Theme Customization

Edit `config/site.json` → `theme` section:

```json
{
  "theme": {
    "accentColor": "#0077b6",      // Main accent color
    "accentLight": "#48cae4",      // Light accent color
    "accentHover": "#005f8f"       // Hover state color
  }
}
```

These colors are used throughout the site for buttons, links, and highlights.

## Deployment

### Option 1: Netlify (Recommended - Easiest)

**Drag & Drop Deployment**:
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `Personal website` folder onto the page
3. Wait for deployment to complete
4. Receive a shareable URL (e.g., `https://wenyu-chiou.netlify.app`)
5. Share this URL with anyone

**GitHub Integration** (Auto-deploy on push):
1. Push your project to GitHub
2. Connect the repository to Netlify
3. Every push to GitHub will auto-update your website

**Custom Domain** (Optional):
- In Netlify settings, you can bind a custom domain (e.g., `wenyuchiou.com`)

### Option 2: GitHub Pages

1. Create a GitHub repository
2. Push your code
3. Go to Settings → Pages
4. Set source to `main` branch
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 3: Other Hosting Services

Any static hosting service works:
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

Simply upload all files maintaining the folder structure.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

## Performance Optimization

### Image Optimization

- Use [TinyPNG](https://tinypng.com/) to compress images
- Recommended sizes:
  - Profile photo: < 200KB
  - Project screenshots: < 300KB each

### SEO

SEO meta tags are configured in `index.html`:
- Title, description, keywords
- Open Graph tags for social media sharing
- Twitter Card support

Update these values in `config/site.json` → `seo` section.

## Troubleshooting

### Issue: Content not loading / Page is blank

**Cause**: Trying to open `index.html` directly without HTTP server

**Solution**: Use Python HTTP server as described in Quick Start section

### Issue: Language switching doesn't work

**Cause**: `data/content.json` failed to load

**Solution**:
1. Check browser console for errors
2. Ensure file path is correct
3. Verify JSON syntax is valid (use [JSONLint](https://jsonlint.com/))

### Issue: Google Analytics not tracking

**Cause**: GA not enabled or invalid Measurement ID

**Solution**:
1. Check `config/site.json` → `analytics.enabled` is `true`
2. Verify `gaId` format is correct (`G-XXXXXXXXXX`)
3. Check browser console for errors
4. Wait 24-48 hours for data to appear in GA dashboard

### Issue: Images not displaying

**Cause**: Incorrect file paths or missing files

**Solution**:
1. Verify images exist at specified paths
2. Check `data/content.json` for correct image paths
3. Ensure file names match exactly (case-sensitive)

## Development

### File Organization

- **HTML**: Only modify `index.html` for structural changes
- **CSS**: Edit `assets/css/style.css` for styling
- **JavaScript**:
  - `i18n.js` for language system
  - `main.js` for interactive features
  - `analytics.js` for tracking
- **Content**: Only edit `data/content.json` for text/data
- **Config**: Edit `config/site.json` for site-wide settings

### Best Practices

1. **Always test locally** before deploying
2. **Backup before making changes** (use Git)
3. **Validate JSON** before saving ([JSONLint](https://jsonlint.com/))
4. **Compress images** before adding them
5. **Test both languages** after updating content
6. **Check responsive design** on mobile/tablet

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern layout with Grid/Flexbox, custom properties
- **Vanilla JavaScript**: No frameworks/libraries
- **JSON**: Data-driven content management
- **Google Analytics 4**: User behavior tracking

## Future Enhancements

### Short-term
- [ ] Add project screenshot galleries
- [ ] Implement dark mode toggle
- [ ] Add image lightbox/carousel for projects

### Medium-term
- [ ] Add blog section
- [ ] Integrate contact form (Netlify Forms / Formspree)
- [ ] Implement lazy loading for images

### Long-term
- [ ] CMS integration (Netlify CMS / Forestry)
- [ ] Search functionality
- [ ] Multi-language support beyond EN/ZH

## Contact & Support

- **Email**: wec325@lehigh.edu
- **GitHub**: [https://github.com/WenyuChiou](https://github.com/WenyuChiou)
- **LinkedIn**: [https://www.linkedin.com/in/wenyu-chiou](https://www.linkedin.com/in/wenyu-chiou)
- **ORCID**: [https://orcid.org/0009-0005-8006-1288](https://orcid.org/0009-0005-8006-1288)

## License

© 2025 Wenyu Chiou. All rights reserved.

---

**Last Updated**: December 2025
**Version**: 1.0.0
