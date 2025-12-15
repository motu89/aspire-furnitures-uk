// Mobile navigation menu behavior
document.addEventListener('DOMContentLoaded', function() {
    // CRITICAL FIX: Force header visibility immediately
    (function forceHeaderVisibility() {
        const header = document.querySelector('header');
        const logo = document.querySelector('.logo');
        const siteName = document.querySelector('.site-name');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('nav');
        
        // Force header elements visibility
        if (header) {
            header.setAttribute('style', 'display: block !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (logo) {
            logo.setAttribute('style', 'display: flex !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (siteName) {
            siteName.setAttribute('style', 'display: inline-block !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (hamburgerMenu) {
            hamburgerMenu.setAttribute('style', 'display: flex !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        // Force nav menu to be visible and horizontal on larger screens
        if (window.innerWidth > 768) {
            if (nav) {
                nav.setAttribute('style', 'display: flex !important; visibility: visible !important; opacity: 1 !important;');
            }
        }
    })();
    
    // Note: Mobile menu functionality has been moved to mobile-menu.js
});

// General scripts for Aspire Furniture UK

// Ensure header elements are always visible
document.addEventListener('DOMContentLoaded', function() {
    function ensureHeaderVisibility() {
        const header = document.querySelector('header');
        const logo = document.querySelector('.logo');
        const siteName = document.querySelector('.site-name');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        
        if (header) {
            header.setAttribute('style', 'display: block !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (logo) {
            logo.setAttribute('style', 'display: flex !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (siteName) {
            siteName.setAttribute('style', 'display: inline-block !important; visibility: visible !important; opacity: 1 !important;');
        }
        
        if (hamburgerMenu && window.innerWidth <= 768) {
            hamburgerMenu.setAttribute('style', 'display: flex !important; visibility: visible !important; opacity: 1 !important;');
        }
    }
    
    // Run on page load
    ensureHeaderVisibility();
    
    // Run periodically to ensure header remains visible
    setInterval(ensureHeaderVisibility, 500);
    
    // Run on window resize
    window.addEventListener('resize', ensureHeaderVisibility);
    
    // Run after any potential layout changes
    document.addEventListener('scroll', ensureHeaderVisibility);
    
    // Carousel functionality
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length > 0) {
        // Auto-advance slides
        setInterval(function() {
            moveSlide(1);
        }, 5000);
    }
    
    // Global function for moving slides
    window.moveSlide = function(n) {
        showSlide(slideIndex += n);
    };
    
    // Global function for direct slide access
    window.goToSlide = function(n) {
        showSlide(slideIndex = n);
    };
    
    function showSlide(n) {
        if (slides.length === 0) return;
        
        // Reset if out of bounds
        if (n >= slides.length) slideIndex = 0;
        if (n < 0) slideIndex = slides.length - 1;
        
        // Hide all slides first
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
        }
        
        // Update indicators if they exist
        if (indicators.length > 0) {
            for (let i = 0; i < indicators.length; i++) {
                indicators[i].classList.remove('active');
            }
            indicators[slideIndex].classList.add('active');
        }
        
        // Show active slide
        slides[slideIndex].classList.add('active');
    }
});

// Note: Mobile menu code has been consolidated in mobile-menu.js

// ... rest of the existing code ... 