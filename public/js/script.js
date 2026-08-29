document.addEventListener('DOMContentLoaded', function () {

  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // Dropdown toggle (mobile)
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parentLi = this.closest('.has-dropdown');
      parentLi.classList.toggle('open');
      var subMenu = parentLi.querySelector('.sub-menu') || parentLi.querySelector('.mega-menu');
      if (subMenu) {
        if (parentLi.classList.contains('open')) {
          subMenu.style.display = 'block';
        } else {
          subMenu.style.display = '';
        }
      }
    });
  });

  // Active nav link highlighting
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.main-nav .nav-list a');

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId !== '#') {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Counter animation for stats
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCounters() {
    statNumbers.forEach(function (el) {
      var raw = el.getAttribute('data-target');
      var target = parseFloat(raw);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;

      function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var currentValue;

        if (raw.indexOf('.') !== -1) {
          currentValue = (progress * target).toFixed(1);
          if (currentValue.endsWith('.0')) currentValue = currentValue.slice(0, -2);
        } else {
          currentValue = Math.floor(progress * target);
        }

        el.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Intersection Observer for stats
  var statsSection = document.querySelector('.stats-section');
  if (statsSection && statNumbers.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
    // Fallback: if observer doesn't fire within 4s, animate anyway
    setTimeout(function () {
      if (statNumbers[0].textContent === '0' || statNumbers[0].textContent === '0+') {
        animateCounters();
      }
    }, 4000);
  }

  // Sticky header - show bg only after scroll
  var header = document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll);

  // Parallax effect on hero slides
  var heroSlider = document.querySelector('.hero-slider');

  function handleParallax() {
    if (!heroSlider) return;
    var scrollTop = window.scrollY;
    var offset = heroSlider.offsetTop;
    var scrolled = scrollTop - offset;
    if (scrolled < 0) scrolled = 0;
    var activeSlide = heroSlider.querySelector('.slide.active');
    if (activeSlide) {
      activeSlide.style.backgroundPosition = 'center ' + (scrolled * 0.4) + 'px';
    }
  }

  if (heroSlider) {
    window.addEventListener('scroll', handleParallax);
  }

  // Rotating Hero Banner Slider
  var heroSlider = document.querySelector('.hero-slider');
  var sliderTrack = document.querySelector('.slider-track');
  if (heroSlider && sliderTrack) {
    var slides = sliderTrack.querySelectorAll('.slide');
    var dots = heroSlider.querySelectorAll('.dot');
    var prevBtn = heroSlider.querySelector('.slider-prev');
    var nextBtn = heroSlider.querySelector('.slider-next');
    var currentIndex = 0;
    var slideInterval = null;
    var autoplayDelay = 5000; // 5 seconds rotation

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach(function (s, i) {
        if (i === index) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      if (dots.length > 0) {
        dots.forEach(function (d, i) {
          if (i === index) {
            d.classList.add('active');
            d.setAttribute('aria-selected', 'true');
          } else {
            d.classList.remove('active');
            d.setAttribute('aria-selected', 'false');
          }
        });
      }

      currentIndex = index;
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      slideInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Next/Prev Buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      });
    }

    // Dot Navigation
    if (dots.length > 0) {
      dots.forEach(function (dot) {
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          var index = parseInt(this.getAttribute('data-slide'), 10);
          goToSlide(index);
          startAutoplay();
        });
      });
    }

    // Pause on hover
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    heroSlider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    heroSlider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      }
    });

    // Start auto-rotation
    startAutoplay();
  }

});
