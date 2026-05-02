/* ---- Scroll progress bar ---- */
const bar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
}, { passive: true });

/* ---- Hamburger menu toggle ---- */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});
navMenu && navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Intersection Observer: reveal elements ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

/* ---- Parallax portrait (desktop only) ---- */
const portrait = document.querySelector('.hero__right-placeholder');
if (portrait && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    portrait.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });
}

/* ---- Animated number counter ---- */
function animateCounter(el, target, duration) {
  const step = target / (duration / 16);
  let cur = 0;
  const tick = () => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.round(cur);
    if (cur < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.counter), 1400);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => counterIO.observe(el));

/* ---- Project filter tabs ---- */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cats  = card.dataset.category || '';
      const match = filter === 'all' || cats.includes(filter);
      if (match) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => card.classList.remove('fade-out'));
      } else {
        card.classList.add('fade-out');
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

/* ---- Skill bar animation ---- */
const skillBarIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fills = e.target.querySelectorAll('.skill-bar__fill');
      fills.forEach(fill => {
        const w = fill.dataset.width || 0;
        requestAnimationFrame(() => { fill.style.width = w + '%'; });
      });
      skillBarIO.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills__col').forEach(col => skillBarIO.observe(col));


/* ================================================================
   CONTACT FORM  —  EmailJS + Validation
   ================================================================
   Replace the two placeholder values below with your real IDs
   from https://dashboard.emailjs.com
   ================================================================ */
const EMAILJS_SERVICE_ID  = 'service_pieufs5';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_p0jkw28';  // e.g. 'template_xyz456'

/* DOM refs */
const contactForm    = document.getElementById('contact-form');
const nameInput      = document.getElementById('name-input');
const msgInput       = document.getElementById('message-input');
const emailInput     = document.getElementById('email-input');
const emailMsg       = document.getElementById('email-msg');
const emailFieldWrap = document.getElementById('email-group');
const nameError      = document.getElementById('name-error');
const messageError   = document.getElementById('message-error');
const emailError     = document.getElementById('email-error');

/* ---- Helpers ---- */
function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function setFieldError(input, errorEl, msg) {
  if (!input || !errorEl) return;
  if (msg) {
    input.classList.add('has-error');
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  } else {
    input.classList.remove('has-error');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function showFormMsg(type, text) {
  if (!emailMsg) return;
  emailMsg.className = 'email-form__msg' + (type ? ' ' + type : '');
  emailMsg.textContent = text;
}

function clearFormMsg() { showFormMsg('', ''); }

/* ---- Live clear-on-type ---- */
nameInput  && nameInput.addEventListener('input',  () => setFieldError(nameInput,  nameError,  ''));
msgInput   && msgInput.addEventListener('input',   () => setFieldError(msgInput,   messageError, ''));
emailInput && emailInput.addEventListener('input', () => {
  setFieldError(emailInput, emailError, '');
  emailFieldWrap && emailFieldWrap.classList.remove('has-error');
  clearFormMsg();
});

/* ---- Validation ---- */
function validateForm() {
  let valid = true;

  const name    = nameInput  ? nameInput.value.trim()  : '';
  const message = msgInput   ? msgInput.value.trim()   : '';
  const email   = emailInput ? emailInput.value.trim() : '';

  // Name
  if (!name) {
    setFieldError(nameInput, nameError, 'Name is required.');
    valid = false;
  } else if (name.length < 2) {
    setFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
    valid = false;
  } else {
    setFieldError(nameInput, nameError, '');
  }

  // Message
  if (!message) {
    setFieldError(msgInput, messageError, 'Message is required.');
    valid = false;
  } else if (message.length < 10) {
    setFieldError(msgInput, messageError, 'Message must be at least 10 characters.');
    valid = false;
  } else {
    setFieldError(msgInput, messageError, '');
  }

  // Email
  if (!email) {
    setFieldError(emailInput, emailError, 'Email is required.');
    emailFieldWrap && emailFieldWrap.classList.add('has-error');
    valid = false;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, 'Please enter a valid email address.');
    emailFieldWrap && emailFieldWrap.classList.add('has-error');
    valid = false;
  } else {
    setFieldError(emailInput, emailError, '');
    emailFieldWrap && emailFieldWrap.classList.remove('has-error');
  }

  return valid;
}

/* ---- Submit via EmailJS ---- */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormMsg();

    if (!validateForm()) {
      showFormMsg('error', '✗ Please fix the errors above before sending.');
      const firstErr = contactForm.querySelector('.has-error');
      firstErr && firstErr.focus();
      return;
    }

    const submitBtn = document.getElementById('email-submit');
    const btnLabel  = submitBtn.querySelector('span');
    submitBtn.disabled   = true;
    btnLabel.textContent = 'Sending…';

    const params = {
      name:    nameInput.value.trim(),
      email:   emailInput.value.trim(),
      message: msgInput.value.trim(),
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(() => {
        showFormMsg('success', "✓ Message sent! I'll get back to you soon.");
        contactForm.reset();
        [nameError, messageError, emailError].forEach(el => {
          if (el) { el.textContent = ''; el.classList.remove('visible'); }
        });
        [nameInput, msgInput, emailInput].forEach(el => el && el.classList.remove('has-error'));
        emailFieldWrap && emailFieldWrap.classList.remove('has-error');
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showFormMsg('error', '✗ Something went wrong. Please try again or email me directly.');
      })
      .finally(() => {
        submitBtn.disabled   = false;
        btnLabel.textContent = 'Send it';
      });
  });
}
