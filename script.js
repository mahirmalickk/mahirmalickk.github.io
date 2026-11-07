/* ============================================
   Particle Canvas (Hero Background)
   Advanced: requestAnimationFrame, canvas API,
   mouse interaction, connected particles
   ============================================ */
class ParticleNetwork {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = window.innerWidth < 768 ? 40 : 80;
    this.maxDistance = 120;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse repulsion
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`;
      this.ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

/* ============================================
   Typewriter Effect
   Advanced: async/await, generator-like timing
   ============================================ */
class TypeWriter {
  constructor(element, words, typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
    this.element = element;
    this.words = words;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const currentWord = this.words[this.wordIndex % this.words.length];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = currentWord.substring(0, this.charIndex);

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex++;
      speed = 400;
    }

    setTimeout(() => this.tick(), speed);
  }
}

/* ============================================
   Rotating Title
   ============================================ */
class RotatingTitle {
  constructor(element, titles) {
    this.element = element;
    this.titles = titles;
    this.index = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const current = this.titles[this.index % this.titles.length];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = current.substring(0, this.charIndex);

    let speed = this.isDeleting ? 30 : 60;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 2500;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.index++;
      speed = 300;
    }

    setTimeout(() => this.tick(), speed);
  }
}

/* ============================================
   Scroll-based Navigation
   Advanced: IntersectionObserver, scroll direction
   detection, debounced scroll handler
   ============================================ */
class ScrollNav {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.links = document.querySelectorAll('[data-nav]');
    this.sections = document.querySelectorAll('.section, .hero');
    this.lastScroll = 0;
    this.ticking = false;

    this.initScrollDirection();
    this.initActiveLink();
  }

  initScrollDirection() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;

          // Show/hide nav based on scroll direction
          if (currentScroll > 100) {
            this.nav.classList.add('nav--scrolled');
            if (currentScroll > this.lastScroll && currentScroll > 300) {
              this.nav.classList.add('nav--hidden');
            } else {
              this.nav.classList.remove('nav--hidden');
            }
          } else {
            this.nav.classList.remove('nav--scrolled');
            this.nav.classList.remove('nav--hidden');
          }

          this.lastScroll = currentScroll;
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  initActiveLink() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    this.sections.forEach((section) => observer.observe(section));
  }
}

/* ============================================
   Reveal on Scroll
   Advanced: IntersectionObserver with staggered
   child animations
   ============================================ */
class RevealOnScroll {
  constructor() {
    this.initSections();
    this.initChildren();
  }

  initSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
  }

  initChildren() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('[data-reveal-child]').forEach((el) => observer.observe(el));
  }
}

/* ============================================
   3D Tilt Effect on Cards
   Advanced: CSS transforms, perspective,
   mouse position mapping
   ============================================ */
class TiltEffect {
  constructor() {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
      card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
    });
  }

  onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  onMouseLeave(e, card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  }
}

/* ============================================
   Cursor Glow
   ============================================ */
class CursorGlow {
  constructor() {
    this.glow = document.querySelector('.cursor-glow');
    if (!this.glow || window.innerWidth < 768) return;

    window.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        this.glow.style.left = e.clientX + 'px';
        this.glow.style.top = e.clientY + 'px';
      });
    });
  }
}

/* ============================================
   Mobile Menu
   ============================================ */
class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.nav__toggle');
    this.links = document.querySelector('.nav__links');
    this.navLinks = document.querySelectorAll('.nav__links a');

    if (!this.toggle) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());

    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });
  }

  toggleMenu() {
    const isOpen = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', !isOpen);
    this.links.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  closeMenu() {
    this.toggle.setAttribute('aria-expanded', 'false');
    this.links.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ============================================
   Smooth Scroll with offset
   ============================================ */
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
}

/* ============================================
   Initialize Everything on DOMContentLoaded
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Particle canvas
  const canvas = document.getElementById('particleCanvas');
  if (canvas) new ParticleNetwork(canvas);

  // Typewriter greeting
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const words = JSON.parse(typewriterEl.dataset.text);
    new TypeWriter(typewriterEl, words, 80, 40, 3000);
  }

  // Rotating title
  const rotatingEl = document.getElementById('rotatingTitle');
  if (rotatingEl) {
    new RotatingTitle(rotatingEl, [
      'Systems Administrator',
      'Security Enthusiast',
      'Infrastructure Builder',
      'Problem Solver',
    ]);
  }

  // Navigation
  new ScrollNav();
  new MobileMenu();
  new SmoothScroll();

  // Animations
  new RevealOnScroll();
  new TiltEffect();
  new CursorGlow();
});
