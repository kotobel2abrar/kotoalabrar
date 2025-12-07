// ===================================
// نظام التتبع الشامل لموقع مدارس الأبرار
// يعمل على جميع الصفحات تلقائياً
// ===================================

(function() {
    'use strict';

    // التحقق من تسجيل الدخول
    function isUserLoggedIn() {
        return sessionStorage.getItem('isLoggedIn') === 'true';
    }

    // إذا لم يكن مسجل دخول، لا نبدأ التتبع
    if (!isUserLoggedIn() && !window.location.pathname.includes('login.html')) {
        console.log('المستخدم لم يسجل دخول - التتبع معطل');
        return;
    }

    // ===================================
    // 1. إنشاء أو جلب معرف الجلسة الفريد
    // ===================================
    function getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
            
            // تسجيل بداية الجلسة
            const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            console.log('✅ تم إنشاء جلسة جديدة:', sessionId);
            console.log('📅 وقت الدخول:', new Date().toISOString());
        }
        
        return sessionId;
    }

    const sessionId = getOrCreateSessionId();

    // ===================================
    // 2. تهيئة بنية البيانات
    // ===================================
    function initializeTracking() {
        let timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        
        if (!timeTracking.sessions) {
            timeTracking.sessions = {};
        }
        
        if (!timeTracking.pageTotals) {
            timeTracking.pageTotals = {};
        }
        
        // إنشاء سجل للجلسة الحالية إذا لم يكن موجوداً
        if (!timeTracking.sessions[sessionId]) {
            const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            timeTracking.sessions[sessionId] = {
                sessionId: sessionId,
                loginTime: userData.loginTime || new Date().toISOString(),
                pages: {},
                downloads: 0,
                lastActive: Date.now(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenSize: `${window.screen.width}x${window.screen.height}`
            };
            
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
            console.log('✅ تم تهيئة تتبع الجلسة:', sessionId);
        }
        
        return timeTracking;
    }

    let timeTracking = initializeTracking();

    // ===================================
    // 3. تتبع الوقت في الصفحة الحالية
    // ===================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let pageStartTime = Date.now();
    let isPageVisible = true;

    console.log('📄 الصفحة الحالية:', currentPage);

    // تحديث الوقت كل ثانية
    const trackingInterval = setInterval(() => {
        if (!isPageVisible) return; // لا نسجل الوقت إذا كانت الصفحة مخفية

        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        
        if (!timeTracking.sessions[sessionId]) {
            console.warn('⚠️ الجلسة غير موجودة، إعادة التهيئة');
            initializeTracking();
            return;
        }

        // حساب الوقت المقضي في هذه الصفحة
        const currentTime = Date.now();
        const elapsedTime = currentTime - pageStartTime;

        // تحديث وقت الصفحة في الجلسة
        timeTracking.sessions[sessionId].pages[currentPage] = elapsedTime;
        timeTracking.sessions[sessionId].lastActive = currentTime;

        // تحديث إجمالي الوقت للصفحة
        if (!timeTracking.pageTotals[currentPage]) {
            timeTracking.pageTotals[currentPage] = 0;
        }
        timeTracking.pageTotals[currentPage] += 1000; // إضافة ثانية واحدة

        localStorage.setItem('timeTracking', JSON.stringify(timeTracking));

        // عرض الوقت في Console كل 10 ثواني
        if (elapsedTime % 10000 < 1000) {
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            console.log(`⏱️ وقت الجلسة في ${currentPage}: ${minutes}د ${seconds}ث`);
        }
    }, 1000); // كل ثانية

    // ===================================
    // 4. تتبع رؤية الصفحة (Tab Focus)
    // ===================================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            isPageVisible = false;
            console.log('👁️ المستخدم غادر الصفحة (تبديل Tab)');
        } else {
            isPageVisible = true;
            pageStartTime = Date.now(); // إعادة تعيين وقت البداية
            console.log('👁️ المستخدم عاد للصفحة');
        }
    });

    // ===================================
    // 5. تتبع التحميلات
    // ===================================
    function trackDownload(bookTitle) {
        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        const siteStats = JSON.parse(localStorage.getItem('siteStats') || '{}');

        // تحديث تحميلات الجلسة
        if (timeTracking.sessions[sessionId]) {
            timeTracking.sessions[sessionId].downloads = (timeTracking.sessions[sessionId].downloads || 0) + 1;
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
        }

        // تحديث إحصائيات الموقع العامة
        if (!siteStats.downloads) siteStats.downloads = {};
        if (!siteStats.downloads[bookTitle]) siteStats.downloads[bookTitle] = 0;
        siteStats.downloads[bookTitle]++;

        // تحديث تحميلات اليوم
        const today = new Date().toDateString();
        if (!siteStats.todayDownloads) siteStats.todayDownloads = {};
        if (!siteStats.todayDownloads[today]) siteStats.todayDownloads[today] = 0;
        siteStats.todayDownloads[today]++;

        localStorage.setItem('siteStats', JSON.stringify(siteStats));
        
        console.log('📥 تم تسجيل تحميل:', bookTitle);
    }

    // الاستماع لأحداث التحميل
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // إذا كان الرابط يحتوي على كلمة "drive" أو class "open-btn"
        if ((target.tagName === 'A' && target.href.includes('drive.google.com')) || 
            target.classList.contains('open-btn') ||
            target.closest('.open-btn')) {
            
            const bookCard = target.closest('.book-card');
            if (bookCard) {
                const bookTitle = bookCard.querySelector('.book-title')?.textContent || 'كتاب غير معروف';
                trackDownload(bookTitle);
            }
        }
    });

    // ===================================
    // 6. تتبع النقرات والتفاعلات
    // ===================================
    let clickCount = 0;
    document.addEventListener('click', function(e) {
        clickCount++;
        
        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        if (timeTracking.sessions[sessionId]) {
            timeTracking.sessions[sessionId].clicks = clickCount;
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
        }
    });

    // ===================================
    // 7. حفظ البيانات عند مغادرة الصفحة
    // ===================================
    window.addEventListener('beforeunload', function() {
        clearInterval(trackingInterval);
        
        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        if (timeTracking.sessions[sessionId]) {
            // حفظ الوقت النهائي
            const finalTime = Date.now() - pageStartTime;
            timeTracking.sessions[sessionId].pages[currentPage] = finalTime;
            timeTracking.sessions[sessionId].lastActive = Date.now();
            timeTracking.sessions[sessionId].endTime = new Date().toISOString();
            
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
            
            console.log('💾 تم حفظ بيانات الجلسة قبل المغادرة');
        }
    });

    // ===================================
    // 8. تتبع التمرير (Scroll)
    // ===================================
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercentage > maxScroll) {
            maxScroll = scrollPercentage;
            
            const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
            if (timeTracking.sessions[sessionId]) {
                if (!timeTracking.sessions[sessionId].scrollData) {
                    timeTracking.sessions[sessionId].scrollData = {};
                }
                timeTracking.sessions[sessionId].scrollData[currentPage] = maxScroll;
                localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
            }
        }
    });

    // ===================================
    // 9. إرسال إشارة حياة (Heartbeat)
    // ===================================
    setInterval(() => {
        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        if (timeTracking.sessions[sessionId]) {
            timeTracking.sessions[sessionId].lastHeartbeat = Date.now();
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
        }
    }, 30000); // كل 30 ثانية

    // ===================================
    // 10. عرض معلومات الجلسة في Console
    // ===================================
    console.log('%c📊 نظام التتبع الشامل مفعّل', 'color: #27ae60; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3498db;');
    console.log('%c🆔 معرف الجلسة:', 'color: #e74c3c; font-weight: bold;', sessionId);
    console.log('%c📄 الصفحة الحالية:', 'color: #f39c12; font-weight: bold;', currentPage);
    console.log('%c⏰ وقت البداية:', 'color: #9b59b6; font-weight: bold;', new Date().toLocaleString('en-US'));
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3498db;');

    // ===================================
    // 11. تصدير وظائف للاستخدام العام
    // ===================================
    window.TrackingSystem = {
        getSessionId: () => sessionId,
        getCurrentPageTime: () => Date.now() - pageStartTime,
        getSessionData: () => {
            const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
            return timeTracking.sessions[sessionId];
        },
        trackCustomEvent: (eventName, eventData) => {
            const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
            if (timeTracking.sessions[sessionId]) {
                if (!timeTracking.sessions[sessionId].customEvents) {
                    timeTracking.sessions[sessionId].customEvents = [];
                }
                timeTracking.sessions[sessionId].customEvents.push({
                    event: eventName,
                    data: eventData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
                console.log('📌 تم تسجيل حدث مخصص:', eventName);
            }
        }
    };

    // ===================================
    // 12. تنظيف البيانات القديمة (أكثر من 30 يوم)
    // ===================================
    function cleanOldData() {
        const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        let cleaned = 0;

        Object.keys(timeTracking.sessions || {}).forEach(sessId => {
            const session = timeTracking.sessions[sessId];
            const loginTime = new Date(session.loginTime).getTime();
            
            if (loginTime < thirtyDaysAgo) {
                delete timeTracking.sessions[sessId];
                cleaned++;
            }
        });

        if (cleaned > 0) {
            localStorage.setItem('timeTracking', JSON.stringify(timeTracking));
            console.log(`🧹 تم تنظيف ${cleaned} جلسة قديمة`);
        }
    }

    // تشغيل التنظيف عند التحميل
    cleanOldData();

    console.log('✅ نظام التتبع جاهز ويعمل بكفاءة!');
})();