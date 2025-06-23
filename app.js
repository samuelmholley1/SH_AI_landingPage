// Samuel Holley's Reclaim by Design - Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initializeNavigation();
    
    // Scroll animations
    initializeScrollAnimations();
    
    // Active navigation highlighting
    initializeActiveNavigation();
    
    // Scale pricing headlines to fit
    scalePricingHeadlines();
    window.addEventListener('resize', scalePricingHeadlines);
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
 * Scales pricing card headlines to fit on one line without wrapping.
 * All headlines are scaled to the same size to accommodate the longest one.
 */
function scalePricingHeadlines() {
    const headlines = document.querySelectorAll('.pricing-card h3');
    if (!headlines.length) return;

    // Reset styles to get accurate measurements
    headlines.forEach(h3 => {
        h3.style.fontSize = ''; // Use CSS-defined font size
    });

    // Allow the browser to render the reset styles before measuring
    requestAnimationFrame(() => {
        let maxScaleRatio = 1;

        // Find the largest scale ratio needed
        headlines.forEach(h3 => {
            // Check if the text is wider than its container
            if (h3.scrollWidth > h3.clientWidth) {
                const ratio = h3.scrollWidth / h3.clientWidth;
                if (ratio > maxScaleRatio) {
                    maxScaleRatio = ratio;
                }
            }
        });

        // If scaling is needed, apply it to all headlines
        if (maxScaleRatio > 1) {
            const currentFontSize = parseFloat(getComputedStyle(headlines[0]).fontSize);
            const newFontSize = currentFontSize / maxScaleRatio;
            
            headlines.forEach(h3 => {
                h3.style.fontSize = `${newFontSize}px`;
            });
        }
    });
}
