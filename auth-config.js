// ملف التكوين - يجب وضعه في مكان آمن خارج الموقع العام
// للأمان القصوى، استخدم متغيرات البيئة أو خادم خلفي

const AUTH_CONFIG = {
  // قم بتغيير هذا الباسورد إلى باسورد قوي
  adminPassword: "AbrarSchools@2025!SecurePass",
  
  // مدة الجلسة بالدقائق
  sessionDuration: 120,
  
  // تشفير الباسورد (استخدام SHA-256)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  // التحقق من الباسورد
  async verifyPassword(inputPassword) {
    const hashedInput = await this.hashPassword(inputPassword);
    const correctHash = await this.hashPassword(this.adminPassword);
    return hashedInput === correctHash;
  },
  
  // حفظ الجلسة
  setSession() {
    const expiryTime = new Date().getTime() + (this.sessionDuration * 60 * 1000);
    sessionStorage.setItem('adminSession', expiryTime.toString());
    sessionStorage.setItem('adminLoggedIn', 'true');
  },
  
  // التحقق من صلاحية الجلسة
  isSessionValid() {
    const expiryTime = sessionStorage.getItem('adminSession');
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (!expiryTime || !isLoggedIn) return false;
    
    const now = new Date().getTime();
    if (now > parseInt(expiryTime)) {
      this.clearSession();
      return false;
    }
    
    return true;
  },
  
  // مسح الجلسة
  clearSession() {
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminLoggedIn');
  }
};

// منع الوصول المباشر إلى هذا الملف
if (typeof window !== 'undefined') {
  Object.freeze(AUTH_CONFIG);
}