/* =============================================
   VISIONPATH — MAIN JAVASCRIPT
   ============================================= */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* ── Intersection Observer for scroll animations ── */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe problem cards
document.querySelectorAll('.problem-card').forEach(el => {
  fadeObserver.observe(el);
});

// Generic fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});

// Steps animation
document.querySelectorAll('.step').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-20px)';
  el.style.transition = `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`;

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  stepObserver.observe(el);
});

// Feature cards animation
document.querySelectorAll('.feature-card, .tech-card, .ext-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${(i % 3) * 120}ms, transform 0.6s ease ${(i % 3) * 120}ms`;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cardObserver.observe(el);
});

// Alert cards
document.querySelectorAll('.alert-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'scale(0.96)';
  el.style.transition = `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`;

  const alertObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        alertObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  alertObs.observe(el);
});

// Impact points
document.querySelectorAll('.impact-point').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-20px)';
  el.style.transition = `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`;

  const impactObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        impactObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  impactObs.observe(el);
});

/* ── Animated number counter ── */
function animateCounter(el, target, duration = 1800) {
  const isFloat = target % 1 !== 0;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;

    if (target >= 1000000) {
      el.textContent = Math.floor(current / 1000000) + 'M';
    } else if (target >= 1000) {
      el.textContent = Math.floor(current / 1000) + 'K';
    } else if (isFloat) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current);
    }

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Counter targets: stat-num elements
const counterMap = {
  '285M': 285000000,
  '40M': 40000000,
  '24/7': null, // skip
};

document.querySelectorAll('.stat-num, .big-num').forEach(el => {
  const original = el.textContent.trim();
  if (original === '24/7') return; // don't animate this one

  let numericTarget;
  if (original.endsWith('M')) {
    numericTarget = parseFloat(original) * 1000000;
  } else if (original.endsWith('K')) {
    numericTarget = parseFloat(original) * 1000;
  } else {
    numericTarget = parseFloat(original);
  }

  el.textContent = '0';

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target, numericTarget);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterObs.observe(el);
});

/* ── Voice bubble rotation in hero ── */
const voiceMessages = [
  '"Turn left after 5 meters"',
  '"Obstacle ahead — stop"',
  '"Car approaching from right"',
  '"Step up in front"',
  '"Bus 42 arriving now"',
  '"You have reached your destination"',
];

const voiceBubble = document.querySelector('.voice-bubble span');
if (voiceBubble) {
  let msgIndex = 0;
  setInterval(() => {
    msgIndex = (msgIndex + 1) % voiceMessages.length;
    voiceBubble.style.opacity = '0';
    voiceBubble.style.transform = 'translateY(6px)';
    voiceBubble.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
      voiceBubble.textContent = voiceMessages[msgIndex];
      voiceBubble.style.opacity = '1';
      voiceBubble.style.transform = 'translateY(0)';
    }, 350);
  }, 3000);
}

/* ── Detection box rotation ── */
const boxConfigs = [
  { person: { top: '80px', left: '30px' }, signal: { top: '40px', right: '20px' }, car: { bottom: '60px', left: '60px' } },
  { person: { top: '60px', left: '60px' }, signal: { top: '20px', right: '40px' }, car: { bottom: '80px', left: '30px' } },
  { person: { top: '100px', left: '10px' }, signal: { top: '60px', right: '10px' }, car: { bottom: '40px', left: '70px' } },
];

const boxPerson = document.querySelector('.box-person');
const boxSignal = document.querySelector('.box-signal');
const boxCar = document.querySelector('.box-car');

if (boxPerson && boxSignal && boxCar) {
  let boxIndex = 0;
  setInterval(() => {
    boxIndex = (boxIndex + 1) % boxConfigs.length;
    const cfg = boxConfigs[boxIndex];

    [boxPerson, boxSignal, boxCar].forEach(b => {
      b.style.transition = 'all 0.8s cubic-bezier(0.4,0,0.2,1)';
    });

    Object.assign(boxPerson.style, cfg.person);
    Object.assign(boxSignal.style, cfg.signal);
    Object.assign(boxCar.style, cfg.car);
  }, 2500);
}

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── CTA / Email signup handler ── */
function handleSignup() {
  const input = document.getElementById('emailInput');
  const btn = document.getElementById('ctaBtn');
  const successMsg = document.getElementById('successMsg');
  const email = input.value.trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    input.style.borderColor = '#E85A4A';
    input.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.animation = '';
    }, 600);
    input.placeholder = 'Please enter a valid email';
    return;
  }

  btn.textContent = 'Joining...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  // Simulate async signup
  setTimeout(() => {
    input.style.display = 'none';
    btn.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.style.animation = 'fadeInUp 0.5s ease';
  }, 1000);
}

/* ── Tech pills hover shimmer ── */
document.querySelectorAll('.tech-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.background = 'rgba(214,58,122,0.08)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.background = '';
  });
});

/* ── Environments bar subtle scroll ── */
const envBar = document.querySelector('.environments-bar');
if (envBar) {
  const envObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('span').forEach((span, i) => {
          span.style.opacity = '0';
          span.style.transform = 'translateY(10px)';
          span.style.transition = `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`;
          setTimeout(() => {
            span.style.opacity = '';
            span.style.transform = '';
          }, 50);
        });
        envObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  envBar.querySelectorAll('span').forEach(span => {
    span.style.opacity = '0';
  });

  envObs.observe(envBar);
}

/* ── Section titles stagger animation ── */
document.querySelectorAll('.section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  titleObs.observe(el);
});

/* ── Add keyframe for shake animation via JS ── */
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `, styleSheet.cssRules.length);
} catch(e) {
  // ignore cross-origin errors in some environments
}

/* ── Parallax subtle effect on hero orbs ── */
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

console.log('%c VisionPath loaded ✓', 'color: #2ECC8A; font-weight: bold; font-size: 14px;');
