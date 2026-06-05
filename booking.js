// ─────────────────────────────────────────────
// EMAILJS CONFIGURATION
// Replace these three values — emailjs.com dashboard:
//   Public Key  → Account > API Keys
//   Service ID  → Email Services tab
//   Template ID → Email Templates tab
// ─────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── Pre-select service from URL param ──
// e.g. booking.html?service=exterior
const serviceMap = {
  exterior: 'Exterior Detail - $40',
  interior: 'Interior Detail - $50',
  full:     'Full Detail - $80',
};
const param = new URLSearchParams(window.location.search).get('service');
if (param && serviceMap[param]) {
  const sel = document.getElementById('service');
  if (sel) sel.value = serviceMap[param];
}

// ── Set minimum selectable date to today ──
const dateInput = document.getElementById('date');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

// ── Form elements ──
const form    = document.getElementById('booking-form');
const btn     = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const spinner = document.getElementById('spinner');
const msgOk   = document.getElementById('msg-success');
const msgErr  = document.getElementById('msg-error');

function setLoading(on) {
  btn.disabled = on;
  btnText.textContent = on ? 'Sending…' : 'Send booking request';
  spinner.classList.toggle('show', on);
}

function validate() {
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    f.classList.remove('err');
    if (!f.value.trim()) { f.classList.add('err'); ok = false; }
  });
  const email = document.getElementById('email');
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('err'); ok = false;
  }
  return ok;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  msgOk.style.display = msgErr.style.display = 'none';
  if (!validate()) return;

  setLoading(true);

  const params = {
    customer_name:  `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
    customer_phone: document.getElementById('phone').value.trim(),
    customer_email: document.getElementById('email').value.trim(),
    service:        document.getElementById('service').value,
    preferred_date: document.getElementById('date').value,
    preferred_time: document.getElementById('time').value,
    address:        document.getElementById('address').value.trim(),
    vehicle:        document.getElementById('vehicle').value.trim() || 'Not provided',
    notes:          document.getElementById('notes').value.trim() || 'None',
    reply_to:       document.getElementById('email').value.trim(),
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    msgOk.style.display = 'block';
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    msgErr.style.display = 'block';
  } finally {
    setLoading(false);
  }
});

form.querySelectorAll('input, select, textarea').forEach(f =>
  f.addEventListener('input', () => f.classList.remove('err'))
);
