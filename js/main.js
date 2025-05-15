document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navList.classList.contains('active') && 
            !event.target.closest('.nav-list') && 
            !event.target.closest('.menu-toggle')) {
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Testimonial slider functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (testimonialSlides.length > 0) {
        let currentSlide = 0;
        
        // Create dots
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('testimonial-dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        const dots = document.querySelectorAll('.testimonial-dot');
        
        // Show a specific slide
        function goToSlide(index) {
            testimonialSlides.forEach(slide => slide.style.display = 'none');
            testimonialSlides[index].style.display = 'block';
            
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            goToSlide(currentSlide);
        }
        
        // Previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            goToSlide(currentSlide);
        }
        
        // Add event listeners to buttons
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Auto-advance slides every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // Active navigation highlighting
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}` || 
                (window.location.pathname === '/' && link.getAttribute('href') === 'index.html' && currentSection === '')) {
                link.classList.add('active');
            } else if (link.getAttribute('href').includes(window.location.pathname.substring(1))) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active nav link on page load and scroll
    setActiveNavLink();
    window.addEventListener('scroll', setActiveNavLink);
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Create or update error message
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                    errorMessage.textContent = 'This field is required';
                } else {
                    field.classList.remove('error');
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
            }
        });
    });
    
    // Fade-in animation for elements
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Run on page load
    checkFade();
    
    // Run on scroll
    window.addEventListener('scroll', checkFade);
});
