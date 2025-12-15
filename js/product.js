// Image Gallery Functionality
function changeImage(thumbnail, newSrc) {
    // Update main image
    document.getElementById('main-product-image').src = newSrc;
    
    // Update selected image in form
    document.getElementById('selected-image').value = newSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// Size Selection
document.querySelectorAll('.size-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update selected size in form
        document.getElementById('selected-size').value = this.dataset.size;
    });
});

// Color Selection
document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Form Submission
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate size selection
    const selectedSize = document.getElementById('selected-size').value;
    if (!selectedSize) {
        alert('Please select a size before placing your order.');
        return;
    }
    
    // Get form data
    const formData = new FormData(this);
    const orderData = Object.fromEntries(formData.entries());
    
    // Store order in localStorage (for demo purposes)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        ...orderData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success message
    alert('✅ Your order has been placed successfully! For tracking and order queries, WhatsApp us at +447494821146.');
    
    // Reset form
    this.reset();
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('selected-size').value = '';
    document.getElementById('selected-image').value = '';
});

// Initialize form with first image
document.addEventListener('DOMContentLoaded', function() {
    const firstImage = document.querySelector('.thumbnail.active img').src;
    document.getElementById('selected-image').value = firstImage;
});

// Function to maintain consistent logo styling when order form is active
function setupLogoConsistency() {
    // Check if we're on a product page
    if (document.querySelector('.product-page')) {
        // Find the logo image
        const logoImage = document.querySelector('.logo img');
        
        if (logoImage) {
            // For desktop (over 768px), ensure consistent logo sizing
            if (window.innerWidth > 768) {
                // Remove inline width/height attributes that could override CSS
                logoImage.removeAttribute('width');
                logoImage.removeAttribute('height');
                
                // Force appropriate styling
                logoImage.style.height = '40px';
                logoImage.style.width = 'auto';
                logoImage.style.maxHeight = '40px';
                logoImage.style.objectFit = 'contain';
                
                // Ensure site name styling is consistent
                const siteName = document.querySelector('.logo .site-name, .logo h1.site-name');
                if (siteName) {
                    siteName.style.fontSize = '18px';
                    siteName.style.fontWeight = '700';
                    siteName.style.margin = '0';
                }
            }
        }

        // When the order button is clicked
        const orderButtons = document.querySelectorAll('.order-now, .order-button');
        orderButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add a class to the body to enable specific styling
                document.body.classList.add('order-active');
                
                // Reapply logo consistency in case CSS was overridden
                if (logoImage && window.innerWidth > 768) {
                    logoImage.removeAttribute('width');
                    logoImage.removeAttribute('height');
                    logoImage.style.height = '40px';
                    logoImage.style.width = 'auto';
                }
            });
        });
    }
}

// Initialize logo consistency function on page load
document.addEventListener('DOMContentLoaded', function() {
    setupLogoConsistency();
    
    // Also maintain consistency if window is resized
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            setupLogoConsistency();
        }
    });
}); 