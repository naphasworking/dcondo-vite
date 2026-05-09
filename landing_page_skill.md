# Premium Bilingual Landing Page Development Skill

This skill provides the architectural pattern, design system, and technical implementation details required to build high-converting, premium real estate landing pages.

## 1. Core Architecture & Tech Stack
- **Stack:** Vanilla HTML5, CSS3, and Vanilla JavaScript. (No heavy frameworks like React/Tailwind unless explicitly required).
- **Structure:** Single Page Application (SPA) style scrolling landing page with optional dedicated SEO sub-pages.
- **Performance:** Ensure all assets are loaded with `loading="lazy"`, use `preconnect` for Google Fonts, and implement cache-busting `?v=x` for CSS files.

## 2. Design System: Premium Glassmorphism
The aesthetic must feel expensive, modern, and trustworthy.
- **Colors:** Deep, rich primary colors (e.g., Teal `#006D77`, Navy) combined with gold/champagne accents. Avoid generic primary colors (e.g., basic red, blue, green).
- **Typography:** Modern, clean sans-serif Google Fonts (e.g., `Prompt`, `Inter`, `Outfit`).
- **Glassmorphism Theme:** Use semi-transparent backgrounds with backdrop filters.
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.3);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow);
  border-radius: 20px;
}
```

## 3. The "No-Reload" Bilingual System
Implement seamless language switching using DOM manipulation and `localStorage` to avoid page reloads.

**HTML Pattern:**
Always include both languages directly in the HTML using data attributes.
```html
<!-- Text Elements -->
<h2 data-th="ภาษาไทย" data-en="English Text">ภาษาไทย</h2>

<!-- Input Placeholders -->
<input type="text" data-placeholder-th="ชื่อ" data-placeholder-en="Name" placeholder="ชื่อ">
```

**JavaScript Logic:**
```javascript
function setLanguage(lang) {
    localStorage.setItem('site_lang', lang);
    
    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate text
    document.querySelectorAll('[data-en][data-th]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });

    // Translate placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-th]').forEach(el => {
        el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
    });
}

// Initialize on load
setLanguage(localStorage.getItem('site_lang') || 'th');
```

## 4. Scroll Animations (IntersectionObserver)
Create dynamic, alive interfaces using scroll-triggered CSS transitions.

**CSS Setup:**
```css
.animate-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.animate-up.in-view {
  opacity: 1;
  transform: translateY(0);
}
.delay-1 { transition-delay: 0.2s; }
.delay-2 { transition-delay: 0.4s; }
```

**JavaScript Logic:**
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
```

## 5. Seamless Lead Generation (Google Apps Script)
Instead of a backend server, use a standard HTML form that POSTs to a Google Apps Script Web App URL.
1. Prevent default form submission.
2. Validate required fields.
3. Change submit button state (`disabled`, loading text).
4. Use `fetch(scriptURL, { method: 'POST', body: new FormData(form) })`.
5. Display inline success/error messages.

## 6. SEO Optimization Strategy
- **Meta Tags:** Every page must have `<meta name="description">`, `<meta name="keywords">`, and an optimized `<title>`.
- **Bilingual SEO Title:** `<title>ชื่อภาษาไทย | English Title | Brand Name</title>`
- **Content Pages:** For heavy SEO keywords, create dedicated sub-pages (e.g., `blog1.html`).
- **Semantic Structure:** Strict adherence to one `<h1>` per page, followed by logical `<h2>` and `<h3>` tags.
- **Conversion Loops:** Every SEO sub-page must include a Call To Action (CTA) button at the bottom linking back to the main registration form (`index.html#register`).

## 7. AI Asset Generation Guidelines
When using AI tools to generate images for the site:
- Specify "premium, high-aesthetic, architectural photography, vibrant lighting".
- Never generate text inside the image.
- Enforce visual consistency (e.g., all interior shots should share a similar color temperature).
