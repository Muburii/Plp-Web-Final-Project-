/**
 * Horizon Website - JavaScript
 * Contains all interactive elements for the website
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize slideshow if on homepage
    if (document.querySelector('.slideshow-container')) {
        initSlideshow();
    }
    
    // Initialize form validation if on contact page
    if (document.getElementById('contactForm')) {
        initFormValidation();
    }
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            // Toggle active class on nav links
            navLinks.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const expanded = navLinks.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (
                !event.target.closest('.nav-links') && 
                !event.target.closest('.mobile-nav-toggle') && 
                navLinks.classList.contains('active')
            ) {
                navLinks.classList.remove('active');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Projects Slideshow
 */
let slideIndex = 1;

function initSlideshow() {
    showSlides(slideIndex);
    
    // Add event listeners to prev and next buttons if they exist
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            changeSlide(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            changeSlide(1);
        });
    }
    
    // Add event listeners to dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide(index + 1);
        });
    });
    
    // Auto advance slides every 5 seconds
    setInterval(function() {
        changeSlide(1);
    }, 5000);
}

// Next/previous controls
function changeSlide(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length) return;
    
    // Reset to first slide if past the end
    if (n > slides.length) {
        slideIndex = 1;
    }
    
    // Go to last slide if going before the first
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    
    // Show current slide and activate current dot
    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add('active');
    
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add('active');
    }
}

/**
 * Contact Form Validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Success - would normally submit to server
            showFormSuccess();
            contactForm.reset();
        }
    });
    
    // Add live validation on input fields
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear error message when user starts typing
        input.addEventListener('input', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

function validateForm() {
    let isValid = true;
    
    // Validate name
    const nameInput = document.getElementById('name');
    if (!validateField(nameInput)) {
        isValid = false;
    }
    
    // Validate email
    const emailInput = document.getElementById('email');
    if (!validateField(emailInput)) {
        isValid = false;
    }
    
    // Validate subject
    const subjectInput = document.getElementById('subject');
    if (!validateField(subjectInput)) {
        isValid = false;
    }
    
    // Validate message
    const messageInput = document.getElementById('message');
    if (!validateField(messageInput)) {
        isValid = false;
    }
    
    // Validate consent
    const consentInput = document.getElementById('consent');
    if (!validateField(consentInput)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    
    // Reset error message
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        errorElement.textContent = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
            errorElement.textContent = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation (optional field)
    if (field.id === 'phone' && field.value.trim()) {
        const phonePattern = /^[0-9+\s()-]{8,20}$/;
        if (!phonePattern.test(field.value)) {
            errorElement.textContent = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    // Message length validation
    if (field.id === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            errorElement.textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
    }
    
    // Checkbox validation
    if (field.type === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
            errorElement.textContent = 'You must agree to proceed';
            isValid = false;
        }
    }
    
    // Visual feedback
    if (!isValid) {
        field.classList.add('invalid');
    } else {
        field.classList.remove('invalid');
    }
    
    return isValid;
}

function showFormSuccess() {
    const successMessage = document.getElementById('formSuccess');
    successMessage.style.display = 'block';
    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}