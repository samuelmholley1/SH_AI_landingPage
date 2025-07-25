// Samuel Holley's Reclaim by Design - Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initializeNavigation();
    
    // Scroll animations
    initializeScrollAnimations();
    
    // Active navigation highlighting
    initializeActiveNavigation();
    
    // Initialize floating elements animation
    initializeFloatingElements();

    // Initialize Calendly if on the schedule page
    if (document.body.dataset.page === 'schedule') {
        initializeCalendly();
    }
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                 // Reset hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .pillar-card');
    if(!animatedElements.length) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Initialize active navigation highlighting
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if(!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initializes subtle floating animation for hero elements
 */
function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    const heroContent = document.querySelector('.hero-content');
    
    // Check if browser supports the API and user hasn't set reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const allowAnimations = !prefersReducedMotion;
    
    if (allowAnimations) {
        // Animate in floating elements with delay
        floatingElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                
                // Add subtle floating animation
                el.animate([
                    { transform: 'translate(0, 0) rotate(0deg)' },
                    { transform: 'translate(0, -8px) rotate(2deg)' },
                    { transform: 'translate(0, 0) rotate(0deg)' }
                ], {
                    duration: 4000 + (index * 500),
                    iterations: Infinity,
                    direction: 'alternate',
                    easing: 'ease-in-out'
                });
            }, 300 + (index * 150));
        });
        
        // Animate in hero content
        if (heroContent) {
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }
}

/**
 * Initializes the Calendly skeleton loader and embed
 */
function initializeCalendly() {
    const skeleton = document.getElementById('skeleton-loader');
    const embedDiv = document.getElementById('calendly-embed');
    if (!skeleton || !embedDiv) return;

    // wait until Calendly injects its <iframe>
    (function poll () {
        const iframe = embedDiv.querySelector('iframe');
        if (!iframe) return requestAnimationFrame(poll);
        iframe.addEventListener('load', () => skeleton.remove());
    })();
}

// Build the 6 × 7 grid (42 boxes) the first time the schedule page loads
(function buildSkeletonCalendar(){
  const grid = document.querySelector('.skeleton-calendar-grid');
  if (!grid || grid.children.length) return;
  for (let i = 0; i < 42; i++){
    const cell = document.createElement('div');
    cell.className = 'skeleton-shape skeleton-date-box';
    grid.appendChild(cell);
  }
})();


