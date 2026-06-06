document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. Sticky Navbar & Scroll Triggers
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const checkScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      // Don't remove scrolled class if we are on secondary pages that require scrolled style
      const path = window.location.pathname;
      if (path.includes('blogs.html') || path.includes('case-studies.html') || path.includes('about.html') || path.includes('works.html') || path.includes('contact.html')) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial invocation

  /* ==========================================================
     2. Mobile Menu Toggle Drawer
     ========================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking navigation links on mobile
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* ==========================================================
     3. Dual Theme Switcher (Dark / Light)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('axxeler_theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('axxeler_theme', theme);
    });
  }

  /* ==========================================================
     4. Animated Statistics Counter in Hero
     ========================================================== */
  const heroCounter = document.getElementById('heroCounter');
  if (heroCounter) {
    let count = 0;
    const target = 312;
    const increment = Math.ceil(target / 60); // approx 60 frames animation
    const updateCounter = () => {
      count += increment;
      if (count < target) {
        heroCounter.innerText = `+${count}%`;
        requestAnimationFrame(updateCounter);
      } else {
        heroCounter.innerText = `+${target}%`;
      }
    };
    // Trigger slightly delayed for visual impact
    setTimeout(updateCounter, 300);
  }

  /* ==========================================================
     5. YouTube Video Interactive Facades
     ========================================================== */
  const facades = document.querySelectorAll('.yt-facade');
  facades.forEach(facade => {
    facade.addEventListener('click', function() {
      const vid = this.getAttribute('data-vid');
      const iframeHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      this.innerHTML = iframeHTML;
      this.style.cursor = 'default';
      this.classList.remove('yt-facade');
    });
  });

  /* ==========================================================
     6. Portfolio Filter Tabs Logic
     ========================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const mediaCards = document.querySelectorAll('.media-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      mediaCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================
     7. Interactive Campaign Retainer Estimator
     ========================================================== */
  const estCards = document.querySelectorAll('.est-card');
  const durationSlider = document.getElementById('durationSlider');
  const durationValue = document.getElementById('durationValue');
  const totalCost = document.getElementById('totalCost');
  const estDiscountLabel = document.getElementById('estDiscountLabel');
  const estimatorSelectedList = document.getElementById('estimatorSelectedList');
  const bookEstimatorCall = document.getElementById('bookEstimatorCall');

  const updateEstimator = () => {
    if (!durationSlider || !totalCost) return;
    
    const months = parseInt(durationSlider.value);
    durationValue.innerText = months === 1 ? '1 Month' : `${months} Months`;
    
    let baseMonthlyCost = 0;
    const selectedItems = [];
    
    estCards.forEach(card => {
      if (card.classList.contains('active')) {
        const cost = parseInt(card.getAttribute('data-cost'));
        const serviceName = card.querySelector('h4').innerText;
        baseMonthlyCost += cost;
        selectedItems.push({ name: serviceName, cost: cost });
      }
    });

    // Discount calculations: Contract duration >= 6 months nets a 15% discount
    let discount = 0;
    if (months >= 6) {
      discount = 0.15;
      if (estDiscountLabel) estDiscountLabel.innerText = 'Automatic 15% discount applied!';
    } else if (months >= 3) {
      discount = 0.05;
      if (estDiscountLabel) estDiscountLabel.innerText = 'Contract 5% discount applied!';
    } else {
      if (estDiscountLabel) estDiscountLabel.innerText = 'No contract discount active.';
    }

    const discountedMonthly = Math.round(baseMonthlyCost * (1 - discount));
    
    // Render Total Cost
    totalCost.innerText = `₹${discountedMonthly.toLocaleString()}`;
    
    // Render Selected List
    if (estimatorSelectedList) {
      if (selectedItems.length === 0) {
        estimatorSelectedList.innerHTML = '<li style="color:var(--text-light)">No services selected. Click to add services!</li>';
      } else {
        estimatorSelectedList.innerHTML = selectedItems.map(item => `
          <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <span>● ${item.name}</span>
            <span>₹${item.cost.toLocaleString()}/mo</span>
          </li>
        `).join('');
      }
    }
  };

  if (estCards.length > 0) {
    estCards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('active');
        updateEstimator();
      });
    });
  }

  if (durationSlider) {
    durationSlider.addEventListener('input', updateEstimator);
    updateEstimator(); // Initial update
  }

  // Pre-fill capture wizard from cost estimator selections using sessionStorage redirection
  if (bookEstimatorCall) {
    bookEstimatorCall.addEventListener('click', (e) => {
      e.preventDefault();
      // Find selected estimator services
      const selectedServices = [];
      estCards.forEach(card => {
        if (card.classList.contains('active')) {
          selectedServices.push(card.querySelector('h4').innerText);
        }
      });

      // Estimate approximate budget based on selected costs
      let monthlyBudget = parseInt(totalCost.innerText.replace(/[^0-9]/g, ''));
      
      // Save details to sessionStorage
      sessionStorage.setItem('axxeler_estimator_services', JSON.stringify(selectedServices));
      sessionStorage.setItem('axxeler_estimator_budget', monthlyBudget);
      
      // Redirect to contact page
      window.location.href = 'contact.html';
    });
  }

  /* ==========================================================
     8. Multi-Step Lead Capture Form Wizard
     ========================================================== */
  const leadForm = document.getElementById('leadForm');
  const stepPanels = document.querySelectorAll('.form-step-panel');
  const stepDots = document.querySelectorAll('.form-step-dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentStep = 1;

  // Auto-fill from cost estimator sessionStorage if redirected
  if (leadForm) {
    const cachedServices = sessionStorage.getItem('axxeler_estimator_services');
    const cachedBudget = sessionStorage.getItem('axxeler_estimator_budget');
    
    if (cachedServices) {
      const selectedServices = JSON.parse(cachedServices);
      const formCheckboxes = document.querySelectorAll('#formServicesGrid input[type="checkbox"]');
      formCheckboxes.forEach(box => {
        // Map checkbox values
        const isMatched = selectedServices.some(s => s.toLowerCase().includes(box.value.replace(' Management', '').replace(' Optimization', '').toLowerCase().substring(0, 8)));
        box.checked = isMatched;
      });
      sessionStorage.removeItem('axxeler_estimator_services');
    }
    
    if (cachedBudget) {
      let monthlyBudget = parseInt(cachedBudget);
      const budgetSelect = document.getElementById('formBudgetRange');
      if (budgetSelect) {
        if (monthlyBudget < 30000) {
          budgetSelect.value = 'Under ₹30,000';
        } else if (monthlyBudget <= 75000) {
          budgetSelect.value = '₹30,000 - ₹75,000';
        } else if (monthlyBudget <= 150000) {
          budgetSelect.value = '₹75,000 - ₹1,50,000';
        } else {
          budgetSelect.value = 'Over ₹1,50,000';
        }
      }
      sessionStorage.removeItem('axxeler_estimator_budget');
    }
  }

  const updateFormWizard = () => {
    // Show active step panel
    stepPanels.forEach(panel => {
      panel.classList.remove('active');
      if (parseInt(panel.getAttribute('data-step')) === currentStep) {
        panel.classList.add('active');
      }
    });

    // Update step dots classes
    stepDots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'));
      dot.classList.remove('active', 'completed');
      if (step === currentStep) {
        dot.classList.add('active');
      } else if (step < currentStep) {
        dot.classList.add('completed');
      }
    });

    // Handle Previous button visibility
    if (currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    // Handle Next button text
    if (currentStep === 3) {
      nextBtn.innerText = 'Submit Strategy Application ✓';
      nextBtn.classList.remove('btn-outline');
      nextBtn.classList.add('btn-primary');
    } else {
      nextBtn.innerText = 'Continue Step ➔';
    }
  };

  const validateStep = (step) => {
    const activePanel = document.querySelector(`.form-step-panel[data-step="${step}"]`);
    if (!activePanel) return true;
    
    const requiredInputs = activePanel.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'var(--primary)';
        // Reset border when user types
        input.addEventListener('input', function resetBorder() {
          this.style.borderColor = 'var(--border)';
          this.removeEventListener('input', resetBorder);
        });
      }
    });
    
    return isValid;
  };

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < 3) {
        if (validateStep(currentStep)) {
          currentStep++;
          updateFormWizard();
        } else {
          alert('Please fill out all required fields before continuing.');
        }
      } else {
        // Step 3 submission execution
        if (validateStep(currentStep)) {
          submitLeadData();
        } else {
          alert('Please fill out your contact details before submitting.');
        }
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateFormWizard();
      }
    });
  }

  const submitLeadData = () => {
    if (!leadForm) return;
    
    const formData = new FormData(leadForm);
    
    // Aggregate checkboxes values
    const chosenServices = [];
    const checkboxes = document.querySelectorAll('#formServicesGrid input[type="checkbox"]');
    checkboxes.forEach(box => {
      if (box.checked) chosenServices.push(box.value);
    });

    // Simple default fallback budget calculation
    const budgetVal = formData.get('budgetRange') || '₹30,000 - ₹75,000';
    let estPipeVal = 50000;
    if (budgetVal.includes('Under')) estPipeVal = 25000;
    if (budgetVal.includes('75,000 -')) estPipeVal = 100000;
    if (budgetVal.includes('Over')) estPipeVal = 200000;

    const lead = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      industry: formData.get('industry'),
      budget: budgetVal,
      estPipelineVal: estPipeVal,
      service: chosenServices.join(', ') || 'Growth Audit Call',
      message: formData.get('challenges') || 'Standard strategy request.',
      status: 'New',
      date: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    // Save lead into LocalStorage DB
    const existingLeads = JSON.parse(localStorage.getItem('axxeler_leads') || '[]');
    existingLeads.push(lead);
    localStorage.setItem('axxeler_leads', JSON.stringify(existingLeads));

    // Success notifications
    alert(`Success, ${lead.name}! Your free audit application has been registered.\nOur team will review your brand within 2 hours.`);
    
    // Reset Form & steps
    leadForm.reset();
    currentStep = 1;
    updateFormWizard();
  };

  /* ==========================================================
     9. FAQ Accordion Collapse Logic
     ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    }
  });

  /* ==========================================================
     10. Blogs Magazine Search Engine & Routing
     ========================================================== */
  const blogSearch = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('#blogListGrid .blog-card');
  const noBlogResults = document.getElementById('noBlogResults');

  if (blogSearch) {
    blogSearch.addEventListener('input', function() {
      const q = this.value.toLowerCase().trim();
      let visibleCount = 0;
      
      blogCards.forEach(card => {
        const text = card.getAttribute('data-title') || '';
        const title = card.querySelector('h3').innerText.toLowerCase();
        
        if (text.includes(q) || title.includes(q)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      if (visibleCount === 0) {
        noBlogResults.style.display = 'block';
      } else {
        noBlogResults.style.display = 'none';
      }
    });
  }

  // SPA hash router for reading blogs full view
  const blogPortalView = document.getElementById('blogPortalView');
  const blogArticleView = document.getElementById('blogArticleView');
  const articles = document.querySelectorAll('.article-panel');

  const handleBlogRouting = () => {
    if (!blogPortalView || !blogArticleView) return;
    
    const hash = window.location.hash;
    
    if (hash && (hash === '#ecom' || hash === '#realestate' || hash === '#speed')) {
      // Hide listings
      blogPortalView.style.display = 'none';
      // Show reading zone
      blogArticleView.style.display = 'block';
      
      // Hide all sub-articles
      articles.forEach(art => art.style.display = 'none');
      
      // Map hash to exact article panels
      if (hash === '#ecom') {
        document.getElementById('artEcom').style.display = 'block';
      } else if (hash === '#realestate') {
        document.getElementById('artRealEstate').style.display = 'block';
      } else if (hash === '#speed') {
        document.getElementById('artSpeed').style.display = 'block';
      }
      
      // Scroll to top
      window.scrollTo(0, 0);
    } else {
      // No hash or root - display directory listings
      blogPortalView.style.display = 'block';
      blogArticleView.style.display = 'none';
      articles.forEach(art => art.style.display = 'none');
    }
  };

  if (blogPortalView && blogArticleView) {
    window.addEventListener('hashchange', handleBlogRouting);
    handleBlogRouting(); // Initial call
  }

  // CRM Lead Management section removed as requested.

});
