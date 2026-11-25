/**
 * DJC Developer - Divya Jyoti Chaudhary Portfolio
 * Vanilla JavaScript (ES6+) - Clean, modular, and performant
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Sticky Header & Active Navigation Highlighting
  // =========================================================================
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const handleScroll = () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll spy for active section link
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // =========================================================================
  // 2. Mobile Menu Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close when clicking any nav link
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  }

  // =========================================================================
  // 3. Portfolio Category Filtering
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.transition = 'all 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // =========================================================================
  // 4. Testimonials Slider
  // =========================================================================
  const testimonials = [
    {
      avatar: 'assets/images/testimonial-1.jpg',
      quote: '“Divya delivered an amazing website with great design and excellent support. Highly recommended!”',
      name: 'Sarah Johnson',
      title: 'Business Owner, USA',
      stars: 5,
    },
    {
      avatar: 'assets/images/testimonial-2.jpg',
      quote: '“Professional, creative and very reliable. The communication was outstanding!”',
      name: 'Rajesh Kumar',
      title: 'Entrepreneur, Nepal',
      stars: 5,
    },
    {
      avatar: 'assets/images/testimonial-1.jpg',
      quote: '“Exceptional frontend work! Fast turnaround and clean code that was very easy to deploy.”',
      name: 'Emily Davis',
      title: 'Product Lead, UK',
      stars: 5,
    },
    {
      avatar: 'assets/images/testimonial-2.jpg',
      quote: '“Divya built our custom booking system with PHP and JavaScript. It runs smoothly without issues.”',
      name: 'Anil Shrestha',
      title: 'Hotel General Manager, Nepal',
      stars: 5,
    },
  ];

  let currentTestimonialIndex = 0;
  const cardsWrap = document.getElementById('testimonialsCardsWrap');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  const renderTestimonials = () => {
    if (!cardsWrap) return;
    cardsWrap.innerHTML = '';

    // Render 2 cards side by side (wrap around array)
    const card1Data = testimonials[currentTestimonialIndex % testimonials.length];
    const card2Data = testimonials[(currentTestimonialIndex + 1) % testimonials.length];

    [card1Data, card2Data].forEach((t) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" loading="lazy">
        <div class="testimonial-body">
          <p class="testimonial-quote">${t.quote}</p>
          <div class="testimonial-author-row">
            <div>
              <h4 class="testimonial-name">${t.name}</h4>
              <p class="testimonial-title">${t.title}</p>
            </div>
            <div class="star-rating" aria-label="${t.stars} stars">
              ${'★'.repeat(t.stars)}
            </div>
          </div>
        </div>
      `;
      cardsWrap.appendChild(card);
    });
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTestimonialIndex =
        (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonials();
    });

    nextBtn.addEventListener('click', () => {
      currentTestimonialIndex =
        (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonials();
    });
  }

  // =========================================================================
  // 5. Statistics Animated Counters
  // =========================================================================
  const statsElements = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateStats = () => {
    statsElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = `${target}${suffix}`;
          clearInterval(interval);
        } else {
          el.textContent = `${current}${suffix}`;
        }
      }, 35);
    });
  };

  const statsSection = document.getElementById('about');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            animateStats();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  }

  // =========================================================================
  // 6. Project Modal Preview & Workflow Timeline
  // =========================================================================
  const projectDetails = {
    '1': {
      title: 'Aagaman Hotel & Party Palace',
      category: 'Hotel Website / Full-Stack',
      image: 'assets/images/project-1.jpg',
      description:
        'A comprehensive hotel booking and banquet reservation web portal designed for Aagaman Hotel & Party Palace. Features an interactive room showcase, online reservation inquiries, dining menus, and an administrative panel for event bookings.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP Backend', 'MySQL'],
      timeline: [
        {
          phase: '01. Discovery & Architecture',
          duration: 'Week 1',
          summary:
            'Mapped room tiers, party palace capacity packages, and online reservation inquiry flows with the hospitality team.',
        },
        {
          phase: '02. UI/UX Design & Prototyping',
          duration: 'Week 2',
          summary:
            'Crafted a welcoming visual hierarchy, responsive photo galleries, and streamlined booking form wireframes.',
        },
        {
          phase: '03. Full-Stack & PHP Development',
          duration: 'Weeks 3–4',
          summary:
            'Built the interactive frontend, PHP reservation handler, MySQL event booking database, and admin dashboard.',
        },
        {
          phase: '04. QA Testing & Deployment',
          duration: 'Week 5',
          summary:
            'Tested cross-browser responsiveness, optimized media assets for fast loading, and launched on cPanel hosting.',
        },
      ],
      client: 'Aagaman Hospitality Group, Nepal',
      link: 'https://djc.com.np/projects/aagaman',
    },
    '2': {
      title: 'Zam Zam Lahan',
      category: 'Electronics Store / E-Commerce',
      image: 'assets/images/project-2.jpg',
      description:
        'An elegant product catalogue and customer inquiry website for Zam Zam Lahan, a premier electronics and consumer appliance retailer. Includes product search, category browsing, warranty inquiry form, and WhatsApp direct ordering.',
      tech: ['HTML5', 'Modern CSS', 'JavaScript ES6', 'PHP', 'Bootstrap Grid'],
      timeline: [
        {
          phase: '01. Catalog Audit & Planning',
          duration: 'Week 1',
          summary:
            'Structured electronics and appliance categories, brand groupings, and warranty support inquiry requirements.',
        },
        {
          phase: '02. Storefront UI/UX Design',
          duration: 'Week 2',
          summary:
            'Designed high-contrast product showcase cards, instant category filtering, and mobile-first browsing layouts.',
        },
        {
          phase: '03. PHP Backend & WhatsApp Ordering',
          duration: 'Weeks 3–4',
          summary:
            'Implemented dynamic PHP product listings, search functionality, and direct WhatsApp order routing.',
        },
        {
          phase: '04. Optimization & Launch',
          duration: 'Week 5',
          summary:
            'Compressed product photography, verified inquiry validation, and deployed the live retail storefront.',
        },
      ],
      client: 'Zam Zam Electronics, Lahan, Nepal',
      link: 'https://djc.com.np/projects/zamzam',
    },
    '3': {
      title: 'Cafe & Restaurant',
      category: 'Food & Beverage / Web Design & UI/UX',
      image: 'assets/images/project-3.jpg',
      description:
        'A warm, appetizing website and digital table menu for a boutique cafe & restaurant. Features an interactive food menu with dietary filters, table reservation module, customer reviews, and Google Maps integration.',
      tech: ['HTML5', 'CSS Animations', 'Vanilla JS', 'Responsive UI/UX'],
      timeline: [
        {
          phase: '01. Brand Mood & Menu Strategy',
          duration: 'Days 1–3',
          summary:
            'Established a warm dining palette and organized food, beverage, and dietary preference categories.',
        },
        {
          phase: '02. Interactive Menu Design',
          duration: 'Days 4–8',
          summary:
            'Designed scannable digital menu cards, table reservation flows, and atmospheric interior gallery layouts.',
        },
        {
          phase: '03. Frontend & Motion Build',
          duration: 'Days 9–13',
          summary:
            'Engineered smooth CSS transitions, Vanilla JS menu filters, reservation validation, and map integration.',
        },
        {
          phase: '04. Mobile QA & Handover',
          duration: 'Days 14–16',
          summary:
            'Validated QR table-menu usability on mobile viewports and delivered clean, maintainable source files.',
        },
      ],
      client: 'Heritage Cafe & Restaurant',
      link: 'https://djc.com.np/projects/cafe',
    },
  };

  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  const openProjectModal = (projectId) => {
    const data = projectDetails[projectId];
    if (!data || !modal || !modalBody) return;

    const timelineMarkup = (data.timeline || [])
      .map(
        (step) => `
        <li class="timeline-step">
          <div class="timeline-step-header">
            <span class="timeline-phase-title">${step.phase}</span>
            <span class="timeline-phase-duration">${step.duration}</span>
          </div>
          <p class="timeline-phase-desc">${step.summary}</p>
        </li>
      `
      )
      .join('');

    modalBody.innerHTML = `
      <div class="modal-project-thumb">
        <img src="${data.image}" alt="${data.title}">
      </div>
      <div class="modal-project-badge">${data.category}</div>
      <h2 id="modalTitle" class="modal-project-title">${data.title}</h2>
      <p class="modal-project-desc">${data.description}</p>

      <div class="modal-section-block">
        <h4 class="modal-section-label">Technologies Used</h4>
        <div class="modal-tech-list">
          ${data.tech
            .map((t) => `<span class="modal-tech-chip">${t}</span>`)
            .join('')}
        </div>
      </div>

      <div class="modal-section-block">
        <h4 class="modal-section-label">Development Workflow &amp; Timeline</h4>
        <ol class="modal-timeline">
          ${timelineMarkup}
        </ol>
      </div>

      <div class="modal-project-footer">
        <div class="modal-client-info">
          Client: <strong>${data.client}</strong>
        </div>
        <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <span>Live Preview</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      if (id) openProjectModal(id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = card.getAttribute('data-project-id');
        if (id) openProjectModal(id);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // =========================================================================
  // 7. Contact Form Handling (Validation & Friendly Notice)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const toastNotice = document.getElementById('toastNotice');

  const showToast = (message) => {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-msg').textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const serviceInput = document.getElementById('userService');
      const messageInput = document.getElementById('userMessage');
      const submitBtn = document.getElementById('submitBtn');

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const service = serviceInput?.value || '';
      const message = messageInput?.value.trim() || '';

      if (!name) {
        showToast('Please enter your full name.');
        nameInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please provide a valid email address.');
        emailInput?.focus();
        return;
      }

      if (!message) {
        showToast('Please write a brief message about your project.');
        messageInput?.focus();
        return;
      }

      // Simulate sending state
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          showToast(
            `Thank you, ${name}! Your inquiry has been received. Divya will respond to ${email} promptly!`
          );

          console.log('[DJC Developer] Form submission payload:', {
            name,
            email,
            service: service || 'General Inquiry',
            message,
            timestamp: new Date().toISOString(),
          });
        }, 800);
      }
    });
  }

  // =========================================================================
  // 8. Download CV Handler
  // =========================================================================
  const cvButtons = document.querySelectorAll('.btn-download-cv');
  cvButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Generate clean professional resume print / download
      showToast('Generating Divya Jyoti Chaudhary Resume (PDF)...');
      
      setTimeout(() => {
        const resumeWindow = window.open('', '_blank');
        if (resumeWindow) {
          resumeWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Divya Jyoti Chaudhary - Full-Stack Web Developer CV</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
                h1 { color: #603df6; margin-bottom: 4px; }
                .role { font-size: 1.2rem; font-weight: 600; color: #475569; margin-bottom: 20px; }
                .contact { font-size: 0.95rem; color: #64748b; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
                h2 { color: #0f172a; border-bottom: 2px solid #603df6; padding-bottom: 6px; margin-top: 24px; font-size: 1.25rem; }
                ul { padding-left: 20px; }
                li { margin-bottom: 8px; }
                .btn-print { background: #603df6; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 1rem; margin-bottom: 20px; }
                @media print { .btn-print { display: none; } }
              </style>
            </head>
            <body>
              <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
              <h1>Divya Jyoti Chaudhary</h1>
              <div class="role">Freelance Full-Stack Web Developer</div>
              <div class="contact">
                Email: hello@djc.com.np &bull; Phone: +977-9812345678 &bull; Location: Saptari, Nepal &bull; Portfolio: djc.com.np
              </div>
              <h2>Professional Summary</h2>
              <p>Passionate Full-Stack Web Developer based in Nepal, specializing in responsive user interfaces, PHP backend development, and complete web applications. Proven track record in delivering high quality, high-converting digital solutions for hotels, retail businesses, and modern enterprises.</p>
              <h2>Core Skills</h2>
              <ul>
                <li><strong>Frontend:</strong> HTML5, CSS3, Vanilla JavaScript (ES6+), Responsive Design, UI/UX Wireframing</li>
                <li><strong>Backend:</strong> PHP, MySQL, RESTful APIs, MVC Architecture</li>
                <li><strong>Tools & Platforms:</strong> Git, GitHub, cPanel, Apache, Linux Server Management</li>
              </ul>
              <h2>Featured Projects</h2>
              <ul>
                <li><strong>Aagaman Hotel & Party Palace:</strong> Full-stack website with banquet booking and room showcase.</li>
                <li><strong>Zam Zam Lahan:</strong> Electronics retail showcase with WhatsApp order integration.</li>
                <li><strong>Heritage Cafe & Restaurant:</strong> Interactive digital menu and table reservation portal.</li>
              </ul>
              <h2>Experience & Stats</h2>
              <p>1+ Years Professional Experience &bull; 10+ Successfully Completed Projects &bull; 100% Client Satisfaction</p>
            </body>
            </html>
          `);
          resumeWindow.document.close();
        } else {
          showToast('Divya Jyoti Chaudhary CV is ready at djc.com.np/cv.pdf');
        }
      }, 500);
    });
  });

  // =========================================================================
  // 9. Smooth Scroll for Anchor Links
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // =========================================================================
  // 10. Light / Dark Mode Theme Toggle & Persistence
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');

  const getStoredTheme = () => {
    try {
      const savedTheme = localStorage.getItem('djc_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const applyTheme = (theme, persist = true) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem('djc_theme', theme);
      } catch (e) {
        console.warn('localStorage is not accessible', e);
      }
    }
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    if (themeToggle) themeToggle.setAttribute('aria-label', label);
    if (mobileThemeToggle) mobileThemeToggle.setAttribute('aria-label', label);
  };

  const handleThemeToggle = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getStoredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  };

  // Sync theme on ready
  applyTheme(getStoredTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', handleThemeToggle);
  }

  // Listen to OS theme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('djc_theme')) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {}
    });
  }

  // =========================================================================
  // 11. Scroll-Triggered Section Fade-In Animations (IntersectionObserver)
  // =========================================================================
  const initSectionFadeIn = () => {
    const targetSections = document.querySelectorAll(
      '#services, #portfolio, #about, #testimonials, #contact'
    );

    if (!targetSections.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targetSections.forEach((section) => {
        section.classList.add('fade-in-section', 'is-visible');
      });
      return;
    }

    targetSections.forEach((section) => {
      section.classList.add('fade-in-section');
    });

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targetSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  };

  initSectionFadeIn();

  console.log('[DJC Developer] Portfolio initialized successfully with theme support.');
});
