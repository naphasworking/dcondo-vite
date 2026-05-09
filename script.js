document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    const heroContent = document.querySelector('.hero-content');
    const parallaxElements = document.querySelectorAll('.fact-card, .facility-card, .location-content, .register-card');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar styling
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hero Parallax Effect
        if (heroContent && scrollY <= window.innerHeight) {
            // Move the text down slightly as you scroll down, creating depth
            heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
            // Fade out the text gradually
            heroContent.style.opacity = 1 - (scrollY / 600);
        }

        // Global Elements Parallax Effect
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is somewhat in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate distance from center of screen
                const centerDist = (window.innerHeight / 2) - (rect.top + rect.height / 2);
                // Apply a very subtle parallax shift (5% of distance)
                const yOffset = centerDist * -0.05; 
                el.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Simple hamburger animation
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Animation Observer (Fade In Up)
    // We already added classes 'animate-up' in HTML to elements in hero section
    // Let's also add it to section headers and cards dynamically
    
    const elementsToAnimate = [
        ...document.querySelectorAll('.animate-up'),
        ...document.querySelectorAll('.section-title'),
        ...document.querySelectorAll('.section-subtitle'),
        ...document.querySelectorAll('.concept-content p'),
        ...document.querySelectorAll('.fact-card'),
        ...document.querySelectorAll('.facility-card'),
        ...document.querySelectorAll('.location-content'),
        ...document.querySelectorAll('.register-card')
    ];

    // Add base class to elements that don't have it yet
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('animate-up')) {
            el.classList.add('animate-up');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // 4. Form Submission to Google Sheets
    const registerForm = document.getElementById('registerForm');
    const formMessage = document.getElementById('formMessage');
    const customPopup = document.getElementById('custom-popup');
    const closePopupBtn = document.getElementById('close-popup');

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            customPopup.classList.remove('show');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            
            const nameInput = document.getElementById('reg-name').value.trim();
            const phoneInput = document.getElementById('reg-phone').value.trim();
            
            if (!nameInput || !phoneInput) {
                // Show custom popup if required fields are empty
                customPopup.classList.add('show');
                return;
            }
            
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'กำลังส่งข้อมูล...';
            submitBtn.disabled = true;

            // Replace this URL with the Web App URL from Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz9glra9RJNxtJY1f7708F_ftyTc3zukVVK_IPQOft1LY7fuibviASihWpgR71C8ys1uw/exec';
            
            const formData = new FormData(registerForm);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    formMessage.innerText = 'ขอบคุณสำหรับการลงทะเบียน เราจะติดต่อกลับโดยเร็วที่สุด';
                    formMessage.style.color = '#006D77'; // Primary color
                    formMessage.style.display = 'block';
                    registerForm.reset();
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    formMessage.innerText = 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง';
                    formMessage.style.color = '#e74c3c';
                    formMessage.style.display = 'block';
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // 5. Language Switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en][data-th]');
    const placeholderElements = document.querySelectorAll('input[data-placeholder-en][data-placeholder-th]');

    function setLanguage(lang) {
        localStorage.setItem('dcondo_lang', lang);
        
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        translatableElements.forEach(el => {
            const newText = el.getAttribute(`data-${lang}`);
            if (newText) {
                el.innerHTML = newText;
            }
        });

        placeholderElements.forEach(el => {
            const newPlaceholder = el.getAttribute(`data-placeholder-${lang}`);
            if (newPlaceholder) {
                el.placeholder = newPlaceholder;
            }
        });
    }

    const savedLang = localStorage.getItem('dcondo_lang') || 'th';
    setLanguage(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});
