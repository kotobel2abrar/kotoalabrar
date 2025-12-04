// 📂 ملف: backup-sync.js
// لنسخ احتياطي ومزامنة البيانات بين Supabase والمحلي

const BACKUP_KEY = 'last_backup_time';

export const backupSync = {
    // مزامنة البيانات المحلية مع Supabase
    async syncToSupabase(supabaseClient) {
        try {
            // مزامنة الكتب المصرية
            const egyptData = JSON.parse(localStorage.getItem("egyptData"));
            if (egyptData?.books?.length > 0) {
                for (const book of egyptData.books) {
                    const { error } = await supabaseClient
                        .from('egypt_books')
                        .upsert({
                            id: book.id,
                            title: book.title,
                            drive_link: book.drive_link,
                            cover_image: book.cover_image,
                            subject: book.subject,
                            year: book.year,
                            term: book.term,
                            grade: book.grade,
                            language: book.language
                        }, {
                            onConflict: 'id'
                        });
                    
                    if (error) console.error('خطأ في مزامنة الكتاب المصري:', error);
                }
            }
            
            // مزامنة الكتب السعودية
            const saudiData = JSON.parse(localStorage.getItem("saudiData"));
            if (saudiData?.books?.length > 0) {
                for (const book of saudiData.books) {
                    const { error } = await supabaseClient
                        .from('saudi_books')
                        .upsert({
                            id: book.id,
                            title: book.title,
                            drive_link: book.drive_link,
                            cover_image: book.cover_image,
                            subject: book.subject,
                            year: book.year,
                            term: book.term,
                            grade: book.grade,
                            language: book.language
                        }, {
                            onConflict: 'id'
                        });
                    
                    if (error) console.error('خطأ في مزامنة الكتاب السعودي:', error);
                }
            }
            
            // تحديث وقت النسخ الاحتياطي
            localStorage.setItem(BACKUP_KEY, new Date().getTime());
            console.log('تمت المزامنة بنجاح');
            
        } catch (error) {
            console.error('خطأ في المزامنة:', error);
        }
    },
    
    // استعادة البيانات من Supabase إلى المحلي
    async restoreFromSupabase(supabaseClient) {
        try {
            // استعادة الكتب المصرية
            const { data: egyptBooks } = await supabaseClient
                .from('egypt_books')
                .select('*');
            
            if (egyptBooks?.length > 0) {
                const egyptData = JSON.parse(localStorage.getItem("egyptData") || '{}');
                egyptData.books = egyptBooks;
                localStorage.setItem("egyptData", JSON.stringify(egyptData));
            }
            
            // استعادة الكتب السعودية
            const { data: saudiBooks } = await supabaseClient
                .from('saudi_books')
                .select('*');
            
            if (saudiBooks?.length > 0) {
                const saudiData = JSON.parse(localStorage.getItem("saudiData") || '{}');
                saudiData.books = saudiBooks;
                localStorage.setItem("saudiData", JSON.stringify(saudiData));
            }
            
            console.log('تمت الاستعادة بنجاح');
            
        } catch (error) {
            console.error('خطأ في الاستعادة:', error);
        }
    },
    
    // التحقق من الحاجة للمزامنة (كل 24 ساعة)
    shouldSync() {
        const lastBackup = localStorage.getItem(BACKUP_KEY);
        if (!lastBackup) return true;
        
        const oneDay = 24 * 60 * 60 * 1000;
        return new Date().getTime() - parseInt(lastBackup) > oneDay;
    }
};