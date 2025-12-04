// theme.js - نظام الثيم (الليل/النهار)
(function() {
    'use strict';
    
    // التحقق من الوضع المحفوظ أو استخدام الوضع الافتراضي
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark) ? 'dark' : 'light';
    
    // تطبيق الثيم عند التحميل
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);
    
    // وظيفة تبديل الثيم
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };
    
    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.innerHTML = '☀️';
                themeToggle.title = 'الوضع النهاري';
            } else {
                themeToggle.innerHTML = '🌙';
                themeToggle.title = 'الوضع الليلي';
            }
        }
    }
    
    // إنشاء زر الثيم ديناميكياً إذا لم يكن موجوداً
    document.addEventListener('DOMContentLoaded', function() {
        let themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.id = 'themeToggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.onclick = toggleTheme;
            updateThemeIcon(initialTheme);
            
            // إضافة الزر إلى شريط التنقل إذا كان موجوداً
            const navbar = document.querySelector('.navbar-content');
            if (navbar) {
                const navLinks = navbar.querySelector('.nav-links');
                if (navLinks) {
                    navbar.insertBefore(themeToggle, navLinks);
                } else {
                    navbar.appendChild(themeToggle);
                }
            } else {
                // إضافة للصفحات الأخرى في الزاوية اليسرى العليا
                themeToggle.style.position = 'fixed';
                themeToggle.style.top = '20px';
                themeToggle.style.left = '20px';
                themeToggle.style.zIndex = '1000';
                themeToggle.style.width = '50px';
                themeToggle.style.height = '50px';
                themeToggle.style.borderRadius = '50%';
                themeToggle.style.fontSize = '1.5em';
                themeToggle.style.cursor = 'pointer';
                themeToggle.style.display = 'flex';
                themeToggle.style.alignItems = 'center';
                themeToggle.style.justifyContent = 'center';
                document.body.appendChild(themeToggle);
            }
        }
        
        // تطبيق الثيم على CSS
        applyThemeStyles();
    });
    
    function applyThemeStyles() {
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = `
            :root {
                --bg-primary: #f8f9fa;
                --bg-secondary: #ffffff;
                --text-primary: #333333;
                --text-secondary: #666666;
                --border-color: #e0e0e0;
                --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            [data-theme="dark"] {
                --bg-primary: #1a1a2e;
                --bg-secondary: #16213e;
                --text-primary: #ffffff;
                --text-secondary: #cccccc;
                --border-color: #2d3748;
                --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            .theme-toggle {
                background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
                color: white;
                border: none;
                box-shadow: var(--shadow);
                transition: all 0.3s ease;
            }
            
            .theme-toggle:hover {
                transform: scale(1.1);
                opacity: 0.9;
            }
            
            [data-theme="dark"] .theme-toggle {
                background: linear-gradient(135deg, #4299e1 0%, #2c5282 100%);
            }
        `;
        document.head.appendChild(style);
    }
})();