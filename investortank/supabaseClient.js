// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// الحصول على قيم المتغيرات من .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود المتغيرات
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env.local file.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// دالة للتحقق من الاتصال
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('COUNT(*)', { count: 'exact', head: true });

    if (error) throw error;
    return { success: true, message: 'تم الاتصال بنجاح!' };
  } catch (error) {
    return { 
      success: false, 
      message: `خطأ في الاتصال: ${error.message}` 
    };
  }
}

// دالة للتحقق من المستخدم الحالي
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
