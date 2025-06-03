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

// Mobile menu functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navbarMenu = document.querySelector('.navbar-menu');
const navbarLinks = document.querySelectorAll('.navbar-links a');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  navbarMenu.classList.toggle('active');
});

// Close menu when clicking a link
navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    navbarMenu.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburgerMenu.contains(e.target) && !navbarMenu.contains(e.target)) {
    hamburgerMenu.classList.remove('active');
    navbarMenu.classList.remove('active');
  }
});

// Calculadora ROI interactiva

// ... existing code ...

// ROI Calculator
const calculatorInputs = document.querySelectorAll('.calculator-input');
const monthlySavings = document.getElementById('monthly-savings');
const yearlySavings = document.getElementById('yearly-savings');
const roiValue = document.getElementById('roi');

function calculateROI() {
  const hours = parseFloat(document.getElementById('hours').value) || 0;
  const cost = parseFloat(document.getElementById('cost').value) || 0;
  const teamSize = parseFloat(document.getElementById('team-size').value) || 0;

  // Asumimos que la IA reduce el tiempo en un 80%
  const timeReduction = 0.8;
  const monthlyHoursSavedPerEmployee = hours * timeReduction;
  const monthlyHoursSaved = monthlyHoursSavedPerEmployee * teamSize;
  const monthlyCostSaved = monthlyHoursSaved * cost;
  const yearlyCostSaved = monthlyCostSaved * 12;
  
  // ROI = (Ahorro anual / Inversión inicial) * 100
  // Asumimos una inversión inicial de $1000
  const initialInvestment = 1000;
  const roi = ((yearlyCostSaved - initialInvestment) / initialInvestment) * 100;
  
  // Actualizar resultados con animación
  animateValue(monthlySavings, monthlyCostSaved, '$');
  animateValue(yearlySavings, yearlyCostSaved, '$');
  animateValue(roiValue, roi, '%');
}

function animateValue(element, end, prefix = '') {
  const start = parseFloat(element.textContent.replace(/[^0-9.-]+/g, '')) || 0;
  const duration = 1000;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = start + (end - start) * progress;
    element.textContent = prefix + Math.round(current).toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

calculatorInputs.forEach(input => {
  input.addEventListener('input', calculateROI);
});

// Calcular valores iniciales
calculateROI();

// ... existing code ...

// Navbar fondo transparente y sticky con fondo negro al scrollear
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight / 2) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
});