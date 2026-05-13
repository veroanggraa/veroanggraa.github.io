# Veronica Putri Anggraini - Personal Website

A tech-forward, terminal-styled personal website showcasing Veronica's experience as a Software Engineer Android and Google Developer Expert.

## 🚀 Features

- **Tech-forward Design**: Terminal/console aesthetic with monospace typography
- **Dark Theme**: Professional dark color scheme with neon Android green and cyan accents
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Interactive Elements**: Typing effects, smooth scrolling, and terminal-style interactions
- **Portfolio Showcase**: Dynamic project cards with technical details
- **Blog Integration**: Medium article integration with code snippets
- **Contact Form**: Terminal-style contact form with validation
- **Accessibility**: WCAG compliant with keyboard navigation support

## 📁 Project Structure

```
veroanggra/
├── index.html           # Main landing page
├── styles/
│   ├── main.css         # Core styling with terminal aesthetic
│   └── responsive.css   # Responsive breakpoints and mobile styles
├── js/
│   └── main.js          # Interactive features and effects
├── data/
│   ├── projects.json    # Portfolio project data
│   └── blog-articles.json # Medium article data
├── images/              # Profile pictures and project screenshots
├── assets/              # Icons and static resources
├── Veronica-Resume.pdf  # Original resume
└── README.md           # This file
```

## 🎨 Technology Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern CSS with Grid/Flexbox, CSS variables, animations
- **JavaScript**: Vanilla JavaScript for interactivity
- **No Frameworks**: Pure HTML/CSS/JS for maximum performance and simplicity

## 🌐 How to Use

### Local Development

1. **Direct File Opening**:
   ```bash
   # Simply double-click index.html or run:
   xdg-open index.html
   ```

2. **Using Python Web Server**:
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000 in your browser
   ```

3. **Using Node.js**:
   ```bash
   npx http-server
   # Open the URL shown in terminal
   ```

### Testing the Website

Run the validation script:
```bash
./test-website.sh
```

This checks:
- File structure
- HTML validity
- CSS completeness
- JavaScript functionality
- Data file integrity
- Section presence

## ✨ Customization

### Personal Information

Edit `index.html` to update:
- Name and title in the hero section
- Contact information
- Social media links
- About section content

### Skills

Update the skills grid in `index.html` under the Skills section.

### Portfolio Projects

Edit `data/projects.json` to add or modify portfolio items:
```json
{
  "id": 1,
  "name": "Project Name",
  "description": "Project description",
  "metrics": [
    { "value": "1M+", "label": "Downloads" }
  ],
  "stack": ["Android SDK", "Kotlin", "MVVM"],
  "highlights": ["Key achievement"],
  "role": "Android Engineer",
  "company": "Company Name",
  "period": "2021 - Present"
}
```

### Blog Articles

Update `data/blog-articles.json` to add Medium articles:
```json
{
  "id": 1,
  "title": "Article Title",
  "category": "Category",
  "excerpt": "Brief description",
  "snippet": "code snippet",
  "date": "2024-05-10",
  "link": "https://medium.com/@username/article"
}
```

### Colors and Styling

Modify CSS variables in `styles/main.css`:
```css
:root {
  /* Neon Accents */
  --accent-green: #3DDC84;
  --accent-cyan: #00BCD4;
  --accent-purple: #9C27B0;

  /* Terminal Colors */
  --terminal-bg: #1e1e1e;
  --terminal-border: #333;
}
```

## 📱 Responsive Breakpoints

The website is optimized for:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px and above

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Proper color contrast ratios
- Screen reader friendly
- Reduced motion support

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- No external dependencies
- Optimized CSS and JavaScript
- Minimal file sizes
- Fast load times
- Lazy loading for images (when implemented)

## 📝 Contact Form

The contact form includes client-side validation but requires backend integration for email functionality. For deployment, consider:

- Formspree (simple integration)
- Netlify Forms (free hosting)
- EmailJS (direct email sending)
- Custom backend (Node.js, PHP, etc.)

## 🎯 Sections

1. **Hero**: Introduction with typing effects and CTAs
2. **About**: Professional summary and mission
3. **Skills**: Categorized technical skills
4. **Experience**: Work experience timeline
5. **Education**: Academic background
6. **Portfolio**: Project showcase with metrics
7. **Blog**: Medium article integration
8. **Contact**: Contact form and direct links
9. **Footer**: Terminal-styled footer with social links

## 🔐 Security

- Input sanitization in JavaScript
- XSS prevention in dynamic content
- Secure external links with `rel="noopener noreferrer"`

## 📄 License

This website is created for Veronica Putri Anggraini's personal use.

## 👤 About Veronica

Veronica Putri Anggraini is a Software Engineer Android and Google Developer Expert with 7+ years of experience building impactful Android applications. She specializes in:

- Mobile development (Android, Flutter)
- Spatial computing and AR/VR
- Machine learning integration
- Technical writing and training
- Developer community engagement

**Location**: Jakarta, Indonesia
**LinkedIn**: linkedin.com/in/veronanggraini
**Medium**: medium.com/@veronanggraini
**GitHub**: veronanggraini.github.io

## 🙏 Acknowledgments

- Design inspired by terminal aesthetics and developer-focused design
- Colors from Android Material Design guidelines
- Built with love for the developer community

---

**Built with ❤️ by Veronica Putri Anggraini | Google Developer Expert for Android**