// View Transition API for MPA navigation

// Check if View Transitions API is supported
if (!document.startViewTransition) {
  console.log('View Transitions API not supported in this browser');
}

// Intercept link clicks for smoother transitions
document.addEventListener('DOMContentLoaded', function() {
  // Get all internal links
  const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="index.html"], a[href^="about.html"], a[href^="projects.html"], a[href^="contact.html"], a[href^="form-no-js.html"], a[href^="form-with-js.html"]');
  
  links.forEach(link => {
    // Skip links that open in new tab or are downloads
    if (link.target === '_blank' || link.download) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's the current page
      if (href === window.location.pathname || href === window.location.pathname.split('/').pop()) {
        e.preventDefault();
        return;
      }
      
      // Skip external links
      if (this.hostname !== window.location.hostname) {
        return;
      }
      
      // For browsers that support View Transitions
      if (document.startViewTransition) {
        e.preventDefault();
        
        // Start the transition
        document.startViewTransition(() => {
          // Navigate to the new page
          window.location.href = href;
        });
      }
      // For browsers that don't support it, let the link work normally
    });
  });
});

console.log('View Transitions initialized for MPA navigation');
