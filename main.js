/**
 * Bhumika Khatri — Travel & Lifestyle Storyteller Portfolio JS
 * Enhances the experience with premium micro-interactions, mouse parallax sways,
 * scroll reveals, and email copying feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initScrollReveal();
  initContactFeedback();
  initSpiralBinder();
});

/**
 * 1. Mouse-Tracking Parallax Sway for Hero Callouts
 * Adds a subtle, tactile movement to the absolute-positioned callouts and stars
 * as the user moves their cursor across the hero area on desktop.
 */
function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const callouts = document.querySelectorAll('.hero-callout');
  const stars = document.querySelectorAll('.star-doodle');
  
  if (!heroSection || window.innerWidth < 768) return;

  heroSection.addEventListener('mousemove', (e) => {
    // Get mouse position relative to the center of the hero section
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Convert to percentage offsets (-1 to 1)
    const pctX = mouseX / (rect.width / 2);
    const pctY = mouseY / (rect.height / 2);
    
    // Apply sway to callouts
    callouts.forEach((callout, index) => {
      // Alternate movement direction slightly for organic look
      const multiplier = (index % 2 === 0) ? 12 : -12;
      const moveX = pctX * multiplier;
      const moveY = pctY * multiplier;
      
      callout.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // Apply sway to stars (different speeds for depth)
    stars.forEach((star, index) => {
      const multiplier = (index + 1) * 6;
      const moveX = pctX * multiplier;
      const moveY = pctY * multiplier;
      
      star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Reset transforms when mouse leaves
  heroSection.addEventListener('mouseleave', () => {
    callouts.forEach(callout => {
      callout.style.transform = 'translate(0, 0)';
    });
    stars.forEach(star => {
      star.style.transform = 'translate(0, 0)';
    });
  });
}

/**
 * 2. Scroll Reveal Observer
 * Triggers clean fade-in and slide-up animations for polaroids, timeline steps,
 * and contact cards as they scroll into view.
 */
function initScrollReveal() {
  // Set up CSS variables and initial styles programmatically to avoid flashes
  const revealTargets = [
    ...document.querySelectorAll('.polaroid-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.stats-card'),
    document.querySelector('.contact-box')
  ];

  revealTargets.forEach(target => {
    if (!target) return;
    
    // Store original transition and transform
    const originalTransform = window.getComputedStyle(target).transform;
    target.dataset.originalTransform = originalTransform === 'none' ? '' : originalTransform;
    
    // Apply initial hidden styles
    target.style.opacity = '0';
    target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    
    if (target.classList.contains('timeline-item')) {
      target.style.transform = 'translateY(20px)';
    } else if (target.classList.contains('polaroid-card')) {
      // Incorporate initial rotation so they don't look weird while revealing
      const rot = target.classList.contains('rotate-left') ? -3.5 : 
                  target.classList.contains('rotate-right') ? 3 : 
                  target.classList.contains('rotate-left-slight') ? -1.5 : 2;
      target.style.transform = `translateY(30px) rotate(${rot}deg)`;
    } else {
      target.style.transform = 'translateY(25px)';
    }
  });

  // Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        // Restore opacity
        target.style.opacity = '1';
        
        // Restore transform state
        if (target.classList.contains('timeline-item')) {
          target.style.transform = 'translateY(0)';
        } else if (target.classList.contains('polaroid-card')) {
          const rot = target.classList.contains('rotate-left') ? -3.5 : 
                      target.classList.contains('rotate-right') ? 3 : 
                      target.classList.contains('rotate-left-slight') ? -1.5 : 2;
          target.style.transform = `translateY(0) rotate(${rot}deg)`;
        } else {
          target.style.transform = 'translateY(0)';
        }
        
        // Clean up styles after transition finishes to preserve native CSS hovers
        setTimeout(() => {
          if (target.style.opacity === '1') {
            target.style.transition = '';
            target.style.transform = '';
          }
        }, 850);

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  revealTargets.forEach(target => {
    if (target) revealObserver.observe(target);
  });
}

/**
 * 3. Smart Contact Button Feedback & Copy Action
 * Copies the email on click and shows a verification checkmark,
 * then opens mailto in a new window or default handler.
 */
function initContactFeedback() {
  const contactBtn = document.getElementById('contact-btn');
  if (!contactBtn) return;

  const originalText = contactBtn.textContent.trim();
  const email = "collab.bhumii@gmail.com";

  contactBtn.addEventListener('click', (e) => {
    // Stop direct nav redirection to execute copy first
    e.preventDefault();
    
    // Copy email to clipboard
    navigator.clipboard.writeText(email).then(() => {
      // Visual success confirmation feedback
      contactBtn.textContent = "Email Copied! ✓";
      contactBtn.style.backgroundColor = "var(--text-ink)";
      contactBtn.style.color = "var(--bg-paper)";
      
      // Open mailto link
      setTimeout(() => {
        window.location.href = `mailto:${email}`;
      }, 300);

      // Revert button styling after 3 seconds
      setTimeout(() => {
        contactBtn.textContent = originalText;
        contactBtn.style.backgroundColor = "";
        contactBtn.style.color = "";
      }, 3000);
    }).catch(err => {
      // Fallback if copy fails
      console.warn("Failed to copy email: ", err);
      window.location.href = `mailto:${email}`;
  });
}

/**
 * 4. Dynamic Spiral Binder Rings Generator
 * Spaces out metal rings across the page width on load and resize,
 * ensuring the binder separator always looks perfect.
 */
function initSpiralBinder() {
  const container = document.querySelector('.binder-rings-container');
  if (!container) return;

  // Clear existing rings
  container.innerHTML = '';

  // Calculate rings count based on viewport width
  const containerWidth = container.offsetWidth || window.innerWidth;
  const ringSpacing = 72; // pixels between each ring
  const ringCount = Math.max(5, Math.floor(containerWidth / ringSpacing));

  for (let i = 0; i < ringCount; i++) {
    const ring = document.createElement('div');
    ring.className = 'binder-ring';
    ring.innerHTML = `
      <div class="ring-hole hole-top"></div>
      <div class="metal-ring"></div>
      <div class="ring-hole hole-bottom"></div>
    `;
    container.appendChild(ring);
  }
}

// Re-initialize rings on window resize with a basic debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initSpiralBinder, 100);
});
