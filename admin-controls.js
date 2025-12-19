// أدوات التحكم للمشرف - إدارة الكتب المرسلة

const AdminBookControls = (function() {
    'use strict';
    
    // تهيئة النظام
    function init() {
        console.log('👑 نظام تحكم المشرف جاهز');
        
        // التحقق من صلاحيات المشرف
        if (!isAdminLoggedIn()) {
            console.warn('⚠️ يجب تسجيل دخول المشرف أولاً');
            return;
        }
        
        // تحميل واجهة التحكم
        loadAdminControls();
    }
    
    // التحقق من تسجيل دخول المشرف
    function isAdminLoggedIn() {
        // هنا يمكنك التحقق من كلمة مرور المشرف
        // للتبسيط، سنتحقق من وجود بيانات المشرف في sessionStorage
        return sessionStorage.getItem('adminLoggedIn') === 'true' || 
               localStorage.getItem('adminPasswordEntered') === 'true';
    }
    
    // تحميل واجهة التحكم
    function loadAdminControls() {
        // هذه الوظيفة ستضاف إلى صفحة الإحصائيات الحالية
        addBookManagementToStatsPage();
    }
    
    // إضافة قسم إدارة الكتب إلى صفحة الإحصائيات
    function addBookManagementToStatsPage() {
        // هذه الوظيفة ستضاف إلى statistics.html
        // سنقوم بحقن HTML و JavaScript في الصفحة
    }
    
    // إنشاء واجهة إدارة الكتب للمشرف
    function createAdminBookInterface() {
        return `
            <div class="admin-book-management">
                <div class="section-title">
                    <i class="fas fa-book-medical"></i>
                    <span>إدارة الكتب المرسلة</span>
                </div>
                
                <div class="admin-stats-grid" id="adminBookStats">
                    <!-- سيتم تعبئته بالجافاسكريبت -->
                </div>
                
                <div class="admin-controls">
                    <div class="filter-controls">
                        <select id="bookStatusFilter" class="form-control" style="width: 200px;">
                            <option value="all">جميع الحالات</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="review">قيد المراجعة</option>
                            <option value="approved">مقبول</option>
                            <option value="rejected">مرفوض</option>
                        </select>
                        
                        <button class="btn btn-primary" onclick="refreshBookList()">
                            <i class="fas fa-sync-alt"></i>
                            تحديث
                        </button>
                    </div>
                </div>
                
                <div class="books-table-container">
                    <table class="books-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>عنوان الكتاب</th>
                                <th>المرسل</th>
                                <th>المادة</th>
                                <th>الصف</th>
                                <th>تاريخ الإرسال</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="adminBooksTable">
                            <!-- سيتم تعبئته بالجافاسكريبت -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    // تحميل قائمة الكتب للمشرف
    function loadAdminBookList() {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const statusFilter = document.getElementById('bookStatusFilter')?.value || 'all';
        
        let filteredBooks = submittedBooks;
        if (statusFilter !== 'all') {
            filteredBooks = submittedBooks.filter(book => book.status === statusFilter);
        }
        
        // ترتيب من الأحدث إلى الأقدم
        filteredBooks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        return filteredBooks;
    }
    
    // عرض إحصائيات الكتب للمشرف
    function displayAdminBookStats() {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        
        const stats = {
            total: submittedBooks.length,
            pending: submittedBooks.filter(b => b.status === 'pending').length,
            review: submittedBooks.filter(b => b.status === 'review').length,
            approved: submittedBooks.filter(b => b.status === 'approved').length,
            rejected: submittedBooks.filter(b => b.status === 'rejected').length
        };
        
        const statsContainer = document.getElementById('adminBookStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">إجمالي المرسلة</span>
                        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-book"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">كتاب مرسل</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">قيد الانتظار</span>
                        <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.pending}</div>
                    <div class="stat-label">كتاب بانتظار المراجعة</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">قيد المراجعة</span>
                        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.review}</div>
                    <div class="stat-label">كتاب تحت المراجعة</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">تمت الموافقة</span>
                        <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-value">${stats.approved}</div>
                    <div class="stat-label">كتاب مقبول</div>
                </div>
            `;
        }
        
        return stats;
    }
    
    // عرض قائمة الكتب للمشرف
    function displayAdminBookList() {
        const books = loadAdminBookList();
        const tableBody = document.getElementById('adminBooksTable');
        
        if (!tableBody) return;
        
        if (books.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>لا توجد كتب لعرضها</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        books.forEach((book, index) => {
            const statusClass = `status-${book.status}`;
            const statusText = BookManagementSystem.STATUS_TEXT[book.status] || book.status;
            const date = new Date(book.submittedAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // أزرار الإجراءات بناءً على الحالة
            let actionButtons = '';
            
            if (book.status === 'pending') {
                actionButtons = `
                    <button class="btn btn-sm btn-success" onclick="changeBookStatus('${book.id}', 'review')">
                        <i class="fas fa-search"></i> مراجعة
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="showBookDetails('${book.id}')">
                        <i class="fas fa-eye"></i> عرض
                    </button>
                `;
            } else if (book.status === 'review') {
                actionButtons = `
                    <button class="btn btn-sm btn-success" onclick="changeBookStatus('${book.id}', 'approved')">
                        <i class="fas fa-check"></i> قبول
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="showRejectModal('${book.id}')">
                        <i class="fas fa-times"></i> رفض
                    </button>
                    <button class="btn btn-sm btn-info" onclick="showBookDetails('${book.id}')">
                        <i class="fas fa-info-circle"></i> تفاصيل
                    </button>
                `;
            } else {
                actionButtons = `
                    <button class="btn btn-sm btn-info" onclick="showBookDetails('${book.id}')">
                        <i class="fas fa-eye"></i> عرض
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="showEditModal('${book.id}')">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                `;
            }
            
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${book.title}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                 display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
                                ${book.userName ? book.userName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span>${book.userName || 'غير معروف'}</span>
                        </div>
                    </td>
                    <td>${book.subject}</td>
                    <td>${book.grade}</td>
                    <td>${date}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // تغيير حالة الكتاب
    function changeBookStatus(bookId, newStatus, notes = '') {
        if (!confirm(`هل أنت متأكد من تغيير حالة الكتاب إلى "${BookManagementSystem.STATUS_TEXT[newStatus]}"؟`)) {
            return;
        }
        
        const success = BookManagementSystem.updateBookStatus(bookId, newStatus, notes);
        
        if (success) {
            // إذا تمت الموافقة على الكتاب، إضافته إلى المكتبة الرسمية
            if (newStatus === 'approved') {
                const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
                const book = submittedBooks.find(b => b.id === bookId);
                
                if (book) {
                    BookManagementSystem.addBookToOfficialLibrary(book);
                }
            }
            
            // تحديث الواجهة
            displayAdminBookStats();
            displayAdminBookList();
            
            // عرض رسالة نجاح
            showAdminToast(`✅ تم تغيير حالة الكتاب إلى "${BookManagementSystem.STATUS_TEXT[newStatus]}"`);
        } else {
            showAdminToast('❌ حدث خطأ أثناء تغيير حالة الكتاب');
        }
    }
    
    // عرض تفاصيل الكتاب
    function showBookDetails(bookId) {
        const submittedBooks = JSON.parse(localStorage.getItem('submittedBooks') || '[]');
        const book = submittedBooks.find(b => b.id === bookId);
        
        if (!book) {
            alert('الكتاب غير موجود');
            return;
        }
        
        const modalContent = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>تفاصيل الكتاب</h2>
                    <button class="close-modal" onclick="closeModal()">&times;</button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; margin-bottom: 25px;">
                        <div style="background: #f8f9fa; border-radius: 10px; overflow: hidden; height: 200px;">
                            <img src="${book.cover_image}" alt="${book.title}" 
                                 style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        
                        <div>
                            <h3 style="color: #2c3e50; margin-bottom: 15px;">${book.title}</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 13px;">المادة:</strong>
                                    <p style="font-weight: 600; margin: 5px 0;">${book.subject}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 13px;">الصف:</strong>
                                    <p style="font-weight: 600; margin: 5px 0;">${book.grade}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 13px;">الفصل:</strong>
                                    <p style="font-weight: 600; margin: 5px 0;">${book.term}</p>
                                </div>
                                <div>
                                    <strong style="color: #7f8c8d; font-size: 13px;">السنة:</strong>
                                    <p style="font-weight: 600; margin: 5px 0;">${book.year}</p>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #7f8c8d; font-size: 13px;">المرسل:</strong>
                                <p style="font-weight: 600; margin: 5px 0;">${book.userName} (${book.userCurriculum})</p>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #7f8c8d; font-size: 13px;">تاريخ الإرسال:</strong>
                                <p style="font-weight: 600; margin: 5px 0;">
                                    ${new Date(book.submittedAt).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <strong style="color: #7f8c8d; font-size: 13px; display: block; margin-bottom: 8px;">وصف الكتاب:</strong>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; min-height: 80px;">
                            ${book.description || 'لا يوجد وصف'}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <strong style="color: #7f8c8d; font-size: 13px; display: block; margin-bottom: 8px;">رابط الكتاب:</strong>
                        <a href="${book.drive_link}" target="_blank" style="color: #3498db; text-decoration: none; word-break: break-all;">
                            ${book.drive_link}
                        </a>
                    </div>
                    
                    ${book.adminNotes ? `
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #7f8c8d; font-size: 13px; display: block; margin-bottom: 8px;">ملاحظات الإدارة:</strong>
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; color: #856404;">
                                ${book.adminNotes}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 10px; margin-top: 25px;">
                        <button class="btn btn-primary" onclick="window.open('${book.drive_link}', '_blank')" style="flex: 1;">
                            <i class="fas fa-external-link-alt"></i>
                            فتح الكتاب
                        </button>
                        
                        <button class="btn btn-success" onclick="changeBookStatus('${book.id}', 'approved')" style="flex: 1;">
                            <i class="fas fa-check"></i>
                            قبول الكتاب
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(modalContent);
    }
    
    // عرض نافذة رفض الكتاب
    function showRejectModal(bookId) {
        const modalContent = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>رفض الكتاب</h2>
                    <button class="close-modal" onclick="closeModal()">&times;</button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; color: #2c3e50; font-weight: 700; margin-bottom: 10px;">
                            سبب الرفض (سيظهر للطالب):
                        </label>
                        <textarea id="rejectReason" class="form-control" 
                                  placeholder="أدخل سبب رفض الكتاب..." 
                                  rows="4" style="width: 100%;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-danger" onclick="rejectBook('${bookId}')" style="flex: 1;">
                            <i class="fas fa-times"></i>
                            رفض الكتاب
                        </button>
                        
                        <button class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(modalContent);
    }
    
    // رفض الكتاب
    function rejectBook(bookId) {
        const rejectReason = document.getElementById('rejectReason')?.value || 'تم الرفض من قبل الإدارة';
        changeBookStatus(bookId, 'rejected', rejectReason);
        closeModal();
    }
    
    // عرض نافذة
    function showModal(content) {
        // إزالة أي نافذة موجودة مسبقاً
        closeModal();
        
        const modal = document.createElement('div');
        modal.id = 'adminModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = content;
        document.body.appendChild(modal);
        
        // منع التمرير خلف النافذة
        document.body.style.overflow = 'hidden';
    }
    
    // إغلاق النافذة
    function closeModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.remove();
        }
        
        // استعادة التمرير
        document.body.style.overflow = 'auto';
    }
    
    // عرض رسالة للمشرف
    function showAdminToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(67, 233, 123, 0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            animation: slideDown 0.5s ease;
        `;
        
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // تحديث قائمة الكتب
    function refreshBookList() {
        const btn = event?.target?.closest('.btn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<div class="loading"></div> جاري التحديث...';
            
            setTimeout(() => {
                displayAdminBookStats();
                displayAdminBookList();
                btn.innerHTML = originalHTML;
                showAdminToast('✅ تم تحديث القائمة بنجاح');
            }, 1000);
        } else {
            displayAdminBookStats();
            displayAdminBookList();
        }
    }
    
    // تهيئة واجهة المشرف في صفحة الإحصائيات
    function initAdminInterface() {
        // هذه الدالة ستستدعى من صفحة statistics.html
        const statsContainer = document.querySelector('.container .stats-container');
        
        if (statsContainer && isAdminLoggedIn()) {
            // إضافة قسم إدارة الكتب بعد قسم الجداول
            const chartsSection = statsContainer.querySelector('.chart-container');
            if (chartsSection) {
                const bookManagementHTML = createAdminBookInterface();
                chartsSection.insertAdjacentHTML('afterend', bookManagementHTML);
                
                // تحميل البيانات
                displayAdminBookStats();
                displayAdminBookList();
                
                // إضافة مستمع للأحداث
                document.getElementById('bookStatusFilter')?.addEventListener('change', displayAdminBookList);
            }
        }
    }
    
    // الواجهة العامة
    return {
        init: init,
        initAdminInterface: initAdminInterface,
        displayAdminBookStats: displayAdminBookStats,
        displayAdminBookList: displayAdminBookList,
        changeBookStatus: changeBookStatus,
        showBookDetails: showBookDetails,
        showRejectModal: showRejectModal,
        rejectBook: rejectBook,
        showModal: showModal,
        closeModal: closeModal,
        refreshBookList: refreshBookList
    };
})();

// جعل الوظائف متاحة عالمياً
window.changeBookStatus = AdminBookControls.changeBookStatus;
window.showBookDetails = AdminBookControls.showBookDetails;
window.showRejectModal = AdminBookControls.showRejectModal;
window.rejectBook = AdminBookControls.rejectBook;
window.closeModal = AdminBookControls.closeModal;
window.refreshBookList = AdminBookControls.refreshBookList;