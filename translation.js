/**
 * نظام الترجمة العالمي للموقع
 * يدعم العربية والإنجليزية مع حفظ التفضيل
 */

const TranslationSystem = {
    currentLang: localStorage.getItem('siteLang') || 'ar',
    
    /**
     * تهيئة النظام عند تحميل الصفحة
     */
    init() {
        this.createLanguageSwitcher();
        this.applyLanguage(this.currentLang);
        this.addStyles();
    },
    
    /**
     * إنشاء زر تبديل اللغة
     */
    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `<button id="langButton">🌐 ${this.currentLang === 'ar' ? 'EN' : 'AR'}</button>`;
        switcher.onclick = () => this.toggleLanguage();
        document.body.appendChild(switcher);
    },
    
    /**
     * إضافة التنسيقات CSS للزر
     */
    addStyles() {
        if (document.getElementById('translation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'translation-styles';
        style.textContent = `
            .lang-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: white;
                padding: 10px 20px;
                border-radius: 25px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .lang-switcher:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            
            .lang-switcher button {
                background: none;
                border: none;
                font-size: 1.2em;
                cursor: pointer;
                padding: 5px 10px;
                font-weight: 600;
            }
            
            @media (max-width: 768px) {
                .lang-switcher {
                    top: 10px;
                    right: 10px;
                    padding: 8px 15px;
                }
                
                .lang-switcher button {
                    font-size: 1em;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    /**
     * تبديل اللغة
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('siteLang', this.currentLang);
        this.applyLanguage(this.currentLang);
    },
    
    /**
     * تطبيق اللغة المحددة
     */
    applyLanguage(lang) {
        // تحديث اتجاه الصفحة
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // تطبيق الترجمة على العناصر
        this.translateElements(lang);
        
        // تطبيق الترجمة على الـ placeholders
        this.translatePlaceholders(lang);
        
        // تحديث زر اللغة
        const langButton = document.getElementById('langButton');
        if (langButton) {
            langButton.textContent = `🌐 ${lang === 'ar' ? 'EN' : 'AR'}`;
        }
        
        // حفظ اللغة
        this.currentLang = lang;
    },
    
    /**
     * ترجمة محتوى العناصر
     */
    translateElements(lang) {
        const elements = document.querySelectorAll('[data-ar][data-en]');
        elements.forEach(el => {
            const translation = el.getAttribute('data-' + lang);
            if (translation) {
                el.textContent = translation;
            }
        });
    },
    
    /**
     * ترجمة الـ placeholders
     */
    translatePlaceholders(lang) {
        const placeholders = document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]');
        placeholders.forEach(el => {
            const translation = el.getAttribute('data-placeholder-' + lang);
            if (translation) {
                el.placeholder = translation;
            }
        });
    },
    
    /**
     * الحصول على اللغة الحالية
     */
    getCurrentLanguage() {
        return this.currentLang;
    },
    
    /**
     * التحقق من اللغة العربية
     */
    isArabic() {
        return this.currentLang === 'ar';
    },
    
    /**
     * التحقق من اللغة الإنجليزية
     */
    isEnglish() {
        return this.currentLang === 'en';
    }
};

// تهيئة النظام عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TranslationSystem.init());
} else {
    TranslationSystem.init();
}

// تصدير النظام للاستخدام العام
window.TranslationSystem = TranslationSystem;