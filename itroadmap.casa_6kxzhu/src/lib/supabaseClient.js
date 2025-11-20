import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env.local file.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testConnection() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Supabase session error:', sessionError);
      throw sessionError;
    }

    const userId = session?.user?.id;
    console.log('Authenticated User ID:', userId);
		console.log('Session object:', session); // Log the full session object
		console.log('User ID from session:', userId); // Log the extracted user ID

    // Only attempt to query 'users' table if a user is authenticated
    let data = null;
    let error = null;

    if (userId) {
      const { data: countData, error: countError } = await supabase
        .from('users')
        .select('COUNT(*)', { count: 'exact', head: true })
        .eq('id', userId); // Query for the specific user's row

      data = countData;
      error = countError;
    } else {
      // If no user is logged in, we can still consider the connection successful
      // but note that no user-specific data was fetched.
      console.log('No active user session. Skipping user-specific table query.');
      return { success: true, message: 'تم الاتصال بنجاح! لا يوجد مستخدم مسجل الدخول.' };
    }

    if (error) {
      console.error('Supabase query error:', error); // Log the query error
      throw error;
    }

    return { success: true, message: `تم الاتصال بنجاح! عدد المستخدمين: ${data}` };
  } catch (error) {
    console.error('Connection error in testConnection function:', error); // Log the overall connection error
    return { 
      success: false, 
      message: `خطأ في الاتصال: ${error.message}` 
    };
  }
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session?.user || null;
}
