
(function(){
  // قائمة الصفحات التي لا تحتاج تسجيل دخول
  const publicPages = ['login.html', 'signin.html'];
  
  // الحصول على اسم الصفحة الحالية
  const currentPage = window.location.pathname.split('/').pop();
  
  // إذا كانت الصفحة الحالية ليست صفحة تسجيل الدخول
  if(!publicPages.includes(currentPage)){
    // التحقق من تسجيل الدخول
    if(!sessionStorage.getItem('isLoggedIn')){
      // إعادة التوجيه لصفحة تسجيل الدخول
      window.location.href = "login.html";
    }
  }
})();

// دالة تسجيل الخروج (يمكن استخدامها في أي صفحة)
function logout(){
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = "login.html";
}