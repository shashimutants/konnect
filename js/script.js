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
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;

      function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var currentValue = Math.floor(progress * target);
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
    }, { threshold: 0.5 });
    observer.observe(statsSection);
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

  // Hero slider
  var sliderTrack = document.querySelector('.slider-track');
  if (sliderTrack) {
    var slides = sliderTrack.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var currentIndex = 0;
    var slideInterval;

    function goToSlide(index) {
      slides.forEach(function (s) {
        s.classList.remove('active');
        s.style.backgroundPosition = '';
      });
      if (dots.length > 0) {
        dots.forEach(function (d) { d.classList.remove('active'); });
        dots[index].classList.add('active');
      }
      slides[index].classList.add('active');
      currentIndex = index;
      handleParallax();
    }

    function nextSlide() {
      var next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function prevSlide() {
      var prev = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    function startAutoplay() {
      stopAutoplay();
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    if (dots.length > 0) {
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          var index = parseInt(this.getAttribute('data-slide'), 10);
          goToSlide(index);
          startAutoplay();
        });
      });
    }

    startAutoplay();
  }

});
