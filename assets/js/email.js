// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_3mta2nk',
    templateId: 'template_97ogr1k',
    userId: 'njHD48xNl8tkUu47J'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.userId);

// Form validation
function validateForm(formData) {
    const errors = {};

    if (!formData.from_name || formData.from_name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.from_email || !formData.from_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.message || formData.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const errorElements = {};

    // Create error message elements
    function createErrorElement(fieldName) {
        const errorElement = document.createElement('p');
        errorElement.className = 'mt-1 text-sm text-red-500';
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        field.parentNode.appendChild(errorElement);
        return errorElement;
    }

    if (contactForm) {
        // Create error elements for each field
        errorElements.name = createErrorElement('name');
        errorElements.email = createErrorElement('email');
        errorElements.message = createErrorElement('message');

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Disable submit button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            // Clear previous error messages
            Object.values(errorElements).forEach(element => {
                element.textContent = '';
            });

            // Get form data
            const formData = {
                from_name: contactForm.querySelector('input[name="name"]').value,
                from_email: contactForm.querySelector('input[name="email"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value,
                reply_to: contactForm.querySelector('input[name="email"]').value
            };

            // Validate form
            const { isValid, errors } = validateForm(formData);

            if (!isValid) {
                // Display validation errors
                Object.entries(errors).forEach(([field, message]) => {
                    if (errorElements[field]) {
                        errorElements[field].textContent = message;
                    }
                });

                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
                return;
            }

            try {
                console.log('Sending email with data:', formData);
                const response = await emailjs.send(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.templateId,
                    formData
                );
                console.log('Email sent successfully:', response);

                // Show success message
                alert('Message sent successfully! I will get back to you soon.');
                contactForm.reset();

            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('Failed to send message. Please try again later.');

            } finally {
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    }
}); 