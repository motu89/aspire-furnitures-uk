// Mobile Menu Functionality for Responsive Design

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');
    const searchContainer = document.querySelector('.search-container');
    
    // Ensure we have the required elements
    if (!hamburgerMenu || !nav) return;
    
    // Toggle mobile menu when hamburger is clicked
    hamburgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when a navigation link is clicked
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close the mobile menu
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Smooth scroll to section
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = nav.contains(event.target) || hamburgerMenu.contains(event.target);
        
        if (!isClickInside && nav.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Set active navigation based on current position on page
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100; // Add some buffer
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Run on scroll
    window.addEventListener('scroll', setActiveNavItem);
    
    // Handle responsive behavior
    function handleResponsive() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 768) {
            // Mobile view
            if (hamburgerMenu) hamburgerMenu.style.display = 'flex';
            nav.classList.remove('flex'); // Remove any desktop classes
            
            // Ensure search container is not in nav on mobile
            if (searchContainer && nav.contains(searchContainer)) {
                nav.removeChild(searchContainer);
                document.querySelector('.header-container').appendChild(searchContainer);
            }
        } else {
            // Desktop view
            if (hamburgerMenu) hamburgerMenu.style.display = 'none';
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Run on page load and when window is resized
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
}); 