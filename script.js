// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dots span');
let current  = 0, timer;

function goTo(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }
function startAuto() { timer = setInterval(next, 5000); }
function stopAuto()  { clearInterval(timer); }

document.getElementById('hero-next')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
document.getElementById('hero-prev')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
startAuto();

// ===== NAV HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!e.target.closest('nav')) navLinks?.classList.remove('open');
});

// ===== STICKY NAV SHADOW =====
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,.15)' : '0 2px 10px rgba(0,0,0,.1)';
});

// ===== DONATION MODAL =====
const overlay   = document.getElementById('donationModal');
const modalTitle = document.getElementById('modalCause');
const customAmt = document.getElementById('customAmount');
const amtBtns   = document.querySelectorAll('.amount-btn');

function openModal(cause) {
  if (modalTitle) modalTitle.textContent = cause;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // reset selection
  amtBtns.forEach(b => b.classList.remove('selected'));
  amtBtns[1]?.classList.add('selected');
  if (customAmt) customAmt.value = '';
}
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.btn-donate').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.cause || 'General Donation'));
});
document.getElementById('modalClose')?.addEventListener('click', closeModal);
overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

amtBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amtBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (customAmt) customAmt.value = '';
  });
});
customAmt?.addEventListener('input', () => amtBtns.forEach(b => b.classList.remove('selected')));

document.getElementById('donateForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const selected = document.querySelector('.amount-btn.selected');
  const amount = selected ? selected.dataset.amount : customAmt?.value;
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert('Please select or enter a valid donation amount.');
    return;
  }
  const name  = document.getElementById('donorName').value.trim();
  const email = document.getElementById('donorEmail').value.trim();
  if (!name || !email) { alert('Please fill in your name and email.'); return; }
  alert(`Thank you ${name}! Your donation of £${Number(amount).toFixed(2)} towards "${modalTitle.textContent}" has been received.\nJazakAllah Khayr!`);
  closeModal();
  e.target.reset();
});

// ===== PROGRESS BAR ANIMATION on scroll =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-bar-fill');
      if (fill) {
        const target = fill.dataset.width;
        setTimeout(() => { fill.style.width = target; }, 100);
      }
    }
  });
}, { threshold: .3 });
document.querySelectorAll('.cause-card').forEach(c => observer.observe(c));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = (current >= 1000 ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K' : Math.floor(current)) + suffix;
    if (current < target) requestAnimationFrame(tick);
    else el.textContent = el.dataset.display || el.textContent;
  };
  tick();
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ===== NEWSLETTER FORM =====
document.getElementById('newsletterForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  alert(`JazakAllah Khayr! ${email} has been subscribed to our updates.`);
  e.target.reset();
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
