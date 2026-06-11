/* ============================================
   Main JavaScript - Veronica's Personal Website
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initThemeSystem();
    initMobileMenu();
    initTypingEffects();
    initSmoothScrolling();
    initScrollAnimations();
    initEmailService();
    initContactForm();
    loadPortfolioData();
    loadBlogData();
    initTerminalEffects();
});

function initEmailService () {
    if (window.emailjs && window.CONFIG && CONFIG.EMAILJS_PUBLIC_KEY) {
        emailjs.init({
            publicKey: CONFIG.EMAILJS_PUBLIC_KEY
        });
    }
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */

function initMobileMenu () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Update button text/icon
            const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
            if (navLinks.classList.contains('active')) {
                menuIcon.textContent = '×';
            } else {
                menuIcon.textContent = '>';
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
                menuIcon.textContent = '>';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
                menuIcon.textContent = '>';
            }
        });
    }
}

/* ============================================
   Typing Effects
   ============================================ */

function initTypingEffects () {
    const typingElements = document.querySelectorAll('.typing-effect');

    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        if (text) {
            typeWriter(element, text, 50);
        }
    });
}

function typeWriter (element, text, speed) {
    let i = 0;
    element.textContent = '';

    function type () {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/* ============================================
   Smooth Scrolling
   ============================================ */

function initSmoothScrolling () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations () {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.add('glow');

                // Remove glow effect after animation
                setTimeout(() => {
                    entry.target.classList.remove('glow');
                }, 2000);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.terminal-window, .skill-category, .experience-item, .portfolio-card, .blog-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ============================================
   Contact Form Validation
   ============================================ */

function initContactForm () {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            let isValid = true;
            let errorMessage = '';

            // Name validation
            if (name.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }

            // Subject validation
            if (subject.trim().length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters long';
            }

            // Message validation
            if (message.trim().length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }

            if (isValid) {
                if (!window.emailjs || !window.CONFIG) {
                    showFormMessage('Contact form is temporarily unavailable. Please email me directly.', 'error');
                    return;
                }

                // Change button state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-cmd">$ ./sending...</span><span class="btn-text">Sending...</span>';

                // Send email using EmailJS from config
                emailjs.sendForm(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, contactForm)
                    .then(() => {
                        showFormMessage('Message sent successfully! I will get back to you soon.', 'success');
                        contactForm.reset();
                    })
                    .catch((error) => {
                        console.error('EmailJS Error:', error);
                        showFormMessage('Failed to send message. Please try again later.', 'error');
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    });
            } else {
                showFormMessage(errorMessage, 'error');
            }
        });
    }
}

function showFormMessage (message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'form-message';
    messageElement.textContent = message;

    // Style based on type
    if (type === 'success') {
        messageElement.style.cssText = `
            background-color: rgba(61, 220, 132, 0.2);
            color: #3DDC84;
            border: 1px solid #3DDC84;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        `;
    } else {
        messageElement.style.cssText = `
            background-color: rgba(255, 95, 86, 0.2);
            color: #ff5f56;
            border: 1px solid #ff5f56;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        `;
    }

    // Insert after the form notice
    const formNotice = document.querySelector('.form-notice');
    if (formNotice) {
        formNotice.after(messageElement);
    } else {
        const contactForm = document.getElementById('contact-form');
        contactForm.after(messageElement);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

/* ============================================
   Portfolio Data Loading
   ============================================ */

function loadPortfolioData () {
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (portfolioGrid) {
        fetch('data/projects.json')
            .then(response => response.json())
            .then(projects => {
                displayProjects(projects);
            })
            .catch(error => {
                console.error('Error loading portfolio data:', error);
                displayFallbackPortfolio();
            });
    }
}

function displayProjects (projects) {
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';

    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        portfolioGrid.appendChild(projectCard);
    });
}

