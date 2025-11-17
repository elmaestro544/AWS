# Supabase Helper Functions - دوال مساعدة

## ملف: `supabaseHelpers.js`

```javascript
import { createClient } from '@supabase/supabase-js';

// تهيئة عميل Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// 1. دوال المصادقة (Authentication)
// =====================================================

export async function signUp(email, password, userType) {
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
        company_name: '',
        stage: 'Pre-seed',
      });
    } else if (userType === 'investor') {
      await supabase.from('investor_profiles').insert({
        user_id: data.user.id,
        firm_name: '',
      });
    }

    // إنشاء إعدادات الخصوصية
    await supabase.from('privacy_settings').insert({
      user_id: data.user.id,
    });

    // إنشاء إعدادات الأمان
    await supabase.from('security_settings').insert({
      user_id: data.user.id,
    });

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // تسجيل النشاط
    await logActivity(data.user.id, 'login', 'auth', data.user.id, {});

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

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

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 2. دوال الملفات الشخصية (Profiles)
// =====================================================

export async function getUserProfile(userId) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (user.user_type === 'startup') {
      const { data: profile, error: profileError } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      return { ...user, profile };
    } else if (user.user_type === 'investor') {
      const { data: profile, error: profileError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      return { ...user, profile };
    }

    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateStartupProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('startup_profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) throw error;

    await logActivity(userId, 'update_profile', 'startup_profile', userId, profileData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateInvestorProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('investor_profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) throw error;

    await logActivity(userId, 'update_profile', 'investor_profile', userId, profileData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 3. دوال الوثائق (Documents)
// =====================================================

export async function uploadDocument(userId, file, documentType, relatedEntityId = null, relatedEntityType = null) {
  try {
    // تحديد المجلد بناءً على نوع الوثيقة
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    // تحميل الملف إلى Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (storageError) throw storageError;

    // إنشاء سجل في قاعدة البيانات
    let insertData = {
      owner_id: userId,
      document_type: documentType,
      file_name: file.name,
      file_url: storageData.path,
      file_size: file.size,
      file_type: file.type,
    };

    if (relatedEntityType === 'startup' && relatedEntityId) {
      insertData.related_startup_id = relatedEntityId;
    } else if (relatedEntityType === 'deal' && relatedEntityId) {
      insertData.related_deal_id = relatedEntityId;
    }

    const { data, error } = await supabase
      .from('documents')
      .insert(insertData);

    if (error) throw error;

    await logActivity(userId, 'upload_document', 'document', data[0].id, { file_name: file.name });
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDocuments(userId, filters = {}) {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('owner_id', userId);

    if (filters.documentType) {
      query = query.eq('document_type', filters.documentType);
    }

    if (filters.relatedStartupId) {
      query = query.eq('related_startup_id', filters.relatedStartupId);
    }

    const { data, error } = await query.order('uploaded_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function grantDocumentAccess(documentId, userId, permissionLevel, currentUserId) {
  try {
    const { data, error } = await supabase
      .from('document_permissions')
      .insert({
        document_id: documentId,
        user_id: userId,
        permission_level: permissionLevel,
        granted_by_user_id: currentUserId,
      });

    if (error) throw error;

    await logActivity(
      currentUserId,
      'grant_document_access',
      'document_permission',
      documentId,
      { user_id: userId, permission_level: permissionLevel }
    );

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function revokeDocumentAccess(documentId, userId, currentUserId) {
  try {
    const { error } = await supabase
      .from('document_permissions')
      .delete()
      .eq('document_id', documentId)
      .eq('user_id', userId);

    if (error) throw error;

    await logActivity(
      currentUserId,
      'revoke_document_access',
      'document_permission',
      documentId,
      { user_id: userId }
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 4. دوال العروض (Pitches)
// =====================================================

export async function createPitch(startupId, title, description, pitchDeckUrl = null) {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .insert({
        startup_id: startupId,
        title,
        description,
        pitch_deck_url: pitchDeckUrl,
        status: 'draft',
      });

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getPitches(startupId) {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .select('*')
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePitchStatus(pitchId, status) {
  try {
    const { data, error } = await supabase
      .from('pitches')
      .update({ status })
      .eq('id', pitchId);

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 5. دوال المراسلات (Messaging)
// =====================================================

export async function createConversation(participantIds, conversationType = 'direct') {
  try {
    // إنشاء المحادثة
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({ conversation_type: conversationType });

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

    return { success: true, data: conversation[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getConversations(userId) {
  try {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations (
          id,
          conversation_type,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true, data: data.map(item => item.conversations) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function sendMessage(conversationId, senderId, messageText, attachmentUrls = []) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message_text: messageText,
        attachment_urls: attachmentUrls,
      });

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getMessages(conversationId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users:sender_id(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 6. دوال سجل النشاط (Activity Log)
// =====================================================

export async function logActivity(userId, action, entityType, entityId, details) {
  try {
    const { error } = await supabase
      .from('activity_log')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function getActivityLog(userId, limit = 50, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
      .offset(offset);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 7. دوال الإعدادات (Settings)
// =====================================================

export async function getPrivacySettings(userId) {
  try {
    const { data, error } = await supabase
      .from('privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePrivacySettings(userId, settings) {
  try {
    const { data, error } = await supabase
      .from('privacy_settings')
      .update(settings)
      .eq('user_id', userId);

    if (error) throw error;

    await logActivity(userId, 'update_privacy_settings', 'privacy_settings', userId, settings);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getSecuritySettings(userId) {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateSecuritySettings(userId, settings) {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .update(settings)
      .eq('user_id', userId);

    if (error) throw error;

    await logActivity(userId, 'update_security_settings', 'security_settings', userId, settings);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 8. دوال الصفقات (Deals)
// =====================================================

export async function createDeal(startupId, investorId, dealType, investmentAmount) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert({
        startup_id: startupId,
        investor_id: investorId,
        deal_type: dealType,
        investment_amount: investmentAmount,
        status: 'proposal',
      });

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDeal(dealId) {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        startup_profiles(*),
        investor_profiles(*)
      `)
      .eq('id', dealId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function proposeDealTerms(dealId, termsData, proposedByInvestor) {
  try {
    const { data, error } = await supabase
      .from('deal_terms')
      .insert({
        deal_id: dealId,
        ...termsData,
        proposed_by_investor: proposedByInvestor,
      });

    if (error) throw error;

    // تحديث حالة الصفقة
    await supabase
      .from('deals')
      .update({ status: 'negotiating' })
      .eq('id', dealId);

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 9. دوال الإشعارات (Notifications)
// =====================================================

export async function createNotification(userId, notificationType, title, message, relatedId = null) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        notification_type: notificationType,
        title,
        message,
        related_id: relatedId,
      });

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
}

