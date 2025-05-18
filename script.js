// FAQ acordeón
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

// Botón volver arriba
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Placeholder animación de conteo (puedes personalizar luego)
// Ejemplo: contar horas ahorradas
// function animateCount(id, start, end, duration) {
//   let current = start;
//   const increment = (end - start) / (duration / 16);
//   const el = document.getElementById(id);
//   function update() {
//     current += increment;
//     if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
//       el.textContent = end;
//     } else {
//       el.textContent = Math.round(current);
//       requestAnimationFrame(update);
//     }
//   }
//   update();
// }
// animateCount('horasAhorradas', 24, 0, 2000);

// Scroll suave para anclas
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animación tipo AOS para .card
function animateAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  elements.forEach(el => observer.observe(el));
}
window.addEventListener('DOMContentLoaded', animateAOS);

// Animación de conteo para KPIs
function animateCountUp(el, end) {
  let start = 0;
  if (typeof end === 'string' && end.includes('h')) return; // skip for "24 h → 0 h"
  const duration = 1200;
  const step = Math.abs(end) > 100 ? 5 : 1;
  let current = start;
  const increment = end > 0 ? step : -step;
  function update() {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      el.textContent = (end > 0 ? '+' : '') + end + ' %';
    } else {
      el.textContent = (end > 0 ? '+' : '') + current + ' %';
      requestAnimationFrame(update);
    }
  }
  update();
}

// KPI-bar IntersectionObserver
let kpiAnimated = false;
const kpiBar = document.querySelector('.kpi-bar');
if (kpiBar) {
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !kpiAnimated) {
        document.querySelectorAll('.kpi-num').forEach(el => {
          const val = el.getAttribute('data-count');
          if (!isNaN(val)) animateCountUp(el, parseInt(val));
        });
        kpiAnimated = true;
        // GA4 event
        if (window.gtag) window.gtag('event', 'view_kpi', { section: 'pain-points' });
        kpiObserver.unobserve(kpiBar);
      }
    });
  }, { threshold: 0.4 });
  kpiObserver.observe(kpiBar);
}
