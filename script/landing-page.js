// Debounce function to limit how often a function is called
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Smooth scrolling to section
function smoothScrollTo(target, duration = 1000) {
  const start = window.scrollY;
  const distance = target.getBoundingClientRect().top;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // Ease function for smooth animation (ease-in-out)
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// ScrollSpy functionality to highlight active section in navbar
function scrollSpy(navLinks) {
  const sections = Array.from(navLinks).map(link => document.querySelector(link.hash));

  function handleScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, i) => {
      if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[i].classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', debounce(handleScroll));
  handleScroll();  // Initialize scroll spy
}

// Detect if a link is external
function isExternalLink(link) {
  return link.hostname !== window.location.hostname;
}

// Set up event listeners for menu links
function setupMenuLinks() {
  const menuLinks = document.querySelectorAll('nav a');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Check if the link is external
      if (isExternalLink(link)) return; // Let external links work as normal

      event.preventDefault();
      const targetSection = document.querySelector(link.hash);
      if (targetSection) smoothScrollTo(targetSection);
    });
  });

  // Activate scrollSpy to update active link based on scrolling
  scrollSpy(menuLinks);
}

// Back to top button logic (optional)
function setupBackToTopButton() {
  const backToTopBtn = document.querySelector('#backToTopBtn');

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', debounce(toggleBackToTop));

  backToTopBtn.addEventListener('click', (event) => {
    event.preventDefault();
    smoothScrollTo(document.body, 800);
  });
}

// Initialize functions
document.addEventListener('DOMContentLoaded', () => {
  setupMenuLinks();
  setupBackToTopButton();  // If a back-to-top button is used
});