export async function getNotifications(userId, unreadOnly = false) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date() })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// =====================================================
// 10. دوال مساعدة عامة (Helper Functions)
// =====================================================

async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}

export async function searchStartups(query, filters = {}) {
  try {
    let dbQuery = supabase
      .from('startup_profiles')
      .select('*')
      .ilike('company_name', `%${query}%`);

    if (filters.industry) {
      dbQuery = dbQuery.eq('industry', filters.industry);
    }

    if (filters.stage) {
      dbQuery = dbQuery.eq('stage', filters.stage);
    }

    const { data, error } = await dbQuery.limit(20);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function searchInvestors(query, filters = {}) {
  try {
    let dbQuery = supabase
      .from('investor_profiles')
      .select('*')
      .ilike('firm_name', `%${query}%`);

    const { data, error } = await dbQuery.limit(20);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## مثال الاستخدام في React Component

```javascript
import { signUp, uploadDocument, getDocuments } from './supabaseHelpers';

function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 'user-id'; // من session

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await uploadDocument(userId, file, 'pitch_deck');
      if (result.success) {
        // إعادة تحميل قائمة الوثائق
        const docsResult = await getDocuments(userId);
        if (docsResult.success) {
          setDocuments(docsResult.data);
        }
        alert('تم تحميل الوثيقة بنجاح');
      } else {
        alert('خطأ: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileUpload} 
        disabled={loading}
      />
      {loading && <p>جاري التحميل...</p>}
      
      <h3>الوثائق المرفوعة:</h3>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.file_name} - {new Date(doc.uploaded_at).toLocaleDateString('ar')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentUpload;
```