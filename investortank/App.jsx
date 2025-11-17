// src/App.jsx
import { useEffect, useState } from 'react';
import { supabase, testConnection, getCurrentUser } from './lib/supabaseClient';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('startup');

  // اختبر الاتصال عند تحميل الصفحة
  useEffect(() => {
    checkConnection();
    checkCurrentUser();
  }, []);

  const checkConnection = async () => {
    const result = await testConnection();
    setConnectionStatus(result.message);
  };

  const checkCurrentUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  // دالة التسجيل
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إنشاء حساب المستخدم
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // إنشاء ملف شخصي حسب نوع المستخدم
      if (userType === 'startup') {
        await supabase.from('startup_profiles').insert({
          user_id: data.user.id,
          company_name: 'شركتي الناشئة',
          stage: 'Seed',
        });
      } else if (userType === 'investor') {
        await supabase.from('investor_profiles').insert({
          user_id: data.user.id,
          firm_name: 'صندوق الاستثمار الخاص بي',
        });
      }

      alert('تم التسجيل بنجاح! تفقد بريدك الإلكتروني للتأكيد.');
      setEmail('');
      setPassword('');
      setUser(data.user);
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الدخول
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      alert('تم تسجيل الدخول بنجاح!');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الخروج
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      alert('تم تسجيل الخروج بنجاح');
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 InvestorTank</h1>
        <p>منصة تربط الشركات الناشئة بالمستثمرين</p>
      </header>

      <main className="container">
        {/* حالة الاتصال */}
        <div className="connection-status">
          <h3>حالة الاتصال بـ Supabase:</h3>
          <p style={{
            color: connectionStatus.includes('نجاح') ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {connectionStatus}
          </p>
        </div>

        {/* إذا لم يكن هناك مستخدم مسجل دخول */}
        {!user ? (
          <div className="auth-section">
            <h2>تسجيل الحساب أو الدخول</h2>
            
            <form onSubmit={handleSignUp} className="form">
              <h3>تسجيل حساب جديد</h3>
              
              <div className="form-group">
                <label>نوع المستخدم:</label>
                <select 
                  value={userType} 
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="startup">🚀 شركة ناشئة</option>
                  <option value="investor">💰 مستثمر</option>
                </select>
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة مرور قوية"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'جاري التسجيل...' : 'تسجيل حساب جديد'}
              </button>
            </form>

            <form onSubmit={handleSignIn} className="form">
              <h3>تسجيل الدخول</h3>
              
              <div className="form-group">
                <label>البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </div>
        ) : (
          /* إذا كان هناك مستخدم مسجل دخول */
          <div className="user-section">
            <h2>مرحباً! 👋</h2>
            <div className="user-info">
              <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
              <p><strong>معرّف المستخدم:</strong> {user.id}</p>
            </div>
            
            <button onClick={handleSignOut} className="logout-btn">
              تسجيل الخروج
            </button>

            <div className="next-steps">
              <h3>الخطوات التالية:</h3>
              <ul>
                <li>✅ تم الاتصال بـ Supabase بنجاح!</li>
                <li>📝 يمكنك الآن تحديث ملفك الشخصي</li>
                <li>📤 تحميل وثائقك</li>
                <li>🎯 إنشاء عروضك</li>
                <li>💬 التواصل مع المستثمرين</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 InvestorTank - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

export default App;
