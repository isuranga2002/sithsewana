/* ============================================
   SITH SEWANA — Scripts
   Modern Charity Website — 2026
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Preloader ---------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });

    /* ---------- Navbar Scroll ---------- */
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ---------- Mobile Menu ---------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    let scrollPos = 0;
    const openMenu = () => {
        scrollPos = window.scrollY;
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.top = `-${scrollPos}px`;
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPos);
    };

    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    /* ---------- Hero Image Slider ---------- */
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        heroSlides.forEach(s => s.classList.remove('active'));
        heroDots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add('active');
        if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % heroSlides.length);
    };

    // Auto-advance every 5 seconds
    const startSlider = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    // Manual dot click
    heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.slide, 10));
            startSlider();
        });
    });

    if (heroSlides.length > 1) {
        startSlider();
    }

    /* ---------- Scroll Reveal ---------- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------- Impact Counter Animation ---------- */
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    // Also animate hero stats on page load
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        heroObserver.observe(heroSection);
    }

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        const impactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    impactObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        impactObserver.observe(impactSection);
    }

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightbox) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    /* ---------- Smooth Scroll for Anchor Links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---------- Active Nav Link Highlight ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(item => {
                    item.style.opacity = item.getAttribute('href') === `#${id}` ? '1' : '';
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ---------- Parallax Background Effect ---------- */
    const parallaxBgs = document.querySelectorAll('.section-bg-image');
    if (parallaxBgs.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxBgs.forEach(bg => {
                const section = bg.parentElement;
                const rect = section.getBoundingClientRect();
                const speed = 0.3;
                bg.style.transform = `translateY(${rect.top * speed}px)`;
            });
        }, { passive: true });
    }

});
