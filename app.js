// =============================================
// EMAILJS CONFIGURATION
// Replace these three values with your own from
// your EmailJS dashboard (emailjs.com):
//   - Public Key:  Account > API Keys
//   - Service ID:  Email Services tab
//   - Template ID: Email Templates tab
// =============================================
const EMAILJS_PUBLIC_KEY  = 'eHUGwjIRURwmBsw7D';
const EMAILJS_SERVICE_ID  = 'service_hswezac';
const EMAILJS_TEMPLATE_ID = 'template_9og5lel';

// Initialize EmailJS with your public key
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SET MINIMUM DATE ON CALENDAR =====
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ===== BOOKING FORM =====
const form      = document.getElementById('booking-form');
const btnText   = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg   = document.getElementById('form-error');

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? 'Sending…' : 'Send Booking Request';
  btnSpinner.classList.toggle('hidden', !loading);
}

function showFeedback(type) {
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');
  if (type === 'success') successMsg.classList.remove('hidden');
  if (type === 'error')   errorMsg.classList.remove('hidden');
}

function validateForm() {
  let valid = true;
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  // Basic email check
  const emailField = document.getElementById('email');
  if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('error');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  if (!validateForm()) return;

  setLoading(true);

  const templateParams = {
    customer_name:   `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
    customer_phone:  document.getElementById('phone').value.trim(),
    customer_email:  document.getElementById('email').value.trim(),
    service:         document.getElementById('service').value,
    preferred_date:  document.getElementById('date').value,
    preferred_time:  document.getElementById('time').value,
    address:         document.getElementById('address').value.trim(),
    vehicle:         document.getElementById('carInfo').value.trim() || 'Not provided',
    notes:           document.getElementById('message').value.trim() || 'None',
    reply_to:        document.getElementById('email').value.trim(),
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    showFeedback('success');
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    showFeedback('error');
  } finally {
    setLoading(false);
  }
});

// Remove error styling on input
form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ===== SMOOTH SCROLL OFFSET FOR FIXED NAV =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 10;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
