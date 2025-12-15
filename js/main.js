// Sample product data
const products = {
    wardrobes: [
        {
            id: 'w1',
            name: 'Modern Sliding Wardrobe',
            price: '£299',
            images: ['wardrobe1-1.jpg', 'wardrobe1-2.jpg', 'wardrobe1-3.jpg'],
            sizes: ['3ft', '4ft', '5ft', '6ft']
        },
        {
            id: 'w2',
            name: 'Classic Hinged Wardrobe',
            price: '£349',
            images: ['wardrobe2-1.jpg', 'wardrobe2-2.jpg'],
            sizes: ['4ft', '5ft', '6ft']
        },
        {
            id: 'w3',
            name: 'Walk-in Wardrobe System',
            price: '£499',
            images: ['wardrobe3-1.jpg', 'wardrobe3-2.jpg', 'wardrobe3-3.jpg'],
            sizes: ['6ft', '8ft', '10ft']
        },
        {
            id: 'w4',
            name: 'Corner Wardrobe Unit',
            price: '£399',
            images: ['wardrobe4-1.jpg', 'wardrobe4-2.jpg'],
            sizes: ['3ft', '4ft']
        }
    ],
    sofas: [
        {
            id: 's1',
            name: 'Luxury 3-Seater Sofa',
            price: '£599',
            images: ['sofa1-1.jpg', 'sofa1-2.jpg'],
            sizes: ['3-Seater', '2-Seater']
        },
        {
            id: 's2',
            name: 'Modern Corner Sofa',
            price: '£799',
            images: ['sofa2-1.jpg', 'sofa2-2.jpg', 'sofa2-3.jpg'],
            sizes: ['L-Shape', 'U-Shape']
        },
        {
            id: 's3',
            name: 'Classic Chesterfield Sofa',
            price: '£699',
            images: ['sofa3-1.jpg', 'sofa3-2.jpg'],
            sizes: ['2-Seater', '3-Seater']
        }
    ],
    beds: [
        {
            id: 'b1',
            name: 'King Size Storage Bed',
            price: '£399',
            images: ['bed1-1.jpg', 'bed1-2.jpg'],
            sizes: ['Single', 'Double', 'King']
        },
        {
            id: 'b2',
            name: 'Modern Platform Bed',
            price: '£349',
            images: ['bed2-1.jpg', 'bed2-2.jpg'],
            sizes: ['Single', 'Double', 'King']
        },
        {
            id: 'b3',
            name: 'Classic Four Poster Bed',
            price: '£599',
            images: ['bed3-1.jpg', 'bed3-2.jpg'],
            sizes: ['Double', 'King']
        },
        {
            id: 'b4',
            name: 'Bunk Bed with Storage',
            price: '£449',
            images: ['bed4-1.jpg', 'bed4-2.jpg'],
            sizes: ['Single', 'Double']
        }
    ],
    wallPanels: [
        {
            id: 'wp1',
            name: 'Modern 3D Wall Panels',
            price: '£199',
            images: ['panel1-1.jpg', 'panel1-2.jpg'],
            sizes: ['4x8ft', '6x8ft']
        },
        {
            id: 'wp2',
            name: 'Classic Wooden Panels',
            price: '£249',
            images: ['panel2-1.jpg', 'panel2-2.jpg'],
            sizes: ['4x8ft', '6x8ft', '8x8ft']
        }
    ]
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const closeModal = document.querySelector('.close');

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const hamburger = document.querySelector('.hamburger-menu');
            const navMenu = document.querySelector('.nav-menu');
            const header = document.querySelector('header');
            
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (header) header.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
            
            // Get the target element
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add a small delay to allow mobile menu to close first
                setTimeout(() => {
                    // Calculate offset to account for sticky header
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    // Smooth scroll to the target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
});

// Carousel functionality - Simplified version
document.addEventListener('DOMContentLoaded', function() {
    // Get carousel elements
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Initialize the carousel
    function initCarousel() {
        if (slides.length === 0) return;
        
        // Set up initial state
        updateSlides();
        
        // Start automatic slideshow
        startSlideshow();
        
        // Add event listeners for controls
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                previousSlide();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                nextSlide();
            });
        }
        
        // Add event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                currentSlide = index;
                updateSlides();
                resetSlideshow();
            });
        });
    }
    
    // Update slide display
    function updateSlides() {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show current slide
        slides[currentSlide].style.display = 'block';
        
        // Update indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        indicators[currentSlide].classList.add('active');
    }
    
    // Go to next slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        updateSlides();
        resetSlideshow();
    }
    
    // Go to previous slide
    function previousSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        updateSlides();
        resetSlideshow();
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset slideshow timer
    function resetSlideshow() {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    // Make functions available globally
    window.moveSlide = function(direction) {
        if (direction < 0) {
            previousSlide();
        } else {
            nextSlide();
        }
    };
    
    window.goToSlide = function(index) {
        currentSlide = index;
        updateSlides();
        resetSlideshow();
    };
    
    // Initialize carousel
    initCarousel();
});

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Load products into their respective sections
function loadProducts() {
    Object.keys(products).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) {
            products[category].forEach(product => {
                const productCard = createProductCard(product, category);
                grid.appendChild(productCard);
            });
        }
    });
}

