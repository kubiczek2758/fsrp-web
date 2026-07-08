/**
 * Florida State Roleplay - Website Application
 * Simple version: loader, navbar, scroll animations, mobile menu.
 */

(function () {
  'use strict';

  // ========================
  // DOM Helpers
  // ========================
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  // ========================
  // Loader
  // ========================
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;

    generateLoaderParticles();
    animateLoaderPercent();

    window.addEventListener('load', () => {
      const progress = $('#loaderProgress');
      const percent = $('#loaderPercent');
      const status = loader.querySelector('.loader-status');

      if (progress) progress.style.width = '100%';
      if (percent) percent.textContent = '100%';
      if (status) status.textContent = 'Welcome to Florida State Roleplay';

      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1600);
    });
  }

  function generateLoaderParticles() {
    const container = $('#loaderParticles');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('span');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.width = Math.random() * 4 + 2 + 'px';
      p.style.height = p.style.width;
      p.style.animationDuration = Math.random() * 3 + 2 + 's';
      p.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(p);
    }
  }

  function animateLoaderPercent() {
    const percent = $('#loaderPercent');
    if (!percent) return;

    let value = 0;
    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 4) + 1;
      if (value >= 99) {
        value = 99;
        clearInterval(interval);
      }
      percent.textContent = value + '%';
    }, 35);
  }

  // ========================
  // Navbar Scroll Effect + Active Links
  // ========================
  function initNavbar() {
    const navbar = $('#navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveNavLink();
    });

    updateActiveNavLink();
  }

  function updateActiveNavLink() {
    const sections = ['home', 'about', 'owners', 'departments', 'applications', 'rules', 'discord'];
    const navLinks = $$('.nav-links a[href^="#"]');
    if (navLinks.length === 0) return;

    let current = 'home';
    const scrollPos = window.scrollY + 150;

    sections.forEach((id) => {
      const section = $('#' + id);
      if (section && section.offsetTop <= scrollPos) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ========================
  // Scroll Reveal Animation
  // ========================
  function initReveal() {
    const reveals = $$('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // ========================
  // Mobile Menu
  // ========================
  function initMobileMenu() {
    const btn = $('#mobileMenuBtn');
    const navLinks = $('.nav-links');
    if (!btn || !navLinks) return;

    btn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      btn.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('open');
          btn.classList.remove('active');
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('open');
        btn.classList.remove('active');
      }
    });
  }

  // ========================
  // Initialize
  // ========================
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initReveal();
    initMobileMenu();
  });
})();
