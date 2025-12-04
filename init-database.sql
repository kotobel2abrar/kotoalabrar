-- 📂 ملف: init-database.sql
-- نفذ هذا الكود في SQL Editor في Supabase Dashboard

-- 1️⃣ إنشاء جدول الكتب المصرية
CREATE TABLE IF NOT EXISTS egypt_books (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    drive_link TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    subject TEXT NOT NULL,
    year TEXT NOT NULL,
    term TEXT NOT NULL,
    grade TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2️⃣ إنشاء جدول الكتب السعودية
CREATE TABLE IF NOT EXISTS saudi_books (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    drive_link TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    subject TEXT NOT NULL,
    year TEXT NOT NULL,
    term TEXT NOT NULL,
    grade TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3️⃣ إنشاء جدول التصنيفات
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    curriculum TEXT NOT NULL CHECK (curriculum IN ('egypt', 'saudi')),
    type TEXT NOT NULL CHECK (type IN ('subject', 'year', 'term')),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(curriculum, type, name)
);

-- 4️⃣ إنشاء جدول إحصائيات التحميلات
CREATE TABLE IF NOT EXISTS download_stats (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL,
    curriculum TEXT NOT NULL,
    book_title TEXT NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5️⃣ إضافة بيانات افتراضية للتصنيفات
INSERT INTO categories (curriculum, type, name) VALUES
-- المواد المصرية
('egypt', 'subject', 'رياضيات'),
('egypt', 'subject', 'لغة عربية'),
('egypt', 'subject', 'لغة إنجليزية'),
('egypt', 'subject', 'علوم'),
('egypt', 'subject', 'دراسات'),
('egypt', 'subject', 'تربية دينية'),
('egypt', 'subject', 'حاسب آلي'),
('egypt', 'subject', 'تربية فنية'),
('egypt', 'subject', 'مهارات حياتية'),
('egypt', 'subject', 'تربية رياضية'),

-- السنوات المصرية
('egypt', 'year', '2024/2025'),
('egypt', 'year', '2025/2026'),

-- الترمات المصرية
('egypt', 'term', 'الأول'),
('egypt', 'term', 'الثاني'),

-- المواد السعودية
('saudi', 'subject', 'رياضيات'),
('saudi', 'subject', 'لغة عربية'),
('saudi', 'subject', 'لغة إنجليزية'),
('saudi', 'subject', 'علوم'),
('saudi', 'subject', 'قرآن'),
('saudi', 'subject', 'توحيد'),
('saudi', 'subject', 'فقه'),
('saudi', 'subject', 'تربية إسلامية'),
('saudi', 'subject', 'اجتماعيات'),
('saudi', 'subject', 'حاسب آلي'),

-- السنوات السعودية
('saudi', 'year', '2024/2025'),
('saudi', 'year', '2025/2026'),

-- الفصول السعودية
('saudi', 'term', 'الأول'),
('saudi', 'term', 'الثاني')
ON CONFLICT (curriculum, type, name) DO NOTHING;

-- 6️⃣ تمكين RLS (Row Level Security) وجعل الجداول عامة
ALTER TABLE egypt_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE saudi_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_stats ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات للوصول العام (للقراءة فقط)
CREATE POLICY "الوصول العام للكتب المصرية" ON egypt_books
    FOR SELECT USING (true);

CREATE POLICY "الوصول العام للكتب السعودية" ON saudi_books
    FOR SELECT USING (true);

CREATE POLICY "الوصول العام للتصنيفات" ON categories
    FOR SELECT USING (true);

CREATE POLICY "الوصول العام للإحصائيات" ON download_stats
    FOR SELECT USING (true);

-- سياسات للإدخال (للتطبيقات التي تريد الكتابة)
CREATE POLICY "إضافة كتب مصرية" ON egypt_books
    FOR INSERT WITH CHECK (true);

CREATE POLICY "إضافة كتب سعودية" ON saudi_books
    FOR INSERT WITH CHECK (true);

CREATE POLICY "إضافة تصنيفات" ON categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "إضافة إحصائيات" ON download_stats
    FOR INSERT WITH CHECK (true);