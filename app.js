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

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1400);
    });
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
