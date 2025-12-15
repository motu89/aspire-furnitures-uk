// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    const searchInput = searchContainer.querySelector('#search-input');
    const searchButton = searchContainer.querySelector('#search-button');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
                e.preventDefault();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) return; // At least 2 characters
        
        // Example: Products we can search for
        const products = [
            {name: 'Modern Sliding Wardrobe', type: 'wardrobe', url: 'products/wardrobe1.html'},
            {name: 'Modern Full Mirror Sliding Doors Wardrobe - Vision', type: 'wardrobe', url: 'products/wardrobe2.html'},
            {name: 'Modern Full Mirror Sliding Doors Wardrobe - Oslo', type: 'wardrobe', url: 'products/wardrobe3.html'},
            {name: 'Modern Full Mirror Sliding Doors Wardrobe - Nichole', type: 'wardrobe', url: 'products/wardrobe4.html'},
            {name: '3+2 Corner Sofa', type: 'sofa', url: 'products/sofa1.html'},
            {name: 'Ushape Sofa', type: 'sofa', url: 'products/sofa2.html'},
            {name: 'Dylan Corner Sofa', type: 'sofa', url: 'products/sofa3.html'},
            {name: 'Ashton Sofa 3+2', type: 'sofa', url: 'products/sofa4.html'},
            {name: 'Florida Beds With Mattress', type: 'bed', url: 'products/bed1.html'},
            {name: 'Panel Wing Beds With Mattress', type: 'bed', url: 'products/bed2.html'},
            {name: 'Hilton Beds With Mattress', type: 'bed', url: 'products/bed3.html'},
            {name: 'Plastic Wooden Effect PVC Wall Panels', type: 'panel', url: 'products/panel1.html'},
            {name: 'Acoustic Wooden Panels', type: 'panel', url: 'products/panel2.html'}
        ];
        
        // Filter products by search query
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.type.toLowerCase().includes(query)
        );
        
        displayResults(results, query);
    }
    
    function displayResults(results, query) {
        // Create or get results container
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            resultsContainer.style.position = 'absolute';
            resultsContainer.style.top = '100%';
            resultsContainer.style.right = '0';
            resultsContainer.style.width = '300px';
            resultsContainer.style.backgroundColor = 'white';
            resultsContainer.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            resultsContainer.style.borderRadius = '4px';
            resultsContainer.style.zIndex = '1002';
            resultsContainer.style.maxHeight = '300px';
            resultsContainer.style.overflowY = 'auto';
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(resultsContainer);
        }
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Display results or "no results" message
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="padding: 10px; margin: 0; color: #666;">No products found matching "' + query + '"</p>';
        } else {
            const resultsList = document.createElement('ul');
            resultsList.style.listStyle = 'none';
            resultsList.style.padding = '0';
            resultsList.style.margin = '0';
            
            results.forEach(product => {
                const listItem = document.createElement('li');
                listItem.style.borderBottom = '1px solid #f1f1f1';
                
                const link = document.createElement('a');
                link.href = product.url;
                link.textContent = product.name;
                link.style.display = 'block';
                link.style.padding = '10px 15px';
                link.style.color = '#333';
                link.style.textDecoration = 'none';
                link.style.transition = 'background-color 0.2s';
                
                link.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f9f9f9';
                });
                
                link.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
                
                listItem.appendChild(link);
                resultsList.appendChild(listItem);
            });
            
            resultsContainer.appendChild(resultsList);
        }
        
        // Show results
        resultsContainer.style.display = 'block';
        
        // Add click event to close results when clicking outside
        document.addEventListener('click', function closeResults(e) {
            if (!searchContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
                document.removeEventListener('click', closeResults);
            }
        });
    }
}); 