// Create product card element
function createProductCard(product, category) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="images/${product.images[0]}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button onclick="openOrderModal('${category}', '${product.id}')">Order Now</button>
        </div>
    `;
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Modal close button
    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // Form submission
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) return;

    const allProducts = [...products.wardrobes, ...products.sofas, ...products.beds, ...products.wallPanels];
    const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );

    // Clear all product sections
    document.querySelectorAll('.product-grid').forEach(grid => {
        grid.innerHTML = '';
    });

    // Display search results
    if (results.length > 0) {
        const firstGrid = document.querySelector('.product-grid');
        results.forEach(product => {
            const category = Object.keys(products).find(cat => 
                products[cat].some(p => p.id === product.id)
            );
            const productCard = createProductCard(product, category);
            firstGrid.appendChild(productCard);
        });
    } else {
        const firstGrid = document.querySelector('.product-grid');
        firstGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
    }
}

// Open order modal with product details
function openOrderModal(category, productId) {
    const product = products[category].find(p => p.id === productId);
    if (!product) return;

    document.getElementById('selected-product').value = product.name;
    orderModal.style.display = 'block';
}

// Handle order form submission
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const orderData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            // Show success message
            alert('Your order is booked. For details and tracking, WhatsApp us.');
            
            // Create WhatsApp message
            const whatsappMessage = `Hi, I want to book my order. Here are my details:
Name: ${orderData.name}
Address: ${orderData.address}
Postcode: ${orderData.postcode}
Product: ${orderData.product}
Size: ${orderData.size}
WhatsApp No: ${orderData.whatsapp}`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/447494821146?text=${encodedMessage}`;
            
            // Show WhatsApp option
            if (confirm('OR you can book your order by sending the above details on our WhatsApp directly.')) {
                window.open(whatsappUrl, '_blank');
            }
            
            // Close modal and reset form
            orderModal.style.display = 'none';
            orderForm.reset();
        } else {
            throw new Error('Failed to submit order');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again or contact us via WhatsApp.');
    }
}

// Search Functionality (Keep this part)
document.addEventListener('DOMContentLoaded', function() {
    // ... existing search code ...
}); 

// Enhanced Customer Ratings Animation
document.addEventListener('DOMContentLoaded', function() {
    const ratingItems = document.querySelectorAll('.rating-item');
    
    // Add hover effects and animations
    ratingItems.forEach((item, index) => {
        // Add staggered entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
        
        // Add pulsing effect on hover
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease-in-out';
        });
        
        item.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add keyframe animation for pulse effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Animate numbers when they come into view
    const animateNumbers = () => {
        const ratingNumbers = document.querySelectorAll('.rating-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const finalValue = element.textContent;
                    
                    // Extract the numeric part
                    const numericPart = parseFloat(finalValue);
                    const suffix = finalValue.replace(numericPart, '');
                    
                    if (!isNaN(numericPart)) {
                        let startValue = 0;
                        const duration = 2000; // ms
                        const increment = numericPart / (duration / 16); // 60fps
                        
                        const animate = () => {
                            startValue += increment;
                            if (startValue >= numericPart) {
                                element.textContent = finalValue;
                            } else {
                                element.textContent = Math.floor(startValue) + suffix;
                                requestAnimationFrame(animate);
                            }
                        };
                        
                        animate();
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        ratingNumbers.forEach(num => {
            observer.observe(num);
        });
    };
    
    // Run the number animation
    animateNumbers();
});
