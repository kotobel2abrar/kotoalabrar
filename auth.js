(function(){
  // قائمة الصفحات التي لا تحتاج تسجيل دخول
  const publicPages = ['login.html', 'signin.html', 'first-login.html', 'student_profile.html'];
  
  // الحصول على اسم الصفحة الحالية
  const currentPage = window.location.pathname.split('/').pop();
  
  // إذا كانت الصفحة الحالية صفحة تسجيل دخول أو أول تسجيل
  if(publicPages.includes(currentPage)){
    // إذا كان المستخدم في صفحة تسجيل الدخول الأولى، إزالة حالة تسجيل الدخول
    if(currentPage === 'first-login.html' || currentPage === 'login.html'){
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('username');
    }
    // إذا كان في صفحة حساب الطالب، لا نفعل شيء (يتم التحكم فيه من داخل الصفحة نفسها)
    return;
  } else {
    // إذا كانت الصفحة الحالية ليست صفحة تسجيل دخول
    // التحقق من تسجيل الدخول
    if(!sessionStorage.getItem('isLoggedIn')){
      // إعادة التوجيه لصفحة تسجيل الدخول
      window.location.href = "first-login.html";
    }
  }
})();

// دالة تسجيل الخروج (يمكن استخدامها في أي صفحة)
function logout(){
  // مسح جميع بيانات الجلسة
  sessionStorage.clear();
  // إعادة التوجيه لصفحة تسجيل الدخول الأولى
  window.location.href = "first-login.html";
}