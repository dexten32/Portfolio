// ==========================================================================
// DUOLINGO-STYLE GAMIFIED PORTFOLIO INTERACTIVITY
// ==========================================================================

// 1. Custom Cursor Movement
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; 
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top = mouseY - 6 + 'px';
  }
});

function animateRing() {
  if (ring) {
    ringX += (mouseX - ringX - 18) * 0.15;
    ringY += (mouseY - ringY - 18) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor Hover Interactions
document.querySelectorAll('a, button, .project-card, .skill-node-card, .badge-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'scale(1.8)';
    if (ring) ring.style.transform = 'scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'scale(1)';
    if (ring) ring.style.transform = 'scale(1)';
  });
});

// 2. Background Sparkles & Floating Particles Canvas
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const PARTICLE_COUNT = 25;

  class SparkleParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 2 + Math.random() * 4;
      this.speedY = -0.3 - Math.random() * 0.5;
      this.opacity = 0.2 + Math.random() * 0.5;
      const colors = ['#58cc02', '#1cb0f6', '#ff9600', '#ce82ff', '#ffc800'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y += this.speedY;
      if (this.y < -10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new SparkleParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// 3. Scroll Progress & Quest Navigation Highlights
const completionBar = document.getElementById('completion-bar-fill');
const navLinks = document.querySelectorAll('.nav-quest-path a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

  if (completionBar) {
    completionBar.style.width = Math.max(10, scrollPercent) + '%';
  }

  let currentSection = 'hero';
  sections.forEach(sec => {
    if (scrollTop >= sec.offsetTop - 150) {
      currentSection = sec.id;
    }
  });

  navLinks.forEach(link => {
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}, { passive: true });

// 4. Reveal Animation on Scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 60);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(r => observer.observe(r));

// 5. Gamified Terminal Command Handler
function runTermCmd(cmd) {
  const termBody = document.getElementById('term-body');
  if (!termBody) return;

  let outputText = '';
  switch (cmd) {
    case 'whoami':
      outputText = 'Full-stack developer with 1+ year experience building end-to-end web apps from PostgreSQL schemas & Express APIs to React dashboards.';
      break;
    case 'skills':
      outputText = 'Frontend: React, Next.js, TypeScript, Tailwind CSS, State Management\nBackend: Node.js, Express, FastAPI, PostgreSQL, MongoDB, Prisma, Redis';
      break;
    case 'projects':
      outputText = '1. Time Tracker (Full-Stack)\n2. Advanced Resume ATS & Intelligence\n3. Invoice Generator Pro\n4. Task Management System';
      break;
    case 'streak':
      outputText = '🔥 7-Day Active Coding Streak! Earned +250 XP this week shipping clean features.';
      break;
    case 'contact':
      outputText = 'Email: work.harshbajaj@gmail.com | GitHub: github.com/Harsh-Bajajb';
      break;
    default:
      outputText = 'Command not recognized. Try: whoami, skills, projects, streak, contact';
  }

  const promptLine = document.createElement('div');
  promptLine.className = 'term-line';
  promptLine.innerHTML = `<span class="term-prompt">~/harsh-portfolio</span> <span class="term-cmd">$ ${cmd}</span>`;

  const outputLine = document.createElement('div');
  outputLine.className = 'term-line term-output';
  outputLine.innerText = outputText;

  termBody.appendChild(promptLine);
  termBody.appendChild(outputLine);
  termBody.scrollTop = termBody.scrollHeight;
}

// 6. Project Details Modal Data & Handlers
const projectDetailsData = {
  'time-tracker': {
    title: '⏱️ Time Tracker — Full-Stack Productivity App',
    type: 'Full-Stack Quest',
    oneLiner: 'A full-stack time tracking app to log, analyze, and visualize time spent on projects and tasks.',
    features: [
      'Start/stop live stopwatch & manual time entry for tasks and projects',
      'Dashboard with daily, weekly, and monthly time breakdowns using interactive charts',
      'Project and tag-based categorization for granular work analysis',
      'User authentication (JWT) with user-specific data isolation & data privacy',
      'Export time logs to CSV/PDF for client billing and reporting'
    ],
    techStack: {
      frontend: 'React + TypeScript + Tailwind CSS + Chart.js',
      backend: 'Node.js + Express.js + REST API Architecture',
      database: 'PostgreSQL + Prisma ORM',
      auth: 'JWT (JSON Web Tokens) authentication',
      deployment: 'Electron Desktop & Cross-Platform Client'
    },
    ownership: 'Designed the PostgreSQL schema, implemented secure REST API endpoints, built responsive React dashboard components, and packaged the Electron desktop client.'
  },
  'ats': {
    title: '🎯 Advanced Resume ATS & Intelligence',
    type: 'AI Full-Stack Desktop & Web App',
    oneLiner: 'AI-powered resume evaluation engine using ONNX vector embeddings and penalty scoring.',
    features: [
      'Interactive drag-and-drop resume upload & instant match scoring UI',
      'ONNX Runtime text embeddings (all-MiniLM-L6-v2) for semantically accurate candidate matching',
      'Domain weighting and inflation-resistant penalty engines to eliminate keyword stuffing',
      'Load-tested with k6 to achieve sub-300ms p95 response times'
    ],
    techStack: {
      frontend: 'React UI / CustomTkinter Desktop Client',
      backend: 'Python FastAPI Microservice',
      database: 'PostgreSQL + ONNX NLP Pipelines',
      deployment: 'Local Desktop & Cloud REST API'
    },
    ownership: 'Designed vector similarity calculations, built custom desktop client, and optimized FastAPI backend endpoints.'
  },
  'invoice': {
    title: '🧾 Invoice Generator Pro',
    type: 'Full-Stack Desktop & Web Client',
    oneLiner: 'High-fidelity invoice creation portal with live side-by-side PDF previewing and tax calculations.',
    features: [
      'Real-time live PDF preview as user types billing items',
      'Multi-currency support & automated tax/discount calculations',
      'Custom branding & logo upload options',
      'One-click local file exports and browser storage persistence'
    ],
    techStack: {
      frontend: 'React + Tailwind CSS + jsPDF',
      backend: 'Node.js / Electron Desktop Wrapper',
      database: 'Local Storage / IndexDB',
      deployment: 'Desktop App & Web Version'
    },
    ownership: 'Built full client interface, implemented jsPDF generation logic, and engineered instant document previews.'
  },
  'tms': {
    title: '📋 Task Management System',
    type: 'Enterprise Full-Stack Platform',
    oneLiner: 'Production-grade task management platform featuring background worker queues and secure RBAC.',
    features: [
      'Modular backend architecture with JWT authentication & RBAC middleware',
      'Redis & BullMQ integration for asynchronous background task processing',
      'Real-time task status updates & optimized database connection pooling',
      'Sub-100ms API response latency under concurrent heavy user loads'
    ],
    techStack: {
      frontend: 'React Dashboard UI',
      backend: 'Node.js + Express.js + BullMQ + Redis',
      database: 'MySQL + Prisma ORM',
      deployment: 'VPS + Nginx Reverse Proxy'
    },
    ownership: 'Architected complete SQL schemas, implemented background queue worker pipelines, and built management board UI.'
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const data = projectDetailsData[projectId];

  if (!modal || !modalBody || !data) return;

  let featuresListHtml = data.features.map(f => `<li>✔ ${f}</li>`).join('');

  modalBody.innerHTML = `
    <span class="project-type-badge">${data.type}</span>
    <h2 style="font-size: 1.8rem; font-weight: 900; margin: 12px 0 6px; color: var(--duo-gray-dark);">${data.title}</h2>
    <p style="font-size: 1.05rem; font-weight: 700; color: var(--duo-gray-mid); margin-bottom: 20px;">${data.oneLiner}</p>

    <div style="background: var(--duo-bg); border: 2px solid var(--duo-border); border-radius: 16px; padding: 18px; margin-bottom: 20px;">
      <h3 style="font-size: 1rem; font-weight: 900; margin-bottom: 10px; color: var(--duo-green-dark);">✨ Key Features & User Flow</h3>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-weight: 700; font-size: 0.9rem;">
        ${featuresListHtml}
      </ul>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 1rem; font-weight: 900; margin-bottom: 10px;">🛠️ Full-Stack Technology Layer</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.85rem; font-weight: 800;">
        <div style="background: #ffffff; border: 2px solid var(--duo-border); padding: 10px; border-radius: 12px;"><strong>Frontend UI:</strong> ${data.techStack.frontend}</div>
        <div style="background: #ffffff; border: 2px solid var(--duo-border); padding: 10px; border-radius: 12px;"><strong>Backend API:</strong> ${data.techStack.backend}</div>
        <div style="background: #ffffff; border: 2px solid var(--duo-border); padding: 10px; border-radius: 12px;"><strong>Database:</strong> ${data.techStack.database}</div>
        <div style="background: #ffffff; border: 2px solid var(--duo-border); padding: 10px; border-radius: 12px;"><strong>Deployment:</strong> ${data.techStack.deployment}</div>
      </div>
    </div>

    <div style="background: var(--duo-green-light); border: 2px solid var(--duo-green); padding: 16px; border-radius: 14px; margin-bottom: 20px;">
      <strong style="color: var(--duo-green-dark); font-size: 0.85rem; text-transform: uppercase;">🦸‍♂️ End-to-End Ownership:</strong>
      <p style="font-size: 0.9rem; font-weight: 700; color: var(--duo-gray-dark); margin-top: 4px;">${data.ownership}</p>
    </div>

    <div style="display: flex; gap: 12px;">
      <button class="btn-duo btn-duo-green" onclick="closeProjectModal()" style="flex: 1;">
        Awesome, Close Modal!
      </button>
    </div>
  `;

  modal.classList.add('open');
}

function closeProjectModal(e) {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('open');
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProjectModal();
});

// 7. Contact Form Web3Forms Handler
const contactForm = document.getElementById('contact-form');
const formStatusBox = document.getElementById('form-status-box');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = '⏳ Sending Message...';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (formStatusBox) {
        formStatusBox.style.display = 'block';
        if (data.success) {
          formStatusBox.style.background = 'var(--duo-green-light)';
          formStatusBox.style.color = 'var(--duo-green-dark)';
          formStatusBox.style.border = '2px solid var(--duo-green)';
          formStatusBox.innerText = '🎉 Message sent successfully! You earned +50 XP! Harsh will get back to you soon.';
          contactForm.reset();
        } else {
          formStatusBox.style.background = 'var(--duo-red-light)';
          formStatusBox.style.color = 'var(--duo-red-dark)';
          formStatusBox.style.border = '2px solid var(--duo-red)';
          formStatusBox.innerText = '❌ Something went wrong. Please try emailing work.harshbajaj@gmail.com directly.';
        }
      }
    } catch (err) {
      if (formStatusBox) {
        formStatusBox.style.display = 'block';
        formStatusBox.style.background = 'var(--duo-red-light)';
        formStatusBox.style.color = 'var(--duo-red-dark)';
        formStatusBox.innerText = '❌ Network error. Please try emailing directly.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = '🚀 Send Message (+50 XP)';
      }
    }
  });
}