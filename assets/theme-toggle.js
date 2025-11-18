// Theme Toggle with localStorage

(function() {
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function() {
        // Create theme toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        
        // Set initial button content
        updateButtonContent(toggleButton, savedTheme);
        
        // Add click handler
        toggleButton.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button content
            updateButtonContent(toggleButton, newTheme);
        });
        
        // Add to page
        document.body.appendChild(toggleButton);
    });
    
    function updateButtonContent(button, theme) {
        if (theme === 'dark') {
            button.innerHTML = '<span class="icon">☀️</span><span>Light Mode</span>';
        } else {
            button.innerHTML = '<span class="icon">🌙</span><span>Dark Mode</span>';
        }
    }
})();
