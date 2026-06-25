'use strict';

// 0. Force scroll to top on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Language Toggle Logic
  const langToggle = document.getElementById('lang-toggle');
  const langText = document.getElementById('lang-text');
  
  langToggle.addEventListener('click', () => {
    const currentLang = document.documentElement.getAttribute('lang');
    const newLang = currentLang === 'th' ? 'en' : 'th';
    document.documentElement.setAttribute('lang', newLang);
    langText.textContent = newLang.toUpperCase();
  });

  // 2. Theme Switcher Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  function updateThemeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }
  
  // Set initial theme based on system preference if not set
  if (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeUI();

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    updateThemeUI();
  });

  // 3. Mobile Menu Toggle (Slide-in Drawer)
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  function toggleMobileDrawer(open) {
    if (open) {
      mobileMenu.classList.remove('translate-x-full');
      drawerOverlay.classList.remove('hidden');
      setTimeout(() => drawerOverlay.classList.add('opacity-100'), 10);
    } else {
      mobileMenu.classList.add('translate-x-full');
      drawerOverlay.classList.remove('opacity-100');
      setTimeout(() => drawerOverlay.classList.add('hidden'), 300);
    }
  }

  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('translate-x-full');
      toggleMobileDrawer(!isOpen);
    });
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      toggleMobileDrawer(false);
    });
  }
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleMobileDrawer(false));
  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  // 4. Smooth Scroll Navigation Highlight
  const navLinks = Array.from(document.querySelectorAll('.nav-menu-link'));
  const mobileLinks = Array.from(document.querySelectorAll('.nav-mobile-link'));
  const sections = ['about', 'resume', 'portfolio', 'blog', 'contact'].map(id => ({
    id,
    el: document.getElementById(id),
    link: navLinks.find(link => link.getAttribute('href') === `#${id}`),
    mobileLink: mobileLinks.find(link => link.getAttribute('href') === `#${id}`)
  })).filter(item => item.el && (item.link || item.mobileLink));

  let isScrolling = false;
  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 140; // Offset for sticky nav bar
    let activeSecId = null;

    // Find the current active section
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (scrollPos >= section.el.offsetTop) {
        activeSecId = section.id;
        break;
      }
    }

    if (!activeSecId && sections.length > 0) {
      activeSecId = sections[0].id;
    }

    // Update nav links classes
    sections.forEach(sec => {
      // Update desktop menu links
      if (sec.link) {
        if (sec.id === activeSecId) {
          sec.link.classList.add('text-primary', 'border-b-2', 'border-primary');
          sec.link.classList.remove('text-on-surface-light/70', 'dark:text-on-surface-dark/70');
        } else {
          sec.link.classList.remove('text-primary', 'dark:text-primary', 'border-b-2', 'border-primary');
          sec.link.classList.add('text-on-surface-light/70', 'dark:text-on-surface-dark/70');
        }
      }

      // Update mobile drawer links
      if (sec.mobileLink) {
        if (sec.id === activeSecId) {
          sec.mobileLink.classList.add('text-primary');
          sec.mobileLink.classList.remove('text-on-surface-light/70', 'dark:text-on-surface-dark/70');
        } else {
          sec.mobileLink.classList.remove('text-primary', 'dark:text-primary');
          sec.mobileLink.classList.add('text-on-surface-light/70', 'dark:text-on-surface-dark/70');
        }
      }
    });
  };

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Initial check
  setTimeout(updateActiveNav, 100);

  // 5. Portfolio Grid Filter Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('bg-white/40', 'dark:bg-slate-900/40', 'text-on-surface-light/85', 'dark:text-on-surface-dark/85', 'border', 'border-outline-muted', 'dark:border-outline-muted-dark');
        b.classList.remove('active');
      });
      btn.classList.add('bg-primary', 'text-white');
      btn.classList.remove('bg-white/40', 'dark:bg-slate-900/40', 'text-on-surface-light/85', 'dark:text-on-surface-dark/85', 'border', 'border-outline-muted', 'dark:border-outline-muted-dark');
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5b. Portfolio Filters Horizontal Scroll Navigation
  const filtersContainer = document.getElementById('portfolio-filters');
  const scrollLeftBtn = document.getElementById('filter-scroll-left');
  const scrollRightBtn = document.getElementById('filter-scroll-right');

  if (filtersContainer && scrollLeftBtn && scrollRightBtn) {
    const updateScrollArrows = () => {
      const isOverflowing = filtersContainer.scrollWidth > filtersContainer.clientWidth;
      
      if (isOverflowing) {
        if (filtersContainer.scrollLeft > 5) {
          scrollLeftBtn.classList.remove('opacity-0', 'pointer-events-none');
          scrollLeftBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
          scrollLeftBtn.classList.add('opacity-0', 'pointer-events-none');
          scrollLeftBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }
        
        const maxScrollLeft = filtersContainer.scrollWidth - filtersContainer.clientWidth;
        if (filtersContainer.scrollLeft < maxScrollLeft - 5) {
          scrollRightBtn.classList.remove('opacity-0', 'pointer-events-none');
          scrollRightBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
          scrollRightBtn.classList.add('opacity-0', 'pointer-events-none');
          scrollRightBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }
      } else {
        scrollLeftBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollRightBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    };

    scrollLeftBtn.addEventListener('click', () => {
      filtersContainer.scrollBy({ left: -140, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
      filtersContainer.scrollBy({ left: 140, behavior: 'smooth' });
    });

    filtersContainer.addEventListener('scroll', updateScrollArrows);
    window.addEventListener('resize', updateScrollArrows);
    
    // Initial calculation check after DOM rendering finishes
    setTimeout(updateScrollArrows, 300);
  }

  // 6. Interactive 3D Card Tilt Effect
  const setupTiltEffect = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
      card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out';
      
      let rect = null;
      let animationFrameId = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect(); // Cache card dimensions once when mouse enters
      });

      card.addEventListener('mousemove', (e) => {
        if (!rect) {
          rect = card.getBoundingClientRect();
        }
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        animationFrameId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
        });
      });
      
      card.addEventListener('mouseleave', () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        rect = null;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    });
  };
  setupTiltEffect();

  // 7. Work Details Popup Modal
  const portfolioModal = document.getElementById('portfolio-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalImg = document.getElementById('modal-project-img');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDescTh = document.getElementById('modal-project-desc-th');
  const modalDescEn = document.getElementById('modal-project-desc-en');
  const modalCtaBtn = document.getElementById('modal-cta-btn');
  const modalPdfBtn = document.getElementById('modal-pdf-btn');
  const galleryContainer = document.getElementById('modal-gallery-container');

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const category = card.getAttribute('data-category');
      const descTh = card.getAttribute('data-desc-th');
      const descEn = card.getAttribute('data-desc-en');
      const img = card.getAttribute('data-img');
      const gallery = card.getAttribute('data-gallery');
      const pdf = card.getAttribute('data-pdf');

      modalImg.src = img;
      modalImg.alt = title;
      modalCategory.textContent = category === 'upcoming' ? (document.documentElement.lang === 'th' ? 'เร็วๆ นี้' : 'COMING SOON') : category.toUpperCase();
      modalTitle.textContent = title;
      modalDescTh.innerHTML = descTh;
      modalDescEn.innerHTML = descEn;

      // Handle PDF/Link button visibility and text
      if (modalPdfBtn) {
        if (pdf) {
          modalPdfBtn.href = pdf;
          modalPdfBtn.classList.remove('hidden');
          
          const isPdf = pdf.toLowerCase().endsWith('.pdf') || pdf.includes('drive.google.com');
          const thSpan = modalPdfBtn.querySelector('.lang-th');
          const enSpan = modalPdfBtn.querySelector('.lang-en');
          const iconSpan = modalPdfBtn.querySelector('.material-symbols-outlined');
          
          if (isPdf) {
            if (iconSpan) iconSpan.textContent = 'picture_as_pdf';
            if (thSpan) thSpan.textContent = 'ดู PDF ฉบับเต็ม';
            if (enSpan) enSpan.textContent = 'View Full PDF';
          } else {
            if (iconSpan) iconSpan.textContent = 'open_in_new';
            if (thSpan) thSpan.textContent = 'ไปยังหน้าเว็บแอป';
            if (enSpan) enSpan.textContent = 'Visit Web App';
          }
        } else {
          modalPdfBtn.classList.add('hidden');
        }
      }

      // Handle extra images gallery
      if (galleryContainer) {
        galleryContainer.innerHTML = '';
        if (gallery) {
          galleryContainer.classList.remove('hidden');
          const imgList = gallery.split(',').map(s => s.trim()).filter(s => s.length > 0);
          const allImgs = [img, ...imgList];
          
          allImgs.forEach((src, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary transition-all bg-slate-100 dark:bg-slate-800`;
            thumb.innerHTML = `<img src="${src}" class="w-full h-full object-cover" />`;
            
            thumb.addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent modal from closing or card re-click
              modalImg.src = src;
              // Reset borders
              galleryContainer.querySelectorAll('div').forEach(d => {
                d.classList.remove('border-primary');
                d.classList.add('border-transparent');
              });
              thumb.classList.remove('border-transparent');
              thumb.classList.add('border-primary');
            });
            
            galleryContainer.appendChild(thumb);
          });
        } else {
          galleryContainer.classList.add('hidden');
        }
      }

      portfolioModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // lock scroll
    });
  });

  function closeModal() {
    portfolioModal.classList.add('hidden');
    document.body.style.overflow = ''; // unlock scroll
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (portfolioModal) {
    portfolioModal.addEventListener('click', (e) => {
      if (e.target === portfolioModal) {
        closeModal();
      }
    });
  }

  if (modalCtaBtn) {
    modalCtaBtn.addEventListener('click', () => {
      closeModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 8. Contact Form Validation and AJAX Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (contactForm.checkValidity()) {
          formSubmitBtn.removeAttribute('disabled');
        } else {
          formSubmitBtn.setAttribute('disabled', '');
        }
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const isTh = document.documentElement.getAttribute('lang') === 'th';
        if (response.ok) {
          alert(isTh ? 'ขอบคุณครับ! ส่งข้อความเรียบร้อยแล้ว' : 'Thank you! Your message has been sent successfully.');
          contactForm.reset();
          formSubmitBtn.setAttribute('disabled', '');
        } else {
          alert(isTh ? 'ขออภัย เกิดข้อผิดพลาดในการส่งข้อมูล' : 'Oops! There was a problem sending your message.');
        }
      } catch (err) {
        const isTh = document.documentElement.getAttribute('lang') === 'th';
        alert(isTh ? 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง' : 'Network error. Please try again later.');
      }
    });
  }

  // 9. Intersection Observer Scroll Animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasObserver = typeof window.IntersectionObserver !== 'undefined';

  if (hasObserver && !prefersReducedMotion) {
    const observerOpts = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOpts);

    document.querySelectorAll('.reveal-hidden').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Immediate fallback: show all hidden elements
    document.querySelectorAll('.reveal-hidden').forEach(el => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
  }

  // Failsafe backup: reveal all elements after 2.5 seconds if they haven't been revealed
  // This handles edge cases or lag where scroll intersection triggers fail on mobile.
  setTimeout(() => {
    document.querySelectorAll('.reveal-hidden').forEach(el => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
  }, 2500);

  // 10. Stat Counters Animation
  const initCounters = () => {
    // Dynamic real-time calculation from DOM project cards
    const webCount = document.querySelectorAll('.work-card[data-category="web"]').length;
    const creatorCount = document.querySelectorAll('#blog a').length; // dynamically count YouTube cards
    const blenderCount = document.querySelectorAll('.work-card[data-category="blender"]').length;
    const photoCount = document.querySelectorAll('.work-card[data-category="photography"]').length;
    const graphicsCount = blenderCount + photoCount;
    const totalCount = document.querySelectorAll('.work-card').length;

    const counters = document.querySelectorAll('.stat-number');
    
    // Set dynamic targets on the elements
    counters.forEach(counter => {
      const statCat = counter.getAttribute('data-stat-category');
      if (statCat === 'web') {
        counter.setAttribute('data-target', webCount);
      } else if (statCat === 'graphics') {
        counter.setAttribute('data-target', graphicsCount);
      } else if (statCat === 'creator') {
        counter.setAttribute('data-target', creatorCount);
      } else if (statCat === 'total') {
        counter.setAttribute('data-target', totalCount);
      }
    });

    const speed = 1500; // Duration in ms

    const animate = (counter) => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const startTime = performance.now();

      const updateCount = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / speed, 1);
        
        // Easing out quadratic curve
        const easeProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(easeProgress * target);
        counter.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if (hasObserver) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      counters.forEach(c => counterObserver.observe(c));
    } else {
      counters.forEach(c => animate(c));
    }
  };
  initCounters();

  // 11. Resume Download Generator (Real-time Dynamic PDF Rendering)
  const downloadBtnTh = document.getElementById('download-resume-th');
  const downloadBtnEn = document.getElementById('download-resume-en');
  const dropdownBtn = document.getElementById('resume-dropdown-btn');
  const dropdownMenu = document.getElementById('resume-dropdown-menu');
  const dropdownChevron = document.getElementById('resume-chevron');
  const dropdownContainer = document.getElementById('resume-dropdown-container');

  let toggleDropdown;

  if (downloadBtnTh && downloadBtnEn) {
    if (dropdownBtn && dropdownMenu) {
      toggleDropdown = (show) => {
        if (show) {
          dropdownMenu.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
          dropdownMenu.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
          dropdownChevron?.classList.add('rotate-180');
        } else {
          dropdownMenu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
          dropdownMenu.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
          dropdownChevron?.classList.remove('rotate-180');
        }
      };

      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = dropdownMenu.classList.contains('opacity-100');
        toggleDropdown(!isExpanded);
      });

      document.addEventListener('click', (e) => {
        if (!dropdownContainer?.contains(e.target)) {
          toggleDropdown(false);
        }
      });
    }
    const handleDownload = (lang) => {
      const btn = lang === 'th' ? downloadBtnTh : downloadBtnEn;
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>Generating...</span>`;
      btn.disabled = true;

      // Extract Name
      const nameThEl = document.querySelector('h1 .lang-th .bg-clip-text') || document.querySelector('h1 .lang-th');
      const nameEnEl = document.querySelector('h1 .lang-en .bg-clip-text') || document.querySelector('h1 .lang-en');
      const name = lang === 'th'
        ? (nameThEl?.textContent.trim() || 'มงคล อ่อนน้อม')
        : (nameEnEl?.textContent.trim() || 'Mongkon Onnom');

      // Extract Role
      const roleThEl = document.querySelector('h2 .lang-th') || document.querySelector('#home h2 .lang-th');
      const roleEnEl = document.querySelector('h2 .lang-en') || document.querySelector('#home h2 .lang-en');
      const roleTitle = lang === 'th'
        ? (roleThEl?.textContent.trim() || 'Software Engineer & Creative Developer')
        : (roleEnEl?.textContent.trim() || 'Software Engineer & Creative Developer');

      // Extract Contact details from DOM dynamically
      const email = document.querySelector('a[href^="mailto:"]')?.textContent.trim() || 'mongkononnom@gmail.com';
      const phone = document.querySelector('a[href^="tel:"]')?.textContent.trim() || '080-084-4424';
      
      const locationLabel = Array.from(document.querySelectorAll('span')).find(el => {
        const text = el.textContent || '';
        return text.toUpperCase().trim() === 'LOCATION';
      });
      const location = locationLabel?.nextElementSibling?.textContent.trim() || (lang === 'th' ? 'กรุงเทพฯ, ประเทศไทย' : 'Bangkok, Thailand');
      
      const portfolioLink = window.location.hostname + window.location.pathname.replace(/\/$/, '') || 'edmaemongkon.github.io/remix-portfolio';

      // Extract Experience
      const expItems = [];
      const expTimeline = document.querySelector('#resume h3 .lang-en')?.closest('h3')?.nextElementSibling;
      if (expTimeline) {
        const items = expTimeline.querySelectorAll('.relative.pl-6');
        items.forEach(item => {
          const period = item.querySelector('.text-primary')?.textContent.trim() || '';
          
          const title = lang === 'th' 
            ? (item.querySelector('h4 .lang-th')?.textContent.trim() || item.querySelector('h4')?.textContent.trim() || '')
            : (item.querySelector('h4 .lang-en')?.textContent.trim() || item.querySelector('h4')?.textContent.trim() || '');
          
          const pElements = item.querySelectorAll('p');
          const companyEl = pElements[0];
          const descEl = pElements[pElements.length - 1];
          
          const company = lang === 'th'
            ? (companyEl?.querySelector('.lang-th')?.textContent.trim() || companyEl?.textContent.trim() || '')
            : (companyEl?.querySelector('.lang-en')?.textContent.trim() || companyEl?.textContent.trim() || '');
            
          const desc = lang === 'th'
            ? (descEl?.querySelector('.lang-th')?.textContent.trim() || descEl?.textContent.trim() || '')
            : (descEl?.querySelector('.lang-en')?.textContent.trim() || descEl?.textContent.trim() || '');
          
          expItems.push({ period, title, company, desc });
        });
      }

      // Extract Education
      const eduItems = [];
      const eduHeader = Array.from(document.querySelectorAll('#resume h3')).find(el => {
        const text = el.textContent || '';
        return text.includes('Education') || el.querySelector('.lang-en')?.textContent.includes('Education');
      });
      if (eduHeader) {
        const eduTimeline = eduHeader.nextElementSibling;
        if (eduTimeline) {
          const items = eduTimeline.querySelectorAll('.relative.pl-6');
          items.forEach(item => {
            const period = item.querySelector('.text-primary')?.textContent.trim() || '';
            const school = item.querySelector('h4')?.textContent.trim() || '';
            
            const pElement = item.querySelector('p');
            const degree = lang === 'th'
              ? (pElement?.querySelector('.lang-th')?.textContent.trim() || pElement?.textContent.trim() || '')
              : (pElement?.querySelector('.lang-en')?.textContent.trim() || pElement?.textContent.trim() || '');
              
            eduItems.push({ period, school, degree });
          });
        }
      }

      // Extract Expertise Roles
      let roleSpans = Array.from(document.querySelectorAll('#resume span[class*="bg-primary/10"]'))
        .map(el => el.textContent.trim());
        
      if (roleSpans.length === 0) {
        const rolesHeading = Array.from(document.querySelectorAll('#resume h4')).find(el => {
          const text = el.textContent || '';
          return text.includes('บทบาท') || text.includes('Roles');
        });
        if (rolesHeading && rolesHeading.nextElementSibling) {
          roleSpans = Array.from(rolesHeading.nextElementSibling.querySelectorAll('span'))
            .map(el => el.textContent.trim());
        }
      }

      // Extract Tools
      const toolItems = [];
      const toolsHeading = Array.from(document.querySelectorAll('#resume h4')).find(el => {
        const text = el.textContent || '';
        return text.includes('เครื่องมือ') || text.includes('Tools');
      });
      const toolsSection = toolsHeading ? toolsHeading.nextElementSibling : (document.querySelector('#resume div.pt-5') || document.querySelector('div.pt-5'));
      
      if (toolsSection) {
        const items = toolsSection.querySelectorAll('.flex.items-start');
        items.forEach(item => {
          const name = item.querySelector('h5')?.textContent.trim() || '';
          const desc = lang === 'th'
            ? (item.querySelector('p .lang-th')?.textContent.trim() || item.querySelector('p')?.textContent.trim() || '')
            : (item.querySelector('p .lang-en')?.textContent.trim() || item.querySelector('p')?.textContent.trim() || '');
          if (name) {
            toolItems.push({ name, desc });
          }
        });
      }

      // Extract Projects (Select exactly one project per unique category, keeping only title and link)
      const projectItems = [];
      const workCards = document.querySelectorAll('.work-card');
      const seenCategories = new Set();
      
      workCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat && !seenCategories.has(cat)) {
          const title = card.getAttribute('data-title') || '';
          const link = card.getAttribute('data-pdf') || '';
          // Only map valid display categories
          let categoryLabelName = '';
          if (cat === 'web') categoryLabelName = lang === 'th' ? 'Web App' : 'Web Application';
          else if (cat === 'unity') categoryLabelName = lang === 'th' ? 'Game Dev' : 'Game Development';
          else if (cat === 'blender') categoryLabelName = lang === 'th' ? '3D Design' : '3D Design & Modeling';
          else if (cat === 'photography') categoryLabelName = lang === 'th' ? 'ถ่ายภาพ' : 'Photography & Layout';
          else if (cat === 'short film') categoryLabelName = lang === 'th' ? 'หนังสั้น' : 'Short Film Production';
          
          if (categoryLabelName && title) {
            projectItems.push({ category: categoryLabelName, title, link });
            seenCategories.add(cat);
          }
        }
      });

      // Construct Resume HTML
      const expTitle = lang === 'th' ? 'ประสบการณ์การทำงาน' : 'Professional Experience';
      const eduTitle = lang === 'th' ? 'ประวัติการศึกษา' : 'Education';
      const skillsTitle = lang === 'th' ? 'ความเชี่ยวชาญ' : 'Expertise';
      const toolsTitle = lang === 'th' ? 'เครื่องมือและเทคโนโลยี' : 'Tools & Tech Stack';
      const projectsTitle = lang === 'th' ? 'ผลงานดีเด่นรายหมวดหมู่' : 'Selected Works';

      let expHtml = '';
      expItems.forEach(item => {
        expHtml += `
          <div style="margin-bottom: 6px; page-break-inside: avoid; letter-spacing: normal;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <h4 style="font-size: 12pt; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.4;">${item.title}</h4>
              <span style="font-size: 9.5pt; font-weight: 600; color: #ff5e3a; white-space: nowrap; margin-left: 10px;">${item.period}</span>
            </div>
            <p style="font-size: 12pt; font-weight: 700; color: #475569; margin: 0 0 2px 0; line-height: 1.4;">${item.company}</p>
            <p style="font-size: 8.5pt; color: #475569; margin: 0; line-height: 1.45; text-align: justify;">${item.desc}</p>
          </div>
        `;
      });

      let eduHtml = '';
      eduItems.forEach(item => {
        eduHtml += `
          <div style="margin-bottom: 6px; page-break-inside: avoid; letter-spacing: normal;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <h4 style="font-size: 12pt; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.4;">${item.school}</h4>
              <span style="font-size: 9.5pt; font-weight: 600; color: #ff5e3a; white-space: nowrap; margin-left: 10px;">${item.period}</span>
            </div>
            <p style="font-size: 8.5pt; color: #475569; margin: 0; line-height: 1.45;">${item.degree}</p>
          </div>
        `;
      });

      let rolesHtml = '';
      roleSpans.forEach(role => {
        rolesHtml += `<span style="font-size: 8.5pt; font-weight: 600; padding: 2px 6px; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; color: #475569; letter-spacing: normal; line-height: 1.4;">${role}</span>`;
      });

      let toolsHtml = '';
      toolItems.forEach(item => {
        toolsHtml += `
          <div style="margin-bottom: 4px; letter-spacing: normal;">
            <h5 style="font-size: 11pt; font-weight: 700; color: #334155; margin: 0 0 1px 0; line-height: 1.4;">${item.name}</h5>
            <p style="font-size: 8.5pt; color: #64748b; margin: 0; line-height: 1.4;">${item.desc}</p>
          </div>
        `;
      });

      let projectsHtml = '';
      projectItems.forEach(item => {
        const cleanLink = item.link ? item.link.replace('https://', '') : '';
        const linkHtml = item.link 
          ? `<a href="${item.link}" target="_blank" style="font-size: 8.5pt; font-weight: 600; color: #ff5e3a; text-decoration: none; line-height: 1.4;">🔗 ${cleanLink}</a>` 
          : `<span style="font-size: 8.5pt; color: #94a3b8; font-style: italic;">${lang === 'th' ? 'ดูรายละเอียดในเว็บพอร์ต' : 'View in Portfolio Web'}</span>`;
        projectsHtml += `
          <div style="margin-bottom: 6px; page-break-inside: avoid; letter-spacing: normal;">
            <div style="font-size: 8.5pt; font-weight: 700; color: #ff5e3a; text-transform: uppercase; margin-bottom: 1px;">[${item.category}]</div>
            <h4 style="font-size: 10.5pt; font-weight: 700; color: #0f172a; margin: 0 0 1px 0; line-height: 1.35;">${item.title}</h4>
            ${linkHtml}
          </div>
        `;
      });

      const resumeHtml = `
        <div style="font-family: 'Google Sans', 'Sarabun', 'Noto Sans Thai', 'Plus Jakarta Sans', sans-serif; padding: 20px 30px; color: #1e293b; background-color: #ffffff; line-height: 1.4; box-sizing: border-box; width: 794px; height: 1120px; display: flex; flex-direction: column; justify-content: space-between; text-align: left;">
          <div>
            <!-- HEADER -->
            <div style="border-bottom: 2px solid #ff5e3a; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <!-- Profile Image (ENLARGED to 70px) -->
                <div style="width: 70px; height: 70px; overflow: hidden; border: 2.5px solid #ff5e3a; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: #f1f5f9; flex-shrink: 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                  <img src="./assets/images/smongkon.webp" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div>
                  <h1 style="font-size: 22pt; font-weight: 700; margin: 0; color: #0f172a; letter-spacing: -0.015em; text-transform: uppercase; line-height: 1.2;">${name}</h1>
                  <p style="font-size: 12pt; font-weight: 700; margin: 2px 0 0 0; color: #ff5e3a; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1.3;">${roleTitle}</p>
                </div>
              </div>
              <div style="text-align: right; font-size: 9.5pt; color: #475569; font-weight: 600; line-height: 1.45;">
                <div>📞 ${phone}</div>
                <div>✉️ ${email}</div>
                <div>🌐 ${portfolioLink}</div>
                <div>📍 ${location}</div>
              </div>
            </div>

            <!-- TWO COLUMN GRID (REPLACED WITH FLEX FOR HTML2CANVAS COMPATIBILITY) -->
            <div style="display: flex; justify-content: space-between; gap: 24px; width: 100%; box-sizing: border-box;">
              <!-- LEFT COLUMN -->
              <div style="width: 410px; flex-shrink: 0; box-sizing: border-box;">
                <!-- EXPERIENCE -->
                <div style="margin-bottom: 12px;">
                  <h3 style="font-size: 14pt; font-weight: 700; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; letter-spacing: 0.02em; line-height: 1.4;">💼 ${expTitle}</h3>
                  ${expHtml}
                </div>

                <!-- EDUCATION -->
                <div>
                  <h3 style="font-size: 14pt; font-weight: 700; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; letter-spacing: 0.02em; line-height: 1.4;">🎓 ${eduTitle}</h3>
                  ${eduHtml}
                </div>
              </div>

              <!-- RIGHT COLUMN -->
              <div style="width: 280px; flex-shrink: 0; box-sizing: border-box;">
                <!-- EXPERTISE ROLES -->
                <div style="margin-bottom: 10px;">
                  <h3 style="font-size: 14pt; font-weight: 700; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; letter-spacing: 0.02em; line-height: 1.4;">🛠️ ${skillsTitle}</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;">
                    ${rolesHtml}
                  </div>
                </div>

                <!-- TOOLS & SOFTWARE -->
                <div style="margin-bottom: 12px;">
                  <h3 style="font-size: 14pt; font-weight: 700; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; letter-spacing: 0.02em; line-height: 1.4;">💻 ${toolsTitle}</h3>
                  ${toolsHtml}
                </div>

                <!-- SELECTED PROJECTS -->
                <div>
                  <h3 style="font-size: 14pt; font-weight: 700; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; letter-spacing: 0.02em; line-height: 1.4;">🚀 ${projectsTitle}</h3>
                  ${projectsHtml}
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 8.5px; color: #94a3b8; font-weight: 500;">
            Generated in Real-Time from Portfolio Website | © 2026 Mongkon Onnom
          </div>
        </div>
      `;

      // Create a temporary visible container in the body (positioned absolute at (0,0) to prevent offsets when scrolled to top)
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '0';
      tempDiv.style.top = '0';
      tempDiv.style.width = '794px';
      tempDiv.style.height = '1120px';
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.style.textAlign = 'left';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.opacity = '1';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.pointerEvents = 'none';
      tempDiv.innerHTML = resumeHtml;
      document.body.appendChild(tempDiv);

      // html2pdf options (optimized with explicit viewport width/height and scroll overrides to ensure single-page A4)
      const opt = {
        margin:       0,
        filename:     `Resume_Mongkon_Onnom_${lang.toUpperCase()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2.0, 
          useCORS: true, 
          letterRendering: false, 
          logging: false,
          width: 794,
          height: 1120,
          windowWidth: 794,
          windowHeight: 1120,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Delay generation to allow browser rendering and painting
      setTimeout(() => {
        // Wait for image loading
        const img = tempDiv.querySelector('img');
        const startPdfGenerate = () => {
          // Temporarily disable smooth scrolling to force instant scroll
          const htmlStyle = document.documentElement.style.scrollBehavior;
          const bodyStyle = document.body.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';

          // Temporarily scroll to top-left to avoid html2canvas scroll offset rendering bugs
          const currentScrollX = window.scrollX;
          const currentScrollY = window.scrollY;
          window.scrollTo(0, 0);

          html2pdf().from(tempDiv).set(opt).save().then(() => {
            // Restore scroll position and behavior
            window.scrollTo(currentScrollX, currentScrollY);
            document.documentElement.style.scrollBehavior = htmlStyle;
            document.body.style.scrollBehavior = bodyStyle;
            
            // Reset button and clean up tempDiv
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
            }
          }).catch(err => {
            console.error('Error generating PDF:', err);
            // Restore scroll position and behavior on error
            window.scrollTo(currentScrollX, currentScrollY);
            document.documentElement.style.scrollBehavior = htmlStyle;
            document.body.style.scrollBehavior = bodyStyle;
            
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
            }
          });
        };

        if (img) {
          if (img.complete) {
            startPdfGenerate();
          } else {
            img.onload = startPdfGenerate;
            img.onerror = startPdfGenerate; // fallback if image fails to load
          }
        } else {
          startPdfGenerate();
        }
      }, 250);
    };

    downloadBtnTh.addEventListener('click', () => {
      if (typeof toggleDropdown === 'function') toggleDropdown(false);
      // Let the browser handle standard anchor link download for static PDF
    });
    downloadBtnEn.addEventListener('click', () => {
      if (typeof toggleDropdown === 'function') toggleDropdown(false);
      // Let the browser handle standard anchor link download for static PDF
    });
  }

  // 12. 2D Curved Carousel Logic (Infinite Smooth 2D Curved Ribbon)
  const carousel = document.getElementById('carousel-3d');
  const infoTitle = document.getElementById('carousel-item-title');
  const infoDesc = document.getElementById('carousel-item-desc');
  
  if (carousel) {
    const items = Array.from(carousel.querySelectorAll('.carousel-3d-item'));
    const totalItems = items.length;
    let currIndex = 0;
    
    let currentX = 0;
    let targetX = 0;
    const autoScrollSpeed = -0.32; // Smoother and slower scroll for a premium feel
    let isHovered = false;
    let isDragging = false;
    let startX = 0;
    let dragXStart = 0;
    let hasDragged = false;
    
    // Spacing configuration (will be updated dynamically on resize)
    let cardWidth = 280;
    let gap = 24;
    let spacing = cardWidth + gap;
    let totalWidth = totalItems * spacing;
    
    const updateDimensions = () => {
      const isMobile = window.innerWidth <= 640;
      cardWidth = isMobile ? 140 : 280;
      gap = isMobile ? 16 : 24;
      spacing = cardWidth + gap;
      totalWidth = totalItems * spacing;
    };
    
    const updateActiveTransformStyle = () => {
      updateDimensions();
      const isMobile = window.innerWidth <= 640;
      
      // Parabolic curve parameters
      const curveHeight = isMobile ? 35 : 75; // Vertical hammock dip depth
      const curveRadius = isMobile ? window.innerWidth * 0.55 : 600; // Curve horizontal spread width
      
      const halfHeight = isMobile ? 93.5 : 186.5;
      
      items.forEach((item, idx) => {
        // Calculate X coordinate relative to current scroll offset
        let xi = (idx * spacing + currentX) % totalWidth;
        
        // Wrap coordinates to center them relative to the viewport [-totalWidth/2, totalWidth/2]
        if (xi > totalWidth / 2) xi -= totalWidth;
        if (xi < -totalWidth / 2) xi += totalWidth;
        
        // Parabolic formula: Y = curveHeight * (X / curveRadius)^2
        const ratio = Math.min(Math.max(xi / curveRadius, -1.8), 1.8);
        const yi = curveHeight * (ratio * ratio);
        
        // Tangent angle calculation: slope = 2 * curveHeight * X / curveRadius^2
        const slope = (2 * curveHeight * xi) / (curveRadius * curveRadius);
        const tiltAngle = Math.atan(slope) * (180 / Math.PI);
        
        // Calculate dynamic zDepth to overlap items nicely (center item comes slightly forward)
        const zDepth = Math.max(0, 40 - Math.abs(xi) * 0.08);
        
        // Scale factors: Active card center gets scale(1.08), side cards get scale(0.92)
        const isActive = idx === currIndex;
        const scaleFactor = isActive ? 1.08 : 0.92;
        
        // Position card: offset from absolute center (50%, 50%)
        const transformStr = `translate3d(${xi - cardWidth/2}px, ${yi - halfHeight}px, ${zDepth}px) rotate(${tiltAngle}deg) scale(${scaleFactor})`;
        item.style.transform = transformStr;
        item.style.setProperty('--active-transform', transformStr);
        
        // Set dynamic opacity and pointer events based on visibility range
        const viewBoundary = window.innerWidth / 2 + cardWidth;
        if (Math.abs(xi) > viewBoundary) {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
        } else {
          // Dim side cards slightly for focus effect
          const opacity = Math.max(0.2, 1 - Math.abs(xi) / (window.innerWidth * 0.7));
          item.style.opacity = opacity.toString();
          item.style.pointerEvents = 'auto';
        }
      });
    };
    
    const rotateTo = (targetIndex) => {
      // Find the shortest circular path in flat layout index offsets
      let diff = targetIndex - currIndex;
      if (diff > totalItems / 2) {
        diff -= totalItems;
      } else if (diff < -totalItems / 2) {
        diff += totalItems;
      }
      
      targetX -= diff * spacing;
      currIndex = targetIndex;
      updateItemStates();
    };

    const updateItemStates = () => {
      items.forEach((item, idx) => {
        if (idx === currIndex) {
          item.classList.remove('inactive');
          item.classList.add('active');
        } else {
          item.classList.remove('active');
          item.classList.add('inactive');
        }
      });
      
      const activeItem = items[currIndex];
      if (activeItem && infoTitle && infoDesc) {
        const isTh = document.documentElement.getAttribute('lang') === 'th';
        const title = isTh ? activeItem.getAttribute('data-title-th') : activeItem.getAttribute('data-title-en');
        const desc = isTh ? activeItem.getAttribute('data-desc-th') : activeItem.getAttribute('data-desc-en');
        
        infoTitle.textContent = title;
        infoDesc.textContent = desc;
      }
    };
    
    // Drag / Swipe Snapping Handlers
    const handleDragStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      dragXStart = targetX;
      hasDragged = false;
    };
    
    const handleDragMove = (clientX) => {
      if (!isDragging) return;
      const diffX = clientX - startX;
      if (Math.abs(diffX) > 4) {
        hasDragged = true;
      }
      // Direct pixel sliding sensitivity mapping 1:1
      targetX = dragXStart + diffX * 1.1;
    };
    
    const handleDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      // Calculate closest snapping index based on final targetX
      const approxIndex = Math.round(-targetX / spacing) % totalItems;
      const snapIndex = approxIndex < 0 ? approxIndex + totalItems : approxIndex;
      
      rotateTo(snapIndex);
    };
    
    // Mouse Event Listeners
    carousel.addEventListener('mousedown', (e) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    });
    
    window.addEventListener('mousemove', (e) => {
      handleDragMove(e.clientX);
    });
    
    window.addEventListener('mouseup', handleDragEnd);
    
    // Touch Event Listeners (Mobile compatibility)
    carousel.addEventListener('touchstart', (e) => {
      handleDragStart(e.touches[0].clientX);
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
      handleDragMove(e.touches[0].clientX);
    }, { passive: true });
    
    carousel.addEventListener('touchend', handleDragEnd);
    
    // Click items to focus them
    items.forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        // If user was dragging, do not trigger index snapping
        if (hasDragged) {
          e.preventDefault();
          return;
        }
        if (idx !== currIndex) {
          rotateTo(idx);
        }
      });
    });

    // Auto-update dynamic active states when continuous scrolling crosses midpoint
    const updateIndexFromAngle = () => {
      const approxIndex = Math.round(-currentX / spacing) % totalItems;
      const activeIdx = approxIndex < 0 ? approxIndex + totalItems : approxIndex;
      
      if (activeIdx !== currIndex) {
        currIndex = activeIdx;
        updateItemStates();
      }
    };

    // Animation loop (Springy physics interpolation)
    const animate = () => {
      if (!isHovered && !isDragging) {
        targetX += autoScrollSpeed;
      }
      
      // Springy smooth transition
      currentX += (targetX - currentX) * 0.08;
      
      // Wrap scroll parameters to prevent coordinate drift over time
      if (Math.abs(currentX) > totalWidth) {
        currentX = currentX % totalWidth;
        targetX = targetX % totalWidth;
      }
      
      updateActiveTransformStyle();
      updateIndexFromAngle();
      requestAnimationFrame(animate);
    };

    // Pause on Hover
    carousel.addEventListener('mouseenter', () => { isHovered = true; });
    carousel.addEventListener('mouseleave', () => { isHovered = false; });
    
    // Lang Change Handler
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        setTimeout(updateItemStates, 50);
      });
    }

    // Initialize layout positions
    updateActiveTransformStyle();
    window.addEventListener('resize', updateActiveTransformStyle);
    
    // Trigger initial positioning state
    updateItemStates();
    
    // Launch Continuous Loop
    requestAnimationFrame(animate);
  }
});
