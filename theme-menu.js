// ملف: theme-menu.js
// نظام موحد للوضع الليلي وقائمة الإضافات

(function() {
  'use strict';

  // ============ إضافة الأنماط ============
  const styles = `
    <style id="theme-menu-styles">
      /* قائمة الإضافات */
      .menu-container {
        position: fixed;
        top: 15px;
        left: 15px;
        z-index: 999;
      }

      [dir="rtl"] .menu-container {
        left: auto;
        right: 15px;
      }

      .menu-btn {
        background: var(--menu-bg, #1a365d);
        color: white;
        border: none;
        padding: 10px 14px;
        font-size: 20px;
        border-radius: 10px;
        cursor: pointer;
        transition: 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }

      .menu-btn:hover {
        background: var(--menu-hover, #2c5282);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }

      .menu-box {
        display: none;
        position: absolute;
        top: 50px;
        right: 0;
        background: var(--card-bg, white);
        border-radius: 10px;
        padding: 10px;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: 0.25s ease;
      }

      [dir="ltr"] .menu-box {
        right: auto;
        left: 0;
      }

      .menu-container.active .menu-box {
        display: block;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .menu-box a, .menu-box button {
        display: block;
        padding: 10px;
        text-decoration: none;
        color: var(--text-color, #1a365d);
        font-size: 16px;
        border-radius: 6px;
        transition: 0.2s;
        border: none;
        background: none;
        width: 100%;
        text-align: right;
        cursor: pointer;
        font-family: inherit;
      }

      [dir="ltr"] .menu-box a,
      [dir="ltr"] .menu-box button {
        text-align: left;
      }

      .menu-box a:hover, .menu-box button:hover {
        background: var(--hover-bg, #e2e8f0);
      }

      .menu-box hr {
        margin: 8px 0;
        border: none;
        border-top: 1px solid var(--border-color, #e2e8f0);
      }

      /* الوضع الليلي */
      body.dark-mode {
        --bg-gradient-start: #0f172a;
        --bg-gradient-end: #1e293b;
        --card-bg: #1e293b;
        --text-color: #e2e8f0;
        --heading-color: #f1f5f9;
        --border-color: #334155;
        --hover-bg: #334155;
        --menu-bg: #334155;
        --menu-hover: #475569;
      }

      body.dark-mode {
        background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%) !important;
        color: var(--text-color);
      }

      body.dark-mode .navbar,
      body.dark-mode .container,
      body.dark-mode .content-box,
      body.dark-mode .content-section,
      body.dark-mode .logo-section,
      body.dark-mode .page-header,
      body.dark-mode .search-section,
      body.dark-mode .book-card,
      body.dark-mode footer,
      body.dark-mode .project-badge,
      body.dark-mode .card {
        background: var(--card-bg) !important;
        color: var(--text-color) !important;
      }

      body.dark-mode h1,
      body.dark-mode h2,
      body.dark-mode h3,
      body.dark-mode .site-title,
      body.dark-mode .book-title {
        color: var(--heading-color) !important;
      }

      body.dark-mode p,
      body.dark-mode .book-details,
      body.dark-mode .small {
        color: var(--text-color) !important;
      }

      body.dark-mode .input-wrap,
      body.dark-mode .search-box,
      body.dark-mode select,
      body.dark-mode input {
        background: rgba(255, 255, 255, 0.05) !important;
        border-color: var(--border-color) !important;
        color: var(--text-color) !important;
      }

      body.dark-mode .nav-links a {
        color: #60a5fa !important;
      }

      body.dark-mode .nav-links a:hover {
        background: #334155 !important;
        color: white !important;
      }

      body.dark-mode footer a {
        color: #60a5fa !important;
      }

      body.dark-mode .students-list {
        background: rgba(255, 255, 255, 0.05) !important;
      }

      body.dark-mode .students-list li {
        background: rgba(255, 255, 255, 0.03) !important;
        color: var(--text-color) !important;
      }

      body.dark-mode .lang-switcher {
        background: var(--card-bg) !important;
        color: var(--text-color) !important;
      }

      body.dark-mode .no-results {
        background: rgba(255, 255, 255, 0.1) !important;
        color: var(--text-color) !important;
      }

      /* أيقونة الوضع الليلي */
      .theme-icon {
        font-size: 18px;
        margin-left: 8px;
      }

      [dir="ltr"] .theme-icon {
        margin-left: 0;
        margin-right: 8px;
      }

      @media (max-width: 768px) {
        .menu-container {
          top: 10px;
          left: 10px;
        }

        [dir="rtl"] .menu-container {
          left: auto;
          right: 10px;
        }

        .menu-box {
          min-width: 170px;
        }
      }
    </style>
  `;

  // ============ إضافة HTML للقائمة ============
  const menuHTML = `
    <div class="menu-container" id="themeMenuContainer">
      <button class="menu-btn" id="menuToggleBtn">☰</button>
      <div class="menu-box" id="menuBox">
        <button id="langToggleBtn">
          <span class="theme-icon">🌐</span>
          <span data-en="العربية" data-ar="English">English</span>
        </button>
        <hr>
        <button id="themeToggleBtn">
          <span class="theme-icon" id="themeIcon">🌙</span>
          <span id="themeText" data-en="Dark Mode" data-ar="الوضع الليلي">الوضع الليلي</span>
        </button>
        <hr>
        <a href="about.html">
          <span class="theme-icon">ℹ️</span>
          <span data-en="About" data-ar="عن المشروع">عن المشروع</span>
        </a>
        <a href="contact.html">
          <span class="theme-icon">📧</span>
          <span data-en="Contact" data-ar="التواصل">التواصل</span>
        </a>
      </div>
    </div>
  `;

  // ============ دالة التهيئة ============
  function init() {
    // إضافة الأنماط
    if (!document.getElementById('theme-menu-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }

    // إضافة HTML القائمة
    if (!document.getElementById('themeMenuContainer')) {
      document.body.insertAdjacentHTML('afterbegin', menuHTML);
    }

    // تحميل الإعدادات المحفوظة
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    const savedLang = localStorage.getItem('siteLang') || 'ar';

    // تطبيق الوضع الليلي
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      updateThemeIcon(true);
    }

    // إعداد الأحداث
    setupEventListeners();

    // تطبيق اللغة
    applyLanguage(savedLang);
  }

  // ============ إعداد الأحداث ============
  function setupEventListeners() {
    // زر فتح/إغلاق القائمة
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const menuContainer = document.getElementById('themeMenuContainer');
    
    if (menuToggleBtn) {
      menuToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuContainer.classList.toggle('active');
      });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!menuContainer.contains(e.target)) {
        menuContainer.classList.remove('active');
      }
    });

    // زر الوضع الليلي
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // زر تبديل اللغة
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // زر اللغة القديم (إن وجد)
    const oldLangSwitcher = document.querySelector('.lang-switcher');
    if (oldLangSwitcher) {
      oldLangSwitcher.style.display = 'none';
    }
  }

  // ============ تبديل الوضع الليلي ============
  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  }

  function updateThemeIcon(isDark) {
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (themeIcon) {
      themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    
    if (themeText) {
      const currentLang = localStorage.getItem('siteLang') || 'ar';
      if (isDark) {
        themeText.textContent = currentLang === 'ar' ? 'الوضع النهاري' : 'Light Mode';
        themeText.setAttribute('data-ar', 'الوضع النهاري');
        themeText.setAttribute('data-en', 'Light Mode');
      } else {
        themeText.textContent = currentLang === 'ar' ? 'الوضع الليلي' : 'Dark Mode';
        themeText.setAttribute('data-ar', 'الوضع الليلي');
        themeText.setAttribute('data-en', 'Dark Mode');
      }
    }
  }

  // ============ تبديل اللغة ============
  function toggleLanguage() {
    const currentLang = localStorage.getItem('siteLang') || 'ar';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('siteLang', newLang);
    applyLanguage(newLang);
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // تحديث جميع العناصر ذات data-ar و data-en
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // تحديث placeholder
    document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(el => {
      el.placeholder = el.getAttribute('data-placeholder-' + lang);
    });

    // تحديث الزر القديم إن وجد
    const oldLangButton = document.getElementById('langButton');
    if (oldLangButton) {
      oldLangButton.textContent = lang === 'ar' ? '🌐 EN' : '🌐 AR';
    }

    // إعادة رسم الكتب إذا كانت موجودة
    if (typeof filterBooks === 'function') {
      filterBooks();
    }
  }

  // ============ تشغيل النظام ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ====================================
   تعليمات الاستخدام:
   ==================================== 

1. احذف زر اللغة القديم (.lang-switcher) من جميع الصفحات

2. أضف هذا السطر في نهاية كل صفحة HTML قبل </body>:
   <script src="theme-menu.js"></script>

3. أو انسخ الكود كاملاً داخل <script> في كل صفحة

4. النظام يعمل تلقائياً ويحفظ الإعدادات
*/