function createProjectCard (project) {
    const card = document.createElement('article');
    card.className = 'portfolio-card';
    const metrics = Array.isArray(project.metrics) ? project.metrics : [];
    const stack = Array.isArray(project.stack) ? project.stack : [];

    card.innerHTML = `
        <div class="portfolio-card-header">
            <h3>${escapeHtml(project.name)}</h3>
        </div>
        <div class="portfolio-card-body">
            <p>${escapeHtml(project.description)}</p>
            <div class="portfolio-metrics">
                ${metrics.map(metric => `
                    <div class="metric">
                        <span class="metric-value">${escapeHtml(metric.value)}</span>
                        <span>${escapeHtml(metric.label)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="portfolio-stack">
                ${stack.map(tech => `
                    <span class="stack-item">${escapeHtml(tech)}</span>
                `).join('')}
            </div>
        </div>
        <div class="portfolio-card-footer">
            ${project.demoLink ? `<a href="${escapeHtml(project.demoLink)}" target="_blank" rel="noopener noreferrer" class="portfolio-link">Live Demo</a>` : ''}
            ${project.codeLink ? `<a href="${escapeHtml(project.codeLink)}" target="_blank" rel="noopener noreferrer" class="portfolio-link">View Code</a>` : ''}
        </div>
    `;

    return card;
}

function displayFallbackPortfolio () {
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = `
        <div class="portfolio-card">
            <div class="portfolio-card-header">
                <h3>LINE Bank by Hana Bank</h3>
            </div>
            <div class="portfolio-card-body">
                <p>Digital banking application with 1M+ users, featuring comprehensive financial services including account management, transfers, and investment tools.</p>
                <div class="portfolio-metrics">
                    <div class="metric"><span class="metric-value">1M+</span><span>Downloads</span></div>
                    <div class="metric"><span class="metric-value">12%</span><span>Transaction Increase</span></div>
                </div>
                <div class="portfolio-stack">
                    <span class="stack-item">Android SDK</span>
                    <span class="stack-item">Kotlin</span>
                    <span class="stack-item">MVVM</span>
                    <span class="stack-item">Firebase</span>
                </div>
            </div>
            <div class="portfolio-card-footer">
                <a href="#" class="portfolio-link">View Details</a>
            </div>
        </div>
        <div class="portfolio-card">
            <div class="portfolio-card-header">
                <h3>Orka - AI Spatial Assistant</h3>
            </div>
            <div class="portfolio-card-body">
                <p>AI-powered spatial assistant for Vision Pro and Meta Quest, featuring real-time object detection, 360° immersive dashboard, and Personalized RAG technology.</p>
                <div class="portfolio-metrics">
                    <div class="metric"><span class="metric-value">XR</span><span>Platform</span></div>
                    <div class="metric"><span class="metric-value">AI</span><span>Powered</span></div>
                </div>
                <div class="portfolio-stack">
                    <span class="stack-item">Meta XR SDK</span>
                    <span class="stack-item">Jetpack Compose XR</span>
                    <span class="stack-item">MLKit</span>
                </div>
            </div>
            <div class="portfolio-card-footer">
                <a href="#" class="portfolio-link">View Details</a>
            </div>
        </div>
        <div class="portfolio-card">
            <div class="portfolio-card-header">
                <h3>AAC Tools</h3>
            </div>
            <div class="portfolio-card-body">
                <p>Accessibility and communication tools for education, featuring Flutter-based responsive design, real-time symbol searching, and adaptive layouts for diverse screen resolutions.</p>
                <div class="portfolio-metrics">
                    <div class="metric"><span class="metric-value">30%</span><span>Faster Interaction</span></div>
                    <div class="metric"><span class="metric-value">Flutter</span><span>Framework</span></div>
                </div>
                <div class="portfolio-stack">
                    <span class="stack-item">Flutter</span>
                    <span class="stack-item">Dart</span>
                    <span class="stack-item">BLOC</span>
                    <span class="stack-item">Responsive</span>
                </div>
            </div>
            <div class="portfolio-card-footer">
                <a href="#" class="portfolio-link">View Details</a>
            </div>
        </div>
    `;
}

/* ============================================
   Blog Data Loading
   ============================================ */

function loadBlogData () {
    const blogGrid = document.getElementById('blog-grid');

    if (blogGrid) {
        fetch('data/blog-articles.json')
            .then(response => response.json())
            .then(articles => {
                displayBlogArticles(articles);
            })
            .catch(error => {
                console.error('Error loading blog data:', error);
                displayFallbackBlog();
            });
    }
}

function displayBlogArticles (articles) {
    const blogGrid = document.getElementById('blog-grid');

    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    articles
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6)
        .forEach(article => {
            const articleCard = createBlogCard(article);
            blogGrid.appendChild(articleCard);
        });
}

function createBlogCard (article) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-card-header">
            <span class="blog-category">${escapeHtml(article.category)}</span>
            <h3>${escapeHtml(article.title)}</h3>
        </div>
        <div class="blog-card-body">
            <p>${escapeHtml(article.excerpt)}</p>
            <div class="blog-snippet">
                <pre><code>${escapeHtml(article.snippet)}</code></pre>
            </div>
        </div>
        <div class="blog-card-footer">
            <time class="blog-date" datetime="${escapeHtml(article.date)}">${formatDate(article.date)}</time>
            <a href="${escapeHtml(article.link)}" target="_blank" rel="noopener noreferrer" class="blog-link">Read More</a>
        </div>
    `;

    return card;
}

function displayFallbackBlog () {
    const blogGrid = document.getElementById('blog-grid');

    if (!blogGrid) return;

    blogGrid.innerHTML = `
        <div class="blog-card">
            <div class="blog-card-header">
                <span class="blog-category">Android Development</span>
                <h3>Building Scalable Android Applications</h3>
            </div>
            <div class="blog-card-body">
                <p>Learn the fundamentals of creating scalable, maintainable Android applications using modern architecture patterns and best practices.</p>
                <div class="blog-snippet">
                    <pre><code>class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}</code></pre>
                </div>
            </div>
            <div class="blog-card-footer">
                <span class="blog-date">2024-05-10</span>
                <a href="https://medium.com/@veronanggraini" target="_blank" rel="noopener noreferrer" class="blog-link">Read More →</a>
            </div>
        </div>
        <div class="blog-card">
            <div class="blog-card-header">
                <span class="blog-category">GDE Insights</span>
                <h3>My Journey as a Google Developer Expert</h3>
            </div>
            <div class="blog-card-body">
                <p>Sharing my experience of becoming a GDE and how it has impacted my career and the developer community in Southeast Asia.</p>
                <div class="blog-snippet">
                    <pre><code>fun shareKnowledge(): Impact {
    return community * contributions
}</code></pre>
                </div>
            </div>
            <div class="blog-card-footer">
                <span class="blog-date">2024-04-15</span>
                <a href="https://medium.com/@veronanggraini" target="_blank" rel="noopener noreferrer" class="blog-link">Read More →</a>
            </div>
        </div>
        <div class="blog-card">
            <div class="blog-card-header">
                <span class="blog-category">Spatial Computing</span>
                <h3>Getting Started with Spatial UI Development</h3>
            </div>
            <div class="blog-card-body">
                <p>An introduction to spatial UI development for VR/AR platforms, focusing on Meta XR SDK and Jetpack Compose for XR.</p>
                <div class="blog-snippet">
                    <pre><code>@Composable
fun SpatialDashboard() {
    Column {
        ImmersiveContent()
        ObjectDetection()
    }
}</code></pre>
                </div>
            </div>
            <div class="blog-card-footer">
                <span class="blog-date">2024-03-20</span>
                <a href="https://medium.com/@veronanggraini" target="_blank" rel="noopener noreferrer" class="blog-link">Read More →</a>
            </div>
        </div>
    `;
}

/* ============================================
   Terminal Effects
   ============================================ */

function initTerminalEffects () {
    // Add random cursor blinking delays
    const typingElements = document.querySelectorAll('.typing-effect');
    typingElements.forEach(element => {
        const randomDelay = Math.random() * 2000;
        element.style.animationDelay = `${randomDelay}ms`;
    });

    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Add intersection observer for navigation highlighting
    initNavHighlighting();
}

/* ============================================
   Theme Management
   ============================================ */

function initThemeSystem () {
    // Determine initial theme
    const savedTheme = localStorage.getItem('theme');
    let initialTheme = savedTheme;

    if (!initialTheme) {
        initialTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    // Apply initial theme
    setTheme(initialTheme);

    // Initialize toggle button
    initThemeToggle();

    // Listen for system theme changes (optional, only if no saved preference)
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
    }
}

function setTheme (theme) {
    // Set data attribute on html element
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle icon
    updateThemeIcon(theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme);
}

function updateThemeIcon (theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function initThemeToggle () {
    const themeToggle = document.querySelector('.theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });

        // Keyboard accessibility
        themeToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            }
        });
    }
}

function handleSystemThemeChange (e) {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
}

function updateMetaThemeColor (theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        const color = theme === 'dark' ? '#0d1117' : '#f8f9fa';
        metaThemeColor.setAttribute('content', color);
    }
}

/* ============================================
   Navigation Highlighting
   ============================================ */

function initNavHighlighting () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to corresponding link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance optimization
function debounce (func, wait) {
    let timeout;
    return function executedFunction (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date for blog articles
function formatDate (dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML for security
function escapeHtml (unsafe) {
    return String(unsafe ?? '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ============================================
   Initialize on page load
   ============================================ */

// Additional initialization
window.addEventListener('load', function () {
    console.log('Veronica\'s Portfolio - Loaded Successfully');
    console.log('Terminal Mode: Active');
    console.log('Tech Stack: HTML, CSS, JavaScript (No Framework)');

    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Handle window resize events
window.addEventListener('resize', debounce(function () {
    // Close mobile menu on resize to desktop
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (window.innerWidth >= 768) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
        menuIcon.textContent = '>';
    }
}, 250));

// Keyboard accessibility enhancements
document.addEventListener('keydown', function (e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
            menuIcon.textContent = '>';
        }
    }
});

/* ============================================
   End of Main JavaScript
   ============================================ */
