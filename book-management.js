// نظام إدارة الكتب - التواصل بين الطالب والإدارة

const BookManagementSystem = (function() {
    'use strict';
    
    // حالة الكتاب
    const BOOK_STATUS = {
        PENDING: 'pending',
        REVIEW: 'review',
        APPROVED: 'approved',
        REJECTED: 'rejected'
    };
    
    // ألوان الحالات
    const STATUS_COLORS = {
        pending: '#FF9800',
        review: '#2196F3',
        approved: '#4CAF50',
        rejected: '#F44336'
    };
    
    // نص الحالات
    const STATUS_TEXT = {
        pending: 'قيد الانتظار',
        review: 'قيد المراجعة',
        approved: 'مقبول',
        rejected: 'مرفوض'
    };
    
    // تهيئة النظام
    function init() {
        console.log('📚 نظام إدارة الكتب جاهز');
        syncWithAdminPanel();
    }
    
    // مزامنة البيانات مع لوحة الإدارة
    function syncWithAdminPanel() {
        // تحديث الكتب المعلقة في لوحة الإدارة
        updatePendingBooksInAdminPanel();
        
        // تحديث إشعارات المشرف
        updateAdminNotifications();
        
        // تحديث الإحصائيات العامة
        updateGlobalStatistics();
    }
    
    // تحديث الكتب المعلقة في لوحة الإدارة
    function updatePendingBooksInAdminPanel() {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const pendingBooks = submittedBooks.filter(book => 
            book.status === BOOK_STATUS.PENDING || book.status === BOOK_STATUS.REVIEW
        );
        
        // حفظ في localStorage للإدارة
        localStorage.setItem('adminPendingBooks', JSON.stringify(pendingBooks));
        
        console.log(`📋 ${pendingBooks.length} كتاب في قائمة الانتظار`);
        return pendingBooks;
    }
    
    // تحديث إشعارات المشرف
    function updateAdminNotifications() {
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        const unreadCount = adminNotifications.filter(n => !n.read).length;
        
        // تحديث مؤشر الإشعارات
        if (typeof updateNotificationBadge === 'function') {
            updateNotificationBadge(unreadCount);
        }
        
        return adminNotifications;
    }
    
    // تحديث الإحصائيات العامة
    function updateGlobalStatistics() {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const siteStats = JSON.parse(localStorage.getItem('siteStats') || '{}');
        
        // إحصائيات الكتب
        const bookStats = {
            totalSubmitted: submittedBooks.length,
            pending: submittedBooks.filter(b => b.status === BOOK_STATUS.PENDING).length,
            inReview: submittedBooks.filter(b => b.status === BOOK_STATUS.REVIEW).length,
            approved: submittedBooks.filter(b => b.status === BOOK_STATUS.APPROVED).length,
            rejected: submittedBooks.filter(b => b.status === BOOK_STATUS.REJECTED).length,
            lastUpdated: new Date().toISOString()
        };
        
        siteStats.bookManagement = bookStats;
        localStorage.setItem('siteStats', JSON.stringify(siteStats));
        
        return bookStats;
    }
    
    // تغيير حالة الكتاب (من قبل الإدارة)
    function updateBookStatus(bookId, newStatus, adminNotes = '') {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const bookIndex = submittedBooks.findIndex(book => book.id === bookId);
        
        if (bookIndex === -1) {
            console.error(`❌ الكتاب غير موجود: ${bookId}`);
            return false;
        }
        
        // تحديث حالة الكتاب
        const oldStatus = submittedBooks[bookIndex].status;
        submittedBooks[bookIndex].status = newStatus;
        submittedBooks[bookIndex].adminNotes = adminNotes;
        submittedBooks[bookIndex].reviewedAt = new Date().toISOString();
        
        // حفظ التغييرات
        localStorage.setItem('submittedBooks', JSON.stringify(submittedBooks));
        
        // إرسال إشعار للمستخدم
        sendNotificationToUser(
            submittedBooks[bookIndex].userId,
            'تحديث حالة الكتاب',
            `تم تغيير حالة كتاب "${submittedBooks[bookIndex].title}" من ${STATUS_TEXT[oldStatus]} إلى ${STATUS_TEXT[newStatus]}`,
            bookId
        );
        
        // مزامنة مع لوحة الإدارة
        syncWithAdminPanel();
        
        console.log(`✅ تم تحديث حالة الكتاب ${bookId} إلى ${newStatus}`);
        return true;
    }
    
    // إرسال إشعار للمستخدم
    function sendNotificationToUser(userId, title, message, bookId = null) {
        const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
        
        if (!userNotifications[userId]) {
            userNotifications[userId] = [];
        }
        
        userNotifications[userId].push({
            id: 'notification_' + Date.now(),
            title: title,
            message: message,
            bookId: bookId,
            timestamp: new Date().toISOString(),
            read: false
        });
        
        // حفظ الإشعارات
        localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
        
        return true;
    }
    
    // الحصول على إشعارات المستخدم
    function getUserNotifications(userId) {
        const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
        return userNotifications[userId] || [];
    }
    
    // الحصول على الكتب حسب الحالة
    function getBooksByStatus(status) {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        return submittedBooks.filter(book => book.status === status);
    }
    
    // الحصول على إحصائيات الكتاب حسب المستخدم
    function getUserBookStats(userId) {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const userBooks = submittedBooks.filter(book => book.userId === userId);
        
        return {
            total: userBooks.length,
            pending: userBooks.filter(b => b.status === BOOK_STATUS.PENDING).length,
            inReview: userBooks.filter(b => b.status === BOOK_STATUS.REVIEW).length,
            approved: userBooks.filter(b => b.status === BOOK_STATUS.APPROVED).length,
            rejected: userBooks.filter(b => b.status === BOOK_STATUS.REJECTED).length
        };
    }
    
    // إضافة كتاب إلى النظام الرسمي بعد الموافقة
    function addBookToOfficialLibrary(bookData) {
        const curriculum = bookData.userCurriculum === 'سعودي' ? 'saudi' : 'egypt';
        const storageKey = curriculum === 'saudi' ? 'saudiData' : 'egyptData';
        
        // الحصول على البيانات الحالية
        const currentData = JSON.parse(localStorage.getItem(storageKey) || '{"books": [], "subjects": [], "years": []}');
        
        // التحقق من عدم وجود الكتاب مسبقاً
        const bookExists = currentData.books.some(book => 
            book.title === bookData.title && 
            book.grade === bookData.grade && 
            book.subject === bookData.subject
        );
        
        if (bookExists) {
            console.log(`📖 الكتاب موجود مسبقاً في ${curriculum === 'saudi' ? 'المسار السعودي' : 'المسار المصري'}`);
            return false;
        }
        
        // إضافة الكتاب
        const newBook = {
            title: bookData.title,
            drive_link: bookData.drive_link,
            cover_image: bookData.cover_image,
            subject: bookData.subject,
            year: bookData.year,
            term: bookData.term,
            grade: bookData.grade,
            language: bookData.language,
            addedBy: bookData.userName,
            addedAt: new Date().toISOString()
        };
        
        currentData.books.push(newBook);
        
        // تحديث قائمة المواد إذا كانت جديدة
        if (!currentData.subjects.includes(bookData.subject)) {
            currentData.subjects.push(bookData.subject);
        }
        
        // تحديث قائمة السنوات إذا كانت جديدة
        if (!currentData.years.includes(bookData.year)) {
            currentData.years.push(bookData.year);
        }
        
        // حفظ البيانات
        localStorage.setItem(storageKey, JSON.stringify(currentData));
        
        // إضافة إلى سجل الإضافة
        addToAdditionLog(bookData, curriculum);
        
        console.log(`✅ تم إضافة الكتاب إلى ${curriculum === 'saudi' ? 'المسار السعودي' : 'المسار المصري'}`);
        return true;
    }
    
    // إضافة إلى سجل الإضافة
    function addToAdditionLog(bookData, curriculum) {
        const additionLog = JSON.parse(localStorage.getItem('bookAdditionLog') || '[]');
        
        additionLog.push({
            bookId: bookData.id,
            title: bookData.title,
            userId: bookData.userId,
            userName: bookData.userName,
            curriculum: curriculum,
            addedAt: new Date().toISOString()
        });
        
        localStorage.setItem('bookAdditionLog', JSON.stringify(additionLog));
    }
    
    // تصدير البيانات للإدارة
    function exportBookDataForAdmin() {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        
        return {
            submittedBooks: submittedBooks,
            userNotifications: userNotifications,
            adminNotifications: adminNotifications,
            bookStats: updateGlobalStatistics(),
            exportTime: new Date().toISOString()
        };
    }
    
    // الواجهة العامة
    return {
        init: init,
        BOOK_STATUS: BOOK_STATUS,
        STATUS_COLORS: STATUS_COLORS,
        STATUS_TEXT: STATUS_TEXT,
        updateBookStatus: updateBookStatus,
        getBooksByStatus: getBooksByStatus,
        getUserBookStats: getUserBookStats,
        getUserNotifications: getUserNotifications,
        addBookToOfficialLibrary: addBookToOfficialLibrary,
        exportBookDataForAdmin: exportBookDataForAdmin,
        syncWithAdminPanel: syncWithAdminPanel
    };
})();

// تهيئة النظام عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BookManagementSystem.init);
} else {
    BookManagementSystem.init();
}