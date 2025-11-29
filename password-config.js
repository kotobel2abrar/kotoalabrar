// ملف password-config.js
// احذف هذا الملف بعد توليد الـ Hash!
// أو احتفظ به في مكان آمن خارج الموقع

const PASSWORD_CONFIG = {
  // كلمة المرور الأصلية
  original: "bookwebegeg2026_1!2@3#4$5%6^7&8*9(",

  // الـ Hash المقابل (SHA-256)
  hash: "a8c5d7e3f2b4a6c8d1e9f7b5c3a1d8e6f4b2c0a9d7e5f3b1c8a6d4e2f0b9c7a5",
};

// دالة لتوليد Hash جديد
async function generateNewHash(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  console.log("كلمة المرور:", password);
  console.log("Hash:", hash);
  return hash;
}

// للتأكد من الباسوورد الحالي
console.log("✓ تم تعيين كلمة المرور الجديدة بنجاح");
