/**
 * Florida State Roleplay - Website Application
 * Features: loader, animations, scroll effects, F8 admin panel,
 * content editing with localStorage persistence, import/export, news system.
 */

(function () {
  'use strict';

  // ========================
  // Configuration
  // ========================
  const ADMIN_PASSWORD = 'H&l9Jo0';
  const STORAGE_KEY = 'fsrp_site_config';
  const NEWS_KEY = 'fsrp_site_news';
  const DEFAULT_DISCORD = 'https://discord.gg/pcP85r22KW';

  // Default configuration used on first load or after reset
  const defaultConfig = {
    serverName: 'Florida State Roleplay',
    serverSubtitle: 'Immersive roleplay experience in sunny Florida. Join a community that values realism, respect, and unforgettable stories.',
    aboutSubtitle: 'Why should you join us?',
    aboutRp: "We create immersive scenarios where every decision matters. We focus on high-quality roleplay at every level.",
    aboutServices: "We work with multiple departments: police, sheriff, fire department, FBI, and more to ensure realistic emergency services.",
    aboutCommunity: "We bring together players who respect each other and want to create unforgettable stories with others.",
    aboutWorld: "From lively cities to wild national park areas — in Florida State Roleplay, everyone will find something for themselves.",
    'dept-florida-fire-desc': 'Save lives and property, respond to fires, vehicle accidents, and medical emergencies across the state.',
    'dept-florida-fire-link': DEFAULT_DISCORD,
    'dept-fbi-desc': 'Lead federal investigations, take down organized crime groups, and protect national security.',
    'dept-fbi-link': DEFAULT_DISCORD,
    'dept-state-patrol-desc': 'Patrol highways and state roads, enforce traffic laws, and keep travelers safe.',
    'dept-state-patrol-link': DEFAULT_DISCORD,
    'dept-lake-sheriff-desc': "Keep the peace in Lake County — from small towns to rural areas, respond to citizen calls.",
    'dept-lake-sheriff-link': DEFAULT_DISCORD,
    'dept-nps-desc': 'Protect wildlife and national parks, assist tourists, and respond to threats in the wilderness.',
    'dept-nps-link': DEFAULT_DISCORD,
    rules: [
      'Respect other players and staff — zero tolerance for toxicity, discrimination, or harassment.',
      'Play realistically — avoid fail RP, meta-gaming, power-gaming, and random deathmatch (RDM).',
      'Use only official in-game communication channels during roleplay (in-game voice).',
      'Do not abuse game or script bugs for personal gain — report them to staff.',
      'Follow instructions from staff and uniformed service members within roleplay.',
      'Keep your account secure and do not share it with others — you are responsible for your actions.',
      'Cheats, mod menus, and any unauthorized software are strictly prohibited.',
      'Remember: the goal is fun for everyone — play responsibly!'
    ],
    discordLink: DEFAULT_DISCORD,
    discordText: 'Latest updates, department recruitments, events, and support — all on our Discord server.',
    discordButton: 'Join Discord',
    'app-staff-desc': 'Become part of the Florida State Roleplay staff team. Help us build a better community for everyone.',
    'app-staff-status': 'Coming Soon',
    'app-ban-desc': 'Submit an appeal if you believe your ban was issued unfairly or if you would like a second chance.',
    'app-ban-status': 'Coming Soon'
  };

  let config = loadConfig();
  let newsList = loadNews();
  let adminLoggedIn = false;
  let editingNewsId = null;

  // ========================
  // Storage Helpers
  // ========================
  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultConfig, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load config from localStorage:', e);
    }
    return { ...defaultConfig };
  }

  function saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config to localStorage:', e);
      showToast('Failed to save changes.', true);
    }
  }

  function loadNews() {
    try {
      const saved = localStorage.getItem(NEWS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load news from localStorage:', e);
    }
    return [];
  }

  function saveNews() {
    try {
      localStorage.setItem(NEWS_KEY, JSON.stringify(newsList));
    } catch (e) {
      console.error('Failed to save news to localStorage:', e);
      showToast('Failed to save news.', true);
    }
  }

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
    if (window.location.pathname.includes('news.html')) return;

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
  // Content Rendering
  // ========================
  function applyConfig() {
    // Text content
    $$('[data-editable]').forEach((el) => {
      const key = el.dataset.editable;
      if (key === 'rules') return; // handled separately
      if (config[key] !== undefined) {
        if (el.tagName === 'A') {
          el.textContent = config[key];
        } else {
          el.textContent = config[key];
        }
      }
    });

    // Discord links
    updateDiscordLinks();

    // Department links
    updateDepartmentLinks();

    // Rules
    renderRules();
  }

  function updateDiscordLinks() {
    document.querySelectorAll('a').forEach((link) => {
      if (link.href && link.href.includes('discord.gg')) {
        link.href = config.discordLink || DEFAULT_DISCORD;
      }
    });
  }

  function updateDepartmentLinks() {
    const deptLinks = [
      'dept-florida-fire-link',
      'dept-fbi-link',
      'dept-state-patrol-link',
      'dept-lake-sheriff-link',
      'dept-nps-link'
    ];
    deptLinks.forEach((key) => {
      const el = $(`[data-editable="${key}"]`);
      if (el && config[key]) {
        el.href = config[key];
      }
    });
  }

  function renderRules() {
    const list = $('#rulesList');
    if (!list || !Array.isArray(config.rules)) return;
    list.innerHTML = '';
    config.rules.forEach((rule) => {
      const li = document.createElement('li');
      li.textContent = rule;
      list.appendChild(li);
    });
  }

  // ========================
  // News System
  // ========================
  function formatDate(dateString) {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  function renderNewsPage() {
    const container = $('#newsContainer');
    if (!container) return;

    if (newsList.length === 0) {
      container.innerHTML = `
        <div class="news-empty">
          <div class="news-empty-icon">📰</div>
          <h3>No news yet</h3>
          <p>Check back later for the latest updates from Florida State Roleplay.</p>
        </div>
      `;
      return;
    }

    const sortedNews = [...newsList].sort((a, b) => new Date(b.date) - new Date(a.date));

    const grid = document.createElement('div');
    grid.className = 'news-grid';

    sortedNews.forEach((news) => {
      const card = document.createElement('article');
      card.className = 'news-card reveal';
      card.innerHTML = `
        <div class="news-card-header">
          <span class="news-category">${escapeHtml(news.category)}</span>
          <span class="news-date">${formatDate(news.date)}</span>
        </div>
        <h2>${escapeHtml(news.title)}</h2>
        <p>${escapeHtml(news.content)}</p>
      `;
      grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);

    // Trigger reveal animations
    const reveals = $$('.news-card.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========================
  // Admin Panel
  // ========================
  function initAdminPanel() {
    const overlay = $('#adminOverlay');
    if (!overlay) return;

    const loginView = $('#adminLogin');
    const dashboard = $('#adminDashboard');
    const passwordInput = $('#adminPassword');
    const loginBtn = $('#adminLoginBtn');
    const loginError = $('#loginError');
    const closeBtn = $('#adminClose');

    function openAdmin() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (adminLoggedIn) {
        showDashboard();
      } else {
        showLogin();
      }
      setTimeout(() => passwordInput.focus(), 100);
    }

    function closeAdmin() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      loginError.textContent = '';
      passwordInput.value = '';
    }

    function showLogin() {
      loginView.style.display = 'block';
      dashboard.style.display = 'none';
    }

    function showDashboard() {
      loginView.style.display = 'none';
      dashboard.style.display = 'flex';
      fillAdminForm();
      renderAdminNewsList();
      updateExportField();
    }

    function attemptLogin() {
      if (passwordInput.value === ADMIN_PASSWORD) {
        adminLoggedIn = true;
        loginError.textContent = '';
        showDashboard();
        showToast('Logged in successfully.');
      } else {
        loginError.textContent = 'Incorrect password. Try again.';
        passwordInput.value = '';
        passwordInput.focus();
      }
    }

    // F8 key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F8') {
        e.preventDefault();
        if (overlay.classList.contains('active')) {
          closeAdmin();
        } else {
          openAdmin();
        }
      }
      // Close on Escape
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeAdmin();
      }
    });

    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptLogin();
    });
    closeBtn.addEventListener('click', closeAdmin);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAdmin();
    });

    initAdminTabs();
    initAdminActions();
    initNewsAdmin();
  }

  function initAdminTabs() {
    const tabs = $$('.admin-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        $$('.admin-section').forEach((section) => section.classList.remove('active'));
        $(`#tab-${tab.dataset.tab}`).classList.add('active');
      });
    });
  }

  function fillAdminForm() {
    // General
    const serverNameEl = $('#editServerName');
    if (serverNameEl) serverNameEl.value = config.serverName;

    const serverSubtitleEl = $('#editServerSubtitle');
    if (serverSubtitleEl) serverSubtitleEl.value = config.serverSubtitle;

    const discordLinkEl = $('#editDiscordLink');
    if (discordLinkEl) discordLinkEl.value = config.discordLink;

    const discordTextEl = $('#editDiscordText');
    if (discordTextEl) discordTextEl.value = config.discordText;

    const discordButtonEl = $('#editDiscordButton');
    if (discordButtonEl) discordButtonEl.value = config.discordButton;

    // Departments
    const fields = [
      ['editDeptFloridaFireDesc', 'dept-florida-fire-desc'],
      ['editDeptFloridaFireLink', 'dept-florida-fire-link'],
      ['editDeptFbiDesc', 'dept-fbi-desc'],
      ['editDeptFbiLink', 'dept-fbi-link'],
      ['editDeptStatePatrolDesc', 'dept-state-patrol-desc'],
      ['editDeptStatePatrolLink', 'dept-state-patrol-link'],
      ['editDeptLakeSheriffDesc', 'dept-lake-sheriff-desc'],
      ['editDeptLakeSheriffLink', 'dept-lake-sheriff-link'],
      ['editDeptNpsDesc', 'dept-nps-desc'],
      ['editDeptNpsLink', 'dept-nps-link']
    ];

    fields.forEach(([id, key]) => {
      const el = $('#' + id);
      if (el) el.value = config[key];
    });

    // Rules
    const editRules = $('#editRules');
    if (editRules) editRules.value = Array.isArray(config.rules) ? config.rules.join('\n') : '';

    // Applications
    const appFields = [
      ['editAppStaffDesc', 'app-staff-desc'],
      ['editAppStaffStatus', 'app-staff-status'],
      ['editAppBanDesc', 'app-ban-desc'],
      ['editAppBanStatus', 'app-ban-status']
    ];
    appFields.forEach(([id, key]) => {
      const el = $('#' + id);
      if (el) el.value = config[key];
    });

    // About / Owners tab
    const aboutFields = [
      ['editAboutSubtitle', 'aboutSubtitle'],
      ['editAboutRp', 'aboutRp'],
      ['editAboutServices', 'aboutServices'],
      ['editAboutCommunity', 'aboutCommunity'],
      ['editAboutWorld', 'aboutWorld']
    ];
    aboutFields.forEach(([id, key]) => {
      const el = $('#' + id);
      if (el) el.value = config[key];
    });

    updateExportField();
  }

  function updateExportField() {
    const field = $('#dataExport');
    if (field) {
      field.value = JSON.stringify(config, null, 2);
    }
  }

  function initAdminActions() {
    const saveBtn = $('#saveAdminBtn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
      // General
      config.serverName = $('#editServerName').value.trim() || defaultConfig.serverName;
      config.serverSubtitle = $('#editServerSubtitle').value.trim() || defaultConfig.serverSubtitle;
      config.discordLink = $('#editDiscordLink').value.trim() || DEFAULT_DISCORD;
      config.discordText = $('#editDiscordText').value.trim() || defaultConfig.discordText;
      config.discordButton = $('#editDiscordButton').value.trim() || defaultConfig.discordButton;

      // Departments
      config['dept-florida-fire-desc'] = $('#editDeptFloridaFireDesc').value.trim() || defaultConfig['dept-florida-fire-desc'];
      config['dept-florida-fire-link'] = $('#editDeptFloridaFireLink').value.trim() || defaultConfig['dept-florida-fire-link'];
      config['dept-fbi-desc'] = $('#editDeptFbiDesc').value.trim() || defaultConfig['dept-fbi-desc'];
      config['dept-fbi-link'] = $('#editDeptFbiLink').value.trim() || defaultConfig['dept-fbi-link'];
      config['dept-state-patrol-desc'] = $('#editDeptStatePatrolDesc').value.trim() || defaultConfig['dept-state-patrol-desc'];
      config['dept-state-patrol-link'] = $('#editDeptStatePatrolLink').value.trim() || defaultConfig['dept-state-patrol-link'];
      config['dept-lake-sheriff-desc'] = $('#editDeptLakeSheriffDesc').value.trim() || defaultConfig['dept-lake-sheriff-desc'];
      config['dept-lake-sheriff-link'] = $('#editDeptLakeSheriffLink').value.trim() || defaultConfig['dept-lake-sheriff-link'];
      config['dept-nps-desc'] = $('#editDeptNpsDesc').value.trim() || defaultConfig['dept-nps-desc'];
      config['dept-nps-link'] = $('#editDeptNpsLink').value.trim() || defaultConfig['dept-nps-link'];

      // Rules
      const rulesRaw = $('#editRules').value.split('\n').map((r) => r.trim()).filter(Boolean);
      config.rules = rulesRaw.length ? rulesRaw : [...defaultConfig.rules];

      // Applications
      config['app-staff-desc'] = $('#editAppStaffDesc').value.trim() || defaultConfig['app-staff-desc'];
      config['app-staff-status'] = $('#editAppStaffStatus').value.trim() || defaultConfig['app-staff-status'];
      config['app-ban-desc'] = $('#editAppBanDesc').value.trim() || defaultConfig['app-ban-desc'];
      config['app-ban-status'] = $('#editAppBanStatus').value.trim() || defaultConfig['app-ban-status'];

      // About
      config.aboutSubtitle = $('#editAboutSubtitle').value.trim() || defaultConfig.aboutSubtitle;
      config.aboutRp = $('#editAboutRp').value.trim() || defaultConfig.aboutRp;
      config.aboutServices = $('#editAboutServices').value.trim() || defaultConfig.aboutServices;
      config.aboutCommunity = $('#editAboutCommunity').value.trim() || defaultConfig.aboutCommunity;
      config.aboutWorld = $('#editAboutWorld').value.trim() || defaultConfig.aboutWorld;

      saveConfig();
      applyConfig();
      updateExportField();
      showToast('Changes saved successfully.');
    });

    // Copy JSON
    const copyBtn = $('#copyConfigBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText($('#dataExport').value);
          showToast('Configuration copied to clipboard.');
        } catch (err) {
          showToast('Could not copy configuration.', true);
        }
      });
    }

    // Import JSON
    const importBtn = $('#importConfigBtn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const raw = $('#dataImport').value.trim();
        if (!raw) {
          showToast('Paste a configuration first.', true);
          return;
        }
        try {
          const imported = JSON.parse(raw);
          config = { ...defaultConfig, ...imported };
          saveConfig();
          applyConfig();
          fillAdminForm();
          $('#dataImport').value = '';
          showToast('Configuration imported successfully.');
        } catch (e) {
          showToast('Invalid JSON configuration.', true);
        }
      });
    }

    // Reset to default
    const resetBtn = $('#resetConfigBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
          config = { ...defaultConfig };
          saveConfig();
          applyConfig();
          fillAdminForm();
          showToast('Settings reset to default.');
        }
      });
    }
  }

  // ========================
  // News Admin
  // ========================
  function initNewsAdmin() {
    const addBtn = $('#addNewsBtn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      const title = $('#newsTitle').value.trim();
      const date = $('#newsDate').value;
      const category = $('#newsCategory').value;
      const content = $('#newsContent').value.trim();

      if (!title || !date || !content) {
        showToast('Please fill in title, date, and content.', true);
        return;
      }

      if (editingNewsId) {
        const index = newsList.findIndex((n) => n.id === editingNewsId);
        if (index !== -1) {
          newsList[index] = { id: editingNewsId, title, date, category, content };
          showToast('News updated successfully.');
        }
        editingNewsId = null;
        addBtn.textContent = 'Add News';
      } else {
        newsList.push({
          id: Date.now().toString(),
          title,
          date,
          category,
          content
        });
        showToast('News added successfully.');
      }

      saveNews();
      clearNewsForm();
      renderAdminNewsList();
      renderNewsPage();
    });

    const clearBtn = $('#clearNewsFormBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearNewsForm);
    }
  }

  function clearNewsForm() {
    $('#newsTitle').value = '';
    $('#newsDate').value = '';
    $('#newsCategory').selectedIndex = 0;
    $('#newsContent').value = '';
    editingNewsId = null;
    const addBtn = $('#addNewsBtn');
    if (addBtn) addBtn.textContent = 'Add News';
  }

  function renderAdminNewsList() {
    const container = $('#adminNewsList');
    if (!container) return;

    if (newsList.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">No news published yet.</p>';
      return;
    }

    const sortedNews = [...newsList].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = '';
    sortedNews.forEach((news) => {
      const item = document.createElement('div');
      item.className = 'news-admin-item';
      item.innerHTML = `
        <div class="news-admin-info">
          <div class="news-admin-title">${escapeHtml(news.title)}</div>
          <div class="news-admin-meta">${escapeHtml(news.category)} • ${formatDate(news.date)}</div>
        </div>
        <div class="news-admin-actions">
          <button class="edit-btn" data-id="${news.id}">Edit</button>
          <button class="delete-btn" data-id="${news.id}">Delete</button>
        </div>
      `;
      container.appendChild(item);
    });

    container.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editNews(btn.dataset.id));
    });

    container.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => deleteNews(btn.dataset.id));
    });
  }

  function editNews(id) {
    const news = newsList.find((n) => n.id === id);
    if (!news) return;

    $('#newsTitle').value = news.title;
    $('#newsDate').value = news.date;
    $('#newsCategory').value = news.category;
    $('#newsContent').value = news.content;
    editingNewsId = id;
    $('#addNewsBtn').textContent = 'Update News';
  }

  function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
      newsList = newsList.filter((n) => n.id !== id);
      saveNews();
      renderAdminNewsList();
      renderNewsPage();
      if (editingNewsId === id) clearNewsForm();
      showToast('News deleted successfully.');
    }
  }

  // ========================
  // Toast Notifications
  // ========================
  function showToast(message, isError = false) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
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
    initAdminPanel();
    applyConfig();
    renderNewsPage();
  });
})();
