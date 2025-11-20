// src/App.jsx - ENHANCED WITH LOGO AND GRADIENT
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

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
    return (
      <div className="loading">
        <div className="loading-content">
          <svg className="logo-loading" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <polyline 
              points="20,70 40,50 60,65 80,30" 
              fill="none" 
              stroke="url(#logoGradient)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <polygon 
              points="80,30 85,15 95,25" 
              fill="url(#logoGradient)"
            />
          </svg>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <svg className="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mainLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#f0f9ff', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <polyline 
                points="20,70 40,50 60,65 80,30" 
                fill="none" 
                stroke="url(#mainLogoGradient)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <polygon 
                points="80,30 85,15 95,25" 
                fill="url(#mainLogoGradient)"
              />
            </svg>
            <h1>InvestorTank</h1>
          </div>
          <p>منصة تربط الشركات الناشئة بالمستثمرين</p>
        </div>
      </header>

      <main className="container">
        <div className="connection-status">
          <div className="status-badge">
            <span className="status-dot"></span>
            <h3>حالة الاتصال:</h3>
          </div>
          <p style={{
            color: connectionStatus.includes('نجاح') ? '#10b981' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {connectionStatus}
          </p>
        </div>

        {!user ? (
          <div className="auth-section">
            <h2>ابدأ الآن</h2>
            
            <form onSubmit={handleSignUp} className="form form-signup">
              <h3>📝 تسجيل حساب جديد</h3>
              
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
                  placeholder="كلمة مرور قوية (8+ أحرف)"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'جاري التسجيل...' : '✨ تسجيل حساب جديد'}
              </button>
            </form>

            <div className="divider">أو</div>

            <form onSubmit={handleSignIn} className="form form-signin">
              <h3>🔑 تسجيل الدخول</h3>
              
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

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'جاري تسجيل الدخول...' : '➜ تسجيل الدخول'}
              </button>
            </form>
          </div>
        ) : (
          <div className="user-section">
            <div className="welcome-card">
              <h2>🎉 مرحباً بك!</h2>
              <div className="user-info">
                <p><strong>📧 البريد الإلكتروني:</strong> <span>{user.email}</span></p>
                <p><strong>🆔 معرّف المستخدم:</strong> <span className="user-id">{user.id.substring(0, 8)}...</span></p>
              </div>
              
              <button onClick={handleSignOut} className="btn-logout">
                🚪 تسجيل الخروج
              </button>
            </div>

            <div className="next-steps">
              <h3>✨ الخطوات التالية:</h3>
              <ul>
                <li>✅ تم الاتصال بـ Supabase بنجاح!</li>
                <li>📝 يمكنك الآن تحديث ملفك الشخصي</li>
                <li>📤 تحميل وثائقك والعروض التقديمية</li>
                <li>🎯 إنشاء عروضك أمام المستثمرين</li>
                <li>💬 التواصل مع المستثمرين والمتابعين</li>
                <li>📊 تتبع صفقاتك والمفاوضات</li>
              </ul>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🚀</span>
                <h4>عروض ديناميكية</h4>
                <p>اعرض مشروعك أمام مستثمرين مهتمين</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💼</span>
                <h4>إدارة الصفقات</h4>
                <p>تتبع وإدارة كل صفقاتك الاستثمارية</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📄</span>
                <h4>وثائق آمنة</h4>
                <p>أرفع والشارك المستندات بأمان</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💬</span>
                <h4>تواصل مباشر</h4>
                <p>التواصل الفوري مع جميع الأطراف</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 InvestorTank - جميع الحقوق محفوظة</p>
        <p className="footer-subtitle">منصة استثمارية تربط الفرص بالرؤية</p>
      </footer>
    </div>
  );
}

export default App;
