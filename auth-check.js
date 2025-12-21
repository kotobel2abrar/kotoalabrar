// ===================================
// سكريبت التحقق من التسجيل والتوجيه التلقائي
// يعمل على جميع صفحات الموقع
// ===================================

(function() {
    'use strict';

    // الصفحات المستثناة من التحقق
    const EXCLUDED_PAGES = ['first-login.html', 'statistics.html'];
    
    // الحصول على الصفحة الحالية
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // ===================================
    // التحقق الفوري من التسجيل
    // ===================================
    
    // إذا كانت الصفحة الحالية هي first-login.html، لا نفعل شيء
    if (currentPage === 'first-login.html') {
        console.log('📝 صفحة التسجيل الأولى');
        return;
    }

    // إذا كانت الصفحة هي statistics.html، نتحقق فقط من كلمة المرور
    if (currentPage === 'statistics.html') {
        console.log('📊 صفحة الإحصائيات');
        return;
    }

    // ===================================
    // الفحص الأول والأهم: هل أكمل التسجيل؟
    // ===================================
    const hasCompletedRegistration = localStorage.getItem('hasCompletedRegistration');
    
    if (hasCompletedRegistration !== 'true') {
        console.log('🚫 المستخدم لم يسجل من قبل');
        console.log('➡️ توجيه فوري إلى صفحة التسجيل الأولى...');
        
        // توجيه فوري دون تأخير
        window.location.replace('first-login.html');
        
        // إيقاف تنفيذ باقي الكود
        return;
    }

    // ===================================
    // إذا وصل هنا، معناه المستخدم مسجل من قبل
    // ===================================
    console.log('✅ المستخدم مسجل مسبقاً');

    // ===================================
    // التحقق من الجلسة الحالية
    // ===================================
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        console.log('⚠️ الجلسة منتهية - إنشاء جلسة جديدة...');
        createNewSession();
    } else {
        console.log('🔓 الجلسة نشطة');
    }

    // ===================================
    // إنشاء جلسة جديدة
    // ===================================
    function createNewSession() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        if (!userProfile.name) {
            console.warn('⚠️ لا توجد بيانات مستخدم - إعادة التوجيه للتسجيل');
            localStorage.removeItem('hasCompletedRegistration');
            window.location.replace('first-login.html');
            return;
        }

        // إنشاء معرف جلسة جديد
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // تحديث بيانات الجلسة
        const sessionData = {
            loginTime: new Date().toISOString(),
            sessionId: sessionId
        };

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('userData', JSON.stringify(sessionData));

        // تسجيل الجلسة في نظام التتبع
        let timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
        if (!timeTracking.sessions) timeTracking.sessions = {};
        
        timeTracking.sessions[sessionId] = {
            sessionId: sessionId,
            userName: userProfile.name,
            curriculum: userProfile.curriculum,
            grade: userProfile.grade,
            email: userProfile.email || '',
            loginTime: sessionData.loginTime,
            pages: {},
            downloads: 0,
            lastActive: Date.now(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`
        };
        
        localStorage.setItem('timeTracking', JSON.stringify(timeTracking));

        console.log('✅ تم إنشاء جلسة جديدة:', sessionId);
        console.log('👤 المستخدم:', userProfile.name);
    }

    // ===================================
    // عرض معلومات المستخدم في Console
    // ===================================
    function displayUserInfo() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        if (userProfile.name) {
            console.log('%c👤 معلومات المستخدم', 'color: #27ae60; font-size: 14px; font-weight: bold;');
            console.log('%c━━━━━━━━━━━━━━━━━━━━', 'color: #3498db;');
            console.log('%c📛 الاسم:', 'color: #e74c3c; font-weight: bold;', userProfile.name);
            console.log('%c📚 المسار:', 'color: #f39c12; font-weight: bold;', userProfile.curriculum);
            console.log('%c🎓 الصف:', 'color: #9b59b6; font-weight: bold;', userProfile.grade);
            if (userProfile.email) {
                console.log('%c📧 البريد:', 'color: #16a085; font-weight: bold;', userProfile.email);
            }
            console.log('%c📅 تاريخ التسجيل:', 'color: #34495e; font-weight: bold;', 
                new Date(userProfile.registrationDate).toLocaleString('en-US'));
            console.log('%c━━━━━━━━━━━━━━━━━━━━', 'color: #3498db;');
        }
    }

    // ===================================
    // إضافة اسم المستخدم في الواجهة
    // ===================================
    function addUserGreeting() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        if (!userProfile.name) return;

        // الانتظار حتى يتم تحميل navbar
        setTimeout(() => {
            const navbar = document.querySelector('.navbar-content');
            if (navbar && !document.getElementById('userGreeting')) {
                const greeting = document.createElement('div');
                greeting.id = 'userGreeting';
                greeting.style.cssText = `
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                    color: white;
                    padding: 10px 18px;
                    border-radius: 25px;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 5px 15px rgba(67, 233, 123, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                `;
                
                greeting.innerHTML = `
                    <i class="fas fa-user-circle" style="font-size: 20px;"></i>
                    <div>
                        <div style="font-size: 13px; opacity: 0.9;">مرحباً</div>
                        <div style="font-size: 15px;">${userProfile.name.split(' ')[0]}</div>
                    </div>
                `;
                
                greeting.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 8px 20px rgba(67, 233, 123, 0.4)';
                });
                
                greeting.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '0 5px 15px rgba(67, 233, 123, 0.3)';
                });
                
                greeting.addEventListener('click', function() {
                    alert(`👤 ${userProfile.name}\n📚 ${userProfile.curriculum}\n🎓 ${userProfile.grade}`);
                });
                
                // إضافة في بداية navbar
                navbar.insertBefore(greeting, navbar.firstChild);
            }
        }, 500);
    }

    // ===================================
    // إضافة زر تسجيل الخروج
    // ===================================
    function addLogoutButton() {
        setTimeout(() => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && !document.getElementById('logoutBtn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.href = '#';
                logoutBtn.style.cssText = `
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white !important;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(240, 147, 251, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> خروج';
                
                logoutBtn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.4)';
                });
                
                logoutBtn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 5px 15px rgba(240, 147, 251, 0.3)';
                });
                
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('هل أنت متأكد من تسجيل الخروج؟\n\nسيتم إنهاء الجلسة الحالية.')) {
                        // مسح الجلسة الحالية فقط
                        sessionStorage.clear();
                        
                        console.log('👋 تم تسجيل الخروج');
                        
                        // عرض رسالة
                        const message = document.createElement('div');
                        message.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                            color: white;
                            padding: 15px 30px;
                            border-radius: 15px;
                            font-weight: 700;
                            box-shadow: 0 10px 30px rgba(67, 233, 123, 0.4);
                            z-index: 9999;
                            animation: slideDown 0.5s ease;
                        `;
                        message.innerHTML = '✅ تم تسجيل الخروج بنجاح';
                        document.body.appendChild(message);
                        
                        setTimeout(() => {
                            // إعادة تحميل الصفحة لإنشاء جلسة جديدة
                            window.location.reload();
                        }, 1000);
                    }
                });
                
                navLinks.appendChild(logoutBtn);
            }
        }, 500);
    }

    // ===================================
    // تطبيق تفضيلات المستخدم
    // ===================================
    function applyUserPreferences() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        
        if (userProfile.curriculum) {
            console.log(`💡 المستخدم مسجل في المسار ${userProfile.curriculum}`);
            
            // إضافة تمييز بصري للمسار المناسب
            setTimeout(() => {
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (userProfile.curriculum === 'سعودي' && href === 'books_sa.html') {
                        link.style.background = 'rgba(46, 204, 113, 0.2)';
                        link.style.borderRight = '4px solid #27ae60';
                    } else if (userProfile.curriculum === 'مصري' && href === 'book_eg.html') {
                        link.style.background = 'rgba(231, 76, 60, 0.2)';
                        link.style.borderRight = '4px solid #e74c3c';
                    }
                });
            }, 600);
        }
    }

    // ===================================
    // تشغيل الوظائف
    // ===================================
    displayUserInfo();
    
    // الانتظار حتى تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addUserGreeting();
            addLogoutButton();
            applyUserPreferences();
        });
    } else {
        addUserGreeting();
        addLogoutButton();
        applyUserPreferences();
    }

    // ===================================
    // تصدير وظائف عامة
    // ===================================
    window.AuthSystem = {
        getUserProfile: () => JSON.parse(localStorage.getItem('userProfile') || '{}'),
        isRegistered: () => localStorage.getItem('hasCompletedRegistration') === 'true',
        isLoggedIn: () => sessionStorage.getItem('isLoggedIn') === 'true',
        logout: () => {
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                sessionStorage.clear();
                console.log('👋 تم تسجيل الخروج');
                window.location.reload();
            }
        },
        resetRegistration: () => {
            if (confirm('⚠️ هل أنت متأكد من إعادة تعيين التسجيل؟\n\nسيتم حذف جميع بياناتك ويجب عليك التسجيل من جديد!')) {
                if (confirm('⚠️ تأكيد نهائي: هذا الإجراء لا يمكن التراجع عنه!')) {
                    localStorage.removeItem('userProfile');
                    localStorage.removeItem('hasCompletedRegistration');
                    sessionStorage.clear();
                    console.log('🔄 تم إعادة تعيين التسجيل');
                    window.location.href = 'first-login.html';
                }
            }
        },
        getSessionInfo: () => {
            const sessionId = sessionStorage.getItem('sessionId');
            const timeTracking = JSON.parse(localStorage.getItem('timeTracking') || '{}');
            return timeTracking.sessions ? timeTracking.sessions[sessionId] : null;
        }
    };

    console.log('✅ نظام التحقق من التسجيل مفعّل');
    console.log('📄 الصفحة الحالية:', currentPage);

})();