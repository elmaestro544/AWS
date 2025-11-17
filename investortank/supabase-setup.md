# دليل إعداد InvestorTank مع Supabase

## الخطوة 1: إعداد Supabase

### 1.1 إنشاء مشروع جديد
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. انقر على "Create a new project"
3. أدخل تفاصيل المشروع:
   - Project name: `InvestorTank`
   - Database password: (استخدم كلمة مرور قوية)
   - Region: (اختر أقرب منطقة جغرافية)

### 1.2 الحصول على بيانات الاتصال
1. اذهب إلى **Settings** → **API**
2. انسخ القيم التالية:
   - **Project URL**: (مثل: `https://xxxx.supabase.co`)
   - **Anon/Public Key**: (للعمليات العامة)
   - **Service Role Key**: (للعمليات الحساسة - احفظه بأمان)

---

## الخطوة 2: إنشاء قاعدة البيانات

### 2.1 تشغيل SQL Schema
1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. انقر على **New Query**
3. انسخ والصق الـ SQL Schema الكامل من ملف `database_schema.sql`
4. انقر على **Run**

### 2.2 تفعيل Row Level Security (RLS)
لكل جدول تم إنشاؤه:
1. اذهب إلى **Authentication** → **Policies**
2. فعّل RLS لكل جدول
3. أضف السياسات الأساسية:

```sql
-- مثال: سياسة لـ startup_profiles
CREATE POLICY "Users can view their own profile"
ON startup_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON startup_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON startup_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## الخطوة 3: تكوين المصادقة

### 3.1 تفعيل Email/Password Authentication
1. اذهب إلى **Authentication** → **Providers**
2. تأكد من تفعيل "Email" provider
3. في **Auth Settings**:
   - فعّل "Enable email confirmations"
   - اختر "Double confirm for both signups and password resets"

### 3.2 إعداد OAuth (اختياري)
لتسهيل التسجيل، يمكنك إضافة:
- Google OAuth
- GitHub OAuth

---

## الخطوة 4: إعداد التطبيق

### 4.1 متغيرات البيئة
أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4.2 تثبيت مكتبات Supabase
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-react
```

### 4.3 إنشاء ملف العميل (client.js)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## الخطوة 5: وظائف مهمة للتطبيق

### 5.1 التسجيل (Sign Up)
```javascript
async function signUp(email, password, userType) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // إنشاء ملف شخصي
  if (userType === 'startup') {
    await supabase.from('startup_profiles').insert({
      user_id: data.user.id,
      company_name: '',
    });
  } else {
    await supabase.from('investor_profiles').insert({
      user_id: data.user.id,
      firm_name: '',
    });
  }

  return data;
}
```

### 5.2 تسجيل الدخول (Sign In)
```javascript
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### 5.3 تحميل الوثائق
```javascript
async function uploadDocument(file, userId, documentType) {
  // تحميل الملف إلى التخزين
  const fileName = `${userId}/${Date.now()}_${file.name}`;
  const { data: storageData, error: storageError } = 
    await supabase.storage
      .from('documents')
      .upload(fileName, file);

  if (storageError) throw storageError;

  // إدراج سجل في قاعدة البيانات
  const { data, error } = await supabase
    .from('documents')
    .insert({
      owner_id: userId,
      document_type: documentType,
      file_name: file.name,
      file_url: storageData.path,
      file_size: file.size,
    });

  if (error) throw error;
  return data;
}
```

### 5.4 إنشاء عرض جديد
```javascript
async function createPitch(startupId, title, description) {
  const { data, error } = await supabase
    .from('pitches')
    .insert({
      startup_id: startupId,
      title,
      description,
      status: 'draft',
    });

  if (error) throw error;
  return data;
}
```

### 5.5 الحصول على سجل النشاط
```javascript
async function getActivityLog(userId, limit = 50) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
```

### 5.6 إنشاء محادثة
```javascript
async function createConversation(participantIds) {
  // إنشاء المحادثة
  const { data: conversation, error: conversationError } = 
    await supabase
      .from('conversations')
      .insert({ conversation_type: 'direct' });

  if (conversationError) throw conversationError;

  // إضافة المشاركين
  const participants = participantIds.map(id => ({
    conversation_id: conversation[0].id,
    user_id: id,
  }));

  const { error: participantError } = await supabase
    .from('conversation_participants')
    .insert(participants);

  if (participantError) throw participantError;
  return conversation[0];
}
```

---

## الخطوة 6: الأمان

### 6.1 حماية المسارات
```javascript
async function getAuthUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    // إعادة التوجيه إلى صفحة التسجيل
    return null;
  }
  return data.session.user;
}
```

### 6.2 إدارة الأذونات
```javascript
async function grantDocumentAccess(documentId, userId, permissionLevel) {
  const { data, error } = await supabase
    .from('document_permissions')
    .insert({
      document_id: documentId,
      user_id: userId,
      permission_level: permissionLevel,
      granted_by_user_id: currentUserId,
    });

  if (error) throw error;
  return data;
}
```

---

## الخطوة 7: النسخ الاحتياطي والصيانة

### 7.1 تفعيل النسخ الاحتياطية التلقائية
1. اذهب إلى **Settings** → **Backups**
2. فعّل "Automatic Backups"
3. اختر تكرار النسخ الاحتياطية

### 7.2 مراقبة الأداء
1. اذهب إلى **Monitoring**
2. راقب:
   - استخدام API
   - أداء قاعدة البيانات
   - الأخطاء والتنبيهات

---

## الخطوة 8: النشر (Deployment)

### 8.1 خيارات النشر
**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel deploy
```

**Netlify:**
```bash
netlify deploy --prod
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## الخطوة 9: اختبار التطبيق

### 9.1 حسابات تجريبية
```
البريد الإلكتروني: startup@test.com
كلمة المرور: TestPass123!

البريد الإلكتروني: investor@test.com
كلمة المرور: TestPass123!
```

### 9.2 الاختبارات الأساسية
- [ ] التسجيل والدخول
- [ ] تحميل الوثائق
- [ ] إنشاء العروض
- [ ] المراسلات
- [ ] سجل النشاط
- [ ] إعدادات الخصوصية

---

## استكشاف الأخطاء والمشاكل الشائعة

### المشكلة: خطأ في المصادقة
**الحل:**
- تحقق من صحة `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
- تأكد من تفعيل Email provider في Supabase

### المشكلة: خطأ في تحميل الملفات
**الحل:**
- تأكد من إنشاء bucket `documents` في Storage
- تحقق من RLS policies على bucket

### المشكلة: بطء في استعلامات قاعدة البيانات
**الحل:**
- أضف فهارس (Indexes) على الأعمدة المستخدمة بكثرة
- استخدم pagination لتقليل حجم البيانات المسترجعة

---

## الموارد الإضافية

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

**آخر تحديث:** نوفمبر 2025

للمساعدة والدعم، اتصل بفريق Supabase على: [support@supabase.io](mailto:support@supabase.io)