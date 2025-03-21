// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update aria-current for navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.setAttribute('aria-current', 'false');
            });
            this.setAttribute('aria-current', 'true');
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.style.background = 'var(--background)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'var(--background)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Form submission
const form = document.querySelector('form');
const formMessage = document.getElementById('form-message');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        const response = await fetch('https://spvxryp8j4.execute-api.eu-west-2.amazonaws.com/dev/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        // Show success/error message
        formMessage.textContent = data.message;
        formMessage.className = `form-message ${data.success ? 'success' : 'error'}`;
        formMessage.style.display = 'block';
        
        // Reset form on success
        if (data.success) {
            form.reset();
        }
        
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
    } finally {
        // Re-enable submit button and restore text
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        
        // Remove message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

// Add animation on scroll with reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !prefersReducedMotion.matches) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add loading animation for project cards with reduced motion support
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion.matches) {
            this.style.transform = 'translateY(-5px)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!prefersReducedMotion.matches) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Theme switching functionality
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
});

function updateThemeIcon(theme) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
} 