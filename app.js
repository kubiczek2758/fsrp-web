/**
 * Florida State Roleplay - Website Application
 * Features: loader, animations, scroll effects, F8 admin panel,
 * content editing with localStorage persistence, import/export,
 * cloud sync via GitHub Gist, news system.
 */

(function () {
  'use strict';

  // ========================
  // Configuration
  // ========================
  const ADMIN_PASSWORD = 'H&l9Jo0';
  const STORAGE_KEY = 'fsrp_site_config';
  const NEWS_KEY = 'fsrp_site_news';
  const CLOUD_KEY = 'fsrp_cloud_settings';
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
  let cloudSettings = loadCloudSettings();
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

  function loadCloudSettings() {
    try {
      const saved = localStorage.getItem(CLOUD_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cloud settings:', e);
    }
    return { provider: 'github', token: '', gistId: '', backendUrl: '', backendToken: '' };
  }

  function saveCloudSettings() {
    try {
      localStorage.setItem(CLOUD_KEY, JSON.stringify(cloudSettings));
    } catch (e) {
      console.error('Failed to save cloud settings:', e);
    }
  }

  // ========================
  // Cloud Sync (GitHub Gist)
  // ========================
  async function createGist(token) {
    const payload = {
      description: 'Florida State Roleplay - Website Data',
      public: false,
      files: {
        'fsrp-data.json': {
          content: JSON.stringify(buildCloudPayload(), null, 2)
        }
      }
    };

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create gist');
    }

    return await response.json();
  }

  async function updateGist(token, gistId) {
    const payload = {
      description: 'Florida State Roleplay - Website Data',
      files: {
        'fsrp-data.json': {
          content: JSON.stringify(buildCloudPayload(), null, 2)
        }
      }
    };

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update gist');
    }

    return await response.json();
  }

  async function fetchGist(token, gistId) {
    const url = token
      ? `https://api.github.com/gists/${gistId}`
      : `https://api.github.com/gists/${gistId}`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch gist');
    }

    return await response.json();
  }

  function buildCloudPayload() {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      config: config,
      news: newsList
    };
  }

  async function saveToCloud() {
    if (cloudSettings.provider === 'backend') {
      if (!cloudSettings.backendUrl) {
        showToast('Please enter a backend URL first.', true);
        return;
      }
      try {
        const response = await fetch(cloudSettings.backendUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloudSettings.backendToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(buildCloudPayload())
        });
        if (!response.ok) throw new Error((await response.json()).error || 'Backend error');
        showToast('Saved to backend successfully.');
        updateCloudStatus('connected', 'Synced to backend');
      } catch (e) {
        console.error('Backend save failed:', e);
        showToast('Backend save failed: ' + e.message, true);
        updateCloudStatus('error', 'Sync failed');
      }
      return;
    }

    if (!cloudSettings.token) {
      showToast('Please enter a GitHub token first.', true);
      return;
    }

    try {
      if (cloudSettings.gistId) {
        await updateGist(cloudSettings.token, cloudSettings.gistId);
        showToast('Saved to cloud successfully.');
        updateCloudStatus('connected', 'Synced to cloud');
      } else {
        const gist = await createGist(cloudSettings.token);
        cloudSettings.gistId = gist.id;
        saveCloudSettings();
        $('#gistId').value = gist.id;
        showToast('New cloud gist created successfully.');
        updateCloudStatus('connected', 'Connected');
      }
    } catch (e) {
      console.error('Cloud save failed:', e);
      showToast('Cloud save failed: ' + e.message, true);
      updateCloudStatus('error', 'Sync failed');
    }
  }

  async function loadFromCloud(silent = false) {
    if (cloudSettings.provider === 'backend') {
      if (!cloudSettings.backendUrl) {
        if (!silent) showToast('Please enter a backend URL first.', true);
        return;
      }
      try {
        const response = await fetch(cloudSettings.backendUrl, {
          headers: cloudSettings.backendToken
            ? { 'Authorization': `Bearer ${cloudSettings.backendToken}` }
            : {}
        });
        if (!response.ok) throw new Error('Backend error');
        const data = await response.json();
        applyCloudData(data);
        if (!silent) showToast('Loaded from backend successfully.');
        updateCloudStatus('connected', 'Connected to backend');
      } catch (e) {
        console.error('Backend load failed:', e);
        if (!silent) showToast('Backend load failed: ' + e.message, true);
        updateCloudStatus('error', 'Load failed');
      }
      return;
    }

    if (!cloudSettings.gistId) {
      if (!silent) showToast('Please enter a Gist ID first.', true);
      return;
    }

    try {
      const gist = await fetchGist(cloudSettings.token, cloudSettings.gistId);
      const file = gist.files['fsrp-data.json'];
      if (!file) throw new Error('Gist does not contain fsrp-data.json');
      const data = JSON.parse(file.content);
      applyCloudData(data);
      if (!silent) showToast('Loaded from cloud successfully.');
      updateCloudStatus('connected', 'Connected');
    } catch (e) {
      console.error('Cloud load failed:', e);
      if (!silent) showToast('Cloud load failed: ' + e.message, true);
      updateCloudStatus('error', 'Load failed');
    }
  }

  function applyCloudData(data) {
    if (data.config) {
      config = { ...defaultConfig, ...data.config };
      saveConfig();
    }
    if (Array.isArray(data.news)) {
      newsList = data.news;
      saveNews();
    }
    applyConfig();
    renderNewsPage();
    fillAdminForm();
    renderAdminNewsList();
  }

  async function initCloudSync() {
    if (cloudSettings.provider === 'github' && cloudSettings.gistId) {
      updateCloudStatus('connected', 'Loading from cloud...');
      await loadFromCloud(true);
    } else if (cloudSettings.provider === 'backend' && cloudSettings.backendUrl) {
      updateCloudStatus('connected', 'Loading from backend...');
      await loadFromCloud(true);
    }
  }

  function updateCloudStatus(type, text) {
    const statusEl = $('#cloudStatus');
    const textEl = $('#cloudStatusText');
    if (!statusEl || !textEl) return;

    statusEl.className = 'cloud-status';
    if (type) statusEl.classList.add(type);
    textEl.textContent = text;
  }

  function initCloudAdmin() {
    const tokenEl = $('#githubToken');
    const gistIdEl = $('#gistId');
    const createBtn = $('#createGistBtn');
    const loadBtn = $('#loadFromCloudBtn');
    const saveBtn = $('#saveToCloudBtn');

    if (!tokenEl || !gistIdEl) return;

    const providerEl = $('#cloudProvider');
    const githubSettings = $('#githubSettings');
    const backendSettings = $('#backendSettings');
    const backendUrlEl = $('#backendUrl');
    const backendTokenEl = $('#backendToken');

    providerEl.value = cloudSettings.provider || 'github';
    tokenEl.value = cloudSettings.token || '';
    gistIdEl.value = cloudSettings.gistId || '';
    if (backendUrlEl) backendUrlEl.value = cloudSettings.backendUrl || '';
    if (backendTokenEl) backendTokenEl.value = cloudSettings.backendToken || '';

    function updateProviderUI() {
      const isGitHub = providerEl.value === 'github';
      githubSettings.style.display = isGitHub ? 'block' : 'none';
      backendSettings.style.display = isGitHub ? 'none' : 'block';
      if (createBtn) createBtn.style.display = isGitHub ? 'inline-flex' : 'none';
      if (isGitHub && cloudSettings.gistId) {
        updateCloudStatus('connected', 'Connected');
      } else if (!isGitHub && cloudSettings.backendUrl) {
        updateCloudStatus('connected', 'Connected to backend');
      } else {
        updateCloudStatus('', 'Not configured');
      }
    }

    updateProviderUI();

    providerEl.addEventListener('change', () => {
      cloudSettings.provider = providerEl.value;
      saveCloudSettings();
      updateProviderUI();
    });

    tokenEl.addEventListener('input', () => {
      cloudSettings.token = tokenEl.value.trim();
      saveCloudSettings();
    });

    gistIdEl.addEventListener('input', () => {
      cloudSettings.gistId = gistIdEl.value.trim();
      saveCloudSettings();
      updateCloudStatus(cloudSettings.gistId ? 'connected' : '', cloudSettings.gistId ? 'Connected' : 'Not configured');
    });

    if (backendUrlEl) {
      backendUrlEl.addEventListener('input', () => {
        cloudSettings.backendUrl = backendUrlEl.value.trim();
        saveCloudSettings();
      });
    }

    if (backendTokenEl) {
      backendTokenEl.addEventListener('input', () => {
        cloudSettings.backendToken = backendTokenEl.value.trim();
        saveCloudSettings();
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', async () => {
        if (!cloudSettings.token) {
          showToast('Please enter a GitHub token first.', true);
          return;
        }
        createBtn.textContent = 'Creating...';
        try {
          const gist = await createGist(cloudSettings.token);
          cloudSettings.gistId = gist.id;
          saveCloudSettings();
          gistIdEl.value = gist.id;
          updateCloudStatus('connected', 'Connected');
          showToast('New cloud gist created successfully.');
        } catch (e) {
          showToast('Failed to create gist: ' + e.message, true);
          updateCloudStatus('error', 'Create failed');
        } finally {
          createBtn.textContent = 'Create New Gist';
        }
      });
    }

    if (loadBtn) {
      loadBtn.addEventListener('click', async () => {
        loadBtn.textContent = 'Loading...';
        await loadFromCloud();
        loadBtn.textContent = 'Load from Cloud';
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        saveBtn.textContent = 'Saving...';
        await saveToCloud();
        saveBtn.textContent = 'Save to Cloud';
      });
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
    $$('[data-editable]').forEach((el) => {
      const key = el.dataset.editable;
      if (key === 'rules') return;
      if (config[key] !== undefined) {
        if (el.tagName === 'A') {
          el.textContent = config[key];
        } else {
          el.textContent = config[key];
        }
      }
    });

    updateDiscordLinks();
    updateDepartmentLinks();
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
      initCloudAdmin();
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'F8') {
        e.preventDefault();
        if (overlay.classList.contains('active')) {
          closeAdmin();
        } else {
          openAdmin();
        }
      }
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
    const setValue = (id, value) => {
      const el = $('#' + id);
      if (el) el.value = value;
    };

    setValue('editServerName', config.serverName);
    setValue('editServerSubtitle', config.serverSubtitle);
    setValue('editDiscordLink', config.discordLink);
    setValue('editDiscordText', config.discordText);
    setValue('editDiscordButton', config.discordButton);

    const deptFields = [
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
    deptFields.forEach(([id, key]) => setValue(id, config[key]));

    setValue('editRules', Array.isArray(config.rules) ? config.rules.join('\n') : '');

    const appFields = [
      ['editAppStaffDesc', 'app-staff-desc'],
      ['editAppStaffStatus', 'app-staff-status'],
      ['editAppBanDesc', 'app-ban-desc'],
      ['editAppBanStatus', 'app-ban-status']
    ];
    appFields.forEach(([id, key]) => setValue(id, config[key]));

    const aboutFields = [
      ['editAboutSubtitle', 'aboutSubtitle'],
      ['editAboutRp', 'aboutRp'],
      ['editAboutServices', 'aboutServices'],
      ['editAboutCommunity', 'aboutCommunity'],
      ['editAboutWorld', 'aboutWorld']
    ];
    aboutFields.forEach(([id, key]) => setValue(id, config[key]));

    updateExportField();
  }

  function updateExportField() {
    const field = $('#dataExport');
    if (field) {
      field.value = JSON.stringify({ config, news: newsList }, null, 2);
    }
  }

  function initAdminActions() {
    const saveBtn = $('#saveAdminBtn');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', async () => {
      config.serverName = $('#editServerName').value.trim() || defaultConfig.serverName;
      config.serverSubtitle = $('#editServerSubtitle').value.trim() || defaultConfig.serverSubtitle;
      config.discordLink = $('#editDiscordLink').value.trim() || DEFAULT_DISCORD;
      config.discordText = $('#editDiscordText').value.trim() || defaultConfig.discordText;
      config.discordButton = $('#editDiscordButton').value.trim() || defaultConfig.discordButton;

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

      const rulesRaw = $('#editRules').value.split('\n').map((r) => r.trim()).filter(Boolean);
      config.rules = rulesRaw.length ? rulesRaw : [...defaultConfig.rules];

      config['app-staff-desc'] = $('#editAppStaffDesc').value.trim() || defaultConfig['app-staff-desc'];
      config['app-staff-status'] = $('#editAppStaffStatus').value.trim() || defaultConfig['app-staff-status'];
      config['app-ban-desc'] = $('#editAppBanDesc').value.trim() || defaultConfig['app-ban-desc'];
      config['app-ban-status'] = $('#editAppBanStatus').value.trim() || defaultConfig['app-ban-status'];

      config.aboutSubtitle = $('#editAboutSubtitle').value.trim() || defaultConfig.aboutSubtitle;
      config.aboutRp = $('#editAboutRp').value.trim() || defaultConfig.aboutRp;
      config.aboutServices = $('#editAboutServices').value.trim() || defaultConfig.aboutServices;
      config.aboutCommunity = $('#editAboutCommunity').value.trim() || defaultConfig.aboutCommunity;
      config.aboutWorld = $('#editAboutWorld').value.trim() || defaultConfig.aboutWorld;

      saveConfig();
      applyConfig();
      updateExportField();

      if (cloudSettings.gistId && cloudSettings.token) {
        await saveToCloud();
      } else {
        showToast('Changes saved locally.');
      }
    });

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
          if (imported.config) config = { ...defaultConfig, ...imported.config };
          if (Array.isArray(imported.news)) newsList = imported.news;
          saveConfig();
          saveNews();
          applyConfig();
          fillAdminForm();
          renderAdminNewsList();
          renderNewsPage();
          $('#dataImport').value = '';
          showToast('Configuration imported successfully.');
        } catch (e) {
          showToast('Invalid JSON configuration.', true);
        }
      });
    }

    const resetBtn = $('#resetConfigBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
          config = { ...defaultConfig };
          newsList = [];
          saveConfig();
          saveNews();
          applyConfig();
          fillAdminForm();
          renderAdminNewsList();
          renderNewsPage();
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

    addBtn.addEventListener('click', async () => {
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

      if (cloudSettings.gistId && cloudSettings.token) {
        await saveToCloud();
      }
    });

    const clearBtn = $('#clearNewsFormBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearNewsForm);
    }
  }

  function clearNewsForm() {
    const fields = ['newsTitle', 'newsDate', 'newsContent'];
    fields.forEach((id) => {
      const el = $('#' + id);
      if (el) el.value = '';
    });
    const categoryEl = $('#newsCategory');
    if (categoryEl) categoryEl.selectedIndex = 0;
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

  async function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
      newsList = newsList.filter((n) => n.id !== id);
      saveNews();
      renderAdminNewsList();
      renderNewsPage();
      if (editingNewsId === id) clearNewsForm();
      showToast('News deleted successfully.');

      if (cloudSettings.gistId && cloudSettings.token) {
        await saveToCloud();
      }
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
  document.addEventListener('DOMContentLoaded', async () => {
    initLoader();
    initNavbar();
    initReveal();
    initMobileMenu();
    initAdminPanel();
    applyConfig();
    renderNewsPage();
    await initCloudSync();
  });
})();
