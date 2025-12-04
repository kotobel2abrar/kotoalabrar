// 📂 ملف: supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔑 إعدادات Supabase - استخدم بياناتك هنا
const supabaseUrl = 'https://hotggrxbxnffyaplabzl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdGdncnhieG5mZnlhcGxhYnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzMzOTYsImV4cCI6MjA4MDQwOTM5Nn0.kWL2o6lbViPfGNdpyj4NfUlK0AxdIH9NOcl6ruvrXAg'

// إنشاء العميل
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 📊 وظائف إدارة الكتب المصرية
export const egyptBooks = {
    // جلب جميع الكتب
    async getAll() {
        const { data, error } = await supabase
            .from('egypt_books')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) {
            console.error('خطأ في جلب الكتب المصرية:', error)
            return []
        }
        return data || []
    },

    // إضافة كتاب جديد
    async add(book) {
        const { data, error } = await supabase
            .from('egypt_books')
            .insert([{
                ...book,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) {
            console.error('خطأ في إضافة الكتاب المصري:', error)
            return null
        }
        return data?.[0]
    },

    // تحديث كتاب
    async update(id, updates) {
        const { data, error } = await supabase
            .from('egypt_books')
            .update(updates)
            .eq('id', id)
            .select()
        
        if (error) {
            console.error('خطأ في تحديث الكتاب المصري:', error)
            return null
        }
        return data?.[0]
    },

    // حذف كتاب
    async delete(id) {
        const { error } = await supabase
            .from('egypt_books')
            .delete()
            .eq('id', id)
        
        if (error) {
            console.error('خطأ في حذف الكتاب المصري:', error)
            return false
        }
        return true
    }
}

// 📊 وظائف إدارة الكتب السعودية
export const saudiBooks = {
    // جلب جميع الكتب
    async getAll() {
        const { data, error } = await supabase
            .from('saudi_books')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) {
            console.error('خطأ في جلب الكتب السعودية:', error)
            return []
        }
        return data || []
    },

    // إضافة كتاب جديد
    async add(book) {
        const { data, error } = await supabase
            .from('saudi_books')
            .insert([{
                ...book,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) {
            console.error('خطأ في إضافة الكتاب السعودي:', error)
            return null
        }
        return data?.[0]
    },

    // تحديث كتاب
    async update(id, updates) {
        const { data, error } = await supabase
            .from('saudi_books')
            .update(updates)
            .eq('id', id)
            .select()
        
        if (error) {
            console.error('خطأ في تحديث الكتاب السعودي:', error)
            return null
        }
        return data?.[0]
    },

    // حذف كتاب
    async delete(id) {
        const { error } = await supabase
            .from('saudi_books')
            .delete()
            .eq('id', id)
        
        if (error) {
            console.error('خطأ في حذف الكتاب السعودي:', error)
            return false
        }
        return true
    }
}

// 🏷️ وظائف إدارة التصنيفات (مواد، سنوات، ترمات)
export const categories = {
    // جلب جميع التصنيفات
    async getAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
        
        if (error) {
            console.error('خطأ في جلب التصنيفات:', error)
            return { egypt: {}, saudi: {} }
        }
        
        // تنظيم البيانات حسب النوع والمسار
        const organized = { egypt: {}, saudi: {} }
        
        data?.forEach(item => {
            if (!organized[item.curriculum]) {
                organized[item.curriculum] = {}
            }
            if (!organized[item.curriculum][item.type]) {
                organized[item.curriculum][item.type] = []
            }
            organized[item.curriculum][item.type].push(item.name)
        })
        
        return organized
    },

    // إضافة تصنيف جديد
    async add(curriculum, type, name) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                curriculum,
                type,
                name,
                created_at: new Date().toISOString()
            }])
            .select()
        
        if (error) {
            console.error('خطأ في إضافة التصنيف:', error)
            return null
        }
        return data?.[0]
    },

    // حذف تصنيف
    async delete(curriculum, type, name) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .match({ curriculum, type, name })
        
        if (error) {
            console.error('خطأ في حذف التصنيف:', error)
            return false
        }
        return true
    }
}

// 📊 وظائف إحصائيات التحميلات
export const stats = {
    // تسجيل تحميل كتاب
    async recordDownload(bookId, curriculum, title) {
        const { error } = await supabase
            .from('download_stats')
            .insert([{
                book_id: bookId,
                curriculum,
                book_title: title,
                downloaded_at: new Date().toISOString()
            }])
        
        if (error) {
            console.error('خطأ في تسجيل التحميل:', error)
        }
    },

    // جلب الإحصائيات
    async getStats() {
        const { data, error } = await supabase
            .from('download_stats')
            .select('*')
            .order('downloaded_at', { ascending: false })
        
        if (error) {
            console.error('خطأ في جلب الإحصائيات:', error)
            return []
        }
        return data || []
    }
}

// 🔐 وظائف تسجيل الدخول (للنسخة المحلية فقط)
export const auth = {
    async login(password) {
        // كلمة المرور الافتراضية
        const ADMIN_PASSWORD = "AbrarSchools@2025!SecurePass"
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true')
            sessionStorage.setItem('adminLoginTime', new Date().getTime())
            return { success: true }
        }
        
        return { success: false, error: 'كلمة مرور خاطئة' }
    },

    logout() {
        sessionStorage.removeItem('adminLoggedIn')
        sessionStorage.removeItem('adminLoginTime')
    },

    checkSession() {
        const loggedIn = sessionStorage.getItem('adminLoggedIn')
        const loginTime = sessionStorage.getItem('adminLoginTime')
        
        // التحقق من انتهاء الجلسة بعد 8 ساعات
        if (loggedIn && loginTime) {
            const eightHours = 8 * 60 * 60 * 1000
            if (new Date().getTime() - parseInt(loginTime) > eightHours) {
                this.logout()
                return false
            }
        }
        
        return !!loggedIn
    }
}

// تصدير العميل الرئيسي للاستخدام المباشر إذا لزم الأمر
export default supabase