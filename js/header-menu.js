// Header Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Note: Mobile menu functionality has been moved to mobile-menu.js
    
    // Make header sticky on scroll
    const header = document.querySelector('header');
    const origOffsetY = header.offsetTop;
    
    function onScroll() {
        if (window.scrollY >= origOffsetY) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    // Add scroll event
    window.addEventListener('scroll', onScroll);
    
    // Ensure header is always visible
    function ensureHeaderVisibility() {
        const header = document.querySelector('header');
        const logo = document.querySelector('.logo');
        const siteName = document.querySelector('.site-name');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        
        if (header) {
            header.style.display = 'block';
            header.style.visibility = 'visible';
        }
        
        if (logo) {
            logo.style.display = 'flex';
            logo.style.visibility = 'visible';
        }
        
        if (siteName) {
            siteName.style.display = 'inline-block';
            siteName.style.visibility = 'visible';
        }
        
        if (hamburgerMenu) {
            if (window.innerWidth <= 768) {
                hamburgerMenu.style.display = 'flex';
            } else {
                hamburgerMenu.style.display = 'none';
            }
        }
    }
    
    // Run visibility check on load and resize
    ensureHeaderVisibility();
    window.addEventListener('resize', ensureHeaderVisibility);
}